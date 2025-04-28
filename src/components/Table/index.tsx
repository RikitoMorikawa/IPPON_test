import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
import { TableProps } from "../../types";
import '../../common/common.css'
import Cookies from 'js-cookie';
import { TableHeaderDownArrowIcon, TableHeaderUpArrowIcon } from "../../common/icons";
/* eslint-disable @typescript-eslint/no-explicit-any */

const Table: React.FC<TableProps> = ({ rows, columns, onRowSelection, selectedIds }: any) => {
  const [, setSelectedIds] = useState<any[]>([]);
  const CustomAscIcon = () => <TableHeaderUpArrowIcon/>;
  const CustomDescIcon = () => <TableHeaderDownArrowIcon/>;
  const userRole = Cookies.get('role')
  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    const selectedRowIds = newSelectionModel as number[];

    setSelectedIds(selectedRowIds);  
    onRowSelection(selectedRowIds);
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      slots={{
        columnSortedAscendingIcon: CustomAscIcon,
        columnSortedDescendingIcon: CustomDescIcon,
      }}
      pageSizeOptions={[5]}
      checkboxSelection={userRole === 'admin'}
      rowSelectionModel={selectedIds}
      onRowSelectionModelChange={handleSelectionChange}
      disableRowSelectionOnClick
      className="customCheckbox"
    />
  );
};
/* eslint-enable @typescript-eslint/no-explicit-any */
export default Table;
