import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Checkbox, 
  Pagination,
  keyframes,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { TableProps } from '../../types';
import { getRole } from '../../utils/authUtils';

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

interface MobileTableProps extends TableProps {
  isLoading?: boolean;
  pagination?: PaginationInfo;
  checkBoxOpen?: boolean;
  onPageChange?: (page: number) => void;
  onRowSelection?: (selectedIds: any[]) => void;
  selectedIds?: any[];
  handlePropertyClick?: (row: any) => void; // Add the click handler prop
}

// Loading spinner animation
const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Custom Loading Overlay
const CustomLoadingOverlay = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 10,
      minHeight: '300px',
    }}
  >
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px'
    }}>
      <Box
        sx={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0B9DBD',
          borderRadius: '50%',
          animation: `${spinAnimation} 1s linear infinite`,
        }}
      />
    </Box>
  </Box>
);

const TableMobile: React.FC<MobileTableProps> = ({
  rows,
  columns,
  onRowSelection,
  selectedIds = [],
  isLoading = false,
  pagination,
  checkBoxOpen = true,
  onPageChange,
  handlePropertyClick // Accept the click handler
}) => {
  const [localPage, setLocalPage] = useState(1);
  const userRole = getRole();

  const handleSelectionChange = (rowId: number, checked: boolean) => {
    if (!onRowSelection) return;
    
    let newSelectedIds: any[];
    if (checked) {
      newSelectedIds = [...(selectedIds || []), rowId];
    } else {
      newSelectedIds = (selectedIds || []).filter((id: any) => id !== rowId);
    }
    onRowSelection(newSelectedIds);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    if (pagination && onPageChange) {
      onPageChange(value);
    } else {
      setLocalPage(value);
    }
  };

  // Calculate pagination values
  const getPaginationValues = () => {
    if (pagination) {
      return {
        totalPages: Math.ceil(pagination.total / pagination.limit),
        currentPage: pagination.page,
        showPagination: pagination.total > pagination.limit
      };
    } else {
      return {
        totalPages: Math.ceil(100 / 10),
        currentPage: localPage,
        showPagination: true
      };
    }
  };

  const { totalPages, currentPage, showPagination } = getPaginationValues();

  // Get field mappings from columns
  const getFieldLabel = (field: string) => {
    const column = columns.find(col => col.field === field);
    return column?.headerName || field;
  };

  // Render field value based on column configuration
  const renderFieldValue = (row: any, field: string) => {
    const column = columns.find(col => col.field === field);
    if (column?.renderCell) {
      return column.renderCell({ row, value: row[field] });
    }
    return row[field];
  };

  // Handle name click for navigation
  const handleNameClick = (row: any, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent accordion toggle
    if (handlePropertyClick) {
      handlePropertyClick(row);
    }
  };

  if (!rows || rows.length === 0) {
    return (
      <Box sx={{ position: 'relative', minHeight: '300px' }}>
        {isLoading && <CustomLoadingOverlay />}
        <Box
          sx={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '16px'
          }}
        >
          データなし
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {isLoading && <CustomLoadingOverlay />}
      
      {/* All items as collapsed accordions by default */}
      {rows.map((row, index) => (
        <Card 
          key={row.id || index}
          sx={{ 
            marginBottom: 1, 
            borderRadius: '8px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
        >
          <Accordion 
            sx={{ 
              boxShadow: 'none',
              '&:before': { display: 'none' },
              '&.MuiAccordion-root': { margin: 0 }
            }}
            defaultExpanded={false} // All items collapsed by default
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                padding: '8px 16px',
                minHeight: '48px',
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  margin: '8px 0'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {userRole === 'admin' && checkBoxOpen && (
                  <Checkbox
                    checked={selectedIds?.includes(row.id) || false}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectionChange(row.id, e.target.checked);
                    }}
                    sx={{ 
                      padding: '4px',
                      marginRight: 1
                    }}
                  />
                )}
                
                {/* Clickable name that doesn't trigger accordion */}
                <Box 
                  sx={{ flex: 1 }}
                  onClick={(e) => handleNameClick(row, e)}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      color: '#3e3e3e',
                      '&:hover': {
                        color: '#1976d2'
                      }
                    }}
                  >
                    {row.name || row.id}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails sx={{ padding: '0 16px 16px' }}>
              <Divider sx={{ marginBottom: 2 }} />
              {columns
                .filter(col => col.field !== 'name' && col.field !== 'id')
                .map((column, fieldIndex) => (
                  <Box 
                    key={column.field}
                    sx={{ 
                      display: 'flex',
                      paddingY: '6px',
                      borderBottom: fieldIndex < columns.length - 2 ? '1px solid #f0f0f0' : 'none'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        minWidth: '100px',
                        fontWeight: 500,
                        color: '#666',
                        backgroundColor: '#f9f9f9',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginRight: 2
                      }}
                    >
                      {getFieldLabel(column.field)}
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ flex: 1, paddingY: '4px' }}
                    >
                      {renderFieldValue(row, column.field)}
                    </Typography>
                  </Box>
                ))}
            </AccordionDetails>
          </Accordion>
        </Card>
      ))}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Box display='flex' justifyContent='center' alignItems='center' mt={3}>
          <Pagination
            shape='rounded'
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            disabled={isLoading}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "#F5F5F5",
                color: "#000",
                borderRadius: "6px",
                "&.Mui-selected": {
                  backgroundColor: "#039dbe",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#039dbe",
                  },
                },
                "&:hover": {
                  backgroundColor: "#DBF8FF",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#F5F5F5",
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default TableMobile;