import { Box } from '@mui/material'
import SectionTitle from '../../../components/SectionTitle'
import { useForm } from 'react-hook-form';
import CustomTwoColInputGroup from '../../../components/CustomTwoColInputGroup';
import CustomFullWidthInputGroup from '../../../components/CustomFullWidthInputGroup';
import { useEffect, useState, useCallback } from 'react';
import CustomButton from '../../../components/CustomButton';
import './Update.css'
import { ImagesUploader } from '../../../components/ImagesUploader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import { createMemberProfile, deleteMemberProfileImage, fetchDetailedMember, sendEmail, updateDetailedMember } from '../../../store/membersSlice';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useToast } from '../../../components/Toastify';
import CustomCheckbox from '../../../components/CustomCheckbox';
import { getClientID, getEmployeeID, getRole } from '../../../utils/authUtils';
 

const readFileAsBase64 = (
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
  // Default to false until we can verify permissions
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const {member_id}= useParams();
  const location = useLocation();
  const isLoginUserProfilePage = location.pathname.includes('profile');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { addToast, toasts } = useToast();
  const [updateStatus,setUpdateStatus] = useState<boolean>(false)
  const [profileUploadStatus, setProfileUploadStatus] = useState<boolean>(false);
  const [, setLoading] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New loading state for submit
  const [registerTimeStamp, setRegisterTimeStamp] = useState('');
  const [imageInitialValue, setImageInitialValue] = useState<any>([]);
  const [componentKey, setComponentKey] = useState<string>(''); // Add component key for forcing re-mount
  
  const clientId = getClientID()
  const employeeId = getEmployeeID()
  const role = getRole()
  const navigate = useNavigate();
  const {data: detailMemberData} = useSelector((state: any)=>state.members.detailed);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, },
  } = useForm();

  // Comprehensive state cleanup function
  const clearAllState = useCallback(() => {
    setIsEdit(false);
    setIsImageLoading(false);
    setUpdateStatus(false);
    setProfileUploadStatus(false);
    setLoading(false);
    setIsSubmitting(false);
    setRegisterTimeStamp('');
    setImageInitialValue([]);
    setComponentKey('');
    
    // Reset form data
    reset();
    
    // Clear specific form fields
    setValue('firstName', '');
    setValue('lastName', '');
    setValue('furiFirstName', '');
    setValue('furiLastName', '');
    setValue('email', '');
    setValue('role', '');
    setValue('image_url', []);
  }, [reset, setValue]);

  const handleImagesDeleted = async() => {
    const params = {
      client_id: clientId,
      member_id: member_id && member_id !== undefined ? member_id : employeeId,
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
      setUpdateStatus(!updateStatus)
    } else {
      console.warn("Params are missing or undefined:", params);
    }
  };
 
  // const handleEditClick = (e:any)=>{
  //   e.preventDefault()
  //   setIsEdit(!isEdit);
  // }

  const handleCancelEditClick = ()=>{
    // Clear all state before navigating
    clearAllState();
    navigate('/members')
  }
   
  const onSubmit = async(data: any) => {
    setIsSubmitting(true); // Start submit loading
    
    try {
      const {image_url, ...otherData} = data;
              const payload = {
            client_id: clientId,
            first_name: otherData.firstName,
            last_name: otherData.lastName,
            first_name_kana: otherData.furiFirstName,
            last_name_kana: otherData.furiLastName,
            mail_address: otherData.email,
            role: otherData.role,
        }
      
      // Update member data
      await updateMember(payload);
      
      // Submit images if any
      if (image_url && image_url.length > 0) {
        await imageSubmit(image_url);
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      addToast({
        message: '更新に失敗しました',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false); // End submit loading
    }
  };

  const updateMember = async (payload:any) => {
    try {
      let updateResult;
      let id;
      if(member_id && member_id !==undefined){
        id = member_id;
        updateResult = await dispatch(updateDetailedMember({id,payload}));
      }else if(isLoginUserProfilePage && employeeId){
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
      }else if(updateDetailedMember.rejected.match(updateResult)){
        addToast({
          message: 'fail to update',
          type: 'error',
        });
        setLoading(false);
        throw new Error('Update failed'); // Throw error to be caught in onSubmit
      }
    } catch (err) {
      console.error('Error updating member:', err);
      throw err; // Re-throw to be handled in onSubmit
    }
  };

  const fetchDetailMember = async () => {
    setIsImageLoading(true);
    setImageInitialValue([]); // Clear images immediately when starting fetch
    
    try {
      if(member_id && member_id !== undefined){
        const id = member_id;
        await dispatch(fetchDetailedMember(id));
      }
      else if(isLoginUserProfilePage && employeeId){
        const id = employeeId;
        await dispatch(fetchDetailedMember(id));
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      // Keep loading state until data is processed in useEffect
    }
  };
  
  // Handle route changes and member_id changes
  useEffect(() => {
    // Reset all state when member_id changes or component mounts
    setIsImageLoading(true);
    setImageInitialValue([]);
    setRegisterTimeStamp('');
    setIsEdit(false);
    setIsSubmitting(false);
    
    // Generate new component key to force re-mount of ImagesUploader
    const newKey = `${member_id || employeeId}-${Date.now()}`;
    setComponentKey(newKey);
    
    // Fetch new member data
    fetchDetailMember();
    
    return () => {
      // Cleanup when route changes
      setIsImageLoading(false);
      setImageInitialValue([]);
      setRegisterTimeStamp('');
      setIsEdit(false);
      setIsSubmitting(false);
    };
  }, [member_id, isLoginUserProfilePage]); 

  // Handle additional updates
  useEffect(() => {
    if (updateStatus || profileUploadStatus) {
      fetchDetailMember();
    }
  }, [updateStatus, profileUploadStatus]);

  useEffect(() => {
  if (detailMemberData) {
    // Set form field values
    setValue('firstName', detailMemberData?.first_name);
    setValue('lastName', detailMemberData?.last_name);
    setValue('furiFirstName', detailMemberData?.first_name_kana);
    setValue('furiLastName', detailMemberData?.last_name_kana);
    setValue('email', detailMemberData?.mail_address);
    setValue('role', detailMemberData?.role);
    
    // Set image data - don't set loading to false immediately
    const imageUrl = detailMemberData?.image_url;
    const hasValidImage = imageUrl !== null && imageUrl !== 'null' && imageUrl !== undefined;
    
    // Keep loading true for a bit longer to allow ImagesUploader to handle its own loading
    setTimeout(() => {
      setImageInitialValue(hasValidImage ? [imageUrl] : []);
      
      // Only set loading to false after images are processed
      setTimeout(() => {
        setIsImageLoading(false);
      }, 100);
    }, 50);
    
    setRegisterTimeStamp(detailMemberData?.register_timestamp);
    
    // Check if user is allowed to edit this profile
    const isAdmin = role === 'admin';
    const isOwnProfile = isLoginUserProfilePage || (String(detailMemberData?.member_id) === String(employeeId || ''));
    
    // Set edit permission based on role and profile ownership
    setIsEdit(isAdmin || isOwnProfile);
  }
}, [detailMemberData, role, clientId, isLoginUserProfilePage, setValue]);

  // Cleanup when component unmounts (when leaving the page)
  useEffect(() => {
    return () => {
      // Clear all state when component unmounts
      clearAllState();
    };
  }, [clearAllState]);

  // Cleanup when browser tab/window is closed or refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearAllState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearAllState();
    };
  }, [clearAllState]);

  const handleChangePassword = async() => {
    try {
      const sendingMailResult = await dispatch(sendEmail(detailMemberData?.mail_address));
      const requestStatus = await sendingMailResult?.meta?.requestStatus as any;
      if(requestStatus==="fulfilled"){
        addToast({
          message: 'メールを正常に送信いたしました。',
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Error changing status', err);
    }
  };

  const imageSubmit = async (data: any) => {
    // Set image loading to true when starting submission
    setIsImageLoading(true);
    
    const formData = new FormData();
    let imageData = '';
    try{
      await Promise.all(
        data?.map(async (file: any) => {
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
      }else if(isLoginUserProfilePage && employeeId){
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
        setProfileUploadStatus(!profileUploadStatus)
      } else if(profileResult?.meta?.requestStatus==='rejected') {
        throw new Error('Image upload failed');
      }
    }
    catch(e){
      console.error('Image submit error:', e);
      throw e;
    } finally {
      // Keep loading for a bit longer to ensure smooth transition
      setTimeout(() => {
        setIsImageLoading(false);
      }, 500);
    }
  };

  return (
    <Box py={3}>
      <SectionTitle title='プロフィール' />
      <Box py={3} sx={{display: 'flex',flexDirection:'row'}}>
        <form onSubmit={handleSubmit(onSubmit)} style={{display:'flex',width: '100%'}}>
        <Box sx={{width: '33.33%', height: '300px', }}>
         <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between', height: '100%'}}>
          <Box className='imageWrapper'>
             <ImagesUploader
                key={componentKey}
                name="image_url"
                memberId={member_id || employeeId || undefined}
                initialImages={imageInitialValue}
                setValue={setValue}
                register={register}
                onImagesDeleted={handleImagesDeleted}
                update={detailMemberData && (detailMemberData?.image_url === 'null' || detailMemberData?.image_url === null) && 'true'}
                showLabel='false'
                isLoading={isImageLoading} // Add this prop
              />
          </Box>
          </div>
        </Box>
        <div className='formStyle'>
          <Box sx={{maxWidth: '516px', height: '100%', display:'flex', flexDirection:'column',alignItems:'flex-end'}}>
          <CustomTwoColInputGroup
            label="名前"
            firstName="firstName"
            lastName="lastName"
            placeholderOne="佐藤"
            placeholderTwo="太郎"
            validationMessageFirstName="姓は必須です"
            validationMessageLastName="お名前(名)は必須です"
            register={register}
            errors={errors}
            disabled={!isEdit || isSubmitting} // Disable during submit
          />
          <CustomTwoColInputGroup
            label="フリガナ"
            firstName="furiFirstName"
            lastName="furiLastName"
            validationMessageFirstName="フリガナ 姓が必要です"
            validationMessageLastName="フリガナ ファーストネームが必要です"
            placeholderOne="サトウ"
            placeholderTwo="タロウ"
            register={register}
            errors={errors}
            disabled={!isEdit || isSubmitting} // Disable during submit
          />
          <CustomCheckbox
            fieldName="role"
            label="権限"
            value={role === 'admin'? true : false}
            onChange={() => {}}
            // disabled={role !== 'admin' || !isEdit || isSubmitting} // Disable during submit
          />
          <CustomFullWidthInputGroup
            label="メール"
            name="email"
            placeholder=""
            register={register}
            errors={errors}
            disabled={!isEdit || isSubmitting} // Disable during submit
          />
          { member_id === undefined && 
          <div className='radioFormControl'>
            <p className='dummyText'></p>
            <Box sx={{width: '374px', display: 'flex', justifyContent: 'flex-start'}}>
              <CustomButton
                label="パスワードを変更する"
                type='button'
                onClick={handleChangePassword}
                className='changePasswordBtn'
                disabled={isSubmitting} // Disable during submit
              />  
            </Box>
          </div>
          }
          </Box>
          <Box sx={{display: 'flex',justifyContent:'center',gap:'10px'}}>
                <>
                  <CustomButton
                    label="登録"
                    disabled={!isEdit || isSubmitting}
                    type='submit'
                    isLoading={isSubmitting} // Show loading spinner during submit
                  />
                  <CustomButton
                    label="戻る"
                    onClick={handleCancelEditClick}
                    buttonCategory='cancel'
                    disabled={isSubmitting} // Disable during submit
                  />
                </>
          </Box>
        </div>
        </form>
      </Box>
      {toasts}
    </Box>
  )
}
 
export default MemberUpdate