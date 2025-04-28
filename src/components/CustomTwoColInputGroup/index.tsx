import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomTwoColInputGroupProps } from "../../types";
import CustomTwoColInput from "../CustomTwoColInput";

export const RequireIcon = ()=>(
    <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.56818 13.75L1.56818 12.7273L7.65909 6.52273L8.65909 7.54545L2.56818 13.75ZM7.65909 13.75L1.56818 7.54545L2.56818 6.52273L8.65909 12.7273L7.65909 13.75ZM0.818182 10.0909C0.818182 9.84091 0.892045 9.63068 1.03977 9.46023C1.1875 9.28977 1.40909 9.20455 1.70455 9.20455C2.01136 9.20455 2.23864 9.28977 2.38636 9.46023C2.53788 9.63068 2.61364 9.84091 2.61364 10.0909C2.61364 10.3295 2.53788 10.5303 2.38636 10.6932C2.23864 10.8523 2.01136 10.9318 1.70455 10.9318C1.40909 10.9318 1.1875 10.8523 1.03977 10.6932C0.892045 10.5303 0.818182 10.3295 0.818182 10.0909ZM4.15909 13.5227C4.15909 13.2841 4.23295 13.0814 4.38068 12.9148C4.52841 12.7443 4.75 12.6591 5.04545 12.6591C5.34091 12.6591 5.56629 12.7443 5.72159 12.9148C5.87689 13.0814 5.95455 13.2841 5.95455 13.5227C5.95455 13.7614 5.87689 13.9659 5.72159 14.1364C5.56629 14.303 5.34091 14.3864 5.04545 14.3864C4.75 14.3864 4.52841 14.303 4.38068 14.1364C4.23295 13.9659 4.15909 13.7614 4.15909 13.5227ZM4.15909 6.75C4.15909 6.51136 4.23295 6.30871 4.38068 6.14205C4.52841 5.97159 4.75 5.88636 5.04545 5.88636C5.34091 5.88636 5.56629 5.97159 5.72159 6.14205C5.87689 6.30871 5.95455 6.51136 5.95455 6.75C5.95455 6.98864 5.87689 7.19318 5.72159 7.36364C5.56629 7.5303 5.34091 7.61364 5.04545 7.61364C4.75 7.61364 4.52841 7.5303 4.38068 7.36364C4.23295 7.19318 4.15909 6.98864 4.15909 6.75ZM7.47727 10.0909C7.47727 9.84091 7.55492 9.63068 7.71023 9.46023C7.86553 9.28977 8.09091 9.20455 8.38636 9.20455C8.68182 9.20455 8.9072 9.28977 9.0625 9.46023C9.2178 9.63068 9.29545 9.84091 9.29545 10.0909C9.29545 10.3295 9.2178 10.5303 9.0625 10.6932C8.9072 10.8523 8.68182 10.9318 8.38636 10.9318C8.09091 10.9318 7.86553 10.8523 7.71023 10.6932C7.55492 10.5303 7.47727 10.3295 7.47727 10.0909Z" fill="#DA384C"/>
</svg>
)

const CustomTwoColInputGroup: React.FC<CustomTwoColInputGroupProps> = ({
  label,
  firstName,
  lastName,
  placeholderOne,
  placeholderTwo,
  register,
  errors,
  marginBottom = "10px",
  disabled = false,
  isRequired = false,
  isModalInput = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: marginBottom,
      }}
    >
      <Typography align="right" fontSize={12} paddingBottom={errors[firstName] || errors[lastName]? '24px' : ''} marginRight="20px" color="#3E3E3E" fontWeight={700} sx={{display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
        {label}{isRequired&& <span style={{display:'flex'}}><RequireIcon/></span>}
      </Typography>
      <CustomTwoColInput
        firstName={firstName}
        lastName={lastName}
        placeholderOne={placeholderOne}
        placeholderTwo={placeholderTwo}
        register={register}
        errors={errors}
        disabled={disabled}
        isModalInput={isModalInput}
      />
    </Box>
  );
};

export default CustomTwoColInputGroup;
