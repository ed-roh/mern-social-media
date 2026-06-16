import './index.css'
import { Send } from '@mui/icons-material';
import { Box, Divider, IconButton, InputBase, Typography, useMediaQuery, useTheme } from '@mui/material'
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'scenes/navbar'
import {env} from "config";
import { setConvs, setMessages, setNewMsgCount } from 'state/chatSlice';
import UserImage from 'components/UserImage';
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import ThreeDotsDropDown from 'components/ThreeDotsDropDown';
import ChatContainer from 'components/ChatContainer';


const Messenger = ({ socket, setPostTimeDiff }) => {
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
    const [isTyping, setIsTyping] = useState(false)
    const [msgSeen, setMsgSeen] = useState(false)

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

    const handleClickToChat = async (convId, lastSender, seen) => {
        const response = await fetch(
            `${env.serverEndpoint()}/messages/${convId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        const dataWithImg = data.map(msgObj => {
            if (msgObj.sender !== user._id) {
                const sender = user.friends.find(frnd => frnd._id === msgObj.sender)
                return { ...msgObj, picturePath: sender.picturePath }
            }
            return msgObj
        })
        setCurrentConv(convId)
        if(!seen&&lastSender!==user._id) updateConvo(convId)
        dispatch(setMessages(dataWithImg))
        chatRef.current.scrollTop = chatRef.current.scrollHeight

    }


    const handleSendMsg = async () => {
        if (!msgInput.replace(/\s/g, '')) return alert("Write something before sending");
        setMsgSeen(false)
        const response = await fetch(
            `${env.serverEndpoint()}/messages/${currentConv}`,
            {
                method: "POST",
                body: JSON.stringify({ conversationId: currentConv, sender: user._id, text: msgInput, seen:false }),
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
        socket.emit("send-newMsg-count", {receiverId})
        const currMsgs = [...messages]
        currMsgs.push(data);

        dispatch(setMessages(currMsgs));

    }

    const handleConvoDelete = async (convoId) => {
        const response = await fetch(`${env.serverEndpoint()}/conversations/${convoId}/delete-convo`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        getConversations();
    }

    const handleMsgInputChange = (e) => {
        setMsgInput(prev => e.target.value)
        const receiverId = (convs.find(conv => conv._id === currentConv)).members.find(id => id !== user._id)
        socket?.emit("is-typing", { typing: true, receiverId })
    }
    const handleKeyUp = (e) => {
        const receiverId = (convs.find(conv => conv._id === currentConv)).members.find(id => id !== user._id)
        socket?.emit("not-typing", { typing: false, receiverId })
    }
    const updateConvo = async(convId)=>{
        try {
            const resp = await fetch(`${env.serverEndpoint()}/conversations/${convId}/update-check/`, {
                method:"PUT",
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            getConversations()
        } catch (error) {
            console.log(error.message)
        }
    }

    const chatRef = useRef(null)

    useEffect(() => {
        getConversations();
        dispatch(setNewMsgCount(0))
        socket?.on("get-message", (data) => {
            const incomingData = { ...data }
            const currMsgs = [...messages]
            const sender = user.friends.find(frnd => frnd._id === incomingData.sender)
            if (incomingData.sender !== user._id) {
                incomingData.picturePath = sender.picturePath
            }
            currMsgs.push(incomingData)
            dispatch(setMessages(currMsgs))
        })
    }, [socket, messages])

    useEffect(() => {
        const queryParams = window.location.search?.split("=")[1]
        if (queryParams) {
            handleClickToChat(queryParams)
        }
    }, [])

    useEffect(() => {
        setMsgInput('')
    }, [currentConv])

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
    }, [convs])

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }

    }, [messages])

    useEffect(() => {
        let timeOutId;
        socket?.emit("new-user", user._id)
        socket?.on("is-online", (userIds) => {
            setOnlineUsers(userIds)
        })
        socket?.on("start-typing", ({ typing }) => {
            if (timeOutId !== undefined) clearTimeout(timeOutId)
            setIsTyping(typing)
        })
        socket?.on("stop-typing", ({ typing }) => {
            timeOutId = setTimeout(() => {
                setIsTyping(typing)
            }, 3000)
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
                        <WidgetWrapper className="adv-friend-box" style={{ overflowY: "scroll" }} height="70vh" width="23vw">
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

                                            <FlexBetween gap="1rem" mt="0.5rem" mb="0.5rem" p="0.5rem"
                                                style={{
                                                    backgroundColor: currentConv === conv._id ? mode === "dark" ? "#0A0A0A" : "#e7e7e7" : "",
                                                    borderRadius: "0.75rem"
                                                }}
                                            >
                                                <FlexBetween gap="1rem" onClick={(e) => handleClickToChat(conv._id, conv.senderId,conv.checked)}>
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
                                                                    filter: onlineUsers.includes(frndId) ? "" : "invert(50%)", marginLeft: "0.45rem"
                                                                }} src="/assets/online.png" width="12px" alt="" />
                                                        </Typography>
                                                        <Typography
                                                            color={medium}
                                                            >
                                                            {
                                                                conv.latestText ?
                                                                    (conv.latestText.length > 15 ? conv.latestText.slice(0, 15) + "..." :
                                                                    conv.latestText)
                                                                    : ""
                                                                }
                                                                &nbsp;&nbsp;
                                                                {
                                                                conv.senderId!==user._id&&
                                                                !conv.checked&&
                                                                <img width="11px" src="/assets/new_msg.png" />}
                                                        </Typography>
                                                    </Box>
                                                </FlexBetween>
                                                <ThreeDotsDropDown clickActions={{ handleConvoDelete }} convoId={conv._id} />
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
                            background:
                                mode === "dark" ? "radial-gradient(circle, hsla(189, 100%, 24%, 1) 0%, hsla(0, 0%, 0%, 1) 100%)" : "radial-gradient(circle, hsla(189, 100%, 49%, 1) 0%, hsla(0, 0%, 100%, 1) 100%)"
                            // background: "linear-gradient(90deg, rgba(0,213,250,1) 0%, rgba(9,90,121,1) 100%)"
                            // background: "rgb(0,213,250)",
                            // background: "linear-gradient(87deg, rgba(0,213,250,1) 0%, rgba(0,89,105,1) 0%, rgba(0,0,0,1) 100%)"
                        }}>
                            <Box className='chat-box' height="80%" ref={chatRef} sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                                {
                                    !currentConv ? <h1 style={{ textAlign: "center" }} >Select a conversation</h1> : messages.length === 0 ? <h2 style={{ textAlign: "center" }}>No messages to preview</h2> :
                                    <ChatContainer
                                        socket={socket}
                                        messages={messages}sx={{ textAlign: "start", marginLeft: 2 }} color={medium} fontSize="0.70rem"
                                        user={user}
                                        medium={medium}
                                        setPostTimeDiff={setPostTimeDiff}
                                        receiverId={(convs.find(conv => conv._id === currentConv)).members.find(id => id !== user._id)}
                                        token={token}
                                        setMsgSeen={setMsgSeen}
                                        msgSeen={msgSeen}
                                        currentConv={currentConv}
                                        getConversations={getConversations}
                                        
                                    />
                                        
                                }
                                <Typography sx={{ textAlign: "start", marginLeft: 2 }} color={medium} fontSize="0.70rem">
                                    {isTyping && currentConv&&
                                    <img src='/assets/typing.gif' width="30px" />}
                                </Typography>
                                {msgSeen && messages[messages.length-1].sender === user._id
                                && <Typography
                                sx={{ textAlign: "end", marginLeft: 2 }} 
                                color={medium} 
                                fontSize="0.70rem">Seen</Typography>}
                            </Box>
                            <Box
                                height="10%"
                                m="1rem"
                            >


                                <FlexBetween
                                    backgroundColor={neutralLight}
                                    borderRadius="9px"
                                    gap="3rem"
                                    padding="0.6rem 1.5rem"
                                    visibility={currentConv ? "visible" : "hidden"}
                                >
                                    <InputBase value={msgInput} onChange={(e) => handleMsgInputChange(e)} sx={{ fontSize: "16px" }} placeholder="Type Something..." fullWidth
                                        onKeyDown={
                                            (e) => {
                                                if (e.key === "Enter") handleSendMsg();
                                            }
                                        }
                                        onKeyUp={() => handleKeyUp()}
                                    />
                                    <IconButton disabled={!msgInput} onClick={handleSendMsg} >
                                        <Send style={{ color: msgInput ? "#00D5FA" : "grey" }} />
                                    </IconButton>
                                </FlexBetween>

                            </Box>
                        </WidgetWrapper>
                        <WidgetWrapper className="adv-friend-box" height="70vh" width="23vw" style={{ overflowY: "scroll" }}>

                            <FriendListWidget
                                handleClickToChat={handleClickToChat}
                                userId={user._id} />

                        </WidgetWrapper>
                    </FlexBetween>
                </Box>
            </Box>
        </Box>
    )
}

export default Messenger
