import { Schema, model, Types } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

interface IPost {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  image: string;
  replyTo: Types.ObjectId;
  likes: Array<Types.ObjectId>;
  reposts: Array<Types.ObjectId>;
  comments: Array<Types.ObjectId>;
}

const postSchema: Schema = new Schema<IPost>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: { maxDepth: 1, select: 'username profileImg' },
    },
    content: {
      type: String,
      required: true,
    },
    image: String,
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      autopopulate: { select: 'content' },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reposts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
  },
);
postSchema.plugin(autopopulate);

const Post = model<IPost>('Post', postSchema);
export default Post;
export type { IPost };
