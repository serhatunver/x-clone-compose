import { Schema, model, type InferSchemaType } from 'mongoose';
import { hashPassword } from '#/lib/utils/auth.utils.js';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [4, 'Username must be at least 4 characters'],
      maxlength: [15, 'Username cannot exceed 15 characters'],
      match: [/^[a-z_][a-z0-9_]*$/, 'Invalid username format'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format'],
      minlength: [5, 'Email too short'],
      maxlength: [255, 'Email too long'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't return password by default
    },
    avatar: {
      type: String,
      default: null,
    },
    cover_img: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [160, 'Bio cannot exceed 160 characters'],
    },
    link: {
      type: String,
      trim: true,
      maxlength: [100, 'Link cannot exceed 100 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [30, 'Location cannot exceed 30 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
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

userSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    const { password: _password, __v, ...userWithoutPassword } = ret;
    return userWithoutPassword;
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await hashPassword(this.password);
});

userSchema.virtual('avatarUrl').get(function () {
  if (this.avatar) return this.avatar;
  return `https://api.dicebear.com/9.x/lorelei/svg?backgroundColor=0D8ABC&seed=${this.username}`;
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
