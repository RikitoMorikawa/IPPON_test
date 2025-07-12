import React from "react";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";

interface OutputToggleButtonProps {
  value: "auto" | "manual";
  onChange: (value: "auto" | "manual") => void;
  leftLabel?: string;
  rightLabel?: string;
  disabled?: boolean;
  sx?: any;
}

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 700,
  fontSize: "14px",
  borderRadius: "8px",
  border: "none",
  transition: "all 0.3s ease",
  whiteSpace: "nowrap",
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
}));

const OutputToggleButton: React.FC<OutputToggleButtonProps> = ({
  value,
  onChange,
  leftLabel = "",
  rightLabel = "",
  disabled = false,
  sx,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const buttonWidth = isMobile ? "120px" : "140px";
  const buttonHeight = isMobile ? "34px" : "38px";
  const buttonPadding = isMobile ? "6px 12px" : "8px 16px";
  
  return (
    <Box sx={{ display: "inline-flex", ...sx }}>
      <StyledButton
        onClick={() => onChange("auto")}
        disabled={disabled}
        sx={{
          width: buttonWidth,
          height: buttonHeight,
          padding: buttonPadding,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
          backgroundColor: value === "auto" ? "#4AABCF" : "#FFFFFF",
          color: value === "auto" ? "#FFFFFF" : "#989898",
          border: "1px solid #D9D9D9 !important",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          "&.Mui-disabled": {
            backgroundColor: "#E0E0E0",
            color: "#A0A0A0",
            border: "1px solid #D9D9D9 !important",
          },
        }}
      >
        {leftLabel}
      </StyledButton>
      <StyledButton
        onClick={() => onChange("manual")}
        disabled={disabled}
        sx={{
          width: buttonWidth,
          height: buttonHeight,
          padding: buttonPadding,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
          backgroundColor: value === "manual" ? "#4AABCF" : "#FFFFFF",
          color: value === "manual" ? "#FFFFFF" : "#989898",
          border: "1px solid #D9D9D9 !important",
          borderLeft: "none !important",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
          "&.Mui-disabled": {
            backgroundColor: "#E0E0E0",
            color: "#A0A0A0",
            border: "1px solid #D9D9D9 !important",
            borderLeft: "none !important",
          },
        }}
      >
        {rightLabel}
      </StyledButton>
    </Box>
  );
};

export default OutputToggleButton;