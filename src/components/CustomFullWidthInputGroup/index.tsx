import React from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CustomFullWidthInputGroupProps } from "../../types";
import CustomTextField from "../CustomTextField";
import { CustomTextAreaField } from "../CustomTextField";
import "../../common/common.css";
import "./CustomFullWidthInputGroup.css";
import { DateRangeCalendarIcon, RequireIcon } from "../../common/icons";

// propsにautoSetAddressを追加
const CustomFullWidthInputGroup: React.FC<
  CustomFullWidthInputGroupProps & {
    autoSetAddress?: (e: React.FocusEvent<HTMLInputElement>) => void;
  }
> = ({
  label,
  name,
  placeholder = "",
  register,
  errors,
  disabled = false,
  isRequired = false,
  type = "text",
  rows,
  multiline = false,
  min,
  max,
  minMessage,
  maxMessage,
  labelWidth,
  labelWidthSp,
  inputWidth,
  inputWidthSp,
  labelSx = {},
  showYen = false,
  showMeter = false,
  showYearIcon = false,
  showCalendarIcon,
  onCalendarClick,
  children,
  autoSetAddress, // 追加
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getValidationRules = () => {
    const rules: any = {};

    if (isRequired) {
      rules.required = `${label}は必須です。`;
    }

    if (type === "number" && (min !== undefined || max !== undefined)) {
      rules.validate = {
        digitsCheck: (value: string) => {
          const numStr = value.toString().replace(/[-.]/g, "");
          if (min !== undefined && numStr.length < min) {
            return minMessage || `Number must have at least ${min} digit(s)`;
          }
          if (max !== undefined && numStr.length > max) {
            return maxMessage || `Number must not exceed ${max} digit(s)`;
          }
          return true;
        },
      };
    }

    if (type === "email") {
      rules.pattern = {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "有効なメールアドレスを入力してください。",
      };
    }

    if (type === "phoneNumber") {
      rules.pattern = {
        value: /^\d{10,11}$/,
        message: "Phone番号は10桁または11桁の数字である必要があります。",
      };
    }

    return rules;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      if (e.key === "e" || e.key === "E") e.preventDefault();
      if (e.key === "-") e.preventDefault();
    }
  };

  const getInputStyles = () => {
    if (type === "number") {
      return {
        "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
          {
            WebkitAppearance: "none",
            margin: 0,
          },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
      };
    }
    return {};
  };

  const getResponsiveClass = () => {
    return "flexCol";
  };

  // --- ここだけが郵便番号自動補完のポイント ---
  // onBlur: 郵便番号欄かつautoSetAddressが渡されていれば実行

  return (
    <Box
      className={`inputGroupWrapper ${getResponsiveClass()} ${
        isMobile ? "sp" : ""
      } ${multiline && "multiline"} ${showCalendarIcon ? "hasCalendar" : ""}`}
      sx={{ display: "flex !important", flexDirection: "column !important" }}
    >
      <Typography
        className={`inputLabel ${isMobile ? "sp" : ""} ${
          multiline && "multiline"
        }`}
        sx={{
          width: { lg: labelWidth, xs: labelWidthSp || "100%" },
          ...labelSx,
          fontSize: { lg: "12px !important", xs: "10px !important" },
          alignSelf: "flex-start",
          paddingTop: multiline ? "8px" : "0",
          paddingBottom: "4px",
          marginBottom: "4px",
          textAlign: "left",
          justifyContent: "flex-start",
        }}
      >
        {label}
        {isRequired && (
          <span style={{ display: "flex" }}>
            <RequireIcon />
          </span>
        )}
      </Typography>
      <Box
        sx={{
          width: { sm: inputWidth, xs: inputWidthSp },
        }}
      >
        {multiline ? (
          <CustomTextAreaField
            fullWidth
            type={type}
            placeholder={placeholder}
            {...register(name, getValidationRules())}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            disabled={disabled}
            rows={rows}
            multiline={multiline}
          />
        ) : (
          <CustomTextField
            fullWidth
            type={type}
            placeholder={placeholder}
            {...register(name, {
              ...getValidationRules(),
              onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                // 「nameがpostalCode」かつautoSetAddress渡ってきた場合のみ発火
                if (
                  name === "postal_code" &&
                  typeof autoSetAddress === "function"
                ) {
                  autoSetAddress(e);
                }
              },
            })}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            inputProps={{
              inputMode: "numeric",
            }}
            InputProps={{
              endAdornment: showYen ? (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: "12px", color: "#3e3e3e" }}>
                    円
                  </Typography>
                </InputAdornment>
              ) : showMeter ? (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: "12px", color: "#3e3e3e" }}>
                    ㎡
                  </Typography>
                </InputAdornment>
              ) : showCalendarIcon ? (
                <InputAdornment position="end">
                  <IconButton onClick={onCalendarClick} sx={{ padding: "0" }}>
                    <DateRangeCalendarIcon />
                  </IconButton>
                </InputAdornment>
              ) : showYearIcon ? (
                <InputAdornment position="end">
                  <Typography sx={{ fontSize: "12px", color: "#3e3e3e" }}>
                    年
                  </Typography>
                </InputAdornment>
              ) : null,
            }}
            sx={getInputStyles()}
          />
        )}
        {children && children}
      </Box>
    </Box>
  );
};

export default CustomFullWidthInputGroup;
