import { useRouter } from 'next/router';
import { Container, Typography } from '@mui/material';

function ItemPage() {
  const router = useRouter();
  const userId = router.query.profileId;
  const collectionId = router.query.collectionId;
  const itemId = router.query.itemId;

  return (
    <Container component="main" maxWidth="xl" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography component="h1" variant="h5" align="center" sx={{ textTransform: 'uppercase' }}>
        Now this page isn't ready for production but it's being built
      </Typography>
    </Container>
  );
}

export default ItemPage;