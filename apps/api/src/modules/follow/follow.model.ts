import { Schema, model, type InferSchemaType } from 'mongoose';

const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Prevent duplicate follows at database level
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export type IFollow = InferSchemaType<typeof followSchema>;
export default model<IFollow>('Follow', followSchema);
