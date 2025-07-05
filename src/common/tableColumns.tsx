import { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router";
import "./common.css";
import CustomButton from "../components/CustomButton";
import { DropDownArrowIcon, EditIcon, SendIcon, SendMailIcon } from "./icons";
import { formatDateTime } from "./formatDate";
import { InquiryTableChip } from "../pages/Inquiry/Listing/InquiryTableChip";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
// import { Tooltip } from "@mui/material";

export const clientColumns: GridColDef<any>[] = [
  {
    field: "clientName",
    headerName: "会社名",
    flex: 1,
    // headerClassName: 'headerStyle',
    renderCell: (params) => (
      <Link to={`/clients/${params.row.id}`} style={{ color: "#3e3e3e" }}>
        {`${params.row.clientName || ""}`}
      </Link>
    ),
  },
  {
    field: "clientMailAddress",
    headerName: "メール",
    flex: 1,
  },
  {
    field: "register_timestamp",
    headerName: "登録日時",
    width: 240,
  },
  {
    field: "update_timestamp",
    headerName: "更新日",
    width: 240,
  },
];

export const memberColumns = ({
  handleChangePassword,
  role,
}: any): GridColDef<any>[] => [
  {
    field: "fullName",
    headerName: "名前",
    width: 160,
    headerClassName: "headerStyle",
    renderCell: (params) => (
      <Link to={`/members/${params.row.id}`} style={{ color: "#3e3e3e" }}>
        {`${params.row.firstName || ""} ${params.row.lastName || ""}`}
      </Link>
    ),
  },
  {
    field: "furiganaName",
    headerName: "フリガナ",
    sortable: false,
    width: 160,
    headerClassName: "headerStyle",
    valueGetter: (_value, row) =>
      `${row.firstNameOfFurigana || ""} ${row.lastNameOfFurigana || ""}`,
  },
  {
    field: "email",
    headerName: "メール",
    sortable: false,
    width: 220,
    headerClassName: "headerStyle",
  },
  {
    field: "adminStatus",
    headerName: "管理者",
    sortable: false,
    width: 160,
    headerClassName: "headerStyle",
    renderCell: (params) => {
      if (params.row.adminStatus === "管理者") {
        return (
          <span
            style={{
              padding: "6px",
              background: "#BFE6EF",
              color: "#3F97D5",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          >
            {params.row.adminStatus}
          </span>
        );
      } else {
        return <span>-</span>;
      }
    },
  },
  {
    field: "registration_timestamp",
    headerName: "登録日時",
    sortable: false,
    width: 220,
    headerClassName: "headerStyle",
  },
  {
    field: "update_timestamp",
    headerName: "更新日時",
    sortable: false,
    width: 220,
    headerClassName: "headerStyle",
  },
  ...(role === "admin"
    ? [
        {
          field: "actions",
          headerName: "",
          sortable: false,
          width: 240,
          headerClassName: "headerStyle",
          cellClassName: "cellFlex",
          renderCell: (params: any) => (
            <p style={{ display: "flex", gap: 10 }}>
              <CustomButton
                label="パスワードリセット"
                startIcon={<SendMailIcon />}
                onClick={() => handleChangePassword(params.row)}
                className={`cellButton sendMailBtn`}
              />
            </p>
          ),
        },
      ]
    : []),
];

export const employeeColumns = ({
  handleChangePassword,
  role,
}: any): GridColDef<any>[] => [
  {
    field: "fullName",
    headerName: "名前",
    flex: 1,
    headerClassName: "headerStyle",
    renderCell: (params) => (
      <Link
        to={`/setting/employees/${params.row.id}`}
        style={{
          color: "#3e3e3e",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        {`${params.row.firstName || ""} ${params.row.lastName || ""}`}
      </Link>
    ),
  },
  {
    field: "furiganaName",
    flex: 1,
    headerName: "フリガナ",
    headerClassName: "headerStyle",
    sortable: false,
    valueGetter: (_value, row) =>
      `${row.firstNameOfFurigana || ""} ${row.lastNameOfFurigana || ""}`,
  },
  {
    field: "email",
    flex: 2,
    headerName: "メール",
    headerClassName: "headerStyle",
    // width: 240,
    sortable: false,
  },
  {
    field: "adminStatus",
    headerName: "管理者",
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      if (params.row.adminStatus === "管理者") {
        return (
          <span
            style={{
              padding: "6px",
              background: "#BFE6EF",
              color: "#0B9DBD",
              fontSize: "12px",
              borderRadius: "5px",
            }}
          >
            {params.row.adminStatus}
          </span>
        );
      } else {
        return <span>-</span>;
      }
    },
  },
  {
    field: "registration_timestamp",
    headerName: "登録日時",
    sortable: false,
    flex: 1,
    // width: 150,
    headerClassName: "headerStyle",
  },
  {
    field: "update_timestamp",
    headerName: "更新日時",
    flex: 1,
    sortable: false,
    // width: 150,
    headerClassName: "headerStyle",
  },
  ...(role === "admin"
    ? [
        {
          field: "actions",
          headerName: "",
          sortable: false,
          flex: 2,
          // width: 240,
          renderCell: (params: any) => (
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
                  onClick={() => handleChangePassword(params.row)}
                  className={`cellButton sendMailBtn`}
                />
              </p>
            </Box>
          ),
        },
      ]
    : []),
];

export const notificationColumns = ({
  handleEdit,
  handleNotifyNow,
}: any): GridColDef<any>[] => [
  {
    field: "notification_title",
    headerName: "題名",
    width: 160,
    headerClassName: "headerStyle",
    renderCell: (params) => (
      <span
        onClick={() => handleEdit(params.row)}
        style={{
          color: "#3e3e3e",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >{`${params.row.notification_title || ""}`}</span>
    ),
  },
  {
    field: "text",
    headerName: "説明",
    sortable: false,
    width: 220,
    headerClassName: "headerStyle",
  },
  {
    field: "status",
    headerName: "ステータス",
    sortable: true,
    width: 200,
    headerClassName: "headerStyle",
    cellClassName: "cellFlex",
    renderCell: (params) => (
      <span
        className={`notification_status ${
          params.row.status === "POSTED"
            ? "posted"
            : params.row.status === "Notification Set"
            ? "notification_set"
            : "draft"
        }`}
      >
        {params.row.status === "POSTED"
          ? "投稿済"
          : params.row.status === "Notification Set"
          ? "通知設定済"
          : "下書き"}
      </span>
    ),
  },
  {
    field: "posting_date",
    headerName: "通知日",
    sortable: false,
    width: 220,
    headerClassName: "headerStyle",
    renderCell: (params) => (
      <span>{formatDateTime(params.row.posting_date)}</span>
    ),
  },
  {
    field: "register_date",
    headerName: "作成日",
    sortable: false,
    width: 220,
    headerClassName: "headerStyle",
    renderCell: (params) => (
      <span>{formatDateTime(params.row.register_date)}</span>
    ),
  },
  {
    field: "actions",
    headerName: "",
    sortable: false,
    width: 240,
    headerClassName: "headerStyle",
    cellClassName: "cellFlex",
    renderCell: (params) => (
      <p style={{ display: "flex", gap: 10 }}>
        <CustomButton
          label="編集"
          startIcon={<EditIcon />}
          onClick={() => handleEdit(params.row)}
          className={`cellButton ${
            params.row.status === "POSTED" && "disabled"
          }`}
        />
        <CustomButton
          label="今すぐ通知"
          startIcon={<SendIcon />}
          onClick={() => handleNotifyNow(params.row)}
          className={`cellButton ${
            params.row.status === "POSTED" && "disabled"
          }`}
        />
      </p>
    ),
  },
];

const prefectures = [
  { value: "1", label: "北海道" },
  { value: "2", label: "青森県" },
  { value: "3", label: "岩手県" },
  { value: "4", label: "宮城県" },
  { value: "5", label: "秋田県" },
  { value: "6", label: "山形県" },
  { value: "7", label: "福島県" },
  { value: "8", label: "茨城県" },
  { value: "9", label: "栃木県" },
  { value: "10", label: "群馬県" },
  { value: "11", label: "埼玉県" },
  { value: "12", label: "千葉県" },
  { value: "13", label: "東京都" },
  { value: "14", label: "神奈川県" },
  { value: "15", label: "新潟県" },
  { value: "16", label: "富山県" },
  { value: "17", label: "石川県" },
  { value: "18", label: "福井県" },
  { value: "19", label: "山梨県" },
  { value: "20", label: "長野県" },
  { value: "21", label: "岐阜県" },
  { value: "22", label: "静岡県" },
  { value: "23", label: "愛知県" },
  { value: "24", label: "三重県" },
  { value: "25", label: "滋賀県" },
  { value: "26", label: "京都府" },
  { value: "27", label: "大阪府" },
  { value: "28", label: "兵庫県" },
  { value: "29", label: "奈良県" },
  { value: "30", label: "和歌山県" },
  { value: "31", label: "鳥取県" },
  { value: "32", label: "島根県" },
  { value: "33", label: "岡山県" },
  { value: "34", label: "広島県" },
  { value: "35", label: "山口県" },
  { value: "36", label: "徳島県" },
  { value: "37", label: "香川県" },
  { value: "38", label: "愛媛県" },
  { value: "39", label: "高知県" },
  { value: "40", label: "福岡県" },
  { value: "41", label: "佐賀県" },
  { value: "42", label: "長崎県" },
  { value: "43", label: "熊本県" },
  { value: "44", label: "大分県" },
  { value: "45", label: "宮崎県" },
  { value: "46", label: "鹿児島県" },
  { value: "47", label: "沖縄県" },
  { label: "指定なし", value: "0" },
];

export const propertiesColumns = ({
  handlePropertyClick,
}: // handleCopyClick
{
  handlePropertyClick?: (row: any) => void;
  handleCopyClick?: (url: string) => void;
} = {}): GridColDef<any>[] => [
  {
    field: "name",
    headerName: "物件名",
    flex: 1.5,
    disableColumnMenu: true,
    headerClassName: "headerStyle",
    renderCell: (params) => {
      const row = params.row;
      // const url = `${window.location.origin}/properties/${row.id}`;

      const handleClick = () => {
        handlePropertyClick?.(row);
      };
      // const handleCopy = (e: React.MouseEvent) => {
      //   e.stopPropagation();
      //   handleCopyClick?.(url);
      //   navigator.clipboard.writeText(url);
      // };

      return (
        <div
          onClick={handleClick}
          style={{
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            color: "#3e3e3e",
            width: "100%",
            cursor: "pointer",
          }}
        >
          {/* <> */}
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline",
              marginRight: 5,
              textDecoration: "underline",
            }}
          >
            {params.row.name || "-"}
          </span>
          {/* <span style={{display:'flex'}} onClick={handleCopy}><CopyIcon /></span>
        </> */}
        </div>
      );
    },
  },
  {
    field: "prefecture",
    headerName: "都道府県",
    sortable: false,
    flex: 0.8,
    disableColumnMenu: true,
    headerClassName: "headerStyle",
    renderCell: (params) => {
      return (
        <span>
          {" "}
          {prefectures.find((p) => p.value === params.row.prefecture)?.label ||
            "-"}{" "}
        </span>
      );
    },
  },
  {
    field: "inquiry_count",
    headerName: "問い合わせ数",
    sortable: false,
    flex: 0.8,
    disableColumnMenu: true,
    headerClassName: "headerStyle",
  },
  {
    field: "price",
    headerName: "金額",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    headerClassName: "headerStyle",
    renderCell: (params) => {
      const price = params.row?.price;
      const isValidNumber =
        price !== undefined &&
        price !== null &&
        price !== "" &&
        !isNaN(Number(price));
      return (
        <span>
          {isValidNumber && Number(price) !== 0
            ? `${Number(price).toLocaleString("en-US")}円`
            : "-"}
        </span>
      );
    },
  },
  // {
  //   field: "layout",
  //   headerName: "間取り",
  //   sortable: false,
  //   disableColumnMenu: true,
  //   flex: 1.5,
  //   headerClassName: 'headerStyle',
  //   renderCell: (params) => {
  //     const layoutText = params.value || '';

  //     return (
  //       <Tooltip title={layoutText}  placement="top" slotProps={{
  //         popper: {
  //           modifiers: [
  //             {
  //               name: 'offset',
  //               options: {
  //                 offset: [0, -20], // x, y offset
  //               },
  //             },
  //           ],
  //         },
  //       }}
  //       componentsProps={{
  //         tooltip: {
  //           sx: {
  //             backgroundColor: '#fff',
  //             color: '#3e3e3e',
  //             fontSize: '10px',
  //             padding: '5px 10px',
  //             borderRadius: '5px',
  //             boxShadow: '0px 0px 4px 0px #00000040',

  //           },
  //         },
  //       }}>
  //         <span
  //           style={{
  //             whiteSpace: 'nowrap',
  //             overflow: 'hidden',
  //             textOverflow: 'ellipsis',
  //             display: 'inline-block',
  //             width: '100%',
  //           }}
  //         >
  //           {layoutText}
  //         </span>
  //       </Tooltip>
  //     );
  //   },
  // },
  {
    field: "land_area",
    headerName: "占有面積",
    sortable: false,
    disableColumnMenu: true,
    flex: 0.8,
    headerClassName: "headerStyle",
  },
  {
    field: "type",
    headerName: "種別",
    sortable: false,
    disableColumnMenu: true,
    flex: 0.8,
    headerClassName: "headerStyle",
  },
  {
    field: "created_at",
    headerName: "登録日時",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    headerClassName: "headerStyle",
  },
  {
    field: "updated_at",
    headerName: "更新日",
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    headerClassName: "headerStyle",
  },
];

export const getPropertiesInquiryColumns = (
  addAction: boolean,
  employees: any,
  updatedManagers: any,
  handleManagerChange: any
): GridColDef<any>[] => {
  const baseColumns: GridColDef<any>[] = [
    {
      field: "sourceOfResponse",
      headerName: "反響元",
      flex: 0.8,

      disableColumnMenu: true,
      headerClassName: "headerStyle",
      renderCell: (params) => (
        <InquiryTableChip sourceOfResponse={params.row.sourceOfResponse} />
      ),
    },
    {
      field: "name",
      headerName: "名前",
      flex: 1,

      disableColumnMenu: true,
      headerClassName: "headerStyle",
      renderCell: (params: any) => (
        <Link
          to={`/properties/inquiry/${params.row.id}`}
          style={{ color: "#000" }}
        >
          {`${params.row.name || ""}`}
        </Link>
      ),
    },
    {
      field: "property_name",
      headerName: "物件名",
      sortable: false,
      flex: 1,

      disableColumnMenu: true,
      headerClassName: "headerStyle",
    },
    {
      field: "type",
      headerName: "種別",
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "register_timestamp",
      headerName: "日時",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <span>{formatDateTime(params.row.register_timestamp)}</span>
      ),
    },
    {
      field: "content",
      headerName: "お問い合わせ内容",
      disableColumnMenu: true,
      flex: 1,
    },
  ];
  if (addAction) {
    baseColumns.push({
      field: "manager",
      headerName: "担当者",
      flex: 1.2,
      renderCell: (params: any) => {
        const rowId = params.row.id;
        const currentValue = updatedManagers[rowId] ?? params.row.manager;
        const selectedEmployee = employees.find(
          (employee: any) => employee.value === params.row.manager
        );
        const handleChange = (event: SelectChangeEvent<string>) => {
          const newValue = event.target.value;
          handleManagerChange(rowId, newValue);
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
                value={selectedEmployee?.value || currentValue}
                onChange={handleChange}
                IconComponent={DropDownArrowIcon}
                sx={{
                  fontSize: "14px",
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
                  "&.MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
                    {
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
    });
  }
  return baseColumns;
};
