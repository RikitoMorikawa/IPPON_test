import { Box, Chip } from "@mui/material";

// Define types for color scheme and valid source values
type ColorScheme = {
  color: string;
  backgroundColor: string;
  borderColor: string;
};

type SourceType = "SUUMO" | "電話" | "その他" | string;

type SourceResponseChipProps = {
  sourceOfResponse: SourceType;
};

const InquiryTableChip = ({ sourceOfResponse }: SourceResponseChipProps) => {
  // Define color schemes for different source types
  const colorSchemes: Record<string, ColorScheme> = {
    "SUUMO": {
      color: "#188D1C",
      backgroundColor: "rgba(169, 222, 171, 0.4)",
      borderColor: "#A9DEAB"
    },
    "その他": {
      color: "#1976D2",
      backgroundColor: "rgba(144, 202, 249, 0.4)",
      borderColor: "#90CAF9"
    },
    "電話": {
      color: "#ED6C02",
      backgroundColor: "rgba(255, 167, 38, 0.2)",
      borderColor: "#FFB74D"
    }
  };

  // Get the color scheme based on source or use a default
  const scheme: ColorScheme = colorSchemes[sourceOfResponse] || {
    color: "#757575",
    backgroundColor: "rgba(224, 224, 224, 0.4)",
    borderColor: "#E0E0E0"
  };

  return (
    <Box display="flex" justifyContent="flex-start" width="100%" height="100%" alignItems="center">
      <Chip
        label={sourceOfResponse}
        variant="outlined"
        sx={{
          borderRadius: 1,
          fontSize: {xs: '10px',sm: '12px'},
          width: {xs: '60px',sm: '80px'},
          height: {xs: '23px', sm: '32px'},
          justifyContent: "center", 
          color: scheme.color,
          backgroundColor: scheme.backgroundColor,
          borderColor: scheme.borderColor,
          fontWeight: "bold",
          "& .MuiChip-label": {
            padding: {xs: '0 8px', sm: '0 11px'}
          },
        }}
      />
    </Box>
  );
};

// Usage in a data grid column with typing
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

const sourceColumn: GridColDef = {
  field: 'sourceOfResponse',
  headerName: '問い合わせ元',
  width: 120,
  align: 'center', // Center align the column header
  renderCell: (params: GridRenderCellParams) => <InquiryTableChip sourceOfResponse={params.value as SourceType} />
};

// Demo usage with React FC typing
import React from 'react';

const SimpleDemo: React.FC = () => (
  <Box sx={{ display: "flex", gap: 2, p: 2 }}>
    <InquiryTableChip sourceOfResponse="SUUMO" />
    <InquiryTableChip sourceOfResponse="電話" />
    <InquiryTableChip sourceOfResponse="その他" />
  </Box>
);

export { InquiryTableChip, sourceColumn, SimpleDemo };