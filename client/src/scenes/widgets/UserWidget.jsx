import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  CheckCircleRounded ,
  OpenInFull 
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, TextField } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import axios from 'axios'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { _id } = useSelector((state) => state.user);
  const [ currentUser, setCurrentUser] = useState('')
  const [InputBox, setInputBox] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;


  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };


  const updateUser = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/users/${userId}`,
        { twitter, linkedIn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  useEffect(() => {
    getUser();
  localStorage.setItem('userId', userId)
  const cu = localStorage.getItem('userId')
  setCurrentUser(cu)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    twitter,
    linkedIn
  } = user;
  const handleSubmit = () => {
    updateUser()
    setInputBox(false)
   }
   const handleTwitterEdit = () => {
    setUser((prev) => ({
      ...prev,
      twitter
    }));
    
  };
  
  const ProfileId = window.location.pathname.split("/").pop()

  // const handleLinkedInEdit = () =>{
  //   setInputBox(!InputBox)
  // }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  
  console.log('103',userId === ProfileId, ProfileId, _id)
  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
             Twitter 
              </Typography>
              {InputBox ?
              <>
              <TextField id="standard-basic" label="" variant="standard" 
              name="twitter" onChange={handleInputChange}/>  
         
              </>
              :
              <>
              <Typography color={medium}>{twitter}</Typography>
              
              </>
              }
            </Box>     
          </FlexBetween>    
          { (_id === ProfileId) ? ( InputBox ? 
          
          <CheckCircleRounded onClick={handleSubmit} /> 
          :
         <EditOutlined sx={{ color: main }} onClick={() => setInputBox(!InputBox)}/> 
          ):''}    
        </FlexBetween>

        {/* <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>{linkedIn}</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }}/>
        </FlexBetween> */}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
