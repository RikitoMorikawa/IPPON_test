import CustomModal from "../../../components/CustomModal";
import { useForm } from "react-hook-form";
import { Box, useMediaQuery } from "@mui/material";
import CustomTwoColInputGroup from "../../../components/CustomTwoColInputGroup";
import CustomFullWidthInputGroup from "../../../components/CustomFullWidthInputGroup";
import CustomButton from "../../../components/CustomButton";
import "./employeeCreate.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { createEmployee } from "../../../store/employeeSlice";
import { useToast } from "../../../components/Toastify";
import CustomFullWidthCheckboxGroup from "../../../components/CustomFullWidthCheckboxInputGroup";
import { getClientID } from "../../../utils/authUtils";
 

const CreateEmployee = ({ openModal, setOpenModal, onCreateSuccess }: any) => {
  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { role: "general" },
  });
  const { addToast, toasts } = useToast();
  const clientId = getClientID();
  const dispatch = useDispatch<AppDispatch>();
  const handleCloseModal = () => setOpenModal(false);
  const handleCancelClick = () => setOpenModal(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const onSubmit = (data: any) => {
            const payload = {
            client_id: clientId,
            // registrant_id: '987654321',
            role: data.role,
            last_name: data.lastName,
            first_name: data.firstName,
            last_name_kana: data.furiLastName,
            first_name_kana: data.furiFirstName,
            mail_address: data.email,
        };
    setOpenModal(false);
    createEmployeeData(payload);

  };

  const createEmployeeData = async (payload: any) => {
    try {
      const createResult = await dispatch(createEmployee(payload));
      if (createEmployee.fulfilled.match(createResult)) {
        addToast({
          message: "更新完了 。",
          type: "success",
        });
        reset(); 
        onCreateSuccess(true);
      } else if (createEmployee.rejected.match(createResult)) {
        addToast({
          message: "fail to create",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error changing status", err);
    }
  };
  return (
    <>
      <CustomModal
        title='新規アカウント登録'
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        modalType='create'
        addTitleBorder='true'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className={`member formInputsContainer ${isMobile?'sp': ''}`}>
            <Box className='formInputsGroup'>
              <CustomTwoColInputGroup
                label='氏名'
                firstName='firstName'
                lastName='lastName'
                placeholderOne='名'
                placeholderTwo='氏'
                register={register}
                errors={errors}
                isRequired
                isModalInput={true}
                labelWidthSp="20%"
              />
              <CustomTwoColInputGroup
                label='フリガナ'
                firstName='furiFirstName'
                lastName='furiLastName'
                placeholderOne='ナマエ'
                placeholderTwo='ミョウジ'
                register={register}
                errors={errors}
                isModalInput={true}
                labelWidthSp="20%"
              />
              <CustomFullWidthCheckboxGroup
                label='ロール'
                name='role'
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                isModalInput={true}
                options={[{ value: "admin", label: "管理者" }]}
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
                inputWidth={'338px'}
                inputWidthSp={'100%'}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <CustomButton
              label='戻る'
              onClick={handleCancelClick}
              buttonCategory='cancel'
            />
            <CustomButton label='作成' type='submit' />
          </Box>
        </form>
      </CustomModal>
      {toasts}
    </>
  );
};
 
export default CreateEmployee;
