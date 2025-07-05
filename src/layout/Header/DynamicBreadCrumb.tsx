import { matchPath, useLocation, useParams } from "react-router";
import { Link } from "react-router"; // Or your custom Link component
import { Stack, Icon, Breadcrumbs, Typography } from "@mui/material";
import { useMemo } from "react";
import { RouteEntry } from "../../types";
import {
  BreadcrumbDashboardIcon,
  BreadcrumbPropertyIcon,
  BreadcrumbSettingIcon,
} from "../../common/icons";
import Cookies from "js-cookie";

const routeConfig: Record<string, RouteEntry> = {
  "/dashboard": {
    icon: <BreadcrumbDashboardIcon />,
    breadcrumb: [
      { path: "/dashboard", title: "ダッシュボード" },
      { path: "/dashboard", title: "問い合わせ一覧" },
    ],
  },
  "/properties": {
    icon: <BreadcrumbPropertyIcon />,
    breadcrumb: [
      { path: "/properties", title: "物件情報" },
      { path: "/properties", title: "物件一覧" },
    ],
  },
  "/properties/create": {
    icon: <BreadcrumbPropertyIcon />,
    breadcrumb: [
      { path: "/properties", title: "物件情報" },
      { path: "/properties/create", title: "新規登録" },
    ],
  },
  "/properties/inquiry_create": {
    icon: <BreadcrumbPropertyIcon />,
    breadcrumb: [
      { path: "/properties", title: "物件情報" },
      { path: "/properties", title: "物件一覧" },
      { path: "/properties/inquiry_create", title: "新規顧客登録" },
    ],
  },
  "/properties/:property_id": {
    icon: <BreadcrumbPropertyIcon />,
    breadcrumb: ({ params, propName }: { params: any; propName?: string }) => [
      { path: "/properties", title: "物件情報" },
      { path: "/properties", title: "物件検索" },
      {
        path: `/properties/${params.property_id}`,
        title: propName ?? `顧客ID: ${params.property_id}`,
      },
    ],
  },
  "/properties/inquiry/:inquiry_id": {
    icon: <BreadcrumbPropertyIcon />,
    breadcrumb: (params: any) => [
      { path: "/properties", title: "物件情報" },
      { path: "/properties/inquiry/", title: "物件一覧" },
      { path: `/properties/inquiry/${params.inquiry_id}`, title: "顧客詳細" },
      // { path: `/properties/inquiry/${params.inquiry_id}`, title: typeof propName === 'string' ? propName : `物件ID: ${params.property_id}` },
    ],
  },
  "/inquiry": {
    icon: <BreadcrumbDashboardIcon />,
    breadcrumb: [
      { path: "/inquiry", title: "ダッシュボード" },
      { path: "/inquiry", title: "顧客一覧" },
    ],
  },
  "/inquiry/create": {
    icon: <BreadcrumbDashboardIcon />,
    breadcrumb: [
      { path: "/inquiry", title: "ダッシュボード" },
      { path: "/inquiry/create", title: "顧客の新規登録" },
    ],
  },
  "/inquiry/:inquiry_id": {
    icon: <BreadcrumbDashboardIcon />,
    breadcrumb: ({
      params,
      customerName,
    }: {
      params: any;
      customerName?: string;
    }) => [
      { path: "/inquiry", title: "ダッシュボード" },
      { path: "/inquiry", title: "顧客一覧" },
      {
        path: `/inquiry/${params.inquiry_id}`,
        title: customerName ?? `顧客ID: ${params.inquiry_id}`,
      },
    ],
  },
  "/setting/employees": {
    icon: <BreadcrumbSettingIcon />,
    breadcrumb: [
      { path: "/setting/employees", title: "管理" },
      { path: "/setting/employees", title: "アカウント設定" },
    ],
  },
  "/setting/employees/:employee_id": {
    icon: <BreadcrumbSettingIcon />,
    breadcrumb: [
      { path: "/setting/employees", title: "アカウント設定" },
      {
        path: "/setting/employees/:employee_id",
        title: `${Cookies.get("clientName")}`,
      },
    ],
  },
  "/setting/client-profile": {
    icon: <BreadcrumbSettingIcon />,
    breadcrumb: [
      { path: "/setting/client-profile", title: "管理" },
      { path: "/setting/client-profile", title: "管理者設定" },
    ],
  },
  "/reports": {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 32 32"
      >
        <path
          fill="currentColor"
          d="m29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29ZM4 13a9 9 0 1 1 9 9a9.01 9.01 0 0 1-9-9"
        />
      </svg>
    ),
    breadcrumb: [
      { path: "/reports", title: "物件情報" },
      { path: "/reports", title: "物件検索" },
    ],
  },
  // Add more routes as needed
};

interface DynamicBreadcrumbProps {
  propName?: string; // Make optional if it might be undefined
  customerName?: string;
  tabName?: string;
}
export default function DynamicBreadcrumb({
  propName,
  customerName,
  tabName,
}: DynamicBreadcrumbProps) {
  const location = useLocation();
  const params = useParams();

  const breadcrumbItems = useMemo(() => {
    let config;

    for (const [pattern, route] of Object.entries(routeConfig)) {
      if (matchPath(pattern, location.pathname)) {
        config = route;
        break;
      }
    }

    if (config) {
      if (typeof config.breadcrumb === "function") {
        const safeParams = Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined)
        ) as { [key: string]: string };

        // return config.breadcrumb(safeParams, propName,customerName,tabName);
        return config.breadcrumb({
          params: safeParams,
          propName,
          customerName,
          tabName,
        });
      }
      if (Array.isArray(config.breadcrumb)) {
        return config.breadcrumb;
      }
    }

    // generate from path segments
    const pathSegments = location.pathname.split("/").filter(Boolean);
    let fullPath = "";
    const crumbs: any[] = [];

    pathSegments.forEach((segment) => {
      fullPath += `/${segment}`;
      const route = routeConfig[fullPath];
      if (route?.title) {
        crumbs.push({ path: fullPath, title: route.title });
      }
    });
    return crumbs;
  }, [location.pathname, params, propName, customerName]);

  const icon = useMemo(() => {
    for (const [pattern, route] of Object.entries(routeConfig)) {
      if (matchPath(pattern, location.pathname)) {
        return route.icon;
      }
    }
    return null;
  }, [location.pathname]);

  return (
    <Stack width="100%" direction="row" alignItems="center">
      {icon && (
        <Icon
          sx={{
            width: 26,
            height: 26,
            backgroundColor: "#fff",
            border: "1px solid #0e9dbc",
            color: "#0e9dbc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            mr: 1,
          }}
        >
          {icon}
        </Icon>
      )}
      <Breadcrumbs aria-label="breadcrumb" sx={{ width: "100%" }}>
        {breadcrumbItems.map((item: any, idx: number) =>
          idx === breadcrumbItems.length - 1 ? (
            <Typography
              key={idx}
              sx={{
                color: "#3E3E3E",
                fontSize: 12,
                fontWeight: "bold",
                display: "inline",
              }}
            >
              {item.title}
            </Typography>
          ) : (
            <Link
              key={idx}
              to={item.path}
              style={{
                color: "#989898",
                fontSize: 12,
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              {item.title}
            </Link>
          )
        )}
      </Breadcrumbs>
    </Stack>
  );
}
