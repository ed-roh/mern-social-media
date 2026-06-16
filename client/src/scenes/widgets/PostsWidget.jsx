import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setUsers } from "state";
import PostWidget from "./PostWidget";
import {env} from "../../config";
import Skeleton from "react-loading-skeleton";
import { Box } from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";


const PostsWidget = ({ userId, socket, isProfile = false, setPostTimeDiff }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.authReducer.posts);
  const token = useSelector((state) => state.authReducer.token);
  const [isLoading, setIsLoading] = useState(false)
  const [pageNo, setPageNo] = useState(0)  

  const getUsers = async () => {
    const resposnse = await fetch(env.serverEndpoint()+"/users", {
      method:"GET",
      headers: {Authorization:`Bearer ${token}`}
    })
    const users = await resposnse.json()
    dispatch(setUsers(users))
  }
  const getPosts = async () => {
    setIsLoading(prev => true)
    const response = await fetch(env.serverEndpoint()+"/posts?pageNo="+pageNo, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    data.reverse()
    dispatch(setPosts({ posts: data }));
    setIsLoading(prev=>false)
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${env.serverEndpoint()}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    // console.log("getuserspost", data)
    data.reverse()
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
      getUsers();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    {
      isLoading?<>
        <WidgetWrapper m="2rem 0">
            <Skeleton count={1} width={50} height={50} circle/>
          <br />
            <Skeleton count={2} />
        </WidgetWrapper>
        <WidgetWrapper m="2rem 0">
            <Skeleton count={1} width={50} height={50} circle/>
          <br />
            <Skeleton count={2} />
        </WidgetWrapper>
      </> 
      :
      posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          createdAt
        }) => (

          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments?.slice().reverse()}
            createdAt={createdAt}
            getPosts={getPosts}
            socket={socket}
            setPostTimeDiff={setPostTimeDiff}
          />
        )
      )
    }
    </>
  );
};

export default PostsWidget;
