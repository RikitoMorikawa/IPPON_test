import React from "react";
import { Box, Typography, MenuItem, Select, FormControl, FormHelperText } from "@mui/material";
import { RequireIcon } from "../CustomTwoColInputGroup";
import '../../common/common.css'
import './CustomFullWidthSelectInputGroup.css'
import { CustomFullWidthSelectInputGroupProps } from "../../types";
import { Controller } from "react-hook-form"; // Import Controller

const CustomFullWidthSelectInputGroup: React.FC<CustomFullWidthSelectInputGroupProps> = ({
  label,
  name,
  placeholder = "",
register,
  control, // Add control prop
  errors = {},
  disabled = false,
  isRequired = false,
  isModalInput = false,
  extraClassName = 'flexRow',
  options = []
}) => {
  return (
    <Box className={`inputGroupWrapper ${extraClassName}`}>
      <Typography 
        className={`inputLabel`} 
        paddingBottom={errors[name] && extraClassName !== 'flexCol' ? '24px' : extraClassName === 'flexCol' ? '10px' : ''}
      >
        {label}{isRequired && <span style={{display:'flex'}}><RequireIcon/></span>}
      </Typography>
      <Box className={`inputGroupWrapperWidth ${isModalInput ? 'modalInput' : ''}`}>
        <FormControl 
          fullWidth 
          error={isRequired ? !!errors[name] : false}
          disabled={disabled}
        >
          <Controller
            name={name}
            control={control}
            rules={isRequired ? { required: `${label} is required` } : {}}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                sx={{
                  height: '40px',
                  fontSize: '14px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: errors[name] ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)',
                    borderRadius: 2,
                  }
                }}
              >
                {placeholder && (
                  <MenuItem value="" disabled>
                    {placeholder}
                  </MenuItem>
                )}
                {options && options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {isRequired && errors[name] && (
            <FormHelperText>{errors[name]?.message}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

export default CustomFullWidthSelectInputGroup;