// src/config/inquiryFieldConfig.ts

import {
  Select,
  MenuItem,
  FormControl,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { Link } from "react-router";
import { InquiryTableChip } from "../pages/Inquiry/Listing/InquiryTableChip";
import { formatDateTime } from "./formatDate";
import { DropDownArrowIcon, SendMailIcon, SPLinkIcon } from "./icons";
import CustomButton from "../components/CustomButton";

export const spInquiryFieldConfig = (
  employees: any[],
  updatedManagers: Record<string, string>,
  handleManagerChange: (row: any, rowId: string, newValue: string) => void
) => [
  {
    label: "名前",
    key: "name",
    render: (value: string, row: any) => {
      return (
        <span
          style={{
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            maxWidth: "90%",
          }}
        >
          <Link
            to={`/inquiry/${row.id}`}
            style={{
              color: "#3e3e3e",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {value || "―"}
          </Link>
          {/* <span style={{display:'flex'}}><SPLinkIcon/></span> */}
        </span>
      );
    },
  },
  {
    label: "反響元",
    key: "method",
    render: (value: string) => {
      return <InquiryTableChip sourceOfResponse={value} />;
    },
  },
  {
    label: "物件名",
    key: "property_name",
    render: (value: string, row: any) => {
      return (
        <span
          style={{
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            maxWidth: "90%",
          }}
        >
          <Link
            to={`/inquiry/${row.id}`}
            style={{
              color: "#3e3e3e",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {value || "―"}
          </Link>
          {/* <span style={{display:'flex'}}><SPLinkIcon/></span> */}
        </span>
      );
    },
  },
  {
    label: "日時",
    key: "registration_timestamp",
    render: (value: string) => {
      return (
        <span style={{ display: "flex", overflow: "hidden" }}>
          <span
            style={{
              color: "#3e3e3e",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
            }}
          >
            {formatDateTime(value) || "―"}
          </span>
        </span>
      );
    },
  },
  { label: "お問い合わせ内容", key: "content" },
  {
    label: "担当者",
    key: "contact",
    render: (_value: string, row: any) => {
      const rowId = row?.id;
      const currentValue = updatedManagers[rowId] ?? row.employee_id;
      const selectedEmployee = employees.find(
        (employee: any) => employee.value === currentValue
      );

      const handleChange = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        handleManagerChange(row, rowId, newValue);
      };
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            width: "100%",
            height: "100%",
          }}
        >
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: "100%" }}
          >
            <Select
              value={selectedEmployee?.value || ""}
              onChange={handleChange}
              IconComponent={DropDownArrowIcon}
              sx={{
                fontSize: "12px",
                "& .MuiSelect-select": {
                  padding: "4px 10px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D9D9D9",
                  borderRadius: "4px",
                },
                "&:hover": {
                  backgroundColor: "transparent !important",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D9D9D9 !important",
                },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#D9D9D9 !important",
                  },
                "&.MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D9D9D9 !important",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D9D9D9 !important",
                },
                ".MuiSelect-icon": {
                  fontSize: "12px",
                },
              }}
            >
              {employees.map((employee: any) => (
                <MenuItem
                  key={employee.value}
                  value={employee.value}
                  sx={{ fontSize: "12px" }}
                >
                  {employee.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      );
    },
  },
];

export const spEmployeeFieldConfig = (
  handleChangePassword: (row: any) => void
) => [
  {
    label: "名前",
    key: "firstName",
    render: (_value: string, row: any) => {
      const fullName = `${row.firstName || ""} ${row.lastName || ""}`.trim();
      return (
        <span
          style={{
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            maxWidth: "90%",
          }}
        >
          <Link
            to={`/setting/employees/${row.id}`}
            style={{
              color: "#3e3e3e",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {`${fullName || ""}`}
          </Link>
          <span style={{ display: "flex" }}>
            <SPLinkIcon />
          </span>
        </span>
      );
    },
  },
  {
    label: "管理者",
    key: "adminStatus",
    render: (value: string) => {
      if (value === "管理者") {
        return (
          <span
            style={{
              padding: "4.25px 9px",
              background: "#BFE6EF",
              color: "#0B9DBD",
              fontSize: "10px",
              borderRadius: "4px",
            }}
          >
            {value}
          </span>
        );
      } else {
        return <span>-</span>;
      }
    },
  },
  {
    label: "フリガナ",
    key: "firstNameOfFurigana",
    render: (_value: string, row: any) => {
      const fullNameOfKatana = `${row.firstNameOfFurigana || ""} ${
        row.lastNameOfFurigana || ""
      }`.trim();
      return (
        <span
          style={{
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            maxWidth: "90%",
          }}
        >
          <span
            style={{
              color: "#3e3e3e",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
            }}
          >
            {`${fullNameOfKatana || ""}`}
          </span>
        </span>
      );
    },
  },
  {
    label: "メール",
    key: "email",
    render: (value: string) => {
      return (
        <span
          style={{
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            maxWidth: "90%",
          }}
        >
          <span
            style={{
              color: "#3e3e3e",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
            }}
          >
            {`${value || ""}`}
          </span>
        </span>
      );
    },
  },
  {
    label: "登録日時",
    key: "registration_timestamp",
    render: (value: string) => {
      return (
        <span style={{ display: "flex", overflow: "hidden" }}>
          <span
            style={{
              color: "#3e3e3e",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
            }}
          >
            {formatDateTime(value) || "―"}
          </span>
        </span>
      );
    },
  },
  {
    label: "更新日時",
    key: "update_timestamp",
    render: (value: string) => {
      return (
        <span style={{ display: "flex", overflow: "hidden" }}>
          <span
            style={{
              color: "#3e3e3e",
              fontSize: "12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
            }}
          >
            {formatDateTime(value) || "―"}
          </span>
        </span>
      );
    },
  },
  {
    label: "",
    key: "",
    render: (_value: string, row: any) => {
      const clickHandleChangePassword = (rowData: any) => {
        handleChangePassword(rowData);
      };

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            width: "100%",
            height: "100%",
          }}
        >
          <p style={{ display: "flex" }}>
            <CustomButton
              label="パスワードリセット"
              startIcon={<SendMailIcon />}
              onClick={() => clickHandleChangePassword(row)}
              className={`cellButton sendMailBtn sp`}
            />
          </p>
        </Box>
      );
    },
  },
];
