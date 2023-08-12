import React, { useEffect } from 'react'
import ChatBubbles from './ChatBubbles'

const ChatContainer = ({ messages, user, medium, setPostTimeDiff, socket, receiverId }) => {

    useEffect(()=>{
        socket?.emit("send-seen", {seen:true, receiverId})
    }, [])
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
