import UserModel from '../../../models/db/user-model';

async function getAllCollectionsHandler(req, res) {
  if (req.method !== 'POST') {
    res.status(400).json({ message: 'Expected post request method!' });
  }

  try {
    const userId = req.body;
    const user = await UserModel.findById({ _id: userId });

    res.status(201).json(user.collections);
  } catch (err) {
    res.status(404).json({ message: "This profile doesn't exist!" });
  }
}

export default getAllCollectionsHandler;