import React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

// Define types for CustomCheckboxProps if not imported
interface CustomCheckboxProps {
  fieldName: string;
  value: boolean;
  onChange: (data: { fieldName: string; value: boolean }) => void;
  label?: string;
}

// Styled component for the iOS-style switch with increased width
const CustomSwitch = styled(({props}: any) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 60, // Increased from 42
  height: 30, // Increased from 26
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(30px)', // Increased from 16px to match wider track
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#039dbe',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#039dbe',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 26, // Increased from 22
    height: 26, // Increased from 22
    borderRadius: 30 / 2, // Increased to match new height
  },
  '& .MuiSwitch-track': {
    borderRadius: 30 / 2, // Increased from 26 / 2
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

// The main iOS-style checkbox component
const CustomCheckbox = ({ fieldName, value, onChange, label }: CustomCheckboxProps) => {  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    if (onChange) {
      // Pass our custom object structure instead of the event
      onChange({
        fieldName,
        value: event.target.checked
      });
    }
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<CustomSwitch sx={{ mr: 1 }} checked={Boolean(value)} onChange={handleChange} />}
        label={label}
      />
    </FormGroup>
  );
};

export default CustomCheckbox;