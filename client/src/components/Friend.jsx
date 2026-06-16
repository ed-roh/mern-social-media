import { PersonAddOutlined, PersonRemoveOutlined, Message } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { env } from "../config";

const Friend = ({ friendId, name, subtitle, userPicturePath, socket, loggedInUserId, postUserId, handleClickToChat, isBeingSearched=false}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.authReducer.user);
  const token = useSelector((state) => state.authReducer.token);
  const friends = useSelector((state) => state.authReducer.user.friends);

  const { palette } = useTheme();
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `${env.serverEndpoint()}/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const isFrnd = data.find(frnd => frnd._id === friendId)
    if (isFrnd) handleNotification(3)
    if (!isFrnd) {
      const response = await fetch(
        `${env.serverEndpoint()}/conversations/${_id}/${friendId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      window.location.reload()
    }
    dispatch(setFriends({ friends: data }));
  };

  const handleNotification = (notiType) => {
    socket.emit("send-notification", {
      senderId: loggedInUserId,
      receiverId: postUserId,
      type: notiType
    })
  }

  const startConversation = async () => {
    const response = await fetch(
      `${env.serverEndpoint()}/conversations/`,
      {
        method: "POST",
        body: JSON.stringify({ senderId: _id, receiverId: friendId }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    let id = null
    if (!data.existingConversation) {
      id = data._doc._id
    } else {
      id = data._id
    }
    if (handleClickToChat !== null && window.location.pathname.includes("messenger")) {
      handleClickToChat(id)
      return
    }
    navigate({
      pathname: '/messenger',
      search: "?convId=" + id
    })
  }

  return (
    <FlexBetween >
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="30px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h6"
            fontWeight="500"
            fontSize="12px"
            sx={{
              "&:hover": {
                color: palette.primary.dark,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.65rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
        {postUserId !== _id &&
      <FlexBetween gap="5px">

          {(!window.location.pathname.includes("messenger")) &&
          <IconButton
            onClick={() => patchFriend()}
            // sx={{ backgroundColor: primaryLight, p: "0.3rem" }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />

            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>}
        {!isBeingSearched&&isFriend&&
          <IconButton
            // sx={{ backgroundColor: primaryLight, p: "0.2rem" }}
            onClick={() => startConversation()}
          >
            <Message sx={{ fontSize: "20px" }} />
          </IconButton>
        }
      </FlexBetween>}
    </FlexBetween>
  );
};

export default Friend;
