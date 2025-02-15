import { Schema, model, Types } from 'mongoose';

interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  followers: Array<Types.ObjectId>;
  following: Array<Types.ObjectId>;
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
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
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
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

userSchema.virtual('followersCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'followers',
  count: true,
});

userSchema.virtual('followingCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'following',
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
