import CustomModal from '../../../components/CustomModal'
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import CustomTwoColInputGroup from '../../../components/CustomTwoColInputGroup';
import CustomFullWidthInputGroup from '../../../components/CustomFullWidthInputGroup';
import CustomButton from '../../../components/CustomButton';
import './memberCreate.css'
import CustomRadioGroup from '../../../components/CustomRadio';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { createMember } from '../../../store/membersSlice';
import { useToast } from '../../../components/Toastify';
import { getClientID } from '../../../utils/authUtils';
/* eslint-disable @typescript-eslint/no-explicit-any */

const CreateMember = ({openModal,setOpenModal,onCreateSuccess}:any) => {
    const {register,control, handleSubmit,formState: { errors },} = useForm({
        defaultValues: { role: 'general' }
    });
    const { addToast, toasts } = useToast();
    const clientId = getClientID();
    const dispatch = useDispatch<AppDispatch>();
    const handleCloseModal = () => setOpenModal(false);
    const handleCancelClick = () => setOpenModal(false);
    const onSubmit = (data: any) => {
        const payload = {
            client_id: clientId,
            role: data.role,
            last_name: data.lastName,
            first_name: data.firstName,
            last_name_kana: data.furiLastName,
            first_name_kana: data.furiFirstName,
            mail_address: data.email,
        }
        setOpenModal(false);
        createMemberData(payload);
    }

    const createMemberData = async(payload:any) => {
        try {
        const createResult = await dispatch(createMember(payload));
        if (createMember.fulfilled.match(createResult)) {
            addToast({
                message: '更新完了 。',
                type: 'success',
            });
            onCreateSuccess(true);
        }
        else if(createMember.rejected.match(createResult)){
            addToast({
                message: 'fail to create',
                type: 'error',
            });
        }
        } catch (err) {
        console.error('Error changing status', err);
        }
        };
  return (
    <>
    <CustomModal title='新規アカウント登録' openModal={openModal} handleCloseModal={handleCloseModal} modalType='create' addTitleBorder='true'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box className='member formInputsContainer'>
            <Box className='formInputsGroup'>
                <CustomTwoColInputGroup
                    label="名前"
                    firstName="firstName"
                    lastName="lastName"
                    placeholderOne="佐藤"
                    placeholderTwo="太郎"
                    register={register}
                    errors={errors}
                    isRequired
                    isModalInput={true}
                />
                <CustomTwoColInputGroup
                    label="フリガナ"
                    firstName="furiFirstName"
                    lastName="furiLastName"
                    placeholderOne="サトウ"
                    placeholderTwo="タロウ"
                    register={register}
                    errors={errors}
                    isRequired
                    isModalInput={true}
                />
                <CustomRadioGroup
                    name="role"
                    control={control}
                    label="管理者"
                    options={[
                    { value: 'admin', label: '管理者' },
                    { value: 'general', label: '設定しない' },
                    ]}
                />
                <CustomFullWidthInputGroup
                    label="メール"
                    name="email"
                    type='email'
                    placeholder=""
                    register={register}
                    errors={errors}
                    isModalInput={true}
                />
            </Box>
            </Box>
            <Box sx={{display: 'flex',justifyContent:'center',gap:'10px'}}>
                <CustomButton
                    label="戻る"
                    onClick={handleCancelClick}
                    buttonCategory='cancel'  
                /> 
                <CustomButton
                    label="作成"
                    type='submit'
                />
            </Box>
        </form>
    </CustomModal>
    {toasts}
    </>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export default CreateMember
