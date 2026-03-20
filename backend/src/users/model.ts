import { Schema, model, Types } from 'mongoose';
import { hashPassword } from '../lib/utils/crypto.js';

interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  profileImg: string;
  coverImg: string;
  bio: string;
  link: string;
  likedPosts: Array<Types.ObjectId>;
}

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't return password by default
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImg: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...userWithoutPassword } = ret;
        return userWithoutPassword;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    if (err instanceof Error) {
      next(err);
    } else {
      next(new Error('An unknown error occurred while hashing the password'));
    }
  }
});

userSchema.virtual('followersCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  count: true,
});

userSchema.virtual('followingCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'follower',
  count: true,
});

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('totalPosts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  count: true, // And only get the number of docs
});

const User = model<IUser>('User', userSchema);
export default User;
export type { IUser };
