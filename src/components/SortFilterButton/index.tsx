// components/SortFilterButton.tsx
import { Button, SxProps, Theme } from "@mui/material";
import { SortButtonProps } from "../../types";

interface ExtendedSortButtonProps extends SortButtonProps {
  sx?: SxProps<Theme>;
}

const SortFilterButton = ({ label, value, onClick, active, sx }: ExtendedSortButtonProps) => {
  return (
    <Button
      variant={active ? "contained" : "outlined"}
      size="small"
      disableElevation
      sx={{
        textTransform: "none",
        fontSize: "12px",
        height: "28px",
        backgroundColor: active ? '#0B9DBD' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#0B9DBD',
        border: active ? '1px solid transparent': '1px solid #0B9DBD',
        borderRadius: '30px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&:hover': {
          backgroundColor: active ? '#0B9DBD' : 'inherit',
        },
        ...sx // Merge passed sx with default styles
      }}
      onClick={() => onClick(value)}
    >
      {label}
    </Button>
  );
};

export default SortFilterButton;