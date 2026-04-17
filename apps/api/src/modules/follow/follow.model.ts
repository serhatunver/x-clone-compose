import { Schema, model, type InferSchemaType, type HydratedDocument } from 'mongoose';
import { ERROR_KEYS } from '@repo/shared';

const followSchema = new Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1 });
followSchema.index({ follower: 1, createdAt: -1 });
followSchema.index({ following: 1, createdAt: -1 });

followSchema.pre('save', function () {
  if (this.follower.equals(this.following)) {
    throw new Error(ERROR_KEYS.FOLLOW.CANNOT_FOLLOW_SELF);
  }
});

followSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    const { __v, ...follow } = ret;
    return follow;
  },
});

followSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret) => {
    const { __v, ...follow } = ret;
    return follow;
  },
});

export type IFollow = InferSchemaType<typeof followSchema>;
export type FollowDocument = HydratedDocument<IFollow>;

export default model<IFollow>('Follow', followSchema);
