import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    height: "25px", // default for mobile (xs)

    [theme.breakpoints.up("sm")]: {
      height: "34px",
      borderRadius: "10px",
    },

    borderRadius: "5px",
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
    fontSize: "10px",
    [theme.breakpoints.up("sm")]: {
      fontSize: "12px",
      padding: "8px 12px",
    },
    "&::placeholder": {
      fontSize: "10px",
      opacity: 0.8,
      [theme.breakpoints.up("sm")]: {
        fontSize: "12px",
      },
      color: "#989898",
    },
  },
  "@media (max-width: 600px)": {
    "& .MuiOutlinedInput-root": {
      height: "25px",
      borderRadius: "5px",
    },
  },
}));

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
  "@media (max-width: 600px)": {
    "& .MuiOutlinedInput-input": {
      fontSize: "10px",
      "&::placeholder": {
        fontSize: "10px",
      },
    },
  },
});

export default CustomTextField;
