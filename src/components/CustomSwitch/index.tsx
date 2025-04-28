import Switch from '@mui/material/Switch';

const CustomSwitch:React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label:string }> =({ checked, onChange, label })=> {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <>
    <Switch
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
    {label}
    </>
  );
}

export default CustomSwitch