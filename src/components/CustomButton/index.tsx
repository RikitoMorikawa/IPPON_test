import React from "react";
import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import { CustomButtonProps } from "../../types";
import "./CustomButton.css";

const styled = {
  clearButton: {
    fontSize: "12px",
    height: "38px",
    borderRadius: 2.5,
    borderColor: "#D9D9D9",
    color: "#989898",
    boxShadow: "none",
    "&:hover": {
      boxShadow: "none",
      borderColor: "#B0B0B0",
      backgroundColor: "#F5F5F5",
    },
    "&:active": {
      boxShadow: "none",
      borderColor: "#A0A0A0",
    },
    "&.Mui-disabled": {
      backgroundColor: "#F5F5F5 !important",
      borderColor: "#E0E0E0 !important",
      color: "#C0C0C0 !important",
    },
    "@media (max-width: 600px)": {
      height: "34px",
      minWidth: '68px'
    },
  },
};

const VisuallyHiddenInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => (
  <input
    {...props}
    style={{
      position: "absolute",
      width: "1px",
      height: "1px",
      margin: "-1px",
      padding: "0",
      border: "0",
      clip: "rect(0 0 0 0)",
      clipPath: "inset(100%)",
      overflow: "hidden",
    }}
  />
);
const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  startIcon,
  sx = {},
  buttonCategory = "submit",
  type = "button",
  isFileUpload = false,
  disabled = false,
  onFileChange,
  className = "",
  isLoading = false,
}) => {
  const isClearButton = label === "クリア";
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Button
      variant={isClearButton ? "outlined" : "contained"}
      disabled={disabled}
      startIcon={!isLoading ? startIcon : null}
      type={type}
      component={isFileUpload ? "label" : "button"}
      disableElevation
      sx={{
        ...(isClearButton ? styled.clearButton : {}),
        textTransform: 'none', // Preserve original case
        ...sx,
        "&.Mui-disabled": {
          backgroundColor: isClearButton
            ? "#F5F5F5 !important"
            : "#808080 !important",
          borderColor: isClearButton ? "#E0E0E0 !important" : undefined,
          color: isClearButton ? "#C0C0C0 !important" : "#fff",
        },
      }}
      className={
        isClearButton
          ? className
          : `buttonStyle ${className} ${isMobile?'sp':''} ${
              buttonCategory === "submit"
                ? "submit"
                : buttonCategory === "delete"
                ? "delete"
                : "cancel"
            }`
      }
      onClick={isLoading ? undefined : onClick}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : label}
      {isFileUpload && (
        <VisuallyHiddenInput type="file" onChange={onFileChange} multiple />
      )}
    </Button>
  );
};

export default CustomButton;