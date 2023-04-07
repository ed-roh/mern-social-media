import { useState, useEffect } from "react";
import { Typography, useTheme, IconButton, Button } from "@mui/material";
import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import axios from 'axios';

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://sheetdb.io/api/v1/kwecdtehfatvt`);
      const data = response.data;
      console.log('93', data);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const slideImages = data.map(item => item.ProductLink);

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (direction) => {
    if (direction === "next") {
      setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
    } else if (direction === "prev") {
      setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleSlideChange("next");
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);
  
  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <div style={{ position: "relative", width: "100%", height: "auto", overflow: "hidden", borderRadius: "0.75rem", margin: "0.75rem 0" }}>
        {slideImages.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="advert"
            style={{
              position: index === currentSlide ? "static" : "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
              transition: "opacity 0.5s",
              opacity: index === currentSlide ? 1 : 0,
            }}
          />
        ))}
        <div style={{ position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)", cursor: "pointer" }} onClick={() => handleSlideChange("prev")}>
          < IconButton ><ArrowBackIosNewRounded /></IconButton>
        </div>
        <div style={{ position: "absolute", top: "50%", right: "0", transform: "translateY(-50%)", cursor: "pointer" }} onClick={() => handleSlideChange("next")}>
          < IconButton ><ArrowForwardIosRounded /></IconButton>
        </div>
      </div>
      {data.map((item, k) => (
  <div key={k} style={{
    position: k === currentSlide ? "static" : "absolute",
    width: "100%",
    height: "auto",
    transition: "opacity 0.5s",
    opacity: k === currentSlide ? 1 : 0,
  }}>
    <FlexBetween>
      <Typography variant="h4" component="h4" color={main}>{item.Price}</Typography>
      <Typography color={medium}><a href="https://www.nike.com/gb/" >Quick Buy</a></Typography>
    </FlexBetween>
    <Typography color={medium} m="0.5rem 0">
      {item.Description}
    </Typography>
  </div>
))}


    </WidgetWrapper>
  );
};

export default AdvertWidget;
