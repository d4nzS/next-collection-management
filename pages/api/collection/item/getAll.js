import UserModel from '../../../../models/db/user-model';

async function getAllItemsHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Expected post request method!' });
  }

  try {
    const { userId, collectionId } = req.body;

    const user = await UserModel.findById({ _id: userId });
    const collection = user.collections.find(collection => collection._id.toString() === collectionId);

    res.status(201).json(collection.items);
  } catch (err) {
    res.status(404).json({ message: "This collection doesn't exist!" });
  }
}

export default getAllItemsHandler;