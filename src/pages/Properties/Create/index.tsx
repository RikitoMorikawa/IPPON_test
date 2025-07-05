import { Box } from '@mui/material'
import PropertyForm from '../../../components/PropertyForm'

const CreateProperty = () => {
  const handleCreate = () => {
    // API call to create
  };
  return (
    <Box pt={3} className='properties'>
      <PropertyForm onSubmit={handleCreate}/>
    </Box>
  )
}

export default CreateProperty
