import { Schema, model, Types } from 'mongoose';

export interface IFollow {
  follower: Types.ObjectId; // The one who follows
  following: Types.ObjectId; // The one being followed
  createdAt: Date;
}

const followSchema = new Schema<IFollow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Prevent duplicate follows at database level
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export default model<IFollow>('Follow', followSchema);
