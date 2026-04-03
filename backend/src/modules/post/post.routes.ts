import { Router } from 'express';
import { protect } from '#/middlewares/auth.middleware.js';
import {
  createPost,
  getPost,
  getFollowingPosts,
  getAllPosts,
  getUserLikedPosts,
  getUserPosts,
  commentOnPost,
  deletePost,
} from './post.controller.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { getPostSchema } from './post.validation.js';

const router = Router();

router.get('/all', protect, getAllPosts);
router.get('/following', protect, getFollowingPosts);
router.get('/likes/:username', protect, getUserLikedPosts);
router.get('/user/:username', protect, getUserPosts);
// router.post("/repost/:postId", protect, repostUndoRepostPost);
router.post('/comment/:postId', protect, commentOnPost);
router.get('/:postId', protect, validate(getPostSchema), getPost);
router.post('/', protect, createPost);
router.delete('/:postId', protect, deletePost);

export default router;
