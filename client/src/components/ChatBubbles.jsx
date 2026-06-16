import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import UserImage from './UserImage'

const ChatBubbles = ({msgObj, medium, user, setPostTimeDiff}) => {


    return (
        <>
            <Typography sx={{ textAlign: msgObj.sender === user._id ? "end" : "start", marginLeft: 4 }} color={medium} fontSize="0.65rem">{
                setPostTimeDiff(msgObj.createdAt, "chats").date
            }</Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: msgObj.sender === user._id ? "flex-end" : "flex-start",
                    mb: 2,
                }}

                key={msgObj._id + msgObj.sender}
            >
                {msgObj.sender === user._id ? "" : <UserImage image={msgObj.picturePath} size="25px" mr={1} />}
                <Paper
                    variant="outlined"
                    sx={{
                        p: 1,
                        // backgroundColor: "secondary.dark",
                        backgroundColor: "primary.light",
                        borderRadius:
                            msgObj.sender === user._id ?
                                "12px 2px 12px 12px" :
                                "2px 12px 12px 12px"
                    }}
                >
                    <Typography variant="body1">{msgObj.text}</Typography>
                    <Typography sx={{ textAlign: "end" }} color={medium} fontSize="0.65rem">{
                        setPostTimeDiff(msgObj.createdAt, "chats").time
                    }</Typography>
                </Paper>
            </Box>
        </>
    )
}

export default ChatBubbles
