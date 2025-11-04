import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { investorCache } from './auth';

const router = Router();

const investorClassificationSchema = z.object({
  investorType: z.enum(['professional', 'accredited', 'retail']),
});

router.post('/investor-classification', requireAuth, (req: AuthRequest, res) => {
  try {
    const { investorType } = investorClassificationSchema.parse(req.body);
    const user = req.user!;

    investorCache.set(user.sub, investorType);

    res.json({
      success: true,
      investorType,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as investorRouter };
