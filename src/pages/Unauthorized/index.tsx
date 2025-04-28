import { Box, Typography } from '@mui/material'

const Unauthorized = () => {
  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 1,
        m: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
      }}>
        <Box sx={{marginTop:'30%',textAlign: 'center'}}>
            <Typography sx={{fontSize: '24px', fontWeight: '700', color:'#3e3e3e'}}>403 Forbidden</Typography>
            <Typography sx={{fontSize: '16px', fontWeight: '500', color:'#3e3e3e'}}>You don't have permission to access this page!</Typography>
        </Box>
    </Box>
  )
}

export default Unauthorized
