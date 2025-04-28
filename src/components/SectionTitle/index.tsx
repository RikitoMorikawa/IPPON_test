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
        borderLeft={"7px solid #3F97D5"}
        pl={1.25}
        mb={1}>
        {title}
    </Typography>
    {addBorder && <Divider sx={{ borderColor: "#D9D9D9" }}/>}
    </>
  )
}

export default SectionTitle
