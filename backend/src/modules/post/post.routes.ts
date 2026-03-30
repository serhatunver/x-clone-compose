import { Router } from 'express';
import protectRoute from '#/middleware/protectRoute.js';
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
import { validate } from '#/middleware/validate.middleware.js';
import { getPostSchema } from './post.validation.js';

const router = Router();

router.get('/all', protectRoute, getAllPosts);

router.get('/following', protectRoute, getFollowingPosts);

router.get('/likes/:username', protectRoute, getUserLikedPosts);

router.get('/user/:username', protectRoute, getUserPosts);

// router.post("/repost/:postId", protectRoute, repostUndoRepostPost);

router.post('/comment/:postId', protectRoute, commentOnPost);

router.get('/:postId', protectRoute, validate(getPostSchema), getPost);

router.post('/', protectRoute, createPost);
router.delete('/:postId', protectRoute, deletePost);

export default router;
