import { useEffect, useState } from "react";
import { Add, Search } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import Table from "../../../components/Table";
import TableMobile from "../../../components/TableMobile";
import { propertiesColumns } from "../../../common/tableColumns";
import { useTheme, useMediaQuery } from "@mui/material";
import SectionTitle from "../../../components/SectionTitle";
import { useToast } from "../../../components/Toastify";
import CustomButton from "../../../components/CustomButton";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import CustomTextField from "../../../components/CustomTextField";
import { formatDateTime } from "../../../common/formatDate";
import { ButtonDeleteIcon } from "../../../common/icons";
import CustomSelect from "../../../components/CustomSelect";
import SortFilterButton from "../../../components/SortFilterButton";
import CustomModal from "../../../components/CustomModal";
import { useNavigate } from "react-router";
import {
  deleteProperty,
  searchProperties,
} from "../../../store/propertiesSlice";
import { PaginationInfo } from "../../../types";
// import ResponsiveTable from "../../../components/ResponsiveTable";

const PropertiesListing = () => {
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [sortType, setSortType] = useState<string>("newest");
  const [formattedDataToDelete, setFormattedDataToDelete] = useState<any>({});
  const [isDeletButtonActive, setIsDeletButtonActive] =
    useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>({
    objectName: "",
    prefecture: "",
    price: "",
    property_type: "",
    building_type: "",
    registrationRange: "",
    limit: "",
  });
  const { addToast, toasts } = useToast();
  const [deleteFlag, setDeleteFlag] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { register, handleSubmit, control, setValue } = useForm({
    shouldUnregister: true,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { data: propertiesData, loading } = useSelector(
    (state: any) => state.properties.searched
  );

  const [properties, setProperties] = useState<any>([]);
  const [propertyList, setPropertyList] = useState<any>([]);
  const [perPage] = useState<number>(10);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
  });

  const registerDates = [
    { label: "1か月以内", value: "1" },
    { label: "2ヶ月以内", value: "2" },
    { label: "3ヶ月以内", value: "3" },
    { label: "6ヶ月以内", value: "4" },
    { label: "1年以内", value: "5" },
    { label: "指定なし", value: "0" },
  ];

  const prefectures = [
    { value: "1", label: "北海道" },
    { value: "2", label: "青森県" },
    { value: "3", label: "岩手県" },
    { value: "4", label: "宮城県" },
    { value: "5", label: "秋田県" },
    { value: "6", label: "山形県" },
    { value: "7", label: "福島県" },
    { value: "8", label: "茨城県" },
    { value: "9", label: "栃木県" },
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
    { label: "指定なし", value: "0" },
  ];

  const types = [
    { label: "土地", value: "1" },
    { label: "分譲", value: "2" },
    { label: "オフィスビル", value: "3" },
    { label: "指定なし", value: "0" },
  ];
  const elclusiveAreas = [
    { label: "〜30㎡", value: "1" },
    { label: "30〜50㎡", value: "2" },
    { label: "50〜70㎡", value: "3" },
    { label: "70〜90㎡", value: "4" },
    { label: "90〜110㎡", value: "5" },
    { label: "110〜130㎡", value: "6" },
    { label: "130㎡〜", value: "7" },
    { label: "指定なし", value: "0" },
  ];
  const propertyPrices = [
    { label: "〜500万円土地", value: "1" },
    { label: "500〜1,000", value: "2" },
    { label: "1,000〜2,000万円", value: "3" },
    { label: "2,000〜3,000万円", value: "4" },
    { label: "3,000〜4,000万円", value: "5" },
    { label: "4,000〜5,000万円", value: "6" },
    { label: "5,000〜7,000万円", value: "7" },
    { label: "7,000〜1億円", value: "8" },
    { label: "1億円〜", value: "9" },
    { label: "指定なし", value: "0" },
  ];

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchProperties(searchParams, page, pagination.limit);
  };

  const fetchProperties = async (
    params: any,
    page: number = 1,
    limit: number = perPage
  ) => {
    try {
      const searchPayload = {
        objectName: params.objectName,
        prefecture: params.prefecture,
        price: params.price,
        property_type: params.property_type,
        building_type: params.building_type,
        registrationRange: params.registrationRange,
        page: page,
        limit: limit,
      };
      const cleanedPayload = Object.fromEntries(
        Object.entries(searchPayload).filter(
          ([_, value]) => value !== undefined
        )
      );
      const result = await dispatch(searchProperties(cleanedPayload));
      if (searchProperties.fulfilled.match(result)) {
        const responseData = result.payload;
        setPagination({
          total: responseData[0]?.pagination.total || 0,
          page: responseData.page || page,
          limit: responseData[0]?.pagination.limit || limit,
        });
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchProperties(searchParams, 1, pagination.limit);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchParams, deleteFlag]);

  useEffect(() => {
    if (propertiesData && propertiesData[0]?.property) {
      setPropertyList(propertiesData[0].property);
    }
  }, [propertiesData]);

  useEffect(() => {
    if (pagination.limit !== perPage) {
      fetchProperties(searchParams);
    }
  }, [perPage]);

  useEffect(() => {
    const sorted = [...propertyList];
    switch (sortType) {
      case "lowestPrice":
        sorted.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        break;
      case "highestPrice":
        sorted.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        break;
      case "mostInquiries":
        sorted.sort((a, b) => parseInt(b.buildYear) - parseInt(a.buildYear));
        break;
      case "newest":
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
    const rows = sorted.map((property: any, index: number) => ({
      id: property.id || index,
      name: property.name || "",
      prefecture: property.prefecture || "",
      inquiry_count:
        (property.inquiry_count !== undefined &&
          property.inquiry_count !== "" &&
          property.inquiry_count + "件") ||
        "-",
      price: property.price || "-",
      type: property.type || "",
      land_area:
        (property.details?.land_area !== undefined &&
          property.details?.land_area !== "" &&
          property.details?.land_area + "㎡") ||
        (property.details?.private_area !== undefined &&
          property.details?.private_area !== "" &&
          property.details?.private_area + "㎡") ||
        "-",
      created_at: formatDateTime(property.created_at),
      updated_at: formatDateTime(property.updated_at),
    }));
    setProperties(rows);
  }, [sortType, propertyList]);

  const onSubmit = (data: any) => {
    setSearchParams({
      objectName: data.objectName || "",
      prefecture: data.prefecture || "",
      price: data.price || "",
      property_type: data.property_type || "",
      registrationRange: data.registrationRange || "",
    });
  };

  const clearSearch = () => {
    // setSearchParams({
    //   objectName: '',
    //   prefecture: '0',
    //   property_type: '0',
    //   price: '0',
    //   building_type: '0',
    //   registrationRange: '0',
    //   });
    setValue("objectName", "");
    setValue("price", "0");
    setValue("property_type", "0");
    setValue("registrationRange", "0");
    setValue("prefecture", "0");

    setSearchParams({});
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when clearing
    fetchProperties({}, 1, pagination.limit);
  };

  const handlePropertyClick = (row: any) => {
    navigate(`/properties/${row.id}`);
  };
  const handleCopyClick = () => {};
  const columns = propertiesColumns({ handlePropertyClick, handleCopyClick });
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);

  const handleRowSelection = (selectedRows: any[]) => {
    setSelectedIds(selectedRows);
    const formattedData = {
      propIds: selectedRows,
    };
    setFormattedDataToDelete(formattedData);
    setIsDeletButtonActive(selectedRows.length > 0);
  };

  const clearRowSelection = () => {
    setSelectedIds([]);
    setFormattedDataToDelete({});
    setIsDeletButtonActive(false);
  };

  const handleDelete = async () => {
    setOpenDeleteModal(false);
    try {
      const deletedResult = await dispatch(
        deleteProperty(formattedDataToDelete)
      );
      if (deleteProperty.fulfilled.match(deletedResult)) {
        setDeleteFlag(!deleteFlag);
        clearRowSelection();
        addToast({
          message: "削除しました!",
          type: "deleted",
        });
      } else if (deleteProperty.rejected.match(deletedResult)) {
        const response = deletedResult.payload as any;
        const errorMessage = response.message || "Failed to delete property";
        addToast({
          message: errorMessage,
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error deleting properties:", err);
    }
  };

  const handleAddNew = () => {
    navigate(`create`);
  };

  return (
    <Box py={{ lg: 3, xs: 1 }}>
      <SectionTitle title="物件検索" />
      <Stack direction={"row"} justifyContent={"space-between"} mt={2.5}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          {/* Mobile Layout */}

          {isMobile ? (
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {/* 担当者 dropdowns for mobile */}

              <Stack
                direction={"column"}
                gap={{ lg: 2, xs: 1 }}
                marginBottom={2}
              >
                <Stack
                  direction={"row"}
                  justifyContent={{ lg: "space-between", xs: "start" }}
                  gap={{ lg: 2, xs: 1.5 }}
                >
                  <CustomSelect
                    label="登録日時"
                    name="registrationRange"
                    control={control}
                    options={registerDates}
                    defaultValue="0"
                  />
                  <CustomSelect
                    label="専有面積"
                    name="exclusive_area"
                    control={control}
                    options={elclusiveAreas}
                    defaultValue="0"
                  />
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={{ lg: "space-between", xs: "start" }}
                  gap={{ lg: 2, xs: 1.5 }}
                >
                  <CustomSelect
                    label="都道府県"
                    name="prefecture"
                    control={control}
                    options={prefectures}
                    defaultValue="0"
                  />
                  <CustomSelect
                    label="物件価格"
                    name="price"
                    control={control}
                    options={propertyPrices}
                    defaultValue="0"
                  />
                </Stack>
                <Stack direction={"row"} justifyContent={"flex-start"}>
                  <CustomSelect
                    label="物件種別"
                    name="property_type"
                    control={control}
                    options={types}
                    defaultValue="0"
                    sx={{ ml: "auto", width: 180 }}
                  />
                </Stack>
              </Stack>

              {/* Search input for mobile */}
              <Stack
                direction={"row"}
                gap={1}
                marginBottom={3}
                alignItems={"center"}
              >
                <CustomTextField
                  fullWidth
                  placeholder="キーワードで絞り込む"
                  {...register("objectName")}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Search sx={{ color: "#989898", fontSize: 20 }} />
                      ),
                    },
                  }}
                  sx={{
                    flex: 1,
                    height: 34,
                    ".MuiInputBase-root": {
                      height: 34,
                      borderRadius: "8px",
                      borderColor: "#989898",
                      paddingLeft: 1,
                      fontFamily: "Noto Sans JP",
                    },
                    input: {
                      fontSize: "12px",
                      padding: "7px 8px",
                      "&::placeholder": {
                        color: "#989898",
                        opacity: 1,
                      },
                    },
                  }}
                />

                <CustomButton
                  type="submit"
                  label=""
                  startIcon={<Search sx={{ fontSize: "20px !important" }} />}
                  sx={{
                    minWidth: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiButton-startIcon": {
                      marginRight: 0,
                      marginLeft: 0,
                    },
                  }}
                />
              </Stack>
              <Box sx={{ marginTop: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {/* First row - 3 buttons with width 60 */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <SortFilterButton
                      label="新規登録順"
                      value="newest"
                      onClick={() => setSortType("newest")}
                      active={sortType === "newest"}
                      sx={{ width: "78px" }}
                    />
                    <SortFilterButton
                      label="価格が安い順"
                      value="lowestPrice"
                      onClick={() => setSortType("lowestPrice")}
                      active={sortType === "lowestPrice"}
                      sx={{ width: "90px" }}
                    />
                    <SortFilterButton
                      label="価格が高い順"
                      value="highestPrice"
                      onClick={() => setSortType("highestPrice")}
                      active={sortType === "highestPrice"}
                      sx={{ width: "90px" }}
                    />
                  </Box>

                  {/* Second row - 4th button with auto width */}
                  <Box sx={{ display: "flex" }}>
                    <SortFilterButton
                      label="問い合わせが多い順"
                      value="mostInquiries"
                      onClick={() => setSortType("mostInquiries")}
                      active={sortType === "mostInquiries"}
                    />
                  </Box>
                </Box>
              </Box>
              <Box>
                <Stack
                  direction="row"
                  spacing={1}
                  marginBottom={2}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  flexWrap={"wrap"}
                >
                  <Typography
                    sx={{
                      fontSize: { lg: "14px", xs: "10px" },
                      fontWeight: 700,
                    }}
                  >
                    検索結果{" "}
                    <span style={{ color: "#0B9DBD", margin: "0 7px" }}>
                      {properties.length}
                    </span>{" "}
                    件
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems={"center"}>
                    <CustomButton
                      label="新規物件登録"
                      type="button"
                      sx={{
                        width: "120px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        "& .MuiButton-startIcon": {
                          marginRight: "4px", // Reduce spacing between icon and text
                        },
                      }}
                      startIcon={
                        <Add
                          sx={{
                            fontSize: { lg: "18px !important", xs: "14px" },
                            color: "white", // Ensure the icon is white
                          }}
                        />
                      }
                      onClick={handleAddNew}
                    />
                    <CustomButton
                      label="削除"
                      type="button"
                      sx={{
                        width: "65px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      startIcon={<ButtonDeleteIcon />}
                      onClick={handleOpenDeleteModal}
                      className={`delete ${
                        isDeletButtonActive ? "active" : "disabled"
                      }`}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                gap={5}
                marginBottom={1}
              >
                <CustomSelect
                  label="登録日時"
                  name="registrationRange"
                  control={control}
                  options={registerDates}
                  defaultValue="0"
                />
                <CustomSelect
                  label="都道府県"
                  name="prefecture"
                  control={control}
                  options={prefectures}
                  defaultValue="0"
                />
                <CustomSelect
                  label="種別"
                  name="property_type"
                  control={control}
                  options={types}
                  defaultValue="0"
                />
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"flex-start"}
                gap={5}
                marginBottom={3}
              >
                <CustomSelect
                  label="専有面積"
                  name="exclusive_area"
                  control={control}
                  options={elclusiveAreas}
                  defaultValue="0"
                />
                <CustomSelect
                  label="物件価格"
                  name="price"
                  control={control}
                  options={propertyPrices}
                  defaultValue="0"
                />
              </Stack>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                flexWrap={"wrap"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"flex-end"}
                  gap={1}
                  marginBottom={3}
                  alignItems={"center"}
                >
                  <Typography marginRight={2} fontSize={12} fontWeight={700}>
                    物件名
                  </Typography>
                  <CustomTextField
                    fullWidth
                    placeholder="キーワードで絞り込む"
                    {...register("objectName")}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Search sx={{ color: "#989898", mr: 1 }} />
                        ),
                      },
                    }}
                    sx={{
                      width: "401px",
                      ".MuiInputBase-root": {
                        height: "38px",
                        borderColor: "#989898",
                      },
                      input: {
                        fontSize: "14px !important",
                        padding: "8px 12px 8px 0 !important",
                      },
                    }}
                  />
                  <CustomButton
                    type="submit"
                    label="検索"
                    startIcon={<Search sx={{ fontSize: "18px !important" }} />}
                  />
                  <CustomButton
                    type="button"
                    label="クリア"
                    onClick={clearSearch}
                  />
                </Stack>
                <Stack
                  direction={"row"}
                  justifyContent={"flex-end"}
                  gap={1}
                  marginBottom={3}
                >
                  <CustomButton
                    label="新規物件登録"
                    type="button"
                    startIcon={<Add sx={{ fontSize: "18px !important" }} />}
                    onClick={handleAddNew}
                  />
                  <CustomButton
                    label="削除"
                    type="button"
                    startIcon={<ButtonDeleteIcon />}
                    onClick={handleOpenDeleteModal}
                    className={`delete ${
                      isDeletButtonActive ? "active" : "disabled"
                    }`}
                  />
                </Stack>
              </Stack>
            </Box>
          )}
        </form>
      </Stack>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Stack
          direction="row"
          spacing={1}
          marginBottom={2}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              marginRight: "12px !important",
            }}
          >
            検索結果{" "}
            <span style={{ color: "#0B9DBD", margin: "0 7px" }}>
              {properties.length}
            </span>{" "}
            件
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={"700"}
            marginRight={"12px !important"}
          >
            ⇅ 並び替え
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            marginTop={2}
            alignItems={"center"}
          >
            <SortFilterButton
              label="新規登録順"
              value="newest"
              onClick={() => setSortType("newest")}
              active={sortType === "newest"}
            />
            <SortFilterButton
              label="価格が安い順"
              value="lowestPrice"
              onClick={() => setSortType("lowestPrice")}
              active={sortType === "lowestPrice"}
            />
            <SortFilterButton
              label="価格が高い順"
              value="highestPrice"
              onClick={() => setSortType("highestPrice")}
              active={sortType === "highestPrice"}
            />
            <SortFilterButton
              label="問い合わせが多い順"
              value="mostInquiries"
              onClick={() => setSortType("mostInquiries")}
              active={sortType === "mostInquiries"}
            />
          </Stack>
        </Stack>
      </Box>
      <CustomModal
        title="削除の確認"
        openModal={openDeleteModal}
        handleCloseModal={() => setOpenDeleteModal(false)}
        bodyText="物件を削除してよろしいですか？"
      >
        <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <CustomButton
            label="削除"
            onClick={handleDelete}
            buttonCategory="delete"
          />
          <CustomButton
            label="戻る"
            type="button"
            onClick={() => setOpenDeleteModal(false)}
          />
        </Box>
      </CustomModal>
      {/* <ResponsiveTable 
        isLoading={loading}
        rows={properties} 
        columns={columns} 
        onRowSelection={handleRowSelection} 
        selectedIds={selectedIds} 
        pagination={pagination}
        onPageChange={handlePageChange}
        handlePropertyClick={handlePropertyClick} // Add this line
      /> */}
      {isMobile ? (
        <TableMobile
          isLoading={loading}
          rows={properties}
          columns={columns}
          onRowSelection={handleRowSelection}
          selectedIds={selectedIds}
          pagination={pagination}
          onPageChange={handlePageChange}
          handlePropertyClick={handlePropertyClick} // Add this line
        />
      ) : (
        <Table
          isLoading={loading}
          rows={properties}
          columns={columns}
          onRowSelection={handleRowSelection}
          selectedIds={selectedIds}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
      {toasts}
    </Box>
  );
};

export default PropertiesListing;
