import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField,MenuItem, Stack } from '@mui/material';
import './CustomDateTimePicker.css'
import { CustomCalendarIcon } from '../../common/icons';

dayjs.extend(utc);

const CustomDateTimePicker = ({ onChange }: { onChange: (value: string) => void }) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [hour, setHour] = useState<string>('00');
  const [minute, setMinute] = useState<string>('00');

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const CalendarIcon = () => <CustomCalendarIcon/>;

  useEffect(() => {
    if (date) {
      const combined = dayjs(`${date.format('YYYY-MM-DD')}T${hour}:${minute}:00`);
      const isoString = combined.utc().toISOString(); // final format: 2025-03-26T09:30:00.000Z
      onChange(isoString);
    }
  }, [date, hour, minute]);

  return (
    <Stack direction="row" spacing={2} sx={{width: '100%'}}>
      <DatePicker
        value={date}
        minDate={dayjs()}
        onChange={(newValue) => setDate(newValue)}
        slotProps={{
          textField: {
            variant: 'outlined',
            sx: { width: '40%' }
          }
        }}
        slots={{
          openPickerIcon: CalendarIcon,
        }}
      />
      <TextField
        select
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        sx={{ width: '25%' }}
        SelectProps={{
          IconComponent: () => <span style={{ fontSize: '12px', paddingRight: '14px' }}>時</span>,
        }}
      >
        {hours.map((h) => (
          <MenuItem key={h} value={h}>{h}</MenuItem>
        ))}
      </TextField>
      <TextField
        select
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        sx={{ width: '25%' }}
        SelectProps={{
          IconComponent: () => <span style={{ fontSize: '12px', paddingRight: '14px' }}>分</span>,
        }}
      >
        {minutes.map((m) => (
          <MenuItem key={m} value={m}>{m}</MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default CustomDateTimePicker;
