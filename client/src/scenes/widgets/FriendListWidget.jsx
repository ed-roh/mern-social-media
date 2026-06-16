import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { env } from "config";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId, handleClickToChat=null }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.authReducer.token);
  const friends = useSelector((state) => state.authReducer.user.friends);
  const [isLoading, setIsLoading] = useState(false)

  const getFriends = async () => {
    setIsLoading(prev=> true)
    const response = await fetch(
      `${env.serverEndpoint()}/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    setIsLoading(prev => false)
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      {
        isLoading?<>
        <Skeleton count={1} />
        <Skeleton count={1} width={50} />
        </>:
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              handleClickToChat={handleClickToChat}
            />
          ))}
        </Box>
      }
    </WidgetWrapper>
  );
};

export default FriendListWidget;
