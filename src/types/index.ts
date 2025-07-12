import { ReactNode } from "react";
import {
  Control,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { SxProps, Theme } from "@mui/system";
import dayjs, { Dayjs } from "dayjs";

export interface LoginFormInputs {
  username?: string;
  password?: string;
  old_password?: string;
  new_password?: string;
}
export interface AuthState {
  loginState: AuthLoginState;
  user: AuthUser;
  redirectPath?: string | null;
}
export interface RequestState<T = any> {
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  contents?: T;
  data?: T;
}
export interface AuthLoginState extends RequestState {
  isLoggedIn: boolean;
}

export interface AuthUser {
  clientID: string;
  clientName: string;
  employeeID: string;
  role: string;
  token?: string;
}

export interface CustomInputProps {
  placeholder: string;
  helperText?: string;
  error?: boolean;
  type?: string;
  register: UseFormRegister<FieldValues>;
  name: string;
  rules?: RegisterOptions;
  endAdornment?: ReactNode;
}

export interface TitleProps {
  title: string;
  addBorder?: boolean;
}

export interface CustomCheckboxProps {
  fieldName?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: boolean;
}

export interface IndexProps {
  status: string;
  text: string;
}

export interface CustomTwoColProps {
  firstName: string;
  lastName: string;
  placeholderOne?: string;
  placeholderTwo?: string;
  register: any;
  errors: any;
  disabled?: boolean;
  isModalInput?: boolean;
  isRequired?: boolean;
  index?: any;
  onRemove?: any;
  validationMessageFirstName?: string;
  validationMessageLastName?: string;
}

export interface CustomTwoColInputGroupProps {
  label: string;
  firstName: string;
  lastName: string;
  placeholderOne: string;
  placeholderTwo: string;
  register: any;
  errors: any;
  marginBottom?: string;
  disabled?: boolean;
  isRequired?: boolean;
  isModalInput?: boolean;
  index?: number;
  labelWidth?: string;
  labelWidthSp?: string;
  inputWidth?: string;
  inputWidthSp?: string;
  onRemove?: any;
  validationMessageFirstName?: string;
  validationMessageLastName?: string;
}

export interface CustomFullWidthInputGroupProps {
  label: string;
  name: string;
  placeholder?: string;
  register: any;
  errors?: any;
  disabled?: boolean;
  isRequired?: boolean;
  isModalInput?: boolean;
  type?: string;
  extraClassName?: string;
  isShowInColumn?: boolean;
  rows?: number;
  multiline?: boolean;
  min?: number;
  max?: number;
  minMessage?: string;
  maxMessage?: string;
  labelWidth?: string;
  labelWidthSp?: string;
  inputWidth?: string;
  inputWidthSp?: string;
  labelSx?: any;
  showYen?: boolean;
  showMeter?: boolean;
  showYearIcon?: boolean;
  showCalendarIcon?: boolean;
  onCalendarClick?: () => void;
  children?: React.ReactNode;
}

export interface CustomFullWidthCheckboxInputGroupProps {
  label: string;
  name: string;
  placeholder?: string;
  register: any;
  errors?: any;
  disabled?: boolean;
  isRequired?: boolean;
  isModalInput?: boolean;
  type?: string;
  extraClassName?: string;
  rows?: number;
  multiline?: boolean;
  sx?: any;
  boxSx?: any;
  watch?: any;
  setValue?: any;
}

export interface CustomFullWidthSelectInputGroupProps {
  label: string;
  name: string;
  placeholder?: string;
  register?: any;
  errors?: any;
  control?: any;
  disabled?: boolean;
  readonly?: boolean;
  isRequired?: boolean;
  isModalInput?: boolean;
  extraClassName?: string;
  isShowInColumn?: boolean;
  options?: Array<{ value: string | number; label: string }>; // Add this line
  labelWidth?: string;
  labelWidthSp?: string;
  inputWidth?: string;
  inputWidthSp?: string;
  onChangeValue?: (val: any) => void;
}

export interface CustomButtonProps {
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  startIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
  buttonCategory?: string;
  type?: "button" | "submit";
  isFileUpload?: boolean;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export type Client = Record<string, any>;

export interface ClientsType {
  detailed: RequestState<Client>;
}

export type Member = Record<string, any>;

export interface MembersType {
  new: RequestState<Member[]>;
  searched: RequestState<Member[]>;
  detailed: RequestState<Member>;
}

export type Report = Record<string, any>;

export interface ReportsType {
  new: RequestState<Report[]>;
  searched: RequestState<Report[]>;
  detailed: RequestState<Report>;
  batchStatus: RequestState<any>;
}

export type Employee = Record<string, any>;

export interface EmployeesType {
  new: RequestState<Employee[]>;
  searched: RequestState<Employee[]>;
  names: RequestState<Employee[]>;
  detailed: RequestState<Employee>;
}

export type Inquiry = Record<string, any>;

export interface InquiryType {
  new: RequestState<Inquiry[]>;
  searched: RequestState<Inquiry[]>;
  detailed: RequestState<Inquiry>;
}

export type Property = Record<string, any>;

export interface PropertiesType {
  new: RequestState<Property[]>;
  names: RequestState<Property[]>;
  searched: RequestState<Property[]>;
  detailed: RequestState<Property>;
  newInquiryHistory?: RequestState<Property[]>;
  searchedInquiryHistory?: RequestState<Property[]>;
}

export interface TableProps {
  rows: any[];
  columns: any[];
  checkbox?: any;
  selectedIds?: string[];
  onRowSelection?: (selectedIds: string[]) => void;
  onAdminStatusClick?: (row: any, newStatus: boolean) => void;
}

export interface CustomRadioGroupProps {
  name: string;
  control: any;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  isModal?: boolean;
  onChangeValue?: any;
  disabled?: boolean;
  labelWidth?: string;
  labelWidthSp?: string;
  containerStyle?: SxProps<Theme>;
}

export interface CustomClientTableProps {
  title: string;
  checkbox: boolean;
  fullList: boolean;
  addAction: boolean;
  type?: string | null; // Optional type parameter for filtering
}

export interface ImagesUploaderProps {
  initialImages?: any[];
  type?: "single" | "multiple";
  showLabel?: "true" | "false";
  name?: string;
  memberId?: string;
  setValue?: any;
  register?: any;
  width?: string;
  onImagesDeleted?: (deletedPaths: any[]) => void;
  update?: string;
  onCleanup?: () => void;
  isLoading?: boolean; // Add this new prop
}

interface SelectOption {
  label: string;
  value: string;
}

export interface CustomSelectProps {
  label: string;
  name: string;
  control?: Control<any>; // This can be more specific if you have your form's data structure typed
  options: SelectOption[];
  defaultValue?: string; // Make it optional if not always provided
  [key: string]: any; // Allow other props to be passed down, like sx, etc.
  width?: string; // Add width prop
  XsWidth?: string;
}

export interface SortButtonProps {
  label: string;
  value: string;
  onClick: (val: string) => void;
  active: boolean;
}

export interface PropertyFormProps {
  defaultValues?: any;
  onSubmit?: (data: any) => void;
  formType?: string;
  onSuccess?: (status: "created" | "updated") => void;
}

export interface CustomerSideMonthlyCalendarType {
  days: any[][];
  showCalendar: boolean;
  bookedSchedule: any[];
  currentYear: number;
  currentMonth: number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onDateSelect: (date: string) => void;
  spView?: boolean;
  bookableDates?: any[];
  setNewSchedule?: (schedule: any) => void;
  setScheduleId?: (id: number) => void;
  setContentOfModalWindow?: (content: string) => void;
}

export interface selectedTimeType {
  date?: string;
  startHour: string;
  endHour: string;
}

export interface DayType {
  day: dayjs.Dayjs;
  bookable?: boolean;
  book: any;
  onCurrentMonth?: boolean;
  setNewSchedule?: any;
  setScheduleId?: any;
  setContentOfModalWindow?: any;
  availableDay?: any;
  onDateSelect?: (date: string) => void;
  setSelectedDate?: (date: string) => void;
  selectedDate?: string;
  isSelected?: boolean;
  spView?: boolean;
  hours?: dayjs.Dayjs[];
  bookableTimes?: any;
  setScrollTop?: (value: number) => void;
  index?: number;
  heightOfOneHour?: string | number;
  heightInNumber?: number;
  selectedTime?: selectedTimeType;
  setSelectedTime?: (time: {
    date: string;
    startHour: string;
    endHour: string;
  }) => void;
  onTimeSelect?: (time: {
    startHour: string;
    endHour: string;
    selectedDate: string;
  }) => void;
}

export type CustomDatePickerProps = {
  onDateConfirm: (date: Dayjs | null) => void;
  onCancel: () => void;
  type?: "date" | "dateTime";
};

export type CustomDateRangePickerProps = {
  onDateConfirm: (range: { start: Dayjs | null; end: Dayjs | null }) => void;
  onCancel: () => void;
};

export interface CustomFullWidthCheckboxInputGroupProps {
  label: string;
  name: string;
  register: any;
  errors?: any;
  disabled?: boolean;
  isRequired?: boolean;
  isModalInput?: boolean;
  extraClassName?: string;
  options?: Array<{ value: any; label: string }>;
  helperText?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelWidth?: string;
  watch?: any;
  setValue?: any;
  sx?: any;
  boxSx?: any;
  uncheckedValue?: string;
}
export interface PerPageSelectBoxProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export interface HeaderLabels {
  date: string;
  // title: string;
  customer_name: string;
  category: string;
  content: string;
}

export interface CustomerInteraction {
  id?: string;            // inquiry_id (表示不要)
  date: string;           // 日付
  customer_name: string;  // 顧客名
  category: string;       // カテゴリ
  content: string;        // 内容
}

export interface MiniTableListProps {
  data: CustomerInteraction[];
  headerLabels?: HeaderLabels;
  onChange?: (data: CustomerInteraction[]) => void;
}

export interface CustomCheckboxGroupProps {
  name: string;
  control: any;
  label?: string;
  defaultValue?: string;
  onChangeValue?: (value: string) => void;
  disabled?: boolean;
  marginBottom?: string;
  isRequired?: boolean;
}

type BreadcrumbItem = { path: string; title: string };

export type RouteEntry = {
  title?: string;
  icon?: React.ReactNode;
  breadcrumb?:
    | BreadcrumbItem[]
    | ((args: {
        params: Record<string, string>;
        propName?: string;
        customerName?: string;
        tabName?: string;
        employeeName?: string;
      }) => BreadcrumbItem[]);
};

export type ErrorPageProps = {
  type: string;
};

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
