import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    height: "34px",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#D9D9D9",
    },
    "&:hover fieldset": {
      borderColor: "#D9D9D9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D9D9D9 !important",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 12px",
    fontSize: "12px",
    "&::placeholder": {
      fontSize: "12px",
      opacity: 0.8,
    },
  },
});

export const CustomTextAreaField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    padding: "8px 12px",
    "& fieldset": {
      borderColor: "#D9D9D9",
    },
    "&:hover fieldset": {
      borderColor: "#D9D9D9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D9D9D9 !important",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "12px",
    "&::placeholder": {
      fontSize: "12px",
      opacity: 0.8,
    },
  },
});

export default CustomTextField