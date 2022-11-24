import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      { posts && posts?.map(
        ({
          _id,
          user,
          description,
          location,
          picturePath,
          likes,
          comments,
          createdAt
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={user._id}
            name={`${user.firstName} ${user.lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={user.picturePath}
            likes={likes}
            comments={comments}
            createdAt={createdAt}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
