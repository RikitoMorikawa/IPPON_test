import React from "react";
import { Box } from "@mui/material";
import { spinAnimation } from "../Table";

interface LoadingOverlayProps {
  minHeight?: string;
  backgroundColor?: string;
  position?: "absolute" | "fixed" | "relative";
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  zIndex?: number;
}

const CustomLoadingOverlay: React.FC<LoadingOverlayProps> = ({
  minHeight = "300px",
  backgroundColor = "rgba(255, 255, 255, 1)",
  position = "absolute",
  top = 0,
  left = 0,
  right = 0,
  bottom = 0,
  zIndex = 10,
}) => (
  <Box
    sx={{
      position,
      top,
      left,
      right,
      bottom,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor,
      zIndex,
      minHeight,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Box
        sx={{
          width: "50px",
          height: "50px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #0B9DBD",
          borderRadius: "50%",
          animation: `${spinAnimation} 1s linear infinite`,
        }}
      />
    </Box>
  </Box>
);

export default CustomLoadingOverlay;
