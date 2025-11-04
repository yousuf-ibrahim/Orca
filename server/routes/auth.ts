import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { loginRateLimiter, recordLoginAttempt } from '../middleware/rateLimiter';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import NodeCache from 'node-cache';

const router = Router();
const investorCache = new NodeCache({ stdTTL: 0 }); // No expiration for demo

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
  throw new Error('Missing required environment variables: JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH');
}

const loginSchema = z.object({
  username: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', loginRateLimiter, async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  
  try {
    const { username, password } = loginSchema.parse(req.body);

    if (username !== ADMIN_USERNAME) {
      recordLoginAttempt(ip, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!isValid) {
      recordLoginAttempt(ip, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    recordLoginAttempt(ip, true);

    const token = jwt.sign(
      { sub: username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('orcajwt', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    const investorType = investorCache.get<string>(username);

    res.json({
      success: true,
      user: {
        email: username,
        role: 'admin',
        investorType: investorType || null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    recordLoginAttempt(ip, false);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', requireAuth, (req: AuthRequest, res) => {
  const user = req.user!;
  const investorType = investorCache.get<string>(user.sub);

  res.json({
    authenticated: true,
    user: {
      email: user.sub,
      role: user.role,
      investorType: investorType || null,
    },
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('orcajwt');
  res.json({ success: true });
});

export { router as authRouter, investorCache };
