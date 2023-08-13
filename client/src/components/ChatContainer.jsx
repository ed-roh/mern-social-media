import React, { useEffect } from 'react'
import ChatBubbles from './ChatBubbles'

const ChatContainer = ({ messages, user, medium, setPostTimeDiff, socket, receiverId, setMsgSeen, currentConv ,token, getConversations}) => {

    const updateConvo = async(convId)=>{
        try {
            const resp = await fetch(`http://localhost:3001/conversations/${convId}/update-check/`, {
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

    useEffect(()=>{
        socket?.emit("send-seen", {seen:true, receiverId})
        updateConvo(currentConv)
        socket?.on("get-seen", async({seen})=>{
            // console.log(msgId)
            setMsgSeen(seen)
            
        })
    }, [messages])

    return (
        messages.map(msgObj => {
            return (
                <div key={msgObj._id}>
                    <ChatBubbles
                        msgObj={msgObj}
                        user={user}
                        medium={medium}
                        setPostTimeDiff={setPostTimeDiff}
                    />
                </div>
            )
        }
        ))
}

export default ChatContainer
