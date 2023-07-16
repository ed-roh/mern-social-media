import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Search,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, InputBase, Typography, useTheme } from "@mui/material";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentValue, setCommentValue] = useState('')
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users)
  const loggedInUserId = useSelector((state) => state.user._id);

  
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  
  
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    // console.log("like",updatedPost)
    dispatch(setPost({ post: updatedPost }));
  };

  const AddComment = async()=>{
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method:"PATCH",
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({userId:loggedInUserId, commentText:commentValue})
    })
    const updatedPost = await response.json();
    // console.log("comm",updatedPost)
    dispatch(setPost({post:updatedPost}))
    setCommentValue('')
  }

  const handleOnOpenComment = () => {
    setIsComments(!isComments)

  }

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => handleOnOpenComment()}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (

        <Box mt="0.5rem">

          <FlexBetween
            // backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase value={commentValue} onChange={(e) => setCommentValue(e.target.value)} placeholder="Write your comment..." />
            <IconButton disabled={!commentValue} onClick={AddComment}>
              <SendRoundedIcon />
            </IconButton>
          </FlexBetween>

          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem", wordBreak:'break-word' }}>
                <Typography color={medium}>{
                users.find(user => user._id === comment.userId)?.firstName +" "+
                users.find(user => user._id === comment.userId)?.lastName
                }</Typography><Typography color={main}>{comment.commentText}</Typography>
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
