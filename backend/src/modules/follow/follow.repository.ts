import Follow from './follow.model.js';

export const followRepository = {
  async findFollow(followerId: string, followingId: string) {
    return Follow.findOne({ follower: followerId, following: followingId });
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
};
