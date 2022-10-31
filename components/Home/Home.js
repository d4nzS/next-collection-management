import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Container,
  Typography
} from '@mui/material';

const Home = ({ users }) => {
  const router = useRouter();

  const fiveBiggestCollections = users
    .reduce(
      (sumCollectionsArr, user) => {
        user.collections.forEach(collection => sumCollectionsArr.push({
          url: `/${user._id}/${collection._id}`,
          authorEmail: user.email,
          name: collection.name,
          itemsAmount: collection.itemsAmount
        }));

        return sumCollectionsArr;
      }, []
    )
    .sort((prevCollection, collection) => collection.itemsAmount - prevCollection.itemsAmount)
    .slice(0, 5);

  return (
    <Container component="main" maxWidth="sm" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography component="h1" variant="h5" align="center" sx={{ mb: 3, textTransform: 'uppercase' }}>
        The biggest collections
      </Typography>
      {fiveBiggestCollections.map(collection => (
        <Card key={collection.url} sx={{ mb: 3 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {collection.name}
            </Typography>
            <Typography variant="body2" color="text">
              Author: {collection.authorEmail}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Amount: {collection.itemsAmount}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => router.push(collection.url)}
            >
              Link
            </Button>
          </CardActions>
        </Card>
      ))}
    </Container>
  );
};

export default Home;