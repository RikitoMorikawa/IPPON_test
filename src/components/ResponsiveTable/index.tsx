import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { TableProps } from '../../types';
import TableMobile from '../TableMobile';
import Table from '../Table';

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

interface ResponsiveTableProps extends TableProps {
  isLoading?: boolean;
  pagination?: PaginationInfo;
  checkBoxOpen?: boolean;
  onPageChange?: (page: number) => void;
  onRowSelection?: (selectedIds: any[]) => void;
  selectedIds?: any[];
  handlePropertyClick?: (row: any) => void; // Add this prop
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Breakpoint at 960px

  // You can also use a custom breakpoint like this:
  // const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? <TableMobile {...props} /> : <Table {...props} />;
};

export default ResponsiveTable;