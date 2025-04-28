import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomFullWidthInputGroupProps } from "../../types";
import CustomTextField from "../CustomTextField";
import { CustomTextAreaField } from "../CustomTextField";
import { RequireIcon } from "../CustomTwoColInputGroup";
import '../../common/common.css'
import './CustomFullWidthInputGroup.css'

const CustomFullWidthInputGroup: React.FC<CustomFullWidthInputGroupProps> = ({
  label,
  name,
  placeholder = "",
  register,
  errors,
  disabled=false,
  isRequired = false,
  isModalInput = false,
  type = 'text',
  extraClassName = 'flexRow',
  rows,
  multiline = false,
  min,
  max,
  minMessage,
  maxMessage,
}) => {

  const getValidationRules = () => {
    const rules: any = {};
    
    if (isRequired) {
      rules.required = `${label} is required`;
    }
    
    if (type === 'number' && (min !== undefined || max !== undefined)) {
      // Add a validate function for custom digit length validation
      rules.validate = {
        digitsCheck: (value: string) => {
          // Remove any negative sign and decimal point for digit counting
          const numStr = value.toString().replace(/[-\.]/g, '');
          
          if (min !== undefined && numStr.length < min) {
            return minMessage || `Number must have at least ${min} digit(s)`;
          }
          
          if (max !== undefined && numStr.length > max) {
            return maxMessage || `Number must not exceed ${max} digit(s)`;
          }
          
          return true;
        }
      };
    }
    
    return rules;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number') {
      // Prevent 'e' and 'E' in all cases for number input
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
      }
      
      // Prevent '-' if negative numbers should be prevented
      if (e.key === '-') {
        e.preventDefault();
      }
    }
  };

  const getInputStyles = () => {
    if (type === 'number') {
      return {
        // Hide spinner buttons
        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        '& input[type=number]': {
          MozAppearance: 'textfield',
        },
      };
    }
    return {};
  };

  return (
     <Box className={`inputGroupWrapper ${extraClassName}`}>
      <Typography className={`inputLabel`}  paddingBottom={errors[name]&&extraClassName!=='flexCol' ? '24px' : extraClassName==='flexCol'? '10px' : ''} >
        {label}{isRequired&& <span style={{display:'flex'}}><RequireIcon/></span>}
      </Typography>
      <Box className={`inputGroupWrapperWidth ${isModalInput? 'modalInput' : ''}`}>
        {multiline ? <CustomTextAreaField
                      fullWidth
                      type={type}
                      placeholder={placeholder}
                      {...register(name, getValidationRules())}
                      error={!!errors[name]}
                      helperText={errors[name]?.message}
                      disabled={disabled}
                      rows={rows}
                      multiline={multiline}
                      /> : 
                      <CustomTextField
                        fullWidth
                        type={type}
                        placeholder={placeholder}
                        {...register(name, getValidationRules())}
                        error={!!errors[name]}
                        helperText={errors[name]?.message}
                        disabled={disabled}
                        onKeyDown={handleKeyDown}
                        inputProps={{
                          inputMode: 'numeric',
                        }}
                        sx={getInputStyles()}
                      />
        }
        </Box>
    </Box>
  );
};

export default CustomFullWidthInputGroup;