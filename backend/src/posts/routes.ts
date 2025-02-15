import { Router } from 'express';
import protectRoute from '../middleware/protectRoute';
import {
  createPost,
  getPost,
  getFollowingPosts,
  getAllPosts,
  getUserLikedPosts,
  getUserPosts,
  likeUnlikePost,
  commentOnPost,
  deletePost,
} from './controller';

const router = Router();

router.get('/all', protectRoute, getAllPosts);

router.get('/following', protectRoute, getFollowingPosts);

router.get('/likes/:username', protectRoute, getUserLikedPosts);

router.get('/user/:username', protectRoute, getUserPosts);

router.post('/like/:postId', protectRoute, likeUnlikePost);

// router.post("/repost/:postId", protectRoute, repostUndoRepostPost);

router.post('/comment/:postId', protectRoute, commentOnPost);

router.get('/:postId', protectRoute, getPost);

router.post('/', protectRoute, createPost);
router.delete('/:postId', protectRoute, deletePost);

export default router;
