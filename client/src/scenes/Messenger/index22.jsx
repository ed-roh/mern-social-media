import './index.css'
import { Send } from '@mui/icons-material';
import { Box, Divider, IconButton, InputBase, Paper, Typography, useMediaQuery, useTheme } from '@mui/material'
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'scenes/navbar'
import { config } from "../../config";
import { setConvs, setMessages } from 'state/chatSlice';
import UserImage from 'components/UserImage';
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
const URL_ENDPT = `http://${config.host}:${config.port}/`

const Messenger = ({ socket }) => {
    const { palette } = useTheme();
    const theme = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;
    const neutralLight = theme.palette.neutral.light;
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const token = useSelector(state => state.authReducer.token)
    const user = useSelector(state => state.authReducer.user)
    const mode = useSelector(state => state.authReducer.mode)
    const convs = useSelector(state => state.chatReducer.convs)
    const messages = useSelector(state => state.chatReducer.messages)
    const dispatch = useDispatch()
    const [msgInput, setMsgInput] = useState('')
    const [currentConv, setCurrentConv] = useState('')
    const rippleRef = useRef(null)
    const [onlineUsers, setOnlineUsers] = useState([]) 

    const getConversations = async () => {
        console.log("gett")
        try {
            const response = await fetch(
                `${URL_ENDPT}conversations/${user._id}`,
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
            `http://localhost:3001/messages/${convId}`,
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
            `http://localhost:3001/messages/${currentConv}`,
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

    useEffect(() => {
        getConversations();
        console.log("hi")
        socket?.on("get-message", (data) => {
            const currMsgs = [...messages]
            currMsgs.push({ text: data.text, sender: data.senderId, conversationId: data.conversationId })
            dispatch(setMessages(currMsgs))
        })
    }, [socket, messages])

    useEffect(()=>{
        const queryParams = window.location.search?.split("=")[1]
        if(queryParams){
            handleClickToChat(queryParams)
        }
    },[])

    useEffect(()=>{
        setMsgInput('')
    },[currentConv])

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
        socket?.on("is-online", (userIds)=>{
            setOnlineUsers(userIds)
        })
    }, [socket, user._id])

    

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreens ? "27%" : undefined}>
                    <FlexBetween gap="1rem">
                        <WidgetWrapper height="70vh" width="23vw">
                            <Box p="1rem 0">
                                <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                                    Active chats
                                </Typography>
                                {/* <Divider/> */}
                                {convs.length !== 0 &&
                                    convs?.map(conv => {
                                        const frndId = conv.members.find(mem => mem !== user._id)
                                        const friendObj = user?.friends.find(frnd => frnd._id === frndId)
                                        return (<Box key={friendObj._id + friendObj.firstName}>

                                            <FlexBetween gap="1rem" mt="0.5rem" mb="0.5rem" p="0.5rem" onClick={(e) => handleClickToChat(conv._id)}
                                                style={{
                                                    cursor:"pointer",
                                                    backgroundColor: currentConv === conv._id ? mode==="dark"?"#0A0A0A": "#e7e7e7" : "",
                                                    borderRadius:"0.75rem"
                                                }}
                                            >
                                                <FlexBetween gap="1rem">
                                                    <UserImage image={friendObj?.picturePath} size="40px" />
                                                    <Box>
                                                    
                                                        <Typography
                                                        variant="h6"
                                                        color={dark}
                                                        fontWeight="500"
                                                        sx={{
                                                          "&:hover": {
                                                            color: palette.info.light,
                                                            cursor: "pointer",
                                                          },
                                                        }}
                                                        
                                                        >
                                                            {friendObj?.firstName} {friendObj?.lastName} 
                                                            <img 
                                                            style={{
                                                                filter:onlineUsers.includes(frndId)?"":"invert(50%)", marginLeft:"0.45rem"}} src="/assets/online.png" width="12px" alt="" />
                                                        </Typography>  
                                                        
                                                        <Typography 
                                                            
                                                        color={medium}>{conv.latestText?conv.latestText:""}</Typography>
                                                    </Box>
                                                    
                                                </FlexBetween>
                                            </FlexBetween>
                                            <TouchRipple ref={rippleRef} />
                                            <Divider />
                                        </Box>
                                        )
                                    })
                                }

                            </Box>
                        </WidgetWrapper>
                        <WidgetWrapper height="70vh" width="40vw" style={{
                            background: "rgb(0,213,250)",
                            background: "linear-gradient(90deg, rgba(0,213,250,1) 0%, rgba(9,90,121,1) 100%)"
                            // background: "rgb(0,213,250)",
                            // background: "linear-gradient(87deg, rgba(0,213,250,1) 0%, rgba(0,89,105,1) 0%, rgba(0,0,0,1) 100%)"
                        }}>
                            <Box className='chat-box' height="80%" ref={chatRef} sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                                {
                                    !currentConv ? <h1 style={{ textAlign: "center" }} >Select a conversation</h1> : messages.length === 0 ? <h2 style={{ textAlign: "center" }}>No messages to preview</h2> :
                                        messages.map(msgObj => {
                                            return (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: msgObj.sender === user._id ? "flex-end" : "flex-start",
                                                        mb: 2,
                                                    }}
                                                    
                                                    key={msgObj._id + msgObj.sender}
                                                >

                                                    <Paper
                                                        variant="outlined"
                                                        sx={{
                                                            p: 1,
                                                            backgroundColor: "primary.light",
                                                        }}
                                                    >
                                                        <Typography variant="body1">{msgObj.text}</Typography>
                                                    </Paper>
                                                </Box>
                                            )
                                        })
                                }
                            </Box>
                            <Box
                                height="10%"
                                m="1rem"
                            >

                                {isNonMobileScreens && (
                                    <FlexBetween
                                        backgroundColor={neutralLight}
                                        borderRadius="9px"
                                        gap="3rem"
                                        padding="0.6rem 1.5rem"
                                        visibility={currentConv?"visible":"hidden"}
                                    >
                                        <InputBase value={msgInput} onChange={(e) => setMsgInput(prev => e.target.value)} sx={{fontSize:"16px"}} placeholder="Type Something..." fullWidth
                                        onKeyDown={
                                            (e)=>{
                                                if(e.key==="Enter") handleSendMsg();
                                            }
                                        }
                                        />
                                        <IconButton onClick={handleSendMsg} >
                                            <Send />
                                        </IconButton>
                                    </FlexBetween>
                                )}
                            </Box>
                        </WidgetWrapper>
                        <WidgetWrapper height="70vh" width="23vw">
                            
                                {/* <Box flexBasis="26%" height="70vh" width="20vw"> */}
                                    <FriendListWidget 
                                     handleClickToChat={handleClickToChat} 
                                     userId={user._id}/>
                                {/* </Box> */}
                            
                        </WidgetWrapper>
                    </FlexBetween>
                </Box>
            </Box>
        </Box>
    )
}

export default Messenger
