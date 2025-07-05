import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/ja"; // Import Japanese locale
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, MenuItem, Stack, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./CustomDateTimePicker.css";
import { ReportCalendarIcon } from "../../common/icons"; // Updated import

dayjs.extend(utc);
dayjs.locale("ja"); // Set Japanese locale

interface CustomDateTimePickerProps {
  onChange: (value: string) => void;
  showTime?: boolean; // New prop to control time visibility
  maxDate?: dayjs.Dayjs; // Optional max date
  minDate?: dayjs.Dayjs; // Optional min date
  width?: any; // Optional width for date picker
  value?: any;
  defaultValue?: dayjs.Dayjs | null; // Optional default value
}

const customTheme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D9D9D9 !important",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D9D9D9 !important",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D9D9D9 !important",
            borderWidth: "1px !important",
          },
        },
      },
    },
  },
});

const CustomDateTimePicker = ({
  onChange,
  showTime = true, // Default to true for backwards compatibility
  maxDate,
  minDate = dayjs(), // Default min date to today
  width, // Custom width prop
  value,
  defaultValue = dayjs(), // Default to today if not specified
}: CustomDateTimePickerProps) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(defaultValue);
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const CalendarIcon = () => <ReportCalendarIcon />; // Updated icon

  useEffect(() => {
    if (date) {
      if (showTime) {
        // Return full datetime ISO string
        const combined = dayjs(
          `${date.format("YYYY-MM-DD")}T${hour}:${minute}:00`
        );
        const isoString = combined.utc().toISOString(); // 2025-03-26T09:30:00.000Z
        onChange(isoString);
      } else {
        // Return just the date string
        const dateString = date.format("YYYY-MM-DD"); // 2025-03-26
        onChange(dateString);
      }
    }
  }, [date, hour, minute, onChange, showTime]);

  useEffect(() => {
    if (value) {
      const parsed = dayjs(value);
      if (!parsed.isSame(date)) setDate(parsed);

      if (showTime) {
        setHour(parsed.format("HH"));
        setMinute(parsed.format("mm"));
      }
    } else if (value !== undefined) {
      // If value is explicitly empty (null or empty string), reset the date
      setDate(null);
      if (showTime) {
        setHour("00");
        setMinute("00");
      }
    }
  }, [value, date, showTime]);

  // Updated inputStyles - consistent across all screen sizes
  const inputStyles = {
    "& .MuiInputBase-input": {
      padding: "6px 14px !important", // Same for all screens
      fontSize: "12px !important", // Same for all screens
      height: { lg: "inherit !important", xs: "25px !important" }, // Same for all screens
    },
    "& .MuiInputBase-root": {
      borderRadius: "8px !important", // Same for all screens
      height: { lg: "inherit !important", xs: "29px !important" }, // Same for all screens
    },
    "& .MuiOutlinedInput-root": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D9D9D9 !important",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D9D9D9 !important",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D9D9D9 !important",
        borderWidth: "1px !important",
      },
    },
    "& .MuiInputAdornment-root": {
      marginLeft: "8px", // Same for all screens
      "& svg": {
        color: "#0e9dbc !important",
        width: "inherit", // Same for all screens
        height: "inherit", // Same for all screens
      },
    },
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box width="inherit">
        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <DatePicker
            value={date}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(newValue) => setDate(newValue)}
            format="YYYY/MM/DD" // Changed to slash format
            // Explicitly set locale for the calendar
            dayOfWeekFormatter={(date) => dayjs(date).locale("ja").format("dd")}
            // Custom month/year header format
            localeText={{
              calendarWeekNumberHeaderText: "#",
              calendarWeekNumberText: (weekNumber) => `${weekNumber}.`,
              cancelButtonLabel: "キャンセル",
              clearButtonLabel: "クリア",
              okButtonLabel: "OK",
              todayButtonLabel: "今日",
              // Custom month/year format for calendar header
              // monthAndYear: 'YYYY年M月',
            }}
            slotProps={{
              textField: {
                variant: "outlined",
                sx: {
                  width: width || (showTime ? "40%" : "100%"),
                  ...inputStyles,
                },
              },
              calendarHeader: {
                format: "YYYY年M月", // Custom format for calendar header
              },
              // Enhanced popper styles for better consistency
              popper: {
                placement: "bottom-start",
                modifiers: [
                  {
                    name: "preventOverflow",
                    enabled: true,
                    options: {
                      boundary: "scrollParent",
                      altBoundary: false,
                      tether: false,
                    },
                  },
                  {
                    name: "flip",
                    enabled: false, // Disable flipping to prevent showing above
                  },
                ],
                sx: {
                  "& .MuiPaper-root": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                    marginTop: "8px",
                    maxHeight: "400px !important",
                    overflow: "hidden !important",
                  },
                  "& .MuiPickersDay-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#0e9dbc !important",
                      color: "white !important",
                      fontWeight: "bold !important",
                      "&:hover": {
                        backgroundColor: "#0e9dbc !important",
                      },
                      "&:focus": {
                        backgroundColor: "#0e9dbc !important",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(14, 157, 188, 0.1) !important",
                    },
                  },
                  "& .MuiPickersCalendarHeader-root": {
                    "& .MuiIconButton-root": {
                      color: "#0e9dbc",
                    },
                  },
                  // 年選択ビューの高さ制御
                  "& .MuiYearPicker-root": {
                    maxHeight: "350px !important",
                    overflowY: "auto !important",
                    padding: "8px !important",
                  },
                  // 包括的な年選択ビューの制御（全ての可能なクラス名をカバー）
                  "& .MuiPickersYearPicker-root, & .PrivatePickersYearPicker-root":
                    {
                      maxHeight: "350px !important",
                      overflowY: "auto !important",
                      padding: "8px !important",
                    },
                  // 年選択のビューポート制御
                  "& .MuiPickersView-root": {
                    maxHeight: "350px !important",
                    overflowY: "auto !important",
                  },
                  "& .MuiPickersYear-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#0e9dbc !important",
                      color: "white !important",
                      fontWeight: "bold !important",
                      "&:hover": {
                        backgroundColor: "#0e9dbc !important",
                      },
                      "&:focus": {
                        backgroundColor: "#0e9dbc !important",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(14, 157, 188, 0.1) !important",
                    },
                  },
                  // Only target specific action bar elements
                  "& .MuiPickersActionBar-root": {
                    display: "none !important",
                  },
                  "& .MuiDialogActions-root": {
                    display: "none !important",
                  },
                },
              },
              // Simple layout cleanup
              layout: {
                sx: {
                  "& .MuiPickersActionBar-root": {
                    display: "none !important",
                  },
                },
              },
            }}
            slots={{
              openPickerIcon: CalendarIcon,
            }}
            // Force desktop behavior on all devices
            desktopModeMediaQuery="@media (min-width: 0px)"
          />

          {/* Conditionally render time selectors */}
          {showTime && (
            <>
              <TextField
                select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                sx={{
                  width: "25%",
                  "& .MuiSelect-select": {
                    padding: "6px 14px !important",
                    fontSize: "12px !important",
                  },
                  ...inputStyles,
                }}
                SelectProps={{
                  IconComponent: () => (
                    <span style={{ fontSize: "12px", paddingRight: "14px" }}>
                      時
                    </span>
                  ),
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        "& .MuiMenuItem-root": {
                          fontSize: "12px !important",
                        },
                      },
                    },
                  },
                }}
              >
                {hours.map((h) => (
                  <MenuItem key={h} value={h}>
                    {h}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                sx={{
                  width: "25%",
                  "& .MuiSelect-select": {
                    padding: "6px 14px !important",
                    fontSize: "12px !important",
                  },
                  ...inputStyles,
                }}
                SelectProps={{
                  IconComponent: () => (
                    <span style={{ fontSize: "12px", paddingRight: "14px" }}>
                      分
                    </span>
                  ),
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        "& .MuiMenuItem-root": {
                          fontSize: "12px !important",
                        },
                      },
                    },
                  },
                }}
              >
                {minutes.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default CustomDateTimePicker;
