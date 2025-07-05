import { Box } from '@mui/material'
import PropertyInquiryForm from '../../../components/PropertyInquiryForm';

const PropertyInquiryCreate = () => {
  const handleCreate = () => {
    // API call to create
  };
  return (
    <Box pt={3}>
      <PropertyInquiryForm onSubmit={handleCreate} formType='create'/>
    </Box>
  )
}

export default PropertyInquiryCreate
