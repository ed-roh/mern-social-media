import { Box, Divider, List, ListItem, Typography } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper'
import React from 'react'
import Friend from 'components/Friend'
import Loading from 'components/Loading'
import { Link } from 'react-router-dom'

const SearchDropdownWidget = ({ users, searchValue, userId, socket }) => {
  

  const filterUsersBySearch =()=>{
    const searchedUsers = users.filter(user=> (
      (user.firstName.toLowerCase().includes(searchValue.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchValue.toLowerCase()))) &&
      user._id !== userId
    );
    return searchedUsers;
  }

  return (
    <Box style={{
      position: "absolute",
      top: "3rem",
      left: "1rem",
      zIndex: "2",
      boxShadow: "1px 1px 5px black",
      borderRadius: "12px"

    }} width="27vw">
      <WidgetWrapper>
        <Typography>{`Search results (${filterUsersBySearch().length})`}</Typography>
        <List style={{}}>
          { filterUsersBySearch().length === 0? 
          <Loading />:
            users.filter((user, i)=>{
              if(i>7) return false;
              return(
                (user.firstName.toLowerCase().includes(searchValue.toLowerCase()) || 
                user.lastName.toLowerCase().includes(searchValue.toLowerCase()))) &&
                user._id !== userId
            } 
            )
            .map(user => {
               return <ListItem key={`search_results_${user._id}`} sx={{ p: 2 }}>
                  <Box>
                      <Friend
                        key={user._id}
                        friendId={user._id}
                        name={`${user.firstName} ${user.lastName}`}
                        subtitle={user.occupation}
                        userPicturePath={user.picturePath}
                        isBeingSearched={true}
                        socket={socket}
                        // handleClickToChat={handleClickToChat}
                      />
                  </Box>
                <Divider />
                </ListItem>
              }

            )
          }
        </List>
        {!!filterUsersBySearch().length&&<Typography> <Link>See all results</Link>  </Typography>}
      </WidgetWrapper>
    </Box>
  )
}

export default SearchDropdownWidget
