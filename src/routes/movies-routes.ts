import { Router } from 'express';
import { MoviesController } from '../controllers/movies-controller';

const router: Router = Router();

router.get('/awards/intervals', MoviesController.getAwardIntervals);

export default router;