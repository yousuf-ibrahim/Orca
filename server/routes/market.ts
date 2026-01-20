import { Router } from 'express';
import { getMarketIndices, getMarketNews, getCurrencyRates, getMarketDataStatus } from '../services/marketData';

const router = Router();

router.get('/indices', async (req, res) => {
  try {
    const indices = await getMarketIndices();
    res.json({
      data: indices,
      timestamp: Date.now(),
      source: getMarketDataStatus().hasApiKey ? 'live' : 'mock',
    });
  } catch (error) {
    console.error('Error fetching market indices:', error);
    res.status(500).json({ error: 'Failed to fetch market indices' });
  }
});

router.get('/news', async (req, res) => {
  try {
    const category = (req.query.category as string) || 'general';
    const news = await getMarketNews(category);
    res.json({
      data: news,
      timestamp: Date.now(),
      source: getMarketDataStatus().hasApiKey ? 'live' : 'mock',
    });
  } catch (error) {
    console.error('Error fetching market news:', error);
    res.status(500).json({ error: 'Failed to fetch market news' });
  }
});

router.get('/currencies', async (req, res) => {
  try {
    const currencies = await getCurrencyRates();
    res.json({
      data: currencies,
      timestamp: Date.now(),
      source: getMarketDataStatus().hasApiKey ? 'live' : 'mock',
    });
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    res.status(500).json({ error: 'Failed to fetch currency rates' });
  }
});

router.get('/status', (req, res) => {
  const status = getMarketDataStatus();
  res.json({
    ...status,
    timestamp: Date.now(),
  });
});

export default router;
