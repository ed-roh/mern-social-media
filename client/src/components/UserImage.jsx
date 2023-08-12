import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px", mr=0 }) => {
  return (
    <Box width={size} height={size} mr={mr}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%"}}
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
