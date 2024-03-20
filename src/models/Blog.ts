import mongoose, { Document, Schema, model } from 'mongoose';
import { UserModel } from './User';

interface Blog extends Document {
  title: string;
  snippet: string;
  body: string;
  author: mongoose.Types.ObjectId;
}

const BlogSchema = new Schema<Blog>(
  {
    title: { type: String, required: true },
    snippet: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Writer' },
  },
  { timestamps: true }
);

// Define a post save middleware
/*BlogSchema.post('save', async function (doc) {
  try {
    const user = await UserModel.findById(doc.author);

    if (user) {
      user.posts.push(doc._id); // Add the ID of the new post
      await user.save(); // Save the updated user document
    }
  } catch (err) {
    console.error(err);
  }
});*/


// Pre hook for 'save' event on BlogSchema
BlogSchema.pre<Blog>('save', async function () {
  try {
    const user: any = await UserModel.findById(this.author);

    if (user) {
      user.posts.push(this._id); // Add the ID of the new post
      await user.save(); // Save the updated user document
    }
  } catch (err) {
    console.error(err);
  }
});

// Post hook for 'remove' event on BlogSchema
/*BlogSchema.pre<Blog>('remove', async function (doc: Blog) {
  try {
    const user = await UserModel.findById(doc.author);

    if (user) {
      user.posts.pull(doc._id); // Remove the ID of the deleted post
      await user.save(); // Save the updated user document without the post reference
    }
  } catch (err) {
    console.error(err);
  }
});*/




const BlogModel = model('Blog', BlogSchema);

export { BlogModel, Blog };
