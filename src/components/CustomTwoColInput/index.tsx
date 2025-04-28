import React from "react";
import { Stack } from "@mui/material";
import { CustomTwoColProps } from "../../types";
import './CustomTwoColInput.css'
import CustomTextField from "../CustomTextField";
import '../../common/common.css'

const CustomTwoColInput: React.FC<CustomTwoColProps> = ({ firstName, lastName, placeholderOne, placeholderTwo, register, errors, disabled, isModalInput }) => {

  return (
    <Stack direction="row" spacing={'10px'} className={`inputGroupWrapperWidth ${isModalInput? 'modalInput' : ''}`}>
        <CustomTextField
        fullWidth
        label=""
        placeholder={placeholderOne}
        {...register(firstName, { required: `${firstName} is required` })}
        error={!!errors[firstName]}
        helperText={errors[firstName]?.message}
        disabled={disabled}
        />
        <CustomTextField
        fullWidth
        label=""
        placeholder={placeholderTwo}
        {...register(lastName, { required: `${lastName} is required`  })}
        error={!!errors[lastName]}
        helperText={errors[lastName]?.message}
        disabled={disabled}
        />
    </Stack>
  );
};

export default CustomTwoColInput;
