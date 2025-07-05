import { Box, Typography, useMediaQuery } from '@mui/material'
import errorImage from '../../assets/trading_error_page.png'
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router';
import { ErrorPageProps } from '../../types';

const ErrorPage = ({ type }: ErrorPageProps) => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center'}}>
            <Box sx={{
              width: {xs: '230px', sm: '366px'},
              margin: '0 auto'
              }}>
              <img src={errorImage} alt="error" style={{width: '100%'}}/>
            </Box>
            <Typography 
            sx={{
              fontSize: {xs: '30px', sm: '40px'}, 
              fontWeight: '600', 
              color:'#0B9DBD',
              padding: {xs:'5px 0 0 0', sm: '19px 0 0 0'},
              lineHeight: '37px'}}>{type === '401' ? '401' : '404'}</Typography>
            <Typography 
              sx={{
                fontSize: {xs: '14px', sm: '24px'},
                fontWeight: '500', 
                color:'#3E3E3E',
                padding: {xs: '20px 0 10px 0', sm: '28px 0 10px 0'},
                }}>{type === '401' ? '承認が必要' : 'ページが見つかりません'}</Typography>
            <Typography 
              sx={{
                fontSize: {xs: '12px', sm: '20px'}, 
                fontWeight: '400', 
                color:'#989898'}}>{type === '401' ? '申し訳ありませんが、リクエストは処理できませんでした。' : 'お探しのページは存在しないか、移動されました。'}</Typography>
            <Box sx={{marginTop:{xs: '18px', sm: '28px'}}}>
            <CustomButton className={`errorBtn ${isMobile?'sp':''}`} label='ホームへ' onClick={()=>navigate('/dashboard')}/>
            </Box>
        </Box>
    </Box>
  )
}

export default ErrorPage
