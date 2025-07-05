import React from "react";
import { Box, IconButton, InputAdornment, Typography, useMediaQuery, useTheme } from "@mui/material";
import { CustomFullWidthInputGroupProps } from "../../types";
import CustomTextField from "../CustomTextField";
import { CustomTextAreaField } from "../CustomTextField";
import '../../common/common.css'
import './CustomFullWidthInputGroup.css'
import { DateRangeCalendarIcon, RequireIcon } from "../../common/icons";

// Note: Add these props to your CustomFullWidthInputGroupProps interface:
// inputWidth?: string | number;
// inputWidthSp?: string | number;
 
const CustomFullWidthInputGroup: React.FC<CustomFullWidthInputGroupProps> = ({
  label,
  name,
  placeholder = "",
  register,
  errors,
  disabled=false,
  isRequired = false,
  // isModalInput = false,
  type = 'text',
  // isShowInColumn = false,
  // extraClassName = 'flexRow',
  rows,
  multiline = false,
  min,
  max,
  minMessage,
  maxMessage,
  labelWidth,
  labelWidthSp,
  inputWidth,
  inputWidthSp,
  labelSx= {},
  showYen = false,
  showMeter = false, 
  showYearIcon = false,
  showCalendarIcon,
  onCalendarClick,
  children,
}) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // true for xs

  const getValidationRules = () => {
    const rules: any = {};
    
    if (isRequired) {
      rules.required = `${label}は必須です。`;
    }
    
    if (type === 'number' && (min !== undefined || max !== undefined)) {
      // Add a validate function for custom digit length validation
      rules.validate = {
        digitsCheck: (value: string) => {
          // Remove any negative sign and decimal point for digit counting
          const numStr = value.toString().replace(/[-.]/g, '');
          
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
    
    if (type === 'email') {
      rules.pattern = {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '有効なメールアドレスを入力してください。',
      };
    }
  
    if (type === 'phoneNumber') {
      rules.pattern = {
        value: /^\d{10,11}$/,
        message: 'Phone番号は10桁または11桁の数字である必要があります。',
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

  // Always use column layout (label on top, input below)
  const getResponsiveClass = () => {
    return 'flexCol';
  };

  return (
     <Box className={`inputGroupWrapper ${getResponsiveClass()} ${isMobile?'sp':''} ${multiline&&'multiline'} ${showCalendarIcon?'hasCalendar':''}`} sx={{display: 'flex !important', flexDirection: 'column !important'}}>
      <Typography className={`inputLabel ${isMobile?'sp':''} ${multiline&&'multiline'}`} sx={{
          width: {lg: labelWidth, xs: labelWidthSp || '100%'}, // Use labelWidth and labelWidthSp props
          ...labelSx,
          fontSize: {lg: '12px !important', xs: '10px !important'},
          alignSelf: 'flex-start', // Always align to start for column layout
          paddingTop: multiline ? '8px' : '0',
          paddingBottom: '4px', // Consistent spacing
          marginBottom: '4px', // Consistent margin
          textAlign: 'left', // Ensure label text is left-aligned
          justifyContent: 'flex-start', // Ensure content is aligned to the left
        }} >
        {label}{isRequired&& <span style={{display:'flex'}}><RequireIcon/></span>}
      </Typography>
      <Box sx={{
        width: {sm: inputWidth, xs: inputWidthSp}
      }}>
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
                        InputProps={{
                          endAdornment: showYen ? (
                            <InputAdornment position="end"><Typography sx={{ fontSize: '12px', color: '#3e3e3e' }}>
                            円
                          </Typography></InputAdornment>
                          ) : showMeter ? (
                            <InputAdornment position="end"><Typography sx={{ fontSize: '12px', color: '#3e3e3e' }}>
                            ㎡
                          </Typography></InputAdornment>
                          ) : showCalendarIcon ? (
                            <InputAdornment position="end">
                              <IconButton onClick={onCalendarClick} sx={{padding: '0'}}>
                                <DateRangeCalendarIcon />
                              </IconButton>
                            </InputAdornment>
                          ): showYearIcon ? (
                            <InputAdornment position="end"><Typography sx={{ fontSize: '12px', color: '#3e3e3e' }}>
                            年
                          </Typography></InputAdornment>
                          ) :null,
                        }}
                        sx={getInputStyles()}
                      />
        }{children&&children}
      </Box> 
    </Box>
  );
};
 
export default CustomFullWidthInputGroup;