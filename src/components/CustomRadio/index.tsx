import { Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { CustomRadioGroupProps } from '../../types';
import './CustomRadio.css'

const IconContainer = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  [theme.breakpoints.down('sm')]: {
    width: 14,
    height: 14,
  },
}));

const UncheckedIcon = styled('span')(({ theme }) => ({
  width: 18,
  height: 18,
  borderRadius: '50%',
  backgroundColor: '#D9D9D9',
  [theme.breakpoints.down('sm')]: {
    width: 14,
    height: 14,
  },
}));

const CheckedIcon = styled('span')(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: '#0B9DBD',
  [theme.breakpoints.down('sm')]: {
    width: 9,
    height: 9,
  },
}));
const CustomRadio = (props: any) => {
  return (
    <Radio
      disableRipple
      color="default"
      sx={{ padding: {xs:'0px 9px',sm: '0px 10px' } }}
      checkedIcon={
        <IconContainer>
          <UncheckedIcon />
          <CheckedIcon style={{ position: 'absolute' }} />
        </IconContainer>
      }
      icon={
        <IconContainer>
          <UncheckedIcon />
        </IconContainer>
      }
      {...props}
    />
  );
};

const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: '#3e3e3e',
    fontSize: '10px',
     [theme.breakpoints.up('sm')]: {
      fontSize: '12px',
    },
  },
  '@media (max-width: 600px)': {
    '&.MuiFormControlLabel-root': {
      marginLeft: '0',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '10px',
      marginLeft: '0'
    },
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
  labelWidth,
  labelWidthSp,
  containerStyle
}) => {
  return (
    <FormControl className='radioFormControl' sx={containerStyle || {width: '100%'}}>
      {label!=='' &&  <FormLabel className='radioFormLabel' sx={{width: {sm: labelWidth, xs: labelWidthSp}, fontSize: {lg: '12px !important', xs: '10px !important'},}}>{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => {
          return(
          <RadioGroup {...field} className={`radioFormGroup ${isModal? 'modalInput' : ''}`} value={field.value ?? defaultValue}
          onChange={(event) => {field.onChange(event.target.value)
            onChangeValue?.(event.target.value);
          }} sx={{width: {xs: 'inherit', sm: 'auto'}}}>
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
