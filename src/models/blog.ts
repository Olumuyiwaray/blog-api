import mongoose, { Document, Schema, model } from 'mongoose';
import { User } from './user';
import redis from '../config/redis';
import { IComment } from './comment';

interface IBlog extends Document {
  title: string;
  snippet: string;
  body: string;
  image: string;
  likes: Schema.Types.ObjectId[];
  comments: IComment[];
  author: Schema.Types.ObjectId;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    snippet: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

BlogSchema.index({ title: 'text', snippet: 'text', body: 'text' });

// Pre hook for 'save' event on BlogSchema
BlogSchema.post<IBlog>('save', async function (doc, next) {
  try {
    const user: any = await User.findById(doc.author);

    if (user) {
      user.posts.push(doc._id); // Add the ID of the new post
      await user.save(); // Save the updated user document
    }
  } catch (error: any) {
    next(error);
  }
});

// Post hook for 'remove' event on BlogSchema
BlogSchema.post<IBlog>(
  'deleteOne',
  { document: true, query: false },
  async function (doc, next) {
    try {
      const user = await User.findById(this.author);
      if (user) {
        const postIndex = user.posts.indexOf(this._id);
        user.posts.splice(postIndex, 1);
        await user.save();
      }
    } catch (error: any) {
      next(error);
    }
  }
);

const Blog = model('Blog', BlogSchema);

/**
 * Watches database for changes to blog coolectionc in order to invalidate caches
 */
const setupChangeStream = () => {
  Blog.watch().on('change', (change) => {
    console.log('Change detected:', change);
    if (['insert', 'update', 'delete'].includes(change.operationType)) {
      redis.del('blogs:all');
    }
  });
};

export { Blog, IBlog, setupChangeStream };
