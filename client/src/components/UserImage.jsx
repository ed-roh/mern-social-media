import { Box } from "@mui/material";

const UserImage = ({ image , isComment}) => {
  const size = isComment ? "30px" : "45px" 
  return (
    <Box sx={{mr:isComment ? 1 : 0}} width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
