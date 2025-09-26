import { Router, Request, Response } from 'express';
import { systemProcessController } from '../controllers/systemController';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('hello, sysyem');
});

//프로세스 정보 반환
router.get('/proc', systemProcessController);

export default router;