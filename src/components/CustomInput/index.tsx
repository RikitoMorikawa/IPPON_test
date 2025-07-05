import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { CustomInputProps } from '../../types';
import './CustomInput.css';

interface ExtendedCustomInputProps extends CustomInputProps {
  InputProps?: Partial<OutlinedInputProps>;
}

const CustomInput: React.FC<ExtendedCustomInputProps> = ({
  placeholder, 
  helperText, 
  error, 
  type = 'text', 
  register, 
  name, 
  rules, 
  endAdornment,
  InputProps = {}
}) => {
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
      <OutlinedInput 
        placeholder={placeholder} 
        type={type} 
        {...register(name, rules)} 
        onFocus={handleFocus}
        onBlur={handleBlur} 
        endAdornment={endAdornment || InputProps.endAdornment}
        {...InputProps}
      />
    </FormControl>
  );
};

export default CustomInput;