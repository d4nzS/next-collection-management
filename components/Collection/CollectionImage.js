import { Container } from '@mui/material';

const CollectionImage = ({ src }) => {
  return (
    <Container maxWidth="xl" sx={{ pt: { xs: 2, sm: 3 }, pl: { xs: 2, sm: 3 } }}>
      <img src={`/${src}`} alt="The collection image" height={350}/>
    </Container>
  );
};

export default CollectionImage;