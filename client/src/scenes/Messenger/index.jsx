import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Box } from '@mui/material';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
// import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Navbar from 'scenes/navbar';
import { useDispatch, useSelector } from 'react-redux';
import {env} from "../../config";
import { setConvs, setMessages } from 'state/chatSlice';
import UserImage from 'components/UserImage';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '100%'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const Messenger = ({ socket }) => {
    const classes = useStyles();
    const token = useSelector(state => state.authReducer.token)
    const user = useSelector(state => state.authReducer.user)
    const convs = useSelector(state => state.chatReducer.convs)
    const messages = useSelector(state => state.chatReducer.messages)
    const dispatch = useDispatch()
    const [msgInput, setMsgInput] = useState('')
    const [currentConv, setCurrentConv] = useState('')

    const getConversations = async () => {
        try {
            const response = await fetch(
                `${env.serverEndpoint()}/conversations/${user._id}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json();
            dispatch(setConvs(data))
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickToChat = async (convId) => {
        const response = await fetch(
            `${env.serverEndpoint()}/messages/${convId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        setCurrentConv(convId)
        dispatch(setMessages(data))
        chatRef.current.scrollTop = chatRef.current.scrollHeight

    }

    const handleSendMsg = async () => {
        if (!msgInput.replace(/\s/g, '')) return alert("Write something before sending");
        const response = await fetch(
            `${env.serverEndpoint()}/messages/`,
            {
                method: "POST",
                body: JSON.stringify({ conversationId: currentConv, sender: user._id, text: msgInput }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );
        setMsgInput('')
        const data = await response.json();
        const receiverId = (convs.find(conv => conv._id === currentConv)).members.find(id => id !== user._id)
        socket.emit("send-message", { data, receiverId })
        const currMsgs = [...messages]
        currMsgs.push(data);
        dispatch(setMessages(currMsgs));

    }
    const chatRef = useRef(null)


    useEffect(()=>{
        chatRef.current.scrollTop = chatRef.current.scrollHeight
    },[convs])
    
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages])

    useEffect(() => {
        socket?.emit("new-user", user._id)
    }, [socket, user._id])

    useEffect(() => {
        getConversations();
        socket?.on("get-message", (data) => {
            const currMsgs = [...messages]
            currMsgs.push({ text: data.text, sender: data.senderId, conversationId: data.conversationId })
            dispatch(setMessages(currMsgs))
        })
    }, [socket, messages])

    return (
        <Box>
            <Navbar />

            <Grid container component={Paper} className={classes.chatSection}>
            {/* -------------------------friend side bar starts--------------------------- */}
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        <ListItem button key="123">
                            <ListItemIcon>
                                <UserImage image={user?.picturePath} size="40px" />
                            </ListItemIcon>
                            <ListItemText primary={`${user.firstName} ${user.lastName}`}></ListItemText>
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
                    <List>

                        {convs.length !== 0 &&
                            convs.map(conv => {
                                const frndId = conv.members.find(mem => mem !== user._id)
                                const friendObj = user?.friends.find(frnd => frnd._id === frndId)
                                return (<>
                                    <ListItem
                                        style={{ backgroundColor: currentConv === conv._id ? "#dfdfdf" : "" }}
                                        button key={friendObj._id + friendObj.firstName}
                                        onClick={() => handleClickToChat(conv._id)}
                                    >
                                        <ListItemIcon>
                                            <UserImage image={friendObj?.picturePath} size="40px" />
                                        </ListItemIcon>
                                        <ListItemText primary={`${friendObj?.firstName} ${friendObj?.lastName}`} />

                                    </ListItem>
                                    <Divider />
                                </>
                                )
                            })
                        }
                    </List>
                </Grid>

                {/* -----------------message container starts ---------------------- */}

                <Grid item xs={9}>
                    <List className={classes.messageArea} ref={chatRef}>
                        {
                            !currentConv ? <h1 style={{textAlign:"center"}} >Select a conversation</h1> : messages.length === 0?<h2 style={{textAlign:"center"}}>No messages to preview</h2>:
                                messages.map(msgObj => {
                                    return (
                                    <ListItem key={msgObj._id + msgObj.sender}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <ListItemText
                                                    align={msgObj.sender === user._id ? "right" : "left"}
                                                    primary={msgObj.text}
                                                ></ListItemText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ListItemText align={msgObj.sender === user._id ? "right" : "left"} secondary="09:30"></ListItemText>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    )
                                })
                        }
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Grid item xs={11}>
                            <TextField value={msgInput} onChange={(e) => setMsgInput(prev => e.target.value)} id="outlined-basic-email" label="Type Something" fullWidth />
                        </Grid>
                        <Grid item xs={1} align="right">
                            <Fab color="primary" aria-label="add"
                                onClick={handleSendMsg}
                            ><SendRoundedIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Messenger;