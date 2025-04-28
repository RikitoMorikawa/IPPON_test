import React from "react";
import { Box, Typography, Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { RequireIcon } from "../CustomTwoColInputGroup";
import '../../common/common.css';
import './CustomFullWidthCheckboxInputGroup.css';

interface CustomFullWidthCheckboxInputGroupProps {
  label: string;
  name: string;
  register: any; 
  errors: any; 
  disabled?: boolean;
  isRequired?: boolean;
  isModalInput?: boolean;
  extraClassName?: string;
  options?: Array<{value: string, label: string}>;
  helperText?: string;
  checked?: boolean; 
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; 
}

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
}) => {
  const registerOptions = isRequired ? { required: `${label} is required` } : {};
  
  return (
    <Box className={`inputGroupWrapper ${extraClassName}`}>
      <Typography 
        className={`inputLabel`} 
        paddingBottom={errors[name] && extraClassName !== 'flexCol' ? '24px' : extraClassName === 'flexCol' ? '10px' : ''}
      >
        {label}{isRequired && <span style={{display: 'flex'}}><RequireIcon/></span>}
      </Typography>
      <Box className={`inputGroupWrapperWidth ${isModalInput ? 'modalInput' : ''}`}>
        {options ? (
          <Box>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    disabled={disabled}
                    {...register(`${name}.${option.value}`, registerOptions)}
                  />
                }
                label={option.label}
              />
            ))}
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