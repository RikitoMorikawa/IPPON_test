import { useForm } from "react-hook-form";
import { Box, useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import CustomTwoColInputGroup from "../../../components/CustomTwoColInputGroup";
import CustomFullWidthInputGroup from "../../../components/CustomFullWidthInputGroup";
import CustomButton from "../../../components/CustomButton";
import "./Update.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import {
  updateDetailedEmployee,
  fetchDetailedEmployee,
} from "../../../store/employeeSlice";
import { useToast } from "../../../components/Toastify";
import CustomFullWidthCheckboxGroup from "../../../components/CustomFullWidthCheckboxInputGroup";
import { useEffect, useState } from "react";
import SectionTitle from "../../../components/SectionTitle";
import { useNavigate, useParams } from "react-router";

const EmployeeUpdate = () => {
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { addToast, toasts } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const clientId = Cookies.get("clientID");
  const employeeId = useParams().employee_id;
  const isMobile = useMediaQuery('(max-width:600px)');
  const [originalValues, setOriginalValues] = useState<any>(null);
  const userRole = Cookies.get("role");

  const { data: employeeData } = useSelector(
    (state: any) => state.employees.detailed
  );
  useEffect(() => {
    dispatch(fetchDetailedEmployee(employeeId));
  }, [employeeId, dispatch]);

  // Populate form with employee data when modal opens
  useEffect(() => {
    if (employeeData) {
    const initial = {
      firstName: employeeData.first_name || "",
      lastName: employeeData.last_name || "",
      furiName: employeeData.first_name_kana || "",
      furiLastName: employeeData.last_name_kana || "",
      email: employeeData.mail_address || "",
      role: employeeData.is_admin ? "admin" : "general",
    };

    Object.entries(initial).forEach(([key, value]) => {
      setValue(key as keyof typeof initial, value);
    });

    setOriginalValues(initial);
  }

  }, [employeeData, setValue]);

  const formValues = watch();

  const isFormChanged = originalValues
    ? Object.entries(originalValues).some(
        ([key, value]) => formValues[key] !== value
      )
    : false;

  const canEdit = userRole === "admin";

  const onSubmit = (data: any) => {
    const payload = {
      client_id: clientId,
      first_name: data.firstName,
      last_name: data.lastName,
      first_name_kana: data.furiName,
      last_name_kana: data.furiLastName,
      mail_address: data.email,
      role: data.role,
    };
    updateEmployeeData(payload);
  };

  const updateEmployeeData = async (payload: any) => {
    try {
      setLoading(true);
      const id = employeeData?.id;
      const updateResult = await dispatch(
        updateDetailedEmployee({ id, payload })
      );

      if (updateDetailedEmployee.fulfilled.match(updateResult)) {
        // Update cookie role if the updated employee is the current logged-in user
        const currentEmployeeId = Cookies.get("employeeID");
        if (String(id) === String(currentEmployeeId)) {
          const updatedEmployeeData = updateResult.payload;
          const newRole = updatedEmployeeData?.is_admin ? "admin" : "general";
          Cookies.set("role", newRole, { expires: 1 });
        }

        addToast({
          message: "更新完了。",
          type: "success",
        });
        reset();
        navigate("/setting/employees");
      }
    } catch (err) {
      console.error("Error updating employee:", err);
      addToast({
        message: "fail to update",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          paddingTop: '24px'
        }}
        display='flex'
        flexDirection='column'
        height='calc(100vh - 74px)'
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}>
        <SectionTitle title='プロフィール' />
        <Box className={`${isMobile?'sp':''} member`} sx={{
          padding: {xs: '10px', sm: '24px'}
        }}>
          <Box width='100%' height='100%' display='flex' flexDirection='column'>
            <CustomTwoColInputGroup
              label='名前'
              firstName='firstName'
              lastName='lastName'
              placeholderOne='佐藤'
              placeholderTwo='太郎'
              register={register}
              errors={errors}
              isRequired
              isModalInput={true}
              labelWidth={`${isMobile? '' : '60px'}`}
              labelWidthSp="20%"
              inputWidth={'338px'}
              inputWidthSp={'100%'}
              disabled={!canEdit}
            />
            <CustomTwoColInputGroup
              label='フリガナ'
              firstName='furiName'
              lastName='furiLastName'
              placeholderOne='サトウ'
              placeholderTwo='タロウ'
              register={register}
              errors={errors}
              isModalInput={true}
              labelWidth={`${isMobile? '' : '60px'}`}
              labelWidthSp="20%"
               inputWidth={'338px'}
              inputWidthSp={'100%'}
              disabled={!canEdit}
            />
            <CustomFullWidthCheckboxGroup
              label='ロール'
              name='role'
              register={register}
              errors={errors}
              watch={watch}
              sx={{ml: {lg: 1.5, xs: 0}}}
              setValue={setValue}
              options={[{ value: "admin", label: "管理者" }]}
              labelWidth={`${isMobile? '26%' : '50px'}`}
              uncheckedValue="general"
              disabled={!canEdit}
            />
            <CustomFullWidthInputGroup
              label='メールアドレス'
              name='email'
              type='email'
              placeholder='メールアドレス'
              register={register}
              errors={errors}
              isRequired
              isModalInput={true}
              labelWidth={`${isMobile? '20%' : '60px'}`}
              labelWidthSp={'20%'}
              inputWidth={'338px'}
              inputWidthSp={'100%'}
              disabled={!canEdit}
            />
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: "rgb(221, 221, 221, 0.2)",
            padding: "10px 0",
            marginTop: "auto",
            position: "sticky",
            bottom: "0",
            marginLeft: "-22px",
            marginRight: "-24px",
            width: "calc(100% + 46px)",
            textAlign: "center",
          }}>
          {/* <CustomButton
              label='戻る'
              onClick={handleCancelClick}
              buttonCategory='cancel'
            /> */}
          <CustomButton label='更新' type='submit' isLoading={loading} disabled={!canEdit || !isFormChanged} />
        </Box>
      </Box>
      {toasts}
    </>
  );
};

export default EmployeeUpdate;
