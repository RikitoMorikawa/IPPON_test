import React from "react";
import { IconButton, InputAdornment, Stack, useMediaQuery } from "@mui/material";
import { CustomTwoColProps } from "../../types";
import './CustomTwoColInput.css'
import CustomTextField from "../CustomTextField";
import '../../common/common.css'
import { CustomCloseIcon } from "../../common/icons";

const CustomTwoColInput: React.FC<CustomTwoColProps> = ({ firstName, lastName, placeholderOne, placeholderTwo, register, errors, disabled, index,
  onRemove,isModalInput,isRequired,validationMessageFirstName,
  validationMessageLastName }) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Stack direction="row" spacing={'10px'} className={`inputGroupWrapperWidth ${isModalInput? 'modalInput' : ''} ${isMobile?'sp':''}`}>
        <CustomTextField
        fullWidth
        label=""
        placeholder={placeholderOne}
        // {...register(firstName, { required: `${firstName} is required` })}
        {...register(firstName, isRequired ? { required: validationMessageFirstName } : {})}
        error={!!errors[firstName]}
        helperText={errors[firstName]?.message}
        disabled={disabled}
        InputProps={{
          endAdornment: index > 0 && (
            <InputAdornment position="end">
              <IconButton onClick={() => onRemove?.(index)} edge="end" color="error" sx={{width: '30px', padding: '10px'}}>
                <CustomCloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        />
        <CustomTextField
        fullWidth
        label=""
        placeholder={placeholderTwo}
        // {...register(lastName, { required: `${lastName} is required`  })}
        {...register(lastName, isRequired ? { required: validationMessageLastName  } : {})}
        error={!!errors[lastName]}
        helperText={errors[lastName]?.message}
        disabled={disabled}
        InputProps={{
          endAdornment: index > 0 && (
            <InputAdornment position="end">
              <IconButton onClick={() => onRemove?.(index)} edge="end" color="error" sx={{width: '30px', padding: '10px'}}>
              <CustomCloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        />
    </Stack>
  );
};

export default CustomTwoColInput;
