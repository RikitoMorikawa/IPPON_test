import { useState } from 'react';
import { Box,IconButton, Stack, Typography } from '@mui/material';
import { LocalizationProvider, StaticDatePicker} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CustomButton from '../CustomButton';
import './datePicker.css'
import { CalendarLeftArrowIcon, CalendarRightArrowIcon, ClockIcon, DateRangeCalendarIcon, DropDownArrowIcon } from '../../common/icons';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CustomDatePickerProps, CustomDateRangePickerProps } from '../../types';
/* eslint-disable @typescript-eslint/no-explicit-any */

export const CustomDatePicker: React.FC<CustomDatePickerProps> =({ onDateConfirm, onCancel,type = 'date' })=> {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [monthToShow, setMonthToShow] = useState<Dayjs>(dayjs());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handlePrev = () => {
    const newMonth = monthToShow.subtract(1, 'month');
    setMonthToShow(newMonth);
    setSelectedDate((prev) => (prev ? newMonth.date(prev.date()) : newMonth));
  };

  const handleNext = () => {
    const newMonth = monthToShow.add(1, 'month');
    setMonthToShow(newMonth);
    setSelectedDate((prev) => (prev ? newMonth.date(prev.date()) : newMonth));
  };

  const japaneseWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

  const handleTimeChange = (unit: 'hour' | 'minute' | 'second', direction: 'up' | 'down') => {
    if (!selectedDate) return;
  
    const currentValue = selectedDate.get(unit);
    let newValue = direction === 'up' ? currentValue + 1 : currentValue - 1;

    if (unit === 'hour') newValue = (newValue + 24) % 24;
    if (unit === 'minute' || unit === 'second') newValue = (newValue + 60) % 60;

    const updatedDate = selectedDate.set(unit, newValue);
    setSelectedDate(updatedDate);
  };

  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width={322} border={1} borderRadius={2} p={2} className='customDatePicker' sx={{
          backgroundColor: '#ffff',
          boxShadow: '0px 1.19px 4.76px 0px #00000040',
            borderColor: '#D9D9D9',
            borderRadius: '11.91px',
          '& .MuiPickersDay-root': {
            color: '#3e3e3e !important', 
          },
          '& .Mui-selected': {
            backgroundColor: '#BFE6EF80 !important',
            border: '1px solid #0B9DBD',
          },
          '& .MuiPickersDay-dayWithMargin': {
            margin: '3px 4px',
          },
          '& .MuiTypography-root': {
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: '#333',
          },
          '& .MuiIconButton-root': {
            backgroundColor: 'transparent',
            '&:hover': {
                backgroundColor: 'transparent',
            },
            }
        }}>
        {/* Custom Header */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <IconButton onClick={handlePrev}>
            <span className='iconContainer'><CalendarLeftArrowIcon/></span>
          </IconButton>
          <Typography variant="subtitle1" className='dateTitle'>
            {monthToShow.format('YYYY年 MM月')}
          </Typography>
          <IconButton onClick={handleNext}>
            <span className='iconContainer'><CalendarRightArrowIcon/></span>
          </IconButton>
        </Box>

        {/* StaticDatePicker */}
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          dayOfWeekFormatter={(date: Dayjs) => japaneseWeekdays[date.day()]}
          showDaysOutsideCurrentMonth={false}
          sx={{
            '& .MuiPickersCalendarHeader-root': {
              display: 'none',
            },
            '& .MuiPickersDay-root': {
              fontSize: '14px',
              color: '#3E3E3E',
              fontWeight: '700',
            },
            '& .MuiDayPicker-weekDay': {
              fontSize: '14px',
              color: '#3E3E3E',
              fontWeight: '700'
            },
            '& .MuiTypography-root': {
                fontSize: '14px',
                fontWeight: 700,
                color: '#3e3e3e',
                margin: '3px 4px'
            },
            '& .css-17f9e7e-MuiTypography-root-MuiDayCalendar-weekDayLabel:nth-of-type(1)': {
                color: '#DA384C',
            },
            '& .css-17f9e7e-MuiTypography-root-MuiDayCalendar-weekDayLabel:nth-of-type(7)': {
                color: '#DA384C',
            },
          }}
        />
        {/* Optional Time Picker */}
        {type === 'dateTime' && (
          <Box mt={2}>
            <Box
                onClick={() => setShowTimePicker(!showTimePicker)}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={2}
                py={1}
                sx={{ cursor: 'pointer'}}
            >
                <Box sx={{display:'flex'}}>
                <ClockIcon/>
                <Typography fontWeight="bold" color='#0B9DBD' marginLeft={1}>時間を選択</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                    <DropDownArrowIcon sx={{fontSize: '13px'}}/>
                </Box>
            </Box>
            {/* Time Picker Panel */}
            {showTimePicker && (
                <Box display="flex" justifyContent="space-around" alignItems={'center'} mt={1} border="1px solid #D9D9D9" borderRadius={'10px'} px={1}>
                {['hour', 'minute', 'second'].map((unit,index) => (
                    <>
                    <Box key={unit} display="flex" flexDirection="column" alignItems="center" mx={1}>
                        <IconButton onClick={() => handleTimeChange(unit as any, 'up')} size="small" sx={{margin: '10px',padding:'0'}}>
                            <KeyboardArrowUpIcon />
                        </IconButton>
                        <Box className='timeContainer' >
                            <Typography variant="h6" fontSize={'14px !important'}>
                                {selectedDate?.get(unit as any).toString().padStart(2, '0')}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => handleTimeChange(unit as any, 'down')} size="small" sx={{margin: '10px',padding:'0'}}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Box>
                    {index !== 2 && <Box>:</Box>}
                    </>
                ))}
                </Box>
            )}
        </Box>
        )}
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <CustomButton label=' 戻る' buttonCategory='cancel' onClick={onCancel} />
          <CustomButton
            label='作成'
            onClick={() => onDateConfirm(selectedDate)}
          > 
          </CustomButton>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

export const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  onDateConfirm,
  onCancel,
})=>{
  const [monthToShow, setMonthToShow] = useState<Dayjs>(dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const japaneseWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

  const handlePrev = () => {
    setMonthToShow((prev) => prev.subtract(1, 'month'));
  };

  const handleNext = () => {
    setMonthToShow((prev) => prev.add(1, 'month'));
  };

  const handleSelect = (date: Dayjs | null) => {
    if (!date) return;

    // If no startDate or both selected, restart range
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date.isBefore(startDate)) {
      setEndDate(startDate);
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const isInRange = (day: Dayjs) => {
    if (startDate && endDate) {
      return day.isAfter(startDate, 'day') && day.isBefore(endDate, 'day');
    }
    return false;
  };

  const isSelected = (day: Dayjs) => {
    return (
      (startDate && day.isSame(startDate, 'day')) ||
      (endDate && day.isSame(endDate, 'day'))
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        width={322}
        border={1}
        borderRadius={2}
        p={2}
        className="customDatePicker"
        sx={{
          backgroundColor: '#fff',
          boxShadow: '0px 1.19px 4.76px 0px #00000040',
          borderColor: '#D9D9D9',
          borderRadius: '11.91px',
          '& .MuiPickersDay-root': {
            color: '#3e3e3e !important',
          },
          '& .Mui-selected': {
            backgroundColor: '#0B9DBD !important',
            color: '#fff !important',
            borderRadius: '50%',
          },
          '& .MuiPickersDay-dayWithMargin': {
            margin: '3px 4px',
          },
        }}
      >
        {/* Selected Range Display */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box className='dateRangeContainer'>
                <Typography className='dateRangeText'>
                {startDate ? startDate.format('YYYY/MM/DD') : '開始日'}
                </Typography>
                <span className='dateRangIconWrapper'><DateRangeCalendarIcon/></span>
            </Box>
            <Box className='dateRangeContainer'>
                <Typography className='dateRangeText'>
                {endDate ? endDate.format('YYYY/MM/DD') : '終了日'}
                </Typography>
                <span className='dateRangIconWrapper'><DateRangeCalendarIcon/></span>
            </Box>
        </Box>
        {/* Header */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <IconButton onClick={handlePrev}>
            <span className="iconContainer">
              <CalendarLeftArrowIcon />
            </span>
          </IconButton>
          <Typography variant="subtitle1" className="dateTitle">
            {monthToShow.format('YYYY年 MM月')}
          </Typography>
          <IconButton onClick={handleNext}>
            <span className="iconContainer">
              <CalendarRightArrowIcon />
            </span>
          </IconButton>
        </Box>

        {/* Calendar */}
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={monthToShow}
          onChange={handleSelect}
          dayOfWeekFormatter={(date: Dayjs) => japaneseWeekdays[date.day()]}
          showDaysOutsideCurrentMonth={false}
          referenceDate={monthToShow}
          sx={{
            '& .MuiPickersCalendarHeader-root': {
              display: 'none',
            },
            '& .MuiPickersDay-root': {
              fontSize: '14px',
              color: '#3E3E3E',
              fontWeight: '700',
            },
            '& .MuiDayPicker-weekDay': {
              fontSize: '14px',
              color: '#3E3E3E',
              fontWeight: '700'
            },
            '& .MuiTypography-root': {
                fontSize: '14px',
                fontWeight: 700,
                color: '#3e3e3e',
                margin: '3px 4px'
            },
            '& .css-17f9e7e-MuiTypography-root-MuiDayCalendar-weekDayLabel:nth-of-type(1)': {
                color: '#DA384C',
            },
            '& .css-17f9e7e-MuiTypography-root-MuiDayCalendar-weekDayLabel:nth-of-type(7)': {
                color: '#DA384C',
            },
          }}
          slots={{
            day: (props) => {
              const day = props.day;
              const isBetween = isInRange(day);
              const isStartOrEnd = isSelected(day);

              return (
                <>
                <Box
                  onClick={() => handleSelect(day)}
                  sx={{
                    width: 36,
                    height: 36,
                    margin: !isBetween?'3px 4px':'inherit',
                    // margin: !isBetween&&!isStartOrEnd?'3px 4px':'inherit',
                    padding: isBetween?'3px 4px':'inherit',
                    // padding: isBetween||isStartOrEnd?'3px 4px':'inherit',
                    borderRadius: !isBetween?'50%':'inherit',
                    border: isStartOrEnd? '1.5px solid #0B9DBD':'transparent',
                    bgcolor: isStartOrEnd
                      ? '#DFF3F7'
                      : isBetween
                      ? '#DFF3F7'
                      : 'transparent',
                    color: '#3e3e3e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {day.date()}
                </Box>
                </>
              );
            },
          }}
        />

        {/* Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <CustomButton label="戻る" buttonCategory="cancel" onClick={onCancel} />
          <CustomButton
            label="作成"
            onClick={() =>
              onDateConfirm({
                start: startDate,
                end: endDate,
              })
            }
          />
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}

/* eslint-enable @typescript-eslint/no-explicit-any */