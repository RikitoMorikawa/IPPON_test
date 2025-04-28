import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './CustomModal.css'
import SectionTitle from '../SectionTitle';
import { Typography } from '@mui/material';
import { CustomCloseIcon } from '../../common/icons';
/* eslint-disable @typescript-eslint/no-explicit-any */

 const CustomModal =({ openModal, handleCloseModal,title,children,modalType='otherModal',bodyText='',addTitleBorder='false' }:any)=> {

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`modalBox ${modalType==='create' ? 'createModal' : modalType==='flexColModal'? 'flexColModal' : 'otherModal'}`}>
          <Box className='modalBoxWrapper'>
            <SectionTitle title={title} addBorder={addTitleBorder==='true' ? true : false}/>
            <span className='closeIcon' onClick={handleCloseModal}><CustomCloseIcon/></span>
            {modalType==='otherModal' && <Typography align='center' fontSize={14} fontWeight={400} padding={'22px 0 30px 0'}>{bodyText}</Typography>}
            {children}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CustomModal