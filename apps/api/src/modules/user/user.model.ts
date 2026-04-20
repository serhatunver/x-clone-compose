import { Schema, model, type InferSchemaType, type HydratedDocument, type Query } from 'mongoose';
import { hashPassword } from '#/lib/utils/auth.utils.js';

export const USER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export const USER_STATUS_VALUES = Object.values(USER_STATUS);

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
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [30, 'Display name cannot exceed 30 characters'],
    },
    avatar: {
      type: String,
      default: null,
    },
    coverImage: {
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
    followersCount: { type: Number, default: 0, min: [0, 'Followers count cannot be negative'] },
    followingCount: { type: Number, default: 0, min: [0, 'Following count cannot be negative'] },
    totalPosts: { type: Number, default: 0, min: [0, 'Total posts cannot be negative'] },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.PENDING,
    },
    lastLogin: {
      type: Date,
    },
    lastActive: {
      type: Date,
    },
    suspendedAt: {
      type: Date,
    },
    deactivatedAt: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    emailVerificationLastSentAt: {
      type: Date,
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
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
    id: false,
  },
);

userSchema.index({ status: 1 });
userSchema.index({ username: 1, status: 1 });
userSchema.index({ email: 1, status: 1 });

userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    const { password: _password, ...userWithoutPassword } = ret;
    return userWithoutPassword;
  },
});

userSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    const { password: _password, ...userWithoutPassword } = ret;
    return userWithoutPassword;
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await hashPassword(this.password);
});

userSchema.pre(/^find/, function (this: Query<unknown, IUser>) {
  const filter = this.getFilter();

  if (filter.status == undefined) {
    this.where({ status: 'active' });
  }
});

export type IUser = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<IUser>;
export default model<IUser>('User', userSchema);
