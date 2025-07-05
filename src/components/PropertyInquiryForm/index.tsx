import { Box, Typography, useMediaQuery} from "@mui/material"
import SectionTitle from "../SectionTitle"
import { useForm } from "react-hook-form";
import CustomFullWidthInputGroup from "../CustomFullWidthInputGroup";
import CustomFullWidthSelectInputGroup from "../CustomFullWidthSelectInputGroup";
import CustomButton from "../CustomButton";
import { useEffect, useState } from "react";
import CustomTwoColInputGroup from "../CustomTwoColInputGroup";
import CustomRadioGroup from "../CustomRadio";
import { PropertyFormProps } from "../../types";
import { FormImagesUploader } from "../FormImagesUploader";
import { createPropertyInquiry, updatePropertyInquiry } from "../../store/propertiesInquiriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { useToast } from "../Toastify";
import { getPropertyNames } from "../../store/propertiesSlice";
import { getEmployeeNames } from "../../store/employeeSlice";
 
const PropertyInquiryForm = ({ defaultValues, formType='create' }: PropertyFormProps,) => {
    const {register, control, handleSubmit,setValue,getFieldState,  formState,reset} = useForm({
        defaultValues: defaultValues || {
            role: 'general',
          },
        mode: "onChange"
    });
    const { errors,isValid,isDirty } = formState;
    const leftInputContainerWidth = '338px';
    // const [deletePaths,setDeletePaths] = useState<boolean>(false)
    const [, setPropertyFileData] = useState<any>([]);
    const [deletedImagePathsFront, setDeletedImagePathsFront] = useState<any>("");
    const [deletedImagePathsBack, setDeletedImagePathsBack] = useState<any>("");
    const dispatch = useDispatch<AppDispatch>()
    const { addToast, toasts } = useToast();
    const [isFormValid, setIsFormValid] = useState(false);
    const {loading} = useSelector((state: any) => state.propertiesInquiries.new);
    const {loading: updateLoading} = useSelector((state: any) => state.propertiesInquiries.detailed);
    const [propertiesName, setPropertiesName] = useState<any>([])
    const [customerId, setCustomerId]= useState('');
    const [customerCreatedAt, setCustomerCreatedAt] = useState('');
    const [inquiryCreatedAt, setInquiryCreatedAt] = useState('');
    const {data: employeesNameData} = useSelector((state: any) => state.employees.names);
    const [managersName, setManagersName] = useState([])
    const isMobile = useMediaQuery('(max-width:600px)');

    const area = [
        { value: '01', label: '北海道' },
        { value: '02', label: '青森県' },
        { value: '03', label: '岩手県' },
        { value: '04', label: '宮城県' },
        { value: '05', label: '秋田県' },
        { value: '06', label: '山形県' },
        { value: '07', label: '福島県' },
        { value: '08', label: '茨城県' },
        { value: '09', label: '栃木県' },
        { value: '10', label: '群馬県' },
        { value: '11', label: '埼玉県' },
        { value: '12', label: '千葉県' },
        { value: '13', label: '東京都' },
        { value: '14', label: '神奈川県' },
        { value: '15', label: '新潟県' },
        { value: '16', label: '富山県' },
        { value: '17', label: '石川県' },
        { value: '18', label: '福井県' },
        { value: '19', label: '山梨県' },
        { value: '20', label: '長野県' },
        { value: '21', label: '岐阜県' },
        { value: '22', label: '静岡県' },
        { value: '23', label: '愛知県' },
        { value: '24', label: '三重県' },
        { value: '25', label: '滋賀県' },
        { value: '26', label: '京都府' },
        { value: '27', label: '大阪府' },
        { value: '28', label: '兵庫県' },
        { value: '29', label: '奈良県' },
        { value: '30', label: '和歌山県' },
        { value: '31', label: '鳥取県' },
        { value: '32', label: '島根県' },
        { value: '33', label: '岡山県' },
        { value: '34', label: '広島県' },
        { value: '35', label: '山口県' },
        { value: '36', label: '徳島県' },
        { value: '37', label: '香川県' },
        { value: '38', label: '愛媛県' },
        { value: '39', label: '高知県' },
        { value: '40', label: '福岡県' },
        { value: '41', label: '佐賀県' },
        { value: '42', label: '長崎県' },
        { value: '43', label: '熊本県' },
        { value: '44', label: '大分県' },
        { value: '45', label: '宮崎県' },
        { value: '46', label: '鹿児島県' },
        { value: '47', label: '沖縄県' },
      ];

    // const inquiryMethods = [
    //     { value: '空き状況の確認', label: '空き状況の確認' },
    //     { value: '賃料・価格について', label: '賃料・価格について' },
    //     { value: '内見希望', label: '内見希望' },
    //     { value: '物件の詳細情報（設備、周辺環境など）', label: '物件の詳細情報（設備、周辺環境など）' },
    // ]

    const categories = [
        { value: 'お問い合わせ', label: 'お問い合わせ' },
        { value: '商談', label: '商談' },
        { value: '内見', label: '内見' },
    ]

    const inquiryTypes = [
        { value: '空室確認', label: '空室確認' },
        { value: '内見希望', label: '内見希望' },
        { value: '資料請求', label: '資料請求' },
        { value: '条件の相談', label: '条件の相談' },
        { value: '申込希望', label: '申込希望' },
        { value: '入居・契約に関する質問', label: '入居・契約に関する質問' },
        { value: 'ペット可否の確認', label: 'ペット可否の確認' },
        { value: '楽器使用の可否確認', label: '楽器使用の可否確認' },
        // { value: '04', label: '楽器使用の可否確認' },
        { value: 'その他のお問い合わせ', label: 'その他のお問い合わせ' },
    ]
    const contactTypes = [
        { value: 'SUUMO', label: 'SUMMO' },
        { value: '電話', label: '電話' },
        { value: 'その他', label: 'その他' },
    ]

    const fetchEmployeeName = async () => {
      try {
         await dispatch(getEmployeeNames('99'));
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };

    useEffect(() => {
      fetchEmployeeName()
    }, []);

    useEffect(()=>{
      if(employeesNameData){
        const transformedArray = employeesNameData.map((user:any) => ({
          value: user.id,
          label: `${user.first_name} ${user.family_name}`,
        }));
        setManagersName(transformedArray)
      }
    },[employeesNameData])

    const getPropertiesName = async()=>{
      const nameResult = await dispatch(getPropertyNames('ddd'))
      // setPropertiesName(nameResult?.payload);
      // const projectOptions = [];
      if (nameResult && Array.isArray(nameResult.payload)) {
        const options = nameResult.payload.map(item => ({
          value: item.name,
          label: item.name
        }));
        setPropertiesName(options);
      } else {
        setPropertiesName([]); // fallback if payload is missing
        console.warn("No valid payload received:", nameResult);
      }
    }

    useEffect(()=>{
      getPropertiesName()
    },[])

    const firstNameState = getFieldState("first_name",formState);
    const lastNameState = getFieldState("last_name",formState);
    const firstNameKanaState = getFieldState("first_name_kana",formState);
    const lastNameKanaState = getFieldState("last_name_kana",formState);
    const birthdayState = getFieldState("birthday",formState);
    const mailState = getFieldState( "mail_address" ,formState);
    const phoneState = getFieldState( "phone_number" ,formState);
    const managerState = getFieldState( "manager" ,formState);

    useEffect(() => {
        const customIsValid = !firstNameState.error && !lastNameState.error && !firstNameKanaState.error &&
        !lastNameKanaState.error && !birthdayState.error && !mailState.error && !phoneState.error && !managerState.error;
    
        setIsFormValid(customIsValid);
    }, [firstNameState, lastNameState,firstNameKanaState,lastNameKanaState,birthdayState,mailState,phoneState,managerState]);

    useEffect(() => {
        // if (defaultValues) {
        //   reset(defaultValues);
        // }
        if (defaultValues) {
            const inquiry = defaultValues;
            const customer = inquiry?.customer;
            const property = inquiry?.property;
            setCustomerId(inquiry?.customer_id);
            setCustomerCreatedAt(customer?.created_at);
            setInquiryCreatedAt(inquiry?.created_at);
            const defaults = {
              first_name: customer?.first_name || '',
              last_name: customer?.last_name || '',
              first_name_kana: customer?.first_name_kana || '',
              last_name_kana: customer?.last_name_kana || '',
              birthday: customer?.birthday || '',
              gender: customer?.gender || '',
              mail_address: customer?.mail_address || '',
              phone_number: customer?.phone_number || '',
              manager: inquiry?.employee_id || '',
              id_card_back: customer?.id_card_back || '',
              id_card_front: customer?.id_card_front || '',
              employee_id: customer?.employee_id || '',
        
              postcode: customer?.postcode || '',
              prefecture: customer?.prefecture || '',
              city: customer?.city || '',
              street_address: customer?.street_address || '',
              building_room_and_number: customer?.building_room_and_number || '',
        
              method: inquiry?.method || '',
              category: inquiry?.category || '',
              type: inquiry?.type || '',
              summary: inquiry?.summary || '',
              property_name: property?.name || '',
            };
            reset(defaults);
          }

    }, [defaultValues, reset]);
    

    useEffect(() => {
        setIsFormValid(isValid && isDirty);
    }, [isValid, isDirty]);

    const createPropertyInquiries = async (uploadFormData:any) => {
            try {
              const registeredResult = await dispatch(
                createPropertyInquiry(uploadFormData),
              );
              if (createPropertyInquiry.fulfilled.match(registeredResult)) {
                const responseData = registeredResult.payload as any;
                const linkId = responseData?.id || '';
                const linkName = responseData?.name || '';
                addToast({
                  message: '登録完了 。',
                  type: 'success',
                  linkId,
                  linkName,
                });
              } else if (createPropertyInquiry.rejected.match(registeredResult)) {
                const responseData = registeredResult.payload as any;
                const message = responseData?.message;
                addToast({
                  message: message,
                  type: 'error',
                });
              }
            } catch (err) {
              console.error('Error creating properties:', err);
            }
          };

          const updatePropertyInquiries = async (uploadFormData:any) => {
            const id = customerId;
            try {
              const updateResult = await dispatch(
                updatePropertyInquiry({id,uploadFormData}),
              );
              if (updatePropertyInquiry.fulfilled.match(updateResult)) {
                const responseData = updateResult.payload as any;
                const linkId = responseData?.id || '';
                const linkName = responseData?.name || '';
                addToast({
                  message: '登録完了 。',
                  type: 'success',
                  linkId,
                  linkName,
                });
              } else if (updatePropertyInquiry.rejected.match(updateResult)) {
                const responseData = updateResult.payload as any;
                const message = responseData?.message;
                addToast({
                  message: message,
                  type: 'error',
                });
              }
            } catch (err) {
              console.error('Error creating properties:', err);
            }
          };

        const handleFormSubmit = async (data:any) => {
            let rest: any = {};
            let id_card_front: any;
            let id_card_back: any;

            if(formType==='update'){
               ({ id_card_front, id_card_back, ...rest } = data);
            }else{
                rest = data;
            }

            
            const formData = new FormData();
    
            Object.entries(rest).forEach(([key, value]:any) => {
                formData.append(key, value);
              });
            // formData.append('property_name',propertyName);
    
              if (formType === 'update') {
                const processSingleImageField = async (
                  fieldName: string,
                  value: string | { file: File },
                  deletedPaths: string[]
                ) => {
                  if (deletedPaths.includes(fieldName) && typeof value === 'string') {
                    return ''; 
                  }
              
                  if (typeof value === 'string') {
                    try {
                      const base64Data = await value;
                      return typeof base64Data === 'string' ? base64Data : '';
                    } catch (error) {
                      console.error('Failed to convert image to base64:', error);
                      return '';
                    }
                  }
              
                  return value;
                };
              
                const frontImage = await processSingleImageField(
                  'id_card_front',
                  id_card_front,
                  deletedImagePathsFront || ""
                );
              
                const backImage = await processSingleImageField(
                  'id_card_back',
                  id_card_back,
                  deletedImagePathsBack || ""
                );
              
                formData.append('id_card_front', frontImage ? JSON.stringify(frontImage) : '');
                formData.append('id_card_back', backImage ? JSON.stringify(backImage) : '');
                formData.append('customer_created_at',customerCreatedAt);
                formData.append('inquiry_created_at',inquiryCreatedAt);
              }
    
            if(formType==='update'){
                updatePropertyInquiries(formData)
            }else{
                createPropertyInquiries(formData)
            }
        };

        const handleImagesDeleted = (
            fieldName: string,
            deletedPaths: string[]
          ) => {
            if (deletedPaths.length > 0) {
              setPropertyFileData((prevData: any) => {
                const updatedFiles = prevData?.filter(
                  (data: any) =>
                    !(data?.fieldName === fieldName && deletedPaths.includes(data?.image_urls))
                );
          
                const remainingFile = updatedFiles?.find(
                  (data: any) => data?.fieldName === fieldName
                );

                setValue(fieldName, remainingFile?.image_urls || "");
          
                return updatedFiles;
              });
          
              if (fieldName === "id_card_front") {
                setDeletedImagePathsFront((prev: string[]) => [...prev, ...deletedPaths]);
              } else if (fieldName === "id_card_back") {
                setDeletedImagePathsBack((prev: string[]) => [...prev, ...deletedPaths]);
              }
            }
          };
          
  return (
    <>
    <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{mb: 5}} className={`properties ${isMobile?'sp':''}`}>
            <SectionTitle title={formType==='create'?'顧客新規登録':'顧客新規'}  />
            <Box className='propertiesFormInputsGroup' sx={{my:2, maxWidth: '100%', pl: {lg: 5, xs: 0}}}>
                <CustomTwoColInputGroup
                    label="氏名"
                    firstName='first_name'
                    lastName='last_name'
                    placeholderOne="氏"
                    placeholderTwo="名"
                    validationMessageFirstName="名前は必須です"
                    validationMessageLastName="姓は必須です"
                    register={register}
                    errors={errors}
                    isRequired={true}
                    labelWidth={leftInputContainerWidth}
                    isModalInput={false}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomTwoColInputGroup
                    label="フリガナ"
                    firstName='first_name_kana'
                    lastName='last_name_kana'
                    placeholderOne="ミョウジ"
                    placeholderTwo="ナマエ"
                    register={register}
                    errors={errors}
                    isRequired={false}
                    labelWidth={leftInputContainerWidth}
                    isModalInput={false}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthInputGroup
                    label="生年月日"
                    name="birthday"
                    type='text'
                    placeholder=""
                    register={register}
                    isRequired
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />

                <Box sx={{
                  display: "block !important",  // Force block display
                  width: "100%",
                  my: 1,
                }}>
                  <Typography sx={{
                    fontSize: {xs: '10px !important',sm: '12px !important'},
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap', 
                    width: {lg: '100%', xs: '100%'}, 
                    alignItems: 'center',
                    }}>性別</Typography>
                  <CustomRadioGroup
                    name="gender"
                    control={control}
                    label=""
                    options={[
                      { label: "男性", value: "male" },
                      { label: "女性", value: "female" },
                      { label: "設定しない", value: "other" }
                    ]}
                    containerStyle={{ marginBottom: "0px !important", width: 'inherit', mt: 1 }}
                  />
                </Box>
                {/* <CustomRadioGroup
                    name="gender"
                    defaultValue={'male'}
                    control={control}
                    label="性別"
                    options={[
                        { label: "男性", value: "male" },
                        { label: "女性", value: "female" },
                        { label: "設定しない", value: "other" }
                      ]}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                /> */}
                <CustomFullWidthInputGroup
                    label="メール"
                    name="mail_address"
                    type='text'
                    placeholder="メールアドレス"
                    register={register}
                    isRequired
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthInputGroup
                    label="電話番号"
                    name="phone_number"
                    type='text'
                    placeholder="12345678900(ハイフンなし)"
                    register={register}
                    isRequired
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthSelectInputGroup
                    label="担当者"
                    name="employee_id"
                    control={control}
                    placeholder="選択してください。"
                    register={register}
                    errors={errors}
                    isRequired
                    options={managersName}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
            </Box>
        </Box>
        <Box sx={{mb: 5}}>
            <SectionTitle title='現住所' />
            <Box className='propertiesFormInputsGroup' sx={{my:2, maxWidth: '100%', pl: {lg: 5, xs: 0}}}>
                <CustomFullWidthInputGroup
                    label="郵便番号"
                    name="postcode"
                    type='text'
                    placeholder="123456"
                    register={register}
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthSelectInputGroup
                    label="都道府県"
                    name="prefecture"
                    control={control}
                    placeholder="選択してください。"
                    register={register}
                    errors={errors}
                    options={area}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthInputGroup
                    label="市区町村"
                    name="city"
                    type='text'
                    placeholder=""
                    register={register}
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthInputGroup
                    label="番地・区画"
                    name="street_address"
                    type='text'
                    placeholder=""
                    register={register}
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthInputGroup
                    label="建物名、部屋番号"
                    name="building_and_room_number"
                    type='text'
                    placeholder=""
                    register={register}
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
            </Box>
        </Box>
        <Box sx={{mb: 5}}>
            <SectionTitle title='お問い合わせ内容' />
            <Box className='propertiesFormInputsGroup' sx={{my:2, maxWidth: '100%', pl: {lg: 5, xs: 0}}}>
                <CustomFullWidthSelectInputGroup
                    label="お問い合わせ物件"
                    name="property_name"
                    control={control}
                    placeholder="選択してください。"
                    register={register}
                    errors={errors}
                    isRequired={true}
                    options={propertiesName}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthSelectInputGroup
                    label="カテゴリ"
                    name="category"
                    control={control}
                    placeholder="お問い合わせ"
                    register={register}
                    errors={errors}
                    options={categories}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthSelectInputGroup
                    label="お問い合わせ種別"
                    name="type"
                    control={control}
                    placeholder="選択してください。"
                    register={register}
                    errors={errors}
                    options={inquiryTypes}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthSelectInputGroup
                    label="お問い合わせ方法"
                    name="method"
                    control={control}
                    placeholder="選択してください。"
                    register={register}
                    errors={errors}
                    options={contactTypes}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
                <CustomFullWidthInputGroup
                    label="お問い合わせ内容"
                    name="summary"
                    type='text'
                    placeholder=""
                    register={register}
                    errors={errors}
                    isModalInput={false}
                    labelWidth={leftInputContainerWidth}
                    labelWidthSp={'47%'}
                    multiline={true}
                    rows={3}
                    inputWidth={leftInputContainerWidth}
                    inputWidthSp={'100%'}
                />
            </Box>
        </Box> 
        {
            formType==='update' && 
            <>
            <Box sx={{mb: 5}}>
                <SectionTitle title='身分証明書（うら）' />
                <Box className='propertiesFormInputsGroup' sx={{my:2, maxWidth: '100%', pl: {lg: 5, xs: 0}}}>
                    <Box sx={{marginTop: '18px'}}>
                        <FormImagesUploader
                        name="id_card_back"
                        setValue={setValue}
                        register={register}
                        initialImages={defaultValues?.customer?.id_card_back && defaultValues?.customer?.id_card_back!=='' ? defaultValues?.customer?.id_card_back : ''}
                        type='single'
                        onImagesDeleted={(paths) => handleImagesDeleted('id_card_back', paths)}
                        />
                    </Box>
                </Box>
            </Box>
            <Box sx={{mb: 5}}>
                <SectionTitle title='身分証明書（おもて）' />
                <Box className='propertiesFormInputsGroup' sx={{my:2, maxWidth: '100%', pl: {lg: 5, xs: 0}}}>
                    <Box sx={{marginTop: '18px'}}>
                        <FormImagesUploader
                        name="id_card_front"
                        setValue={setValue}
                        register={register}
                        // initialImages={[]}
                        initialImages={defaultValues?.customer?.id_card_front || ''}
                        type='single'
                        onImagesDeleted={(paths) => handleImagesDeleted('id_card_front', paths)}
                        />
                    </Box>
                </Box>
            </Box>
            </>
        }
        <div style={{background: '#F7FBFD', display: 'flex', justifyContent: 'center', width: 'calc(100% + 46px)',
            padding: '10px 0',position: 'sticky',bottom: '0',marginLeft: '-22px',
            marginRight: '-24px'}}>
            <CustomButton
                sx={{width: {lg: '100px', xs: '80px'}}}
                label={`${formType==='update'?'保存':"登録"}`}
                type='submit' 
                disabled={formType === 'update' ? (!isDirty) : (!isFormValid && !isDirty)} 
                isLoading={formType !== 'update' ? loading : updateLoading}
            />
        </div>  
        </form>
        {toasts}
    </>
  )
}
 
export default PropertyInquiryForm