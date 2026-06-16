import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
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
import ThreeDotsDropDown from "components/ThreeDotsDropDown";
import { env } from "config";

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
  createdAt,
  getPosts,
  socket,
  setPostTimeDiff
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentValue, setCommentValue] = useState('')
  const [seeMore, setSeeMore] = useState(false)
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.token);
  const users = useSelector((state) => state.authReducer.users)
  const loggedInUserId = useSelector((state) => state.authReducer.user._id);


  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;


  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`${env.serverEndpoint()}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    // console.log("like",updatedPost)
    const userLikedId = Object.keys(updatedPost.likes)?.find(id => id === loggedInUserId)
    if (userLikedId && postUserId !== loggedInUserId) handleNotification(1);
    dispatch(setPost({ post: updatedPost }));

  };

  

  const AddComment = async () => {
    const response = await fetch(`${env.serverEndpoint()}/posts/${postId}/comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: loggedInUserId, commentText: commentValue })
    })
    const updatedPost = await response.json();
    // console.log("comm",updatedPost)
    dispatch(setPost({ post: updatedPost }))
    if (postUserId !== loggedInUserId) handleNotification(2);
    setCommentValue('')
  }

  const handleCommentDelete = async (postId, commentId) => {
    const response = await fetch(`${env.serverEndpoint()}/posts/${postId}/delete-comment`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ loggedInUserId, commentId })
    })
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }))
  }

  const handleDeletePost = async (postId) => {
    await fetch(`${env.serverEndpoint()}/posts/${postId}/delete-post`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ loggedInUserId, postUserId })
    })

    getPosts();
  }

  const handleNotification = (notiType) => {
    socket.emit("send-notification", {
      senderId: loggedInUserId,
      receiverId: postUserId,
      type: notiType
    })
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
        socket={socket}
        loggedInUserId={loggedInUserId}
        postUserId={postUserId}
      />
      <Typography sx={{ textAlign: "end" }} color={medium} fontSize="0.65rem">{
        setPostTimeDiff(createdAt, "posts") + " ago"
      }</Typography>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
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

        <FlexBetween gap='0.3rem'>
          {loggedInUserId === postUserId ?
            <>
              <ThreeDotsDropDown clickActions={{ handleDeletePost }} postId={postId} />
              <IconButton>
                <ShareOutlined />
              </IconButton> </> :
            <IconButton>
              <ShareOutlined />
            </IconButton>}
        </FlexBetween>
      </FlexBetween>
      {isComments && (

        <Box mt="0.5rem">

          <FlexBetween
            // backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase fullWidth value={commentValue} onKeyDown={(e) => e.key === "Enter" && AddComment()} onChange={(e) => setCommentValue(e.target.value)} placeholder="Write your comment..." />
            <IconButton disabled={!commentValue} onClick={AddComment}>
              <SendRoundedIcon />
            </IconButton>
          </FlexBetween>

          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <FlexBetween>
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem", wordBreak: 'break-word' }}>
                  <FlexBetween gap={2}>

                    <Typography color={medium} fontSize="14px" fontStyle="italic">{
                      users.find(user => user._id === comment.userId)?.firstName + " " +
                      users.find(user => user._id === comment.userId)?.lastName
                    }</Typography>
                    <Typography color={medium} fontSize={10}>{setPostTimeDiff(comment.createdAt)}</Typography>
                  </FlexBetween>

                  <Typography color={main}>{
                    comment.commentText.length < 150 ? comment.commentText :
                      <>{seeMore ? comment.commentText : comment.commentText.slice(0, 100) + "..."} <span
                        style={{ color: 'blue', textDecoration: "underline", cursor: 'pointer' }}
                        onClick={() => setSeeMore(!seeMore)}> {!seeMore ? ">See more" : "<See less"} </span></>
                  }</Typography>
                </Typography>
                <ThreeDotsDropDown
                  commentId={comment._id}
                  postId={postId}
                  commentUserId={comment.userId}
                  userId={loggedInUserId}
                  clickActions={{ handleCommentDelete }}
                />
              </FlexBetween>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
