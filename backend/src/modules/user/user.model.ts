import { Schema, model, type InferSchemaType } from 'mongoose';
import { hashPassword } from '#/lib/utils/crypto.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    cover_img: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
    },
    link: {
      type: String,
    },
    location: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    likedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordResetLastSentAt: {
      type: Date,
    },
    // tokenVersion: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
    id: false,
    toObject: {
      virtuals: true,
    },
  },
);
export type IUser = InferSchemaType<typeof userSchema>;

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    const { password: _password, __v, ...userWithoutPassword } = ret;
    return userWithoutPassword;
  },
});

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

export default model<IUser>('User', userSchema);
