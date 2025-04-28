import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { CustomButtonProps } from "../../types";
import './CustomButton.css';

const VisuallyHiddenInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
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
  buttonCategory = 'submit',
  type = 'button',
  isFileUpload = false,
  disabled = false,
  onFileChange,
  className='',
  isLoading = false,
}) => {
  return (
    <Button
      variant="contained"
      disabled={disabled}
      startIcon={!isLoading ? startIcon : null}
      type={type}
      component={isFileUpload ? "label" : "button"}
      sx={{
        ...sx,
        '&.Mui-disabled': {
          backgroundColor: '#808080 !important', 
          color: '#fff',
        },
      }}
      className={`buttonStyle ${className} ${buttonCategory === 'submit' ? '' : 'cancel'}`}
      onClick={isLoading ? undefined : onClick}
    >
      {isLoading ? (
        <CircularProgress size={24} color="inherit" /> 
      ) : (
        label
      )}
      {isFileUpload && (
        <VisuallyHiddenInput
          type="file"
          onChange={onFileChange}
          multiple
        />
      )}
    </Button>
  );
};

export default CustomButton;