import { useState } from "react";
import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const slideImages = [
    "http://localhost:3001/assets/info1.jpeg",
    "http://localhost:3001/assets/info2.jpeg",
    "http://localhost:3001/assets/info3.jpeg",
    "http://localhost:3001/assets/info4.jpeg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (direction) => {
    if (direction === "next") {
      setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
    } else if (direction === "prev") {
      setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
    }
  };

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
          {"<"}
        </div>
        <div style={{ position: "absolute", top: "50%", right: "0", transform: "translateY(-50%)", cursor: "pointer" }} onClick={() => handleSlideChange("next")}>
          {">"}
        </div>
      </div>
      <FlexBetween>
        <Typography color={main}>MikaCosmetics</Typography>
        <Typography color={medium}>mikacosmetics.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Your pathway to stunning and immaculate beauty and made sure your skin is exfoliating skin and shining like light.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
