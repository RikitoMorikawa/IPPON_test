import { TextField, MenuItem, Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { CustomSelectProps } from "../../types";
import { DropDownArrowIcon } from "../../common/icons";

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  control,
  options,
  required,
  defaultValue,
  width = "124px",
  XsWidth = "90px",
  ...props
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: { lg: 2, xs: 1 } }}>
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontSize: { lg: "12px", xs: "10px" },
            fontWeight: 700,
            color: "#3e3e3e",
          }}
        >
          {label}
        </Typography>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error } }) => (
          <TextField
            select
            {...field}
            value={field.value ?? ""}
            error={!!error}
            {...props}
            slotProps={{
              select: {
                IconComponent: DropDownArrowIcon,
              },
            }}
            sx={{
              width: { lg: width, xs: XsWidth },
              ".MuiInputBase-root": {
                height: { xs: "25px", sm: "34px" },
                borderRadius: { xs: "5px", sm: "8px" },
                fieldset: {
                  borderColor: error ? "#d32f2f" : "#D9D9D9",
                },
                "&:hover fieldset": {
                  borderColor: error ? "#d32f2f" : "#D9D9D9",
                },
                "&.Mui-focused fieldset": {
                  borderColor: error ? "#d32f2f" : "#D9D9D9",
                },
              },
              ".MuiSelect-select": {
                padding: "8px 22px 8px 12px !important",
                fontSize: "12px",
              },
              ".MuiSelect-icon": {
                fontSize: "14px",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  // borderColor: "#0e9dbc",
                  borderColor: "#D9D9D9",
                },
              },
              "& .MuiInputBase-input": {
                color: "#3e3e3e", // 選択後は通常の文字色
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  fontSize: { xs: "10px", sm: "12px" },
                  minHeight: { xs: "25px", sm: "30px" },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
        rules={{
          validate: (v) => {
            if (required && !v) return "必須項目です";
            return true;
          },
        }}
      />
    </Box>
  );
};

export default CustomSelect;
