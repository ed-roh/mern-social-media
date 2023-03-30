import { Category } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import { useState } from 'react';

const PostCategorizer = ({
  postId,
  likes, 
  picturePath, 
  userId,
  userPicturePath,
  name,
  description,
  location,
  comments
}) => {
  const [category, setCategory] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSave = () => {
    // const getItem = JSON.parse(localStorage.getItem('savedPosts'))
    // const alreadySaved = getItem.find(item => item.postId === postId)
    if(true){
      const categorizedPost = {
        postId,
        category,
        likes,
        picturePath,
        userId,
        userPicturePath,
        name,
        description,
        location,
        comments
      };
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
      savedPosts.push(categorizedPost);
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));    
    }
    setOpenSnackbar(true);

  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'justifyCenter' }}>
      <FormControl sx={{ m:1, minWidth: 120 }} size="small">
        <InputLabel>Category</InputLabel>
        <Select value={category} label="Category" onChange={handleCategoryChange}>
          <MenuItem value="great">Great</MenuItem>
          <MenuItem value="good">Good</MenuItem>
          <MenuItem value="ok">OK</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{mt:1.1}}>
        <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
      </Box>      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Post saved!"
      />
    </Box>
  );
};

export default PostCategorizer;
