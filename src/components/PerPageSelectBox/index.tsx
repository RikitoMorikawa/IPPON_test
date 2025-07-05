import React from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { PerPageSelectBoxProps } from '../../types';

const PerPageSelectBox: React.FC<PerPageSelectBoxProps> = ({
  value,
  onChange,
  options = [10, 25, 50, 100]
}) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    onChange(event.target.value as number);
  };

  return (
    <FormControl variant="outlined" size="small" 
      sx={{ 
        minWidth: {xs: '67px', sm: '80px'},
        }}>
      <Select
        labelId="per-page-select-label"
        id="per-page-select"
        value={value}
        sx={{ 
          color: '#0B9DBD', 
          borderColor: '#0B9DBD',
          borderRadius: '8px',
          fontSize: '12px',
          width: {xs: '67px', sm: '80px'},
          '& .MuiOutlinedInput-input': {
            paddingRight: {xs: '0px !important', sm: '32px !important'},
            padding: {xs: '8.38px 14px !important', sm: '8.5px 14px !important'},
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0B9DBD',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0B9DBD',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0B9DBD',
          },
          '& .MuiSvgIcon-root': {
            color: '#0B9DBD',
          }
        }}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option} sx={{fontSize: '12px',minHeight: {xs: '25px',sm: '30px'}}}>
            {option}件
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PerPageSelectBox;