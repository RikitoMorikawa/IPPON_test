import { Divider, Typography } from '@mui/material'
import { TitleProps } from '../../types'

const SectionTitle:React.FC<TitleProps> = ({title,addBorder=true}) => {
  return (
    <>
    <Typography
        variant='subtitle1'
        component='h1'
        fontWeight='bold'
        fontSize={"16px"}
        lineHeight={"20px"}
        position={"relative"}
        sx={{
          fontSize: {
            xs: '14px',   // small screens
            sm: '14px',   // tablets
            md: '16px',   // desktops
          },
          borderLeft: {xs: '6px solid #0B9DBD', sm: '7px solid #0B9DBD'}
        }}
        pl={1.25}
        mb={1}>
        {title}
    </Typography>
    {addBorder && <Divider sx={{ borderColor: "#D9D9D9" }}/>}
    </>
  )
}

export default SectionTitle
