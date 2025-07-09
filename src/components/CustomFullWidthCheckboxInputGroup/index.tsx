import React from "react";
import { Box, Typography, Checkbox, FormControlLabel, FormHelperText, useMediaQuery } from "@mui/material";
import { RequireIcon } from "../CustomTwoColInputGroup";
import '../../common/common.css';
import './CustomFullWidthCheckboxInputGroup.css';
import { CustomFullWidthCheckboxInputGroupProps } from "../../types";

const CustomFullWidthCheckboxGroup: React.FC<CustomFullWidthCheckboxInputGroupProps> = ({
  label,
  name,
  register,
  errors,
  disabled = false,
  isRequired = false,
  isModalInput = false,
  extraClassName = 'flexRow',
  options,
  helperText,
  watch, // Add watch from react-hook-form
  setValue, // Add setValue from react-hook-form
  sx={},
  boxSx,
  labelWidth,
  uncheckedValue = "" // Add uncheckedValue prop with default empty string
}) => {
  const registerOptions = isRequired ? { required: `${label}は必須です。` } : {};
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // Get current form values
  const currentValue = watch ? watch(name) : undefined;
  
  const handleCheckboxChange = (optionValue: any, checked: boolean) => {
    if (setValue) {
      if (checked) {
        // Set the role to the option value (e.g., "admin")
        setValue(name, optionValue);
      } else {
        // Set the unchecked value when unchecked
        setValue(name, uncheckedValue);
      }
    }
  };

  return (
    <Box className={`inputGroupWrapper ${extraClassName} ${isModalInput ? 'modalInput' : ''} ${isMobile? 'sp' : ''}`} sx={{...boxSx}}>
      <Typography 
        className={`inputLabel ${isMobile? 'sp' : ''}`} 
        paddingBottom={errors[name] && extraClassName !== 'flexCol' ? '24px' : extraClassName === 'flexCol' ? '10px' : ''}
        sx={{
          width: labelWidth,
          fontSize: {xs: '10px !important', sm: '12px !important'}
        }}
      >
        {label}{isRequired && <span style={{display: 'flex'}}><RequireIcon/></span>}
      </Typography>
      <Box className={`inputGroupWrapperWidth ${isModalInput ? 'modalInput' : ''} ${isMobile? 'sp' : ''}`} sx={{...sx}}>
        {options ? (
          <Box>
            {options.map((option) => (
              <FormControlLabel
                sx={{
                  fontWeight: 'bold',
                  '& .MuiFormControlLabel-label': {
                    fontSize: {xs: '10px', sm: '14px'},
                  },
                }}
                key={option.value}
                control={
                  <Checkbox
                    size={`${isMobile?'small':'medium'}`}
                  sx={{'&.Mui-checked': {color: '#0B9DBD'}}}
                    disabled={disabled}
                    checked={currentValue === option.value}
                    onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  />
                }
                label={option.label}
              />
            ))}
            {/* Hidden input for form validation */}
            <input
              type="hidden"
              {...register(name, registerOptions)}
            />
            {errors[name] && (
              <FormHelperText error>{errors[name]?.message}</FormHelperText>
            )}
          </Box>
        ) : (
          <FormControlLabel
            control={
              <Checkbox
                disabled={disabled}
                {...register(name, registerOptions)}
              />
            }
            label={label}
          />
        )}
        {helperText && !errors[name] && <FormHelperText>{helperText}</FormHelperText>}
        {errors[name] && <FormHelperText error>{errors[name]?.message}</FormHelperText>}
      </Box>
    </Box>
  );
};

export default CustomFullWidthCheckboxGroup;