import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './CustomModal.css'
import SectionTitle from '../SectionTitle';
import { Typography, useMediaQuery } from '@mui/material';
import { CustomCloseIcon } from '../../common/icons';
 

 const CustomModal =({ openModal, handleCloseModal,title,children,modalType='otherModal',bodyText='',addTitleBorder='false' }:any)=> {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`modalBox ${isMobile? 'sp' :''} ${modalType==='create' ? 'createModal' : modalType==='flexColModal'? 'flexColModal' : 'otherModal'}`}>
          <Box className='modalBoxWrapper'>
            <SectionTitle title={title} addBorder={addTitleBorder==='true' ? true : false}/>
            <span className='closeIcon' onClick={handleCloseModal}><CustomCloseIcon/></span>
            {modalType==='otherModal' && <Typography align='center' fontSize={{xs: 12, sm:14}} fontWeight={400} padding={{xs: '16px 0 20px 0', sm:'22px 0 30px 0'}}>{bodyText}</Typography>}
            {children}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CustomModal