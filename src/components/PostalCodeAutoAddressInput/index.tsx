import React from "react";
import CustomFullWidthInputGroup from "../CustomFullWidthInputGroup";
import CustomFullWidthSelectInputGroup from "../CustomFullWidthSelectInputGroup";
import axios from "axios";

type Props = {
  register: any;
  errors: any;
  setValue: any;
  leftInputContainerWidth?: string | number;
  prefectureOptions: { value: string; label: string }[];
  inputWidth?: string | number;
  inputWidthSp?: string | number;
  control?: any;
  disabled?: boolean;
};

const PostalCodeAutoAddressInput: React.FC<Props> = ({
  register,
  errors,
  setValue,
  leftInputContainerWidth = "338px",
  prefectureOptions,
  control,
  disabled = false,
}) => {
  // 郵便番号→住所自動セット

  const autoSetAddress = async (event: React.FocusEvent<HTMLInputElement>) => {
    if (disabled) return; // If disabled, don't process auto-complete
    
    const value = event.target.value.replace(/[^0-9]/g, "");
    if (value.length === 7) {
      try {
        const res = await axios.get(
          "https://zipcloud.ibsnet.co.jp/api/search",
          { params: { zipcode: value } }
        );
        if (res.data && res.data.results) {
          const result = res.data.results[0];
          // 都道府県名→value番号でセット
          setValue("postal_code", value);
          const pref = prefectureOptions.find(
            (p) => p.label === result.address1
          );
          setValue("prefecture", pref ? pref.value : "");
          setValue("city", result.address2 + result.address3);
        }
      } catch {
        console.log("error");
      }
    }
  };

  return (
    <>
      <CustomFullWidthInputGroup
        label="郵便番号"
        name="postal_code"
        type="text"
        placeholder="1234567（ハイフンなし）"
        register={register}
        errors={errors}
        isModalInput={false}
        inputWidth={String(leftInputContainerWidth)}
        inputWidthSp={"100%"}
        autoSetAddress={autoSetAddress}
        isRequired={true}
        labelWidth="120px"
        labelWidthSp="47%"
        disabled={disabled}
      />
      <CustomFullWidthSelectInputGroup
        label="都道府県"
        name="prefecture"
        control={control}
        register={register}
        errors={errors}
        options={prefectureOptions}
        inputWidth={String(leftInputContainerWidth)}
        inputWidthSp={"100%"}
        placeholder="選択してください"
        isRequired={true}
        labelWidth="120px"
        labelWidthSp="47%"
        disabled={disabled}
      />
      <CustomFullWidthInputGroup
        label="市区町村"
        name="city"
        type="text"
        register={register}
        errors={errors}
        isModalInput={false}
        inputWidth={String(leftInputContainerWidth)}
        inputWidthSp={"100%"}
        isRequired={true}
        labelWidth="120px"
        labelWidthSp="47%"
        disabled={disabled}
      />
    </>
  );
};

export default PostalCodeAutoAddressInput;
