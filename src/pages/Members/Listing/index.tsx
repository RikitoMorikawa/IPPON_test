import { useEffect, useState } from "react";
import { Add, Search } from "@mui/icons-material";
import {
  Box,
  Stack,
} from "@mui/material";
import Table from "../../../components/Table";
import { memberColumns } from "../../../common/tableColumns";
import SectionTitle from "../../../components/SectionTitle";
import { useToast } from "../../../components/Toastify";
import CustomButton from "../../../components/CustomButton";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { deleteMember, searchMembers } from "../../../store/membersSlice";
import CustomTextField from "../../../components/CustomTextField";
import { formatDateTime } from "../../../common/formatDate";
import CreateMember from "../Create";
import { ButtonDeleteIcon } from "../../../common/icons";
import { useNavigate } from "react-router";
import { getRole, getClientID } from "../../../utils/authUtils";
 

const MembersListing = () => {
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [formattedDataToDelete, setFormattedDataToDelete] = useState<any[]>([]);
  const [isDeletButtonActive,setIsDeletButtonActive] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>({
    name: '',
  });
  const { addToast, toasts } = useToast();
  const [deleteFlag,setDeleteFlag] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm();
  const clientId = getClientID()
  const role = getRole()
  const { data: membersData, loading: isSearchLoading } = useSelector(
    (state: any) => state.members.searched,
  );
  const [members,setMembers] = useState<any>([]);
  const [changeFlag, setChangeFlag]= useState(false);

  const handleRowSelection = (selectedRows: any[]) => {
    setSelectedIds(selectedRows);
    const selectedData = selectedRows.map((id) => {
      const row = members.find((row:any) => row.id === id);
      return row
        ? {
            member_id: row.id,
            client_id: clientId,
            mail_address: row.email,
          }
        : null;
    }).filter(Boolean); // Remove null values
    setFormattedDataToDelete(selectedData)
    if(selectedRows.length > 0){
        setIsDeletButtonActive(true);

    }else{
        setIsDeletButtonActive(false);
    }
  };

  const clearRowSelection = () => {
    setSelectedIds([]);
    setFormattedDataToDelete([])
    setIsDeletButtonActive(false);
};

  const handleDelete = async() => {
    if (formattedDataToDelete.length > 0) {
        try {
            const deleteResult = await dispatch(deleteMember(formattedDataToDelete));
            const result = await deleteResult?.payload as any;
            if(result?.successfulDeletes?.length>0){
              setDeleteFlag(true)
              clearRowSelection()
              addToast({
                message: '削除しました!',
                type: 'deleted',
              });
            }
            else if(result?.failedDeletes?.length>0){
              addToast({
                message: 'fail to delete',
                type: 'error',
              });
            }
          } catch (err) {
            console.error('Error deleting members:', err);
          }
    }
  };

  const onSubmit = (data:any) => {
    setSearchParams({
      name: data.name || '',
    });
  };

  const fetchMembers = async () => {
    try {
      await dispatch(searchMembers(searchParams));
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams,changeFlag,deleteFlag]);

  const createMemberSuccessHandler =()=>{
    setChangeFlag(!changeFlag);
  }

  // const updateAdminStatus = async({member_id,email,newStatus}:any) => {
  //   try {
  //     const updateResult = await dispatch(changeAdminStatus({member_id,email,newStatus}));
  //     const result = await updateResult.payload as any;
  //       if (result.message){
  //         addToast({
  //           message: result?.message,
  //           type: 'error',
  //         });
  //       }
  //   } catch (err) {
  //     console.error('Error changing status', err);
  //   }
  // };

  const handleChangePassword = async(row: any) => {
    navigate(`/reset_password?email=${encodeURIComponent(row.email)}`)
  };

  const columns = memberColumns( {handleChangePassword, role});

  useEffect(()=>{
    if(membersData && membersData.length!==0){
      const rows = membersData?.map((member:any, index:number) => ({
        id: member.member_id || index,
        lastName: member.last_name || "",
        firstName: member.first_name || "",
        firstNameOfFurigana: member.first_name_kana || "",
        lastNameOfFurigana: member.last_name_kana || "",
        email: member.mail_address || "",
        adminStatus: member.is_admin ? "管理者" : "-",
        registration_timestamp: formatDateTime(member.register_timestamp),
        update_timestamp: formatDateTime(member.update_timestamp),
    }));
      setMembers(rows)
    }
  },[membersData])

  const handleOpenModal = () => setOpenModal(true);

  // const handleChangeAdminStatus = (row: any, newStatus: boolean) => {
  //   const member_id = row?.id;
  //   const email = row?.email;
    
  //   setMembers((prevRows:any) =>
  //     prevRows.map((r:any) => (r.id === row.id ? { ...r, adminStatus: newStatus } : r))
  //   );
    
  //   updateAdminStatus({member_id, email, newStatus});
  // };

  return (
    <Box py={3}>
      <SectionTitle title='管理アカウント' />
      <Stack direction={"row"} justifyContent={"space-between"} my={2.5}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={"row"} justifyContent={"flex-end"} gap={1}>
            <CustomTextField
              fullWidth
              placeholder='キーワードで絞り込む'
              {...register('name')}
              slotProps={{
                input: {
                  startAdornment: <Search sx={{ color: "#989898", mr: 1}} />,
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
                  padding: "8px 12px 8px 0 !important"
                },
              }}
            />
          <CustomButton
            type='submit'
            label="検索"
            startIcon={<Search sx={{ fontSize: "18px !important" }} />}
          />
        </Stack>
        </form>
        {
          role === 'admin' && <Stack direction={"row"} justifyContent={"flex-end"} gap={1}>
          <CustomButton
            label="新規追加"
            startIcon={<Add sx={{ fontSize: "18px !important" }} />}
            onClick={handleOpenModal}
          />
          <CustomButton
            label="削除"
            startIcon={<ButtonDeleteIcon />}
            onClick={handleDelete}
            className={`delete ${isDeletButtonActive ? 'active' : 'disabled'}`}
          />
        </Stack>
        }  
      </Stack>
      <CreateMember openModal={openModal} setOpenModal={setOpenModal} onCreateSuccess={createMemberSuccessHandler}/>
      <Table 
        isLoading={isSearchLoading}
        rows={members} 
        columns={columns} 
        checkbox={true} 
        onRowSelection={handleRowSelection} 
        selectedIds={selectedIds} 
      />
      {toasts}
    </Box>
  );
};
 
export default MembersListing;
