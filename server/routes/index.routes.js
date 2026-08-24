import { Router } from 'express';
import { getInfoAPI } from '../controllers/index.controllers.js';

const router = Router();

router.get("/", getInfoAPI);

export default router;