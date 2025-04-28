import { ReactNode } from "react";
import { FieldValues, RegisterOptions, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { SxProps, Theme } from "@mui/system";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoginFormInputs {
    username?: string;
    password?: string;
    old_password?: string;
    new_password?: string;
  }
  export interface AuthState {
    loginState: AuthLoginState;
    user: AuthUser;
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
      endAdornment?:ReactNode;
    }

  export interface TitleProps{
      title: string;
      addBorder?: boolean;
  }  

  export interface IndexProps {
    status: string;
    text:string;
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
  }

  export interface CustomFullWidthInputGroupProps {
    label: string;
    name: string;
    placeholder?: string;
    register: any;
    errors?: any;
    disabled?:boolean;
    isRequired?: boolean;
    isModalInput?: boolean;
    type?: string;
    extraClassName?: string;
    rows?: number;
    multiline?: boolean;
    min?: number;
    max?: number;
    minMessage?: string;
    maxMessage?: string;
  }

  export interface CustomFullWidthCheckboxInputGroupProps {
    label: string;
    name: string;
    placeholder?: string;
    register: any;
    errors?: any;
    disabled?:boolean;
    isRequired?: boolean;
    isModalInput?: boolean;
    type?: string;
    extraClassName?: string;
    rows?: number;
    multiline?: boolean;
  }

  export interface CustomFullWidthSelectInputGroupProps {
    label: string;
    name: string;
    placeholder?: string;
    register: any;
    errors?: any;
    control?:any;
    disabled?: boolean;
    isRequired?: boolean;
    isModalInput?: boolean;
    extraClassName?: string;
    options?: Array<{value: string | number, label: string}>; // Add this line
  }

  export interface CustomButtonProps {
    label: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    startIcon?: React.ReactNode;
    sx?: SxProps<Theme>;
    buttonCategory?: string;
    type?: "button" | "submit";
    isFileUpload?: boolean;
    onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?:string;
    disabled?: boolean;
    isLoading?:boolean;
  }

  export interface ClientsType {
    new: RequestState<Member[]>;
    searched: RequestState<Member[]>;
    detailed: RequestState<Member>;
  }

  export type Member = Record<string, any>;

  export interface MembersType {
    new: RequestState<Member[]>;
    searched: RequestState<Member[]>;
    detailed: RequestState<Member>;
  }

  export interface TableProps {
    rows: any[];
    columns: any[];
    selectedIds: string[];
    onRowSelection: (selectedIds: string[]) => void;
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
  }

  export interface ImagesUploaderProps {
    initialImages?: string[];
    type?: 'multiple' | 'single';
    showLabel?: string;
    name: string;
    setValue: UseFormSetValue<any>;
    register: UseFormRegister<any>;
    width?: string;
    onImagesDeleted?: (deletedImagePaths: string[]) => void;
    update?: string;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */