import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  BookmarkBorder,
  BookmarkOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Button, TextField } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import PostCategorizer from "./PostCategorizer";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import axios from 'axios'

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments
}) => {
  const [isComments, setIsComments] = useState(false);
  const [ newcomment, setNewComment] = useState('')
  const [PostCategory, setPostCategory] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [loadcomments, setLoadComments] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/${postId}/get/comment`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setLoadComments(response.data.comments);
        console.log('50', loadcomments)
      })
      .catch(error => {
        console.error(error);
      });
  }, [postId, token,newcomment,loadcomments]);
  

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
    dispatch(setPost({ post: updatedPost }));
  };

 
  const postComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${postId}/comment`, 
        {
          userId: loggedInUserId,
          postId: postId,
          comment: newcomment,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data); 
    } catch (error) {
      console.error(error);
    }
  };

  const addComment = () => {
    postComment()
  }


  const handleShare = () => {
    const postUrl = `http://localhost:3000/posts`;
    navigator.clipboard.writeText(postUrl);
  };

  console.log('104',loadcomments)
  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {/* {description.includes('.com') ? <a href={description} target="_blank" rel="noreferrer">Best Buy Link</a> : description } */}
        {description.includes('.com') ? (
          <Button
            onClick={() => window.open(description, "_blank")}
            variant="contained"
            style={{
              cursor: "pointer",
            }}
          >
            Best Buy Link
          </Button>
        ) : (
          <p>{description}</p>
        )}

      </Typography>
      {picturePath && picturePath.includes(".com") ? (
        <img
          width="100%"
          height="280px"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
        />
      ) : (
        <img
          width="100%"
          height="280px"
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
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{loadcomments?.length}</Typography>
          </FlexBetween>

          {!window.location.pathname.includes('saved') &&
            <IconButton onClick={() => setPostCategory(!PostCategory)}>
              {PostCategory ? (
                <BookmarkBorder sx={{ color: primary }} />
              ) : (
                <BookmarkBorder />
              )}
            </IconButton>
          }
        </FlexBetween>
        <IconButton onClick={handleShare}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          <TextField
            id="my-text-field"
            label=""
            name="comment"
            variant="standard"
            placeholder="Add your Comment"
            size="small"
            sx={{p: "0.3rem"}}
            onChange={(e) => setNewComment(e.target.value)}
          />
     <Button variant="contained" size="small" onClick={addComment} >
      Add 
    </Button>

         {loadcomments?.map(comment => (
                <Box key={comment._id}>
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment?.comment}</Typography>
                </Box>
              )).reverse()}
        {comments.length > 1 &&<Divider /> }
        </Box>
      )}


      <Box mt="0.5rem">
        {PostCategory && <PostCategorizer postId={postId} likes={likes} picturePath={picturePath}
          userPicturePath={userPicturePath}
          name={name}
          description={description}
          location={location}
          comments={comments} />}
      </Box>
    </WidgetWrapper>
  );
};

export default PostWidget;
