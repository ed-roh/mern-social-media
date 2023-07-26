import { PersonAddOutlined, PersonRemoveOutlined, Message } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setConvs, setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath, socket, loggedInUserId, postUserId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.authReducer.user);
  const token = useSelector((state) => state.authReducer.token);
  const friends = useSelector((state) => state.authReducer.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const isFrnd = data.find(frnd=> frnd._id === friendId)
    if(isFrnd) handleNotification(3)
    dispatch(setFriends({ friends: data }));
  };

  const handleNotification = (notiType)=>{
    socket.emit("send-notification", {
      senderId: loggedInUserId,
      receiverId: postUserId,
      type:notiType
    })
  }

  const startConversation = async()=>{
    const response = await fetch(
      `http://localhost:3001/conversations/`,
      {
          method:"POST",
          body:JSON.stringify({senderId:_id, receiverId:friendId}),
          headers:{
              "Content-Type":"application/json",
              Authorization: `Bearer ${token}` 
          }
      }
  );
    
    const data = await response.json();
    console.log(data)
    // const currConvs = [...convs];
    // currConvs.push(data)
    // dispatch(setConvs(currConvs))
    // if(data.existingConversation){
    let id = null
    if(!data.existingConversation){
      id=data._doc._id
    }else{
      id=data._id
    }
    navigate({
      pathname:'/messenger',
      search:"?convId="+id
    })
    // }
  }

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="40px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween gap="5px">

      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.3rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
          
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
      <IconButton
      sx={{ backgroundColor: primaryLight, p: "0.2rem" }}
      onClick={()=> startConversation()}
      >
        <Message sx={{ fontSize: "25px" }} />
      </IconButton>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Friend;
