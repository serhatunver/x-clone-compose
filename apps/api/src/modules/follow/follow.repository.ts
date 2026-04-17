import Follow from './follow.model.js';
// import { Types } from 'mongoose';

export const followRepository = {
  async findFollow(followerId: string, followingId: string) {
    return Follow.findOne({ follower: followerId, following: followingId }).lean();
  },

  async createFollow(followerId: string, followingId: string) {
    return Follow.create({ follower: followerId, following: followingId });
  },

  async deleteFollow(followerId: string, followingId: string) {
    return Follow.deleteOne({ follower: followerId, following: followingId });
  },

  async getFollowingIds(userId: string) {
    const following = await Follow.find({ follower: userId }).select('following').lean();
    return following.map((f) => f.following.toString());
  },

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const count = await Follow.countDocuments({ follower: followerId, following: followingId });
    return count > 0;
  },

  async getFollowers(userId: string, limit = 20, skip = 0) {
    return await Follow.find({ following: userId })
      .populate('follower', 'username avatar displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  // async getFollowers(userId: string, limit = 20, skip = 0) {
  //   return await Follow.aggregate()
  //     .match({ following: new Types.ObjectId(userId) })
  //     .lookup({
  //       from: 'users',
  //       localField: 'follower',
  //       foreignField: '_id',
  //       as: 'followerDetails',
  //     })
  //     .unwind('$followerDetails')
  //     .project({
  //       _id: 1,
  //       createdAt: 1,
  //       follower: {
  //         _id: '$followerDetails._id',
  //         username: '$followerDetails.username',
  //         avatar: '$followerDetails.avatar',
  //         displayName: '$followerDetails.displayName',
  //       },
  //     })
  //     .sort({ createdAt: -1 })
  //     .skip(skip)
  //     .limit(limit)
  //     .exec();
  // },

  async getFollowing(userId: string, limit = 20, skip = 0) {
    return await Follow.find({ follower: userId })
      .populate('following', 'username avatar displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  // async getFollowing(userId: string, limit = 20, skip = 0) {
  //   return await Follow.aggregate()
  //     .match({ follower: new Types.ObjectId(userId) })
  //     .lookup({
  //       from: 'users',
  //       localField: 'following',
  //       foreignField: '_id',
  //       as: 'followingDetails',
  //     })
  //     .unwind('$followingDetails')
  //     .project({
  //       _id: 1,
  //       createdAt: 1,
  //       following: {
  //         _id: '$followingDetails._id',
  //         username: '$followingDetails.username',
  //         avatar: '$followingDetails.avatar',
  //         displayName: '$followingDetails.displayName',
  //       },
  //     })
  //     .sort({ createdAt: -1 })
  //     .skip(skip)
  //     .limit(limit)
  //     .exec();
  // },
};
