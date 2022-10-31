import fs from 'fs';
import path from 'path';
import formidable from 'formidable';
import { Types } from 'mongoose';

import ApiError from '../../../exceptions/api-error';
import UserModel from '../../../models/db/user-model';

export const config = {
  api: {
    bodyParser: false,
  },
}

// TODO: refactor to use REST

async function createCollectionHandler(req, res) {
  if (req.method !== 'POST') {
    throw ApiError.BadRequest('post');
  }

  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (error, fields, files) => {
      const { userId, ...collection } = fields;
      const collectionId = Types.ObjectId();

      const file = files.image;

      if (file) {
        fs.renameSync(file.filepath, path.join('public', file.originalFilename));
      }

      Object.entries(collection).forEach(([key, val]) => {
        try {
          collection[key] = JSON.parse(val);
        } catch {
        }
      });

      await UserModel.updateOne({ _id: Types.ObjectId(userId) }, {
        $push: {
          collections: {
            _id: collectionId,
            image: file?.originalFilename,
            ...collection
          }
        }
      });

      res.status(201).json(collectionId);
    });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

export default createCollectionHandler;