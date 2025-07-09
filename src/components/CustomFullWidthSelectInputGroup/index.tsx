import React from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { RequireIcon } from "../CustomTwoColInputGroup";
import "../../common/common.css";
import "./CustomFullWidthSelectInputGroup.css";
import { CustomFullWidthSelectInputGroupProps } from "../../types";
import { Controller } from "react-hook-form"; // Import Controller
import { DropDownArrowIcon } from "../../common/icons";

const CustomFullWidthSelectInputGroup: React.FC<
  CustomFullWidthSelectInputGroupProps
> = ({
  label,
  name,
  placeholder = "",
  control, // Add control prop
  errors = {},
  disabled = false,
  readonly = false,
  isRequired = false,
  // isModalInput = false,
  extraClassName = "flexRow",
  isShowInColumn = false,
  options = [],
  labelWidth = "98px",
  labelWidthSp = "100px",
  inputWidth = "100%",
  inputWidthSp = "100%",
  onChangeValue,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true for xs

  return (
    <Box
      className={`inputGroupWrapper ${
        isShowInColumn ? "isShowInColumn" : ""
      } ${extraClassName} ${isMobile ? "sp" : ""}`}
      sx={{ display: "flex !important", width: { xs: "100%", sm: "inherit" } }}
    >
      <Typography
        className="inputLabel"
        sx={{
          width: { sm: labelWidth, xs: labelWidthSp ?? "47%" },
          //           width: {lg: labelWidth, xs: '125px'},
          whiteSpace: "nowrap",
          fontSize: { lg: "12px !important", xs: "10px !important" },
        }}
        paddingBottom={
          errors[name] && extraClassName !== "flexCol"
            ? "24px"
            : extraClassName === "flexCol"
            ? "10px"
            : ""
        }
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
        <FormControl
          fullWidth
          error={isRequired ? !!errors[name] : false}
          disabled={disabled}
        >
          <Controller
            name={name}
            control={control}
            rules={isRequired ? { required: `${label}は必須です。` } : {}}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  if (onChangeValue) onChangeValue(e.target.value);
                }}
                IconComponent={DropDownArrowIcon}
                readOnly={readonly}
                sx={{
                  height: { sm: "34px", xs: "25px" },
                  mb: 1,
                  fontSize: "12px",
                  backgroundColor: readonly ? "#F5F5F5" : "transparent",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: errors[name] ? "#d32f2f" : "#D9D9D9",
                    borderRadius: 2,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: errors[name] ? "#d32f2f" : "#D9D9D9",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: errors[name] ? "#d32f2f" : "#D9D9D9",
                    borderWidth: "1px",
                  },
                  "&:hover": {
                    backgroundColor: readonly ? "#F5F5F5" : "transparent", // disable background hover
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#F5F5F5 !important",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#D9D9D9 !important",
                    },
                  },
                  ".MuiSelect-icon": {
                    fontSize: "14px",
                    display: readonly ? "none" : disabled ? "none" : "block", // Hide dropdown arrow when readonly or disabled
                  },
                  "& .MuiSelect-select": {
                    color: readonly ? "#3e3e3e" : disabled ? "#3e3e3e" : "inherit", // Unified text color when readonly or disabled
                  },
                  "& .MuiSelect-select.Mui-disabled": {
                    color: "#3e3e3e !important",
                    WebkitTextFillColor: "#3e3e3e !important",
                  },
                }}
              >
                {placeholder && (
                  <MenuItem value="" disabled sx={{ fontSize: "12px" }}>
                    {placeholder}
                  </MenuItem>
                )}
                {options &&
                  options.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{ fontSize: "12px" }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            )}
          />
          {isRequired && errors[name] && (
            <FormHelperText>{errors[name]?.message}</FormHelperText>
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

export default CustomFullWidthSelectInputGroup;
