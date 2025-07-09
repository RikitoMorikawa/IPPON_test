import { Box, Typography } from "@mui/material";
import SectionTitle from "../SectionTitle";
import { useFieldArray, useForm } from "react-hook-form";
import CustomFullWidthInputGroup from "../CustomFullWidthInputGroup";
import CustomFullWidthSelectInputGroup from "../CustomFullWidthSelectInputGroup";
import CustomButton from "../CustomButton";
import { useEffect, useState } from "react";
import CustomTwoColInputGroup from "../CustomTwoColInputGroup";
import { PropertyFormProps } from "../../types";
import { useToast } from "../Toastify";
import { FormImagesUploader } from "../FormImagesUploader";
import { createProperty, updateProperty } from "../../store/propertiesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import CustomTextField from "../CustomTextField";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router";
import { RequireIcon } from "../../common/icons";
import CustomDateTimePicker from "../CustomDateTimePicker";
import { Controller } from "react-hook-form";
import PostalCodeAutoAddressInput from "../PostalCodeAutoAddressInput";
export const readFileAsBase64 = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const PropertyForm = ({ defaultValues, formType }: PropertyFormProps) => {
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    getFieldState,
    setValue,
    formState,
    reset,
  } = useForm({
    defaultValues: defaultValues || {
      nearest_stations: [{ line_name: "", station_name: "", walk_minutes: "" }],
    },
    mode: "onChange",
  });
  const { errors, isDirty } = formState;
  const leftInputContainerWidth = "338px";
  const [deletePaths, setDeletePaths] = useState<boolean>(false);
  // const [showCalendar, setShowCalendar] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultValues?.details?.type || "土地"
  );
  //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { addToast, toasts } = useToast();
  const [imagesToShow, setImagesToShow] = useState(defaultValues?.image_urls);
  const [propertyFileData, setPropertyFileData] = useState<any>([]);
  const [deletedImagePaths, setDeletedImagePaths] = useState<any>([]);
  const { loading } = useSelector((state: any) => state.properties.new);
  const { loading: updateLoading } = useSelector(
    (state: any) => state.properties.detailed
  );
  const Types = [
    { value: "土地", label: "土地" },
    { value: "マンション", label: "マンション" },
    { value: "新築", label: "新築" },
  ];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nearest_stations",
  });

  const typeState = getFieldState("type", formState);
  const propertyNameState = getFieldState("name", formState);
  const postCodeState = getFieldState("postal_code", formState);
  const prefectureState = getFieldState("prefecture", formState);
  const cityState = getFieldState("city", formState);
  const salePriceState = getFieldState("price", formState);

  useEffect(() => {
    const customIsValid =
      !typeState.error &&
      !propertyNameState.error &&
      !postCodeState.error &&
      !prefectureState.error &&
      !cityState.error &&
      !salePriceState.error;

    setIsFormValid(customIsValid);
  }, [
    typeState,
    propertyNameState,
    postCodeState,
    prefectureState,
    cityState,
    salePriceState,
  ]);

  useEffect(() => {
    if (!defaultValues) return;

    const {
      nearest_stations = [],
      details = {},
      image_urls = [],
      ...rest
    } = defaultValues;

    // Determine the selected category
    const selectedDetailCategory = defaultValues.type || "土地";
    setSelectedCategory(selectedDetailCategory);
    setValue("type", selectedDetailCategory);

    // Construct the details object based on the selected category
    let formattedDetails = {};

    if (selectedDetailCategory === "マンション") {
      formattedDetails = {
        private_area: details.private_area || "",
        balcony_area: details.balcony_area || "",
        layout: details.layout || "",
        total_units: details.total_units || "",
        management_fee: details.management_fee || "",
        repair_fund: details.repair_fund || "",
        community_fee: details.community_fee || "",
        parking: details.parking || "",
        management_type: details.management_type || "",
        structure: details.structure || "",
        built_year: details.built_year || "",
      };
    } else if (selectedDetailCategory === "新築") {
      formattedDetails = {
        land_area: details.land_area || "",
        floor_area: details.floor_area || "",
        layout: details.layout || "",
        structure: details.structure || "",
        land_rights: details.land_rights || "",
        land_category: details.land_category || "",
        topography: details.topography || "",
        usage_zone: details.usage_zone || "",
        building_coverage: details.building_coverage || "",
        floor_area_ratio: details.floor_area_ratio || "",
        road_situation: details.road_situation || "",
        facilities: details.facilities || "",
        school_area: details.school_area || "",
        built_year: details.built_year || "",
      };
    } else {
      formattedDetails = {
        land_area: details.land_area || "",
        land_rights: details.land_rights || "",
        land_category: details.land_category || "",
        usage_zone: details.usage_zone || "",
        building_coverage: details.building_coverage || "",
        floor_area_ratio: details.floor_area_ratio || "",
        road_situation: details.road_situation || "",
      };
    }

    if (image_urls && Array.isArray(image_urls)) {
      const images = image_urls.map((image: any) => ({
        base64: image.image_urls || "",
      }));
      images.forEach((image, index) => {
        setValue(`images[${index}].base64`, image.base64);
      });

      setImagesToShow(images);
    }

    // Reset the form with the combined values
    reset({
      ...rest,
      image_urls: imagesToShow,
      type: selectedDetailCategory,
      nearest_stations: nearest_stations.length
        ? nearest_stations
        : [{ line_name: "", station_name: "", walk_minutes: "" }],
      ...formattedDetails,
    });
  }, [defaultValues, formType, reset]);

  const area = [
    { value: "01", label: "北海道" },
    { value: "02", label: "青森県" },
    { value: "03", label: "岩手県" },
    { value: "04", label: "宮城県" },
    { value: "05", label: "秋田県" },
    { value: "06", label: "山形県" },
    { value: "07", label: "福島県" },
    { value: "08", label: "茨城県" },
    { value: "09", label: "栃木県" },
    { value: "10", label: "群馬県" },
    { value: "11", label: "埼玉県" },
    { value: "12", label: "千葉県" },
    { value: "13", label: "東京都" },
    { value: "14", label: "神奈川県" },
    { value: "15", label: "新潟県" },
    { value: "16", label: "富山県" },
    { value: "17", label: "石川県" },
    { value: "18", label: "福井県" },
    { value: "19", label: "山梨県" },
    { value: "20", label: "長野県" },
    { value: "21", label: "岐阜県" },
    { value: "22", label: "静岡県" },
    { value: "23", label: "愛知県" },
    { value: "24", label: "三重県" },
    { value: "25", label: "滋賀県" },
    { value: "26", label: "京都府" },
    { value: "27", label: "大阪府" },
    { value: "28", label: "兵庫県" },
    { value: "29", label: "奈良県" },
    { value: "30", label: "和歌山県" },
    { value: "31", label: "鳥取県" },
    { value: "32", label: "島根県" },
    { value: "33", label: "岡山県" },
    { value: "34", label: "広島県" },
    { value: "35", label: "山口県" },
    { value: "36", label: "徳島県" },
    { value: "37", label: "香川県" },
    { value: "38", label: "愛媛県" },
    { value: "39", label: "高知県" },
    { value: "40", label: "福岡県" },
    { value: "41", label: "佐賀県" },
    { value: "42", label: "長崎県" },
    { value: "43", label: "熊本県" },
    { value: "44", label: "大分県" },
    { value: "45", label: "宮崎県" },
    { value: "46", label: "鹿児島県" },
    { value: "47", label: "沖縄県" },
  ];
  const handleImagesDeleted = (deletedPaths: any) => {
    setDeletePaths(true);
    if (deletedPaths.length > 0) {
      setPropertyFileData(() => {
        const filterPropertiesFile = defaultValues?.image_urls?.filter(
          (data: any) => !deletedPaths?.includes(data?.image_urls)
        );

        return filterPropertiesFile;
      });
    } else {
      setPropertyFileData(defaultValues?.image_urls);
    }
    setDeletedImagePaths((prev: any) => [...prev, ...deletedPaths]);
  };

  const createProperties = async (uploadFormData: any) => {
    try {
      const registeredResult = await dispatch(createProperty(uploadFormData));
      if (createProperty.fulfilled.match(registeredResult)) {
        const responseData = registeredResult.payload as any;
        const linkId = responseData?.id || "";
        const linkName = responseData?.name || "";
        console.log("登録したデータ", responseData);
        addToast({
          message: "登録完了 。",
          type: "success",
          linkId,
          linkName,
        });
        navigate(`/properties/${linkId}`);
      } else if (createProperty.rejected.match(registeredResult)) {
        const responseData = registeredResult.payload as any;
        const message = responseData?.message;
        addToast({
          message: message,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error creating properties:", err);
    }
  };

  const updateProperties = async (uploadFormData: any) => {
    const id = defaultValues.id;
    try {
      const updatedResult = await dispatch(
        updateProperty({ id, uploadFormData })
      );
      if (updateProperty.fulfilled.match(updatedResult)) {
        const responseData = updatedResult.payload as any;
        const linkId = responseData?.id || "";
        const linkName = responseData?.name || "";
        addToast({
          message: "登録完了 。",
          type: "success",
          linkId,
          linkName,
        });
        navigate(`/properties`);
      } else if (updateProperty.rejected.match(updatedResult)) {
        const responseData = updatedResult.payload as any;
        const message = responseData.error[0];
        addToast({
          message: message,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error creating properties:", err);
    }
  };
  const handleFormSubmit = async (data: any) => {
    const { nearest_stations, image_urls, ...rest } = data;
    const imageFiles = image_urls;
    let details = {};
    if (selectedCategory === "マンション") {
      details = {
        private_area: rest.private_area,
        balcony_area: rest.balcony_area,
        layout: rest.layout,
        total_units: rest.total_units,
        management_fee: rest.management_fee,
        repair_fund: rest.repair_fund,
        community_fee: rest.community_fee,
        parking: rest.parking,
        management_type: rest.management_type,
        structure: rest.structure,
        built_year: rest.built_year,
      };
    } else if (selectedCategory === "新築") {
      details = {
        land_area: rest.land_area,
        floor_area: rest.floor_area,
        layout: rest.layout,
        structure: rest.structure,
        land_rights: rest.land_rights,
        land_category: rest.land_category,
        topography: rest.topography,
        usage_zone: rest.usage_zone,
        building_coverage: rest.building_coverage,
        floor_area_ratio: rest.floor_area_ratio,
        road_situation: rest.road_situation,
        facilities: rest.facilities,
        school_area: rest.school_area,
        built_year: rest.built_year,
      };
    } else {
      details = {
        land_area: rest.land_area,
        land_rights: rest.land_rights,
        land_category: rest.land_category,
        usage_zone: rest.usage_zone,
        building_coverage: rest.building_coverage,
        floor_area_ratio: rest.floor_area_ratio,
        road_situation: rest.road_situation,
      };
    }

    const formData = new FormData();
    formData.append("nearest_stations", JSON.stringify(nearest_stations));

    const detailKeys = Object.keys(details);
    detailKeys.forEach((key) => {
      //Remove duplicate keys from 'form'
      delete rest[key];
    });

    Object.entries(rest).forEach(([key, value]: any) => {
      formData.append(key, value);
    });
    formData.append("details", JSON.stringify(details));

    if (formType !== "update") {
      if (imageFiles) {
        // const base64Images = [] as any;
        // await Promise.all(
        //   imageFiles.map(async (file: any) => {
        //     try {
        //       const base64Data = await readFileAsBase64(file.file);
        //       if (typeof base64Data === 'string') {
        //         base64Images.push(base64Data.split(',')[1]);
        //       }
        //     } catch (error) {
        //       console.error('Error converting file to base64:', error);
        //     }
        //   }),
        // );
        formData.append("image_urls", JSON.stringify(imageFiles));
      }
    } else {
      let combinedPropertyFiles = [] as any;
      // const newImageFiles = imageFiles.filter(
      //     (file:any) => typeof file === 'object', // Ensures only new files are selected
      //   );
      const newImageFiles = imageFiles;
      const oldFiles =
        defaultValues.image_urls?.map((file: any) => file.image_urls) || [];

      const oldFilesAfterDeleted =
        propertyFileData?.map((file: any) => file.image_urls) || [];

      const remainingOldFiles = oldFiles.filter((file: any) =>
        oldFilesAfterDeleted.includes(file)
      );

      const remainOldFilesToSend =
        deletedImagePaths.length > 0 ? remainingOldFiles : oldFiles;

      // const base64Images = await Promise.all(
      // newImageFiles.map(async (file: any) => {
      //     try {
      //     const base64Data = await readFileAsBase64(file.file);
      //     return typeof base64Data === 'string'
      //         ? base64Data.split(',')[1]
      //         : null;
      //     } catch (error:any) {
      //     return error;
      //     }
      // }),
      // );

      // Filter any null values
      // const validBase64Images = base64Images.filter((image:any) => image !== null);

      // Merge old files and new images
      combinedPropertyFiles = [...remainOldFilesToSend, ...newImageFiles];

      //Handle empty files (if all deleted)
      if (deletedImagePaths.length > 0 && newImageFiles.length === 0) {
        combinedPropertyFiles = [];
      }
      formData.append("image_urls", JSON.stringify(combinedPropertyFiles));
    }

    if (formType === "update") {
      updateProperties(formData);
    } else {
      createProperties(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="properties">
      <Box sx={{ mb: 5 }}>
        <SectionTitle title="基本情報" />
        <Box
          className="propertiesFormInputsGroup"
          sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
        >
          <CustomFullWidthSelectInputGroup
            label="種別"
            name="type"
            control={control}
            placeholder="選択してください。"
            register={register}
            errors={errors}
            isRequired
            options={Types}
            onChangeValue={(val: any) => {
              setSelectedCategory(val);
            }}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthInputGroup
            label="物件名"
            name="name"
            type="text"
            placeholder=""
            register={register}
            isRequired
            errors={errors}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
        </Box>
      </Box>
      <Box sx={{ mb: 5 }}>
        <SectionTitle title="画像情報" />
        <Box sx={{ marginTop: "18px" }}>
          <FormImagesUploader
            name="image_urls"
            setValue={setValue}
            register={register}
            initialImages={imagesToShow}
            onImagesDeleted={handleImagesDeleted}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 5 }}>
        <SectionTitle title="所在地" />
        <Box
          className="propertiesFormInputsGroup"
          sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
        >
          <PostalCodeAutoAddressInput
            register={register}
            errors={errors}
            setValue={setValue}
            prefectureOptions={area}
            inputWidth={leftInputContainerWidth}
            inputWidthSp="100%"
            control={control}
          />

          {/* <CustomFullWidthInputGroup
            label="郵便番号"
            name="postal_code"
            type="number"
            placeholder="1234567(ハイフンなし)"
            register={register}
            isRequired
            errors={errors}
            min={7}
            max={10}
            minMessage="郵便番号は7桁です"
            maxMessage="郵便番号は7桁です"
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthSelectInputGroup
            label="都道府県"
            name="prefecture"
            control={control}
            placeholder="選択してください。"
            register={register}
            errors={errors}
            isRequired
            options={area}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthInputGroup
            label="市区町村"
            name="city"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isRequired
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          /> */}
          <CustomFullWidthInputGroup
            label="番地・区画"
            name="block_number"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isRequired
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthInputGroup
            label="建物名・部屋番号"
            name="building"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isRequired={false}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"40%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          {fields.map((field, index) => (
            <Box key={field.id}>
              {/* Desktop Layout - Your existing code unchanged */}
              <Box
                display={{ xs: "none", md: "flex" }}
                gap={2}
                alignItems="center"
              >
                <CustomTwoColInputGroup
                  label={index === 0 ? `最寄り駅` : ""}
                  firstName={`nearest_stations.${index}.line_name`}
                  lastName={`nearest_stations.${index}.station_name`}
                  placeholderOne="(例)東京メトロ日比谷線"
                  placeholderTwo="秋葉原駅"
                  register={register}
                  errors={errors}
                  index={index}
                  isRequired={false}
                  labelWidth={"leftInputContainerWidth"}
                  labelWidthSp={"47%"}
                  inputWidth={leftInputContainerWidth}
                  inputWidthSp={"100%"}
                  onRemove={() => remove(index)}
                />
                <Box
                  display="flex"
                  alignItems="center"
                  marginBottom={index == 0 ? 0 : "5px"}
                  mt={index == 0 ? 1.7 : 0}
                >
                  <Typography
                    align="right"
                    fontSize={12}
                    marginRight="20px"
                    color="#3E3E3E"
                    fontWeight={700}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "50px",
                    }}
                  >
                    まで徒歩
                  </Typography>
                  <CustomTextField
                    variant="outlined"
                    size="small"
                    {...register(`nearest_stations.${index}.walk_minutes`, {
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "数字のみを入力してください。",
                      },
                    })}
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ fontSize: "12px", color: "#3e3e3e" }}>
                          分
                        </Typography>
                      ),
                    }}
                    sx={{ width: 100 }}
                  />
                </Box>
              </Box>
              {/* Mobile Layout - Updated */}
              <Box sx={{ display: "flex", justifyContent: "end", mt: 2.5 }}>
                <Box
                  display={{ xs: "block", md: "none" }}
                  sx={{
                    border: "1px solid #E0E0E0",
                    borderRadius: "8px",
                    padding: "16px",
                    width: 192,
                    marginBottom: "16px",
                    backgroundColor: "#fff",
                    position: "relative",
                  }}
                >
                  {/* Header with title and remove button */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    {index === 0 && (
                      <Typography
                        fontSize={14}
                        color="#3E3E3E"
                        fontWeight={700}
                      >
                        最寄り駅
                      </Typography>
                    )}
                    {index > 0 && <Box />}
                    {fields.length > 1 && (
                      <Box
                        component="button"
                        type="button"
                        onClick={() => remove(index)}
                        sx={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          border: "1px solid #D9D9D9",
                          cursor: "pointer",
                          padding: "0",
                          background: "#fff",
                          fontSize: "14px",
                          color: "white",
                          lineHeight: 1,
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "&:hover": {
                            // backgroundColor: '#ff2222',
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <ClearIcon
                          sx={{ fontSize: "14px", color: "#D9D9D9" }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Line name input */}
                  <Box mb={2}>
                    <CustomTextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="(例)東京メトロ日比谷線"
                      {...register(`nearest_stations.${index}.line_name`)}
                    />
                  </Box>

                  {/* Station name input */}
                  <Box mb={2}>
                    <CustomTextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="秋葉原駅"
                      {...register(`nearest_stations.${index}.station_name`)}
                    />
                  </Box>

                  {/* Walking time section - Label outside input */}
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography
                      fontSize={12}
                      color="#3E3E3E"
                      fontWeight={700}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      まで徒歩
                    </Typography>
                    <CustomTextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`nearest_stations.${index}.walk_minutes`, {
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "数字のみを入力してください。",
                        },
                      })}
                      InputProps={{
                        endAdornment: (
                          <Typography
                            sx={{ fontSize: "12px", color: "#3e3e3e" }}
                          >
                            分
                          </Typography>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
          <Box sx={{ paddingLeft: "125px" }}>
            <Typography
              sx={{
                marginLeft: "18px",
                fontSize: "12px",
                cursor: "pointer",
                display: "inline",
                textDecoration: "underline",
              }}
              onClick={() => append({ line_name: "", station_name: "" })}
            >
              ＋駅名を追加
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mb: 5 }}>
        <SectionTitle title="オーナー情報" />
        <Box
          className="propertiesFormInputsGroup"
          sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
        >
          <CustomTwoColInputGroup
            label="氏名"
            firstName="owner_first_name"
            lastName="owner_last_name"
            placeholderOne="氏"
            placeholderTwo="名"
            validationMessageFirstName="所有者名は必須です"
            validationMessageLastName="所有者姓は必須です"
            register={register}
            errors={errors}
            isRequired={true}
            labelWidth={leftInputContainerWidth}
            isModalInput={false}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomTwoColInputGroup
            label="フリガナ"
            firstName="owner_first_name_kana"
            lastName="owner_last_name_kana"
            placeholderOne="ミョウジ"
            placeholderTwo="ナマエ"
            register={register}
            errors={errors}
            isRequired={false}
            labelWidth={leftInputContainerWidth}
            isModalInput={false}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <Box
            sx={{
              display: "block",
              width: "100%",
              marginBottom: 2,
            }}
          >
            <Typography
              color="#3E3E3E"
              fontWeight={700}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                fontSize: { xs: "10px", sm: "12px" },
                width: { xs: "40%", sm: "100px" },
              }}
            >
              売り出し開始日
              <span style={{ display: "flex" }}>
                <RequireIcon />
              </span>
            </Typography>
            <Controller
              name="sales_start_date"
              control={control}
              rules={{ required: "売り出し開始日は必須項目です" }}
              render={({ field: { onChange, value } }) => (
                <CustomDateTimePicker
                  onChange={onChange}
                  //   width={`${isMobile ? "100%" : "338px"}`}
                  width={"338px"}
                  value={value}
                  showTime={false}
                  // maxDate={dayjs()}
                  // minDate={dayjs().subtract(150, "year")}
                />
              )}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 5 }}>
        <SectionTitle title="料金" />
        <Box
          className="propertiesFormInputsGroup"
          sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
        >
          <CustomFullWidthInputGroup
            label="価格"
            name="price"
            type="number"
            placeholder=""
            register={register}
            isRequired
            errors={errors}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
            showYen={true}
          />
          {/* <CustomRadioGroup
                    name="type"
                    defaultValue={selectedCategory}
                    control={control}
                    label="物件カテゴリ"
                    options={[
                        { label: "土地", value: "土地" },
                        { label: "マンション", value: "マンション" },
                        { label: "新築", value: "新築" }
                      ]}
                    labelWidth={leftInputContainerWidth}
                        labelWidthSp={'47%'}
                    onChangeValue={(val:any) => {
                        setSelectedCategory(val);
                    }}
                /> */}
        </Box>
      </Box>
      {/* show hide block */}
      {selectedCategory === "マンション" ? (
        <Box sx={{ mb: 5 }}>
          <SectionTitle title="詳細情報" />
          <Box
            className="propertiesFormInputsGroup"
            sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
          >
            <CustomFullWidthInputGroup
              label="専有面積"
              name="private_area"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
              showMeter={true}
            />
            <CustomFullWidthInputGroup
              label="バルコニー面積"
              name="balcony_area"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
              showMeter={true}
            />
            <CustomFullWidthInputGroup
              label="間取り"
              name="layout"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="総戸数"
              name="total_units"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="管理費"
              name="management_fee"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="修繕積立金"
              name="repair_fund"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="自治会費"
              name="community_fee"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="駐車場"
              name="parking"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="管理方式"
              name="management_type"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="建物構造"
              name="structure"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="築年月"
              name="built_year"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>
      ) : selectedCategory === "新築" ? (
        <Box sx={{ mb: 5 }}>
          <SectionTitle title="詳細情報" />
          <Box
            className="propertiesFormInputsGroup"
            sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
          >
            <CustomFullWidthInputGroup
              label="土地面積"
              name="land_area"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              showMeter={true}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="延床面積"
              name="floor_area"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              showMeter={true}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="間取り"
              name="layout"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="建物構造"
              name="structure"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="土地権利"
              name="land_rights"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="地目"
              name="land_category"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="地勢"
              name="topography"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="用途地域"
              name="usage_zone"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="建ぺい率"
              name="building_coverage"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="容積率"
              name="floor_area_ratio"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="接道状況"
              name="road_situation"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="設備"
              name="facilities"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="学区"
              name="school_area"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="築年月"
              name="built_year"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 5 }}>
          <SectionTitle title="詳細情報" />
          <Box
            className="propertiesFormInputsGroup"
            sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
          >
            <CustomFullWidthInputGroup
              label="詳細情報"
              name="land_area"
              type="number"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              showMeter={true}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="土地権利"
              name="land_rights"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="地目"
              name="land_category"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="用途地域"
              name="usage_zone"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="建ぺい率"
              name="building_coverage"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="容積率"
              name="floor_area_ratio"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
            <CustomFullWidthInputGroup
              label="接道状況"
              name="road_situation"
              type="text"
              placeholder=""
              register={register}
              errors={errors}
              isModalInput={false}
              labelWidth={leftInputContainerWidth}
              labelWidthSp={"47%"}
              inputWidth={leftInputContainerWidth}
              inputWidthSp={"100%"}
            />
          </Box>
        </Box>
      )}
      <Box sx={{ mb: 5 }}>
        <SectionTitle title="その他概要" />
        <Box
          className="propertiesFormInputsGroup"
          sx={{ my: 2, maxWidth: "100%", pl: { lg: 5, xs: 0, md: 0, sm: 0 } }}
        >
          <CustomFullWidthInputGroup
            label="引渡し時期"
            name="delivery_time"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthInputGroup
            label="引渡し方法"
            name="delivery_method"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthInputGroup
            label="取引態様"
            name="transaction_type"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthInputGroup
            label="現状"
            name="current_condition"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
          />
          <CustomFullWidthInputGroup
            label="備考"
            name="remarks"
            type="text"
            placeholder=""
            register={register}
            errors={errors}
            isModalInput={false}
            labelWidth={leftInputContainerWidth}
            labelWidthSp={"47%"}
            inputWidth={leftInputContainerWidth}
            inputWidthSp={"100%"}
            multiline
            rows={3}
          />
          {/* date range picker */}
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>  
                <CustomDateRangePicker onDateConfirm={(date:any) => {
                    const formattedDate = {
                        startDate: date.start.format('YYYY/MM/DD'),
                        endDate: date.end.format('YYYY/MM/DD'),
                      };
                    }}
                    onCancel={() => {
                        setShowCalendar(false);
                    }}
                />
                </LocalizationProvider> */}
        </Box>
      </Box>
      <div
        style={{
          background: "#F7FBFD",
          display: "flex",
          justifyContent: "center",
          width: "calc(100% + 46px)",
          padding: "10px 0",
          position: "sticky",
          bottom: "0",
          marginLeft: "-22px",
          marginRight: "-24px",
        }}
      >
        <CustomButton
          sx={{ width: { lg: "100px", xs: "80px" } }}
          label={`${formType === "update" ? "保存" : "登録"}`}
          type="submit"
          disabled={
            formType === "update"
              ? !isDirty && !deletePaths
              : !isFormValid && !isDirty
          }
          isLoading={formType !== "update" ? loading : updateLoading}
        />
      </div>
      {toasts}
    </form>
  );
};

export default PropertyForm;
