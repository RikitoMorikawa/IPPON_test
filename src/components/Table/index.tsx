import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { Box, keyframes, Pagination } from "@mui/material";
import { TableProps } from "../../types";
import "../../common/common.css";
import Cookies from "js-cookie";
import {
  TableHeaderDownArrowIcon,
  TableHeaderUpArrowIcon,
} from "../../common/icons";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

interface ExtendedTableProps extends TableProps {
  isLoading?: boolean;
  logoUrl?: string; // Add prop for logo URL
  pagination?: PaginationInfo;
  checkBoxOpen?: boolean;
  onPageChange?: (page: number) => void;
}

// Circle spinner animation
export const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Table: React.FC<ExtendedTableProps> = ({
  rows,
  columns,
  onRowSelection,
  selectedIds,
  isLoading = false,
  pagination,
  checkBoxOpen = true,
  onPageChange,
}: any) => {
  const [, setSelectedIds] = useState<any[]>([]);

  // Only use local state if no pagination prop is provided (for backward compatibility)
  const [localPage, setLocalPage] = useState(1);

  const CustomAscIcon = () => <TableHeaderUpArrowIcon />;
  const CustomDescIcon = () => <TableHeaderDownArrowIcon />;
  const userRole = Cookies.get("role");

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = newSelectionModel as number[];
    setSelectedIds(selectedRowIds);
    onRowSelection(selectedRowIds);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (pagination && onPageChange) {
      // Use parent's pagination handling
      onPageChange(value);
    } else {
      // Fallback to local state for backward compatibility
      setLocalPage(value);
    }
  };

  const CustomNoRowsOverlay = () => (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        color: "#3e3e3e",
        fontSize: "14px",
      }}
    >
      {/* データなし */}
    </div>
  );

  // Custom Loading Overlay with Spinner and Text
  const CustomLoadingOverlay = () => (
    <Box
      sx={{
        position: "absolute",
        top: "36px", // Start below the header (columnHeaderHeight)
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
        zIndex: 10,
        minHeight: "300px", // Minimum height for loading area
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px", // Space between spinner and text
        }}
      >
        {/* Circle Spinner */}
        <Box
          sx={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            // borderTop: '4px solid #344052',
            borderTop: "4px solid #0B9DBD",
            borderRadius: "50%",
            animation: `${spinAnimation} 1s linear infinite`,
          }}
        />
      </Box>
    </Box>
  );

  // Calculate pagination values
  const getPaginationValues = () => {
    if (pagination) {
      // Use pagination from props
      return {
        totalPages: Math.ceil(pagination.total / pagination.limit),
        currentPage: pagination.page,
        showPagination: pagination.total > pagination.limit,
      };
    } else {
      // Fallback to hardcoded values for backward compatibility
      return {
        totalPages: Math.ceil(100 / 10),
        currentPage: localPage,
        showPagination: true,
      };
    }
  };

  const { totalPages, currentPage, showPagination } = getPaginationValues();

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {/* Show loading overlay when isLoading is true */}
        {isLoading && <CustomLoadingOverlay />}

        <DataGrid
          rows={rows}
          columns={columns}
          slots={{
            columnSortedAscendingIcon: CustomAscIcon,
            columnSortedDescendingIcon: CustomDescIcon,
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          pageSizeOptions={[]}
          paginationModel={{
            pageSize: rows?.length,
            page: 0,
          }}
          hideFooterPagination
          hideFooter
          checkboxSelection={userRole === "admin" && checkBoxOpen}
          rowSelectionModel={selectedIds}
          onRowSelectionModelChange={handleSelectionChange}
          disableRowSelectionOnClick
          className="customCheckbox"
          rowHeight={42}
          columnHeaderHeight={36}
          sx={{
            minHeight: "400px", // Minimum height for the entire table
            "&.MuiDataGrid-root": {
              "--DataGrid-containerBackground": "#EBEBEB",
              "--unstable_DataGrid-radius": "0px",
              borderLeft: "none",
              borderRight: "none",
              borderBottom: "none",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              ...(rows?.length === 0 && {
                borderBottom: "inherit",
              }),
            },
            "& .MuiDataGrid-row": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "transparent",
            },
            "& .MuiDataGrid-columnHeader": {
              borderBottom: "none !important",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderRadius: "8px",
              overflow: "hidden",
              borderBottom: "none",
            },
            "& .MuiDataGrid-main": {
              minHeight: "300px", // Minimum height for table body
            },
            "& .MuiDataGrid-virtualScroller": {
              minHeight: "300px", // Minimum height for scrollable area
            },
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            "& .MuiDataGrid-row:focus": {
              outline: "none",
              backgroundColor: "transparent",
            },
            "& .MuiDataGrid-row:focus-within": {
              outline: "none",
              backgroundColor: "transparent",
            },
            // Link hover effects
            "& .MuiDataGrid-cell a": {
              transition: "color 0.2s ease-in-out",
            },
            "& .MuiDataGrid-cell a:hover": {
              color: "#0e9dbc !important",
            },
            "& .MuiDataGrid-cell span[style*='text-decoration: underline']:hover":
              {
                color: "#0e9dbc !important",
                cursor: "pointer",
              },
          }}
        />
      </Box>
      {/* Show pagination only if there are multiple pages */}
      {showPagination && totalPages > 1 && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
          <Pagination
            shape="rounded"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            disabled={isLoading}
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
    </>
  );
};

export default Table;
