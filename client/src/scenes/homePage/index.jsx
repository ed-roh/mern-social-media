import './index.css'
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useEffect, useRef, useState } from "react";
import Skeleton from 'react-loading-skeleton';


const HomePage = ({ socket, setPostTimeDiff }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.authReducer.user);
  const lowerBodyRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleScroll = (e)=>{
    console.log("handle scroll")
    if (e.target.offsetHeight + e.target.scrollTop === e.target.scrollHeight) {
      console.log("inside scroll")
      
      return;
    }
  }
  useEffect(() => {
    socket?.emit("new-user", _id)
    
    console.log()
  }, [socket, _id])

  return (
    <Box
      height="100vh"
    >
      <Navbar socket={socket} setPostTimeDiff={setPostTimeDiff} lowerBodyRef={lowerBodyRef} />
      <Box
        width="100%"
        padding="2rem 6% 0 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        // gap="0.5rem"
        justifyContent="space-between"
        ref={lowerBodyRef}
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} >
          <UserWidget userId={_id} picturePath={picturePath} isLoading={isLoading} setIsLoading={setIsLoading} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          style={{ overflowY: "scroll", height: '85vh' }}
          onScroll={(e)=> handleScroll(e)}
          className="mypost-box"
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget setPostTimeDiff={setPostTimeDiff} userId={_id} socket={socket} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%" style={{ height: "85vh", paddingBottom: "2rem" }}
            className="adv-friend-box">
            {/* <AdvertWidget /> */}
            {/* <Box m="2rem 0" /> */}
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
