import { Divider, Typography, Box, IconButton } from '@mui/material'
import { AddNewIcon } from '../../../../common/icons'

interface TitleProps{
    title: string;
    addBorder?: boolean;
    onAddClick?: () => void;
}  

const SectionTitleInquiry: React.FC<TitleProps> = ({ title, addBorder = true, onAddClick }) => {
  return (
    <>
     <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography
          variant='subtitle1'
          component='h1'
          fontWeight='bold'
          fontSize={"16px"}
          lineHeight={"20px"}
          position={"relative"}
          borderLeft={"7px solid #0B9DBD"}
          sx={{
            fontSize: {
              xs: '14px',   // small screens
              sm: '14px',   // tablets
              md: '16px',   // desktops
            },
          }}
          pl={1.25}
        >
          {title}
        </Typography>
        {onAddClick && (
          <IconButton 
            onClick={onAddClick}
            size="small"
            sx={{
              padding: 0.5,
              '& svg': {
                width: '18px',
                height: '18px'
              }
            }}
          >
            <AddNewIcon />
          </IconButton>
        )}
      </Box>
      {addBorder && <Divider sx={{ borderColor: "#D9D9D9" }} />}
    </>
  )
}

export default SectionTitleInquiry