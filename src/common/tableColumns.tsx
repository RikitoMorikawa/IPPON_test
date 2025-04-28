import { GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router";
import './common.css'
import CustomButton from "../components/CustomButton";
import { EditIcon, SendIcon, SendMailIcon } from "./icons";
import { formatDateTime } from "./formatDate";
/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const employeeColumns: GridColDef<any>[] = [
  {
    field: "employee_name",
    headerName: "会社名",
    flex: 1,
  },
  {
    field: "employee_mail_address",
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

export const memberColumns=({handleChangePassword, role}: any): GridColDef<any>[] => [
  {
    field: "fullName",
    headerName: "名前",
    width: 160,
    editable: true,
    headerClassName: 'headerStyle',
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
    editable: true,
    headerClassName: 'headerStyle',
    valueGetter: (_value, row) => `${row.firstNameOfFurigana || ""} ${row.lastNameOfFurigana || ""}`,
  },
  {
    field: "email",
    headerName: "メール",
    sortable: false,
    width: 220,
    editable: true,
    headerClassName: 'headerStyle',
  },
  {
    field: "adminStatus",
    headerName: "管理者",
    sortable: false,
    width: 160,
    headerClassName: 'headerStyle', 
    renderCell: (params) => {
      if (params.row.adminStatus === '管理者') {
        return (
          <span
            style={{
              padding: '6px',
              background: '#BFE6EF',
              color: '#3F97D5',
              fontSize: '12px',
              borderRadius: '5px',
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
    headerClassName: 'headerStyle',
  },
  {
    field: "update_timestamp",
    headerName: "更新日時",
    sortable: false,
    width: 220,
    headerClassName: 'headerStyle',
  },
  ...(role === 'admin'
    ? [{
      field: 'actions',
      headerName: "",
      sortable: false,
      width: 240,
      headerClassName: 'headerStyle',
      cellClassName: 'cellFlex',
        renderCell: (params:any) => (
          <p style={{ display: 'flex', gap: 10 }}>
            <CustomButton
              label="パスワードリセット"
              startIcon={<SendMailIcon />}
              onClick={() => handleChangePassword(params.row)}
              className={`cellButton sendMailBtn`}
            />
          </p>
        ),
      }]
    : []),
];

export const notificationColumns=({ handleEdit, handleNotifyNow }: any): GridColDef<any>[] => [
  {
    field: "notification_title",
    headerName: "題名",
    width: 160,
    editable: true,
    headerClassName: 'headerStyle',
    renderCell: (params) => (
      <span onClick={() => handleEdit(params.row)} style={{ color: "#3e3e3e",textDecoration:'underline',cursor:'pointer' }}>{`${params.row.notification_title || ""}`}</span>
    )
  },
  {
    field: "text",
    headerName: "説明",
    sortable: false,
    width: 220,
    editable: true,
    headerClassName: 'headerStyle',
    },
  {
    field: "status",
    headerName: "ステータス",
    sortable: true,
    width: 200,
    editable: true,
    headerClassName: 'headerStyle',
    cellClassName: 'cellFlex',
    renderCell: (params) => (
      <span className={`notification_status ${params.row.status === 'POSTED' ? 'posted' : params.row.status === 'Notification Set' ? 'notification_set' : 'draft'}`}>
        {params.row.status === 'POSTED' ? '投稿済' : params.row.status === 'Notification Set' ? '通知設定済' : '下書き'}
      </span>
    ),
  },
  {
    field: "posting_date",
    headerName: "通知日",
    sortable: false,
    width: 220,
    headerClassName: 'headerStyle',
      renderCell: (params) => (
        <span>
          {formatDateTime(params.row.posting_date)}
        </span>
      ),
  },
  {
    field: "register_date",
    headerName: "作成日",
    sortable: false,
    width: 220,
    headerClassName: 'headerStyle',
    renderCell: (params) => (
      <span>
        {formatDateTime(params.row.register_date)}
      </span>
    ),
  },
  {
    field: 'actions',
    headerName: "",
    sortable: false,
    width: 240,
    headerClassName: 'headerStyle',
    cellClassName: 'cellFlex',
    renderCell: (params) => (
      <p style={{display: 'flex', gap: 10}}>
        <CustomButton
            label="編集"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
            className={`cellButton ${params.row.status === 'POSTED' && 'disabled'}`}
          />
        <CustomButton
            label="今すぐ通知"
            startIcon={<SendIcon />}
            onClick={() => handleNotifyNow(params.row)}
            className={`cellButton ${params.row.status === 'POSTED' && 'disabled'}`}
          />
      </p>
    ),
  }
];
/* eslint-enable @typescript-eslint/no-explicit-any */