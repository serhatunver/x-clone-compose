import { Router } from 'express';
import userRoutes from '#/modules/user/user.routes.js';
import postRoutes from '#/modules/post/post.routes.js';
import authRoutes from '#/modules/auth/auth.routes.js';
import followRoutes from '#/modules/follow/follow.routes.js';

const v1Router = Router();

v1Router.use('/user', userRoutes);
v1Router.use('/post', postRoutes);
v1Router.use('/auth', authRoutes);
v1Router.use('/follow', followRoutes);

export default v1Router;
