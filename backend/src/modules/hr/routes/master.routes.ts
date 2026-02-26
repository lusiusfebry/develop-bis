import { Router } from 'express';
import { authenticate } from '../../../middlewares/auth.middleware';
import { MasterEntityConfig } from '../dto/master.dto';
import { createMasterController } from '../controllers/master.controller';

// ── Factory Function ───────────────────────────────────────────────

export function createMasterRouter(config: MasterEntityConfig): Router {
    const router = Router();
    const controller = createMasterController(config);

    // Semua route dilindungi middleware authenticate
    router.use(authenticate);

    router.get('/', controller.list);
    router.get('/:id', controller.getOne);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.patch('/:id/status', controller.toggleStatus);

    return router;
}
