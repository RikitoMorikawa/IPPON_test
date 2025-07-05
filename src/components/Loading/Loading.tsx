import React from 'react'
import { spinAnimation } from '../Table'
import { Backdrop, Box, Modal } from '@mui/material'

interface CustomLoadingProps {
    loading: boolean;
    background?: string;
  }
const CustomLoading: React.FC<CustomLoadingProps> = ({ loading,background}) => {
  return (
    <Modal
    open={loading}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{ timeout: 500 }}
    sx={{background: background}}
  >
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box
        sx={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0B9DBD',
          borderRadius: '50%',
          animation: `${spinAnimation} 1s linear infinite`,
        }}
      />
    </Box>
  </Modal>
  )
}

export default CustomLoading
