import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import { CustomInputProps } from '../../types';
import './CustomInput.css';

const CustomInput:React.FC<CustomInputProps> = ({placeholder, helperText, error, type = 'text', register, name,rules,endAdornment }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const handleFocus = () => {
        setIsFocused(true);
      };
    
    const handleBlur = () => {
        setIsFocused(false);
      };

  return (
    <FormControl
    className={`formControl ${error ? 'formControlError' : ''}`}
    >
        {isFocused && helperText && (
        <FormHelperText className={`formControlHelperText ${error ? 'formControlHelperTextError' : 'formControlHelperTextNormal'}`}>
          {helperText}
        </FormHelperText>
      )}
      <OutlinedInput placeholder={placeholder} type={type} {...register(name, rules)} onFocus={handleFocus}
        onBlur={handleBlur} 
        endAdornment={endAdornment}
        />
    </FormControl>
  );
};

export default CustomInput;
