import { Request, Response, NextFunction } from 'express';

interface LoginAttempt {
  count: number;
  lockedUntil?: number;
}

const attempts = new Map<string, LoginAttempt>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes

export function loginRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  const attempt = attempts.get(ip);
  
  if (attempt?.lockedUntil && attempt.lockedUntil > now) {
    const remainingMs = attempt.lockedUntil - now;
    const remainingMin = Math.ceil(remainingMs / 60000);
    return res.status(429).json({ 
      error: `Too many login attempts. Try again in ${remainingMin} minute(s)` 
    });
  }

  if (!attempt || (attempt.lockedUntil && attempt.lockedUntil <= now)) {
    attempts.set(ip, { count: 0 });
  }

  next();
}

export function recordLoginAttempt(ip: string, success: boolean) {
  if (success) {
    attempts.delete(ip);
    return;
  }

  const attempt = attempts.get(ip) || { count: 0 };
  attempt.count++;

  if (attempt.count >= MAX_ATTEMPTS) {
    attempt.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }

  attempts.set(ip, attempt);
}
