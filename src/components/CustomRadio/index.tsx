import { Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CustomRadioGroupProps } from '../../types';
import './CustomRadio.css'

const CustomRadio = styled(Radio)(() => ({
  '&.MuiButtonBase-root': {
    position: 'relative',
    padding: '8px',
  },
  '&.Mui-checked': {
    color: '#D9D9D9',
    border: 'inherit',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '20px',
    height: '20px',
    backgroundColor: '#D9D9D9',
    border: 'inherit',
    borderRadius: '50%',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '3',
  },
  '&.Mui-checked::before': {
    content: '""',
    position: 'absolute',
    width: '14px',
    height: '14px',
    backgroundColor: '#3F97D5',
    border: 'inherit',
    borderRadius: '50%',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const CustomFormControlLabel = styled(FormControlLabel)(() => ({
  '& .MuiFormControlLabel-label': {
    color: '#3e3e3e',
    fontSize: '12px',
  },
}));

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  name,
  control,
  label,
  options,
  defaultValue,
  isModal = false,
  onChangeValue,
  disabled=false,
}) => {
  return (
    <FormControl className='radioFormControl'>
      {label!=='' &&  <FormLabel className='radioFormLabel' >{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
          return(
          <RadioGroup {...field} className={`radioFormGroup ${isModal? 'modalInput' : ''}`} value={field.value ?? defaultValue}
          onChange={(event) => {field.onChange(event.target.value)
            onChangeValue?.(event.target.value);
          }}>
            {options.map((option) => (
              <CustomFormControlLabel
                key={option.value}
                value={option.value}
                control={<CustomRadio />}
                label={option.label}
                disabled={disabled}
              />
            ))}
          </RadioGroup>
        )}}
      />
    </FormControl>
  );
};

export default CustomRadioGroup;
