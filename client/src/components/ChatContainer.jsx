import React, { useEffect } from 'react'
import ChatBubbles from './ChatBubbles'

const ChatContainer = ({ messages, user, medium, setPostTimeDiff, socket, receiverId, setMsgSeen, currentConv ,token, getConversations}) => {

    useEffect(()=>{
        socket?.emit("send-seen", {seen:true, receiverId})
        // if(currentConv && user._id !== receiverId) updateConvo(currentConv);
        socket?.on("get-seen", async({seen})=>{
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
