import { Box } from '@mui/material'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SectionTitle from '../../../components/SectionTitle'
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import CustomTwoColInputGroup from '../../../components/CustomTwoColInputGroup';
import CustomFullWidthInputGroup from '../../../components/CustomFullWidthInputGroup';
import { useEffect, useState } from 'react';
import CustomButton from '../../../components/CustomButton';
import './Update.css'
import { ImagesUploader } from '../../../components/ImagesUploader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { createMemberProfile, deleteMemberProfileImage, fetchDetailedMember, sendEmail, updateDetailedMember } from '../../../store/membersSlice';
import { useParams } from 'react-router';
import { useToast } from '../../../components/Toastify';
import CustomRadioGroup from '../../../components/CustomRadio';
/* eslint-disable @typescript-eslint/no-explicit-any */

export const readFileAsBase64 = (
  file: File,
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const MemberUpdate = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {member_id}= useParams();
  const { addToast, toasts } = useToast();
  const [updateStatus,setUpdateStatus] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [registerTimeStamp, setRegisterTimeStamp] = useState('');
  const [imageInitialValue, setImageInitialValue] = useState<any>();
  const clientId = Cookies.get('clientID')
  const employeeId = Cookies.get('employeeID')
  const role = Cookies.get('role')
  const {data: detailMemberData} = useSelector((state: any)=>state.members.detailed);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const {
    register: registerForm2,
    setValue: setValue2,
    handleSubmit: handleSubmitForm2,
  } = useForm();

  const handleImagesDeleted = async() => {
    const params = {
      client_id: clientId,
      member_id: member_id&&member_id!==undefined ? member_id : employeeId,
      register_timestamp: registerTimeStamp,
    }
      if (params.client_id && params.member_id && params.register_timestamp) {
        const deleteResult = await dispatch(deleteMemberProfileImage({params}));
        if(deleteResult?.meta?.requestStatus==='fulfilled'){
          addToast({
            message: '削除しました!',
            type: 'deleted',
          });
        }
      } else {
        console.warn("Params are missing or undefined:", params);
      }
  };
 
  const handleEditClick = (e:any)=>{
    e.preventDefault()
    setIsEdit(!isEdit);
  }

  const handleCancelEditClick = ()=>{
    setIsEdit(!isEdit);
  }
   
  const onSubmit = (data: any) => {
    const payload = {
      client_id: clientId,
      first_name: data.firstName,
      family_name: data.lastName,
      first_name_kana: data.furiFirstName,
      family_name_kana: data.furiLastName,
      mail_address: data.email,
      role: data.role,
     }
    updateMember(payload);
  };

  const updateMember = async (payload:any) => {
    try {
      let updateResult;
      let id;
      if(member_id && member_id !==undefined){
        id = member_id;
        updateResult = await dispatch(updateDetailedMember({id,payload}));
      }else{
        id= employeeId;
        updateResult = await dispatch(updateDetailedMember({id,payload}));
      }

      if (updateDetailedMember.fulfilled.match(updateResult)) {
        addToast({
          message: '更新完了 。',
          type: 'success',
        });
        setUpdateStatus(!updateStatus)
        setLoading(false);
      }else if(updateDetailedMember.pending.match(updateResult)){
        setLoading(true);
      }else if(updateDetailedMember.rejected.match(updateResult)){
        addToast({
          message: 'fail to update',
          type: 'error',
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

    const fetchDetailMember = async () => {
      try {
        if(member_id&&member_id!==undefined){
          const id = member_id;
          await dispatch(fetchDetailedMember(id));
        }
        else{
          const id = employeeId;
          await dispatch(fetchDetailedMember(id));
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };
  
    useEffect(() => {
      fetchDetailMember();
    }, [updateStatus]);

    useEffect(()=>{
      if(detailMemberData){
        setValue('firstName', detailMemberData.safeMemberData?.first_name);
        setValue('lastName', detailMemberData.safeMemberData?.family_name);
        setValue('furiFirstName', detailMemberData.safeMemberData?.first_name_kana);
        setValue('furiLastName', detailMemberData.safeMemberData?.family_name_kana);
        setValue('email', detailMemberData.safeMemberData?.mail_address);
        setValue('role', detailMemberData.safeMemberData?.role);
        setImageInitialValue(detailMemberData.safeMemberData?.image_url !== null && detailMemberData.safeMemberData?.image_url !== 'null' ? [detailMemberData.safeMemberData?.image_url] : []);
        setRegisterTimeStamp(detailMemberData.safeMemberData?.register_timestamp)
      }
    },[detailMemberData])

    const handleChangePassword = async() => {
        try {
              const sendingMailResult = await dispatch(sendEmail(detailMemberData?.safeMemberData?.mail_address));
              const result = await sendingMailResult?.payload as any;
              const requestStatus = await sendingMailResult?.meta?.requestStatus as any;
              if(requestStatus==="fulfilled"){
                addToast({
                  message: result.message,
                  type: 'success',
                });
              }
            } catch (err) {
              console.error('Error changing status', err);
            }
      };

    const onSubmitForm2 = async (data: any) => {
      const formData = new FormData();
      let imageData = '';
      try{
        await Promise.all(
          data.image_url?.map(async (file: any) => {
            try {
              const base64Data = await readFileAsBase64(file.file);
              imageData = typeof base64Data === "string" ? base64Data.split(",")[1] : '';
              
          return imageData ?? "";
            } catch (error:any) {
              return error;
            }
          })|| []
        );
        if (clientId !== undefined && clientId !== null) {
          formData.append("client_id", String(clientId)); 
        }
    
        if (member_id !== undefined && member_id !== null) {
          formData.append("member_id", String(member_id));
        }else {
          formData.append("member_id", String(employeeId));
        }

        if (registerTimeStamp !== ''){
          formData.append("register_timestamp", String(registerTimeStamp));
        }

        if(imageData !== ''){
          formData.append("image_url", imageData||'');
        }
        const profileResult = await dispatch(createMemberProfile(formData));
        if(profileResult?.meta?.requestStatus==='fulfilled'){
          addToast({
            message: '更新完了 。',
            type: 'success',
          });
        }
      }
      catch(e){
        console.log(e);
      }
    };

  return (
    <Box py={3}>
      <SectionTitle title='プロフィール' />
      <Box py={3} sx={{display: 'flex',flexDirection:'row'}}>
        <Box sx={{width: '33.33%', height: '300px', }}>
        <form onSubmit={handleSubmitForm2(onSubmitForm2)} style={{display:'flex',flexDirection:'column',justifyContent:'space-between', height: '100%'}}>
          <Box className='imageWrapper'>
          <ImagesUploader
              name="image_url"
              initialImages={imageInitialValue}
              setValue={setValue2}
              register={registerForm2}
              onImagesDeleted={handleImagesDeleted}
              update={detailMemberData&&(detailMemberData.safeMemberData?.image_url === 'null' || detailMemberData.safeMemberData?.image_url === null) && 'true'}
              showLabel='false'
            />
          </Box>
          <Box className='buttonWrapper'>
          <CustomButton
            label="写真アップロード"
            startIcon={<FileUploadOutlinedIcon sx={{ fontSize: "20px !important" }} />}
            type='submit'
          />
          </Box>
          </form>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} className='formStyle'>
          <Box sx={{maxWidth: '516px', height: '100%', display:'flex', flexDirection:'column',alignItems:'flex-end'}}>
          <CustomTwoColInputGroup
            label="名前"
            firstName="firstName"
            lastName="lastName"
            placeholderOne="佐藤"
            placeholderTwo="太郎"
            register={register}
            errors={errors}
            disabled={!isEdit}
          />
          <CustomTwoColInputGroup
            label="フリガナ"
            firstName="furiFirstName"
            lastName="furiLastName"
            placeholderOne="サトウ"
            placeholderTwo="タロウ"
            register={register}
            errors={errors}
            disabled={!isEdit}
          />
          <CustomRadioGroup
            name="role"
            defaultValue={detailMemberData.safeMemberData?.role === 'admin' ? 'admin' : 'general'}
            control={control}
            label="管理者"
            options={[
              { value: 'admin', label: '管理者' },
              { value: 'general', label: '設定しない' },
            ]}
            disabled={role !== 'admin'}
          />
          <CustomFullWidthInputGroup
            label="メール"
            name="email"
            placeholder=""
            register={register}
            errors={errors}
            disabled={!isEdit}
          />
          { member_id && member_id === undefined && 
          <div className='radioFormControl'>
            <p className='dummyText'></p>
            <Box sx={{width: '374px', display: 'flex', justifyContent: 'flex-start'}}>
              <CustomButton
                label="パスワードを変更する"
                type='button'
                onClick={handleChangePassword}
                className='changePasswordBtn'
              />  
            </Box>
          </div>
          }
          </Box>
          <Box sx={{display: 'flex',justifyContent:'center',gap:'10px'}}>
            {isEdit ? 
            <>
              <CustomButton
                label="登録"
                type='submit'
                isLoading={loading}
              />
              <CustomButton
                label="戻る"
                onClick={handleCancelEditClick}
                buttonCategory='cancel'  
              /></> : 
              <CustomButton
                label="検索"
                onClick={(e)=>handleEditClick(e)}
                startIcon={<BorderColorIcon sx={{ fontSize: "16px" }} />}
              />
            }    
          </Box>
        </form>
      </Box>
      {toasts}
    </Box>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export default MemberUpdate
