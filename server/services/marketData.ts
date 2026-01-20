import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 });

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

interface MarketQuote {
  symbol: string;
  name: string;
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  category: string;
  related: string;
}

const INDEX_SYMBOLS = [
  { symbol: 'SPY', name: 'S&P 500 ETF', displayName: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ-100 ETF', displayName: 'NASDAQ' },
  { symbol: 'DIA', name: 'Dow Jones ETF', displayName: 'DOW' },
  { symbol: 'IWM', name: 'Russell 2000 ETF', displayName: 'Russell 2000' },
];

const CURRENCY_PAIRS = [
  { symbol: 'OANDA:EUR_USD', name: 'EUR/USD' },
  { symbol: 'OANDA:GBP_USD', name: 'GBP/USD' },
  { symbol: 'OANDA:USD_JPY', name: 'USD/JPY' },
  { symbol: 'OANDA:USD_CHF', name: 'USD/CHF' },
];

async function fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function getMarketIndices(): Promise<MarketQuote[]> {
  const cacheKey = 'market_indices';
  const cached = cache.get<MarketQuote[]>(cacheKey);
  if (cached) return cached;

  if (!FINNHUB_API_KEY) {
    return getMockMarketIndices();
  }

  try {
    const quotes = await Promise.all(
      INDEX_SYMBOLS.map(async ({ symbol, displayName }) => {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const response = await fetchWithTimeout(url);
        if (!response.ok) throw new Error(`Failed to fetch ${symbol}`);
        const data = await response.json();
        
        return {
          symbol,
          name: displayName,
          current: data.c || 0,
          change: data.d || 0,
          changePercent: data.dp || 0,
          high: data.h || 0,
          low: data.l || 0,
          open: data.o || 0,
          previousClose: data.pc || 0,
          timestamp: data.t ? data.t * 1000 : Date.now(),
        };
      })
    );

    cache.set(cacheKey, quotes, 30);
    return quotes;
  } catch (error) {
    console.error('Error fetching market indices:', error);
    return getMockMarketIndices();
  }
}

export async function getMarketNews(category = 'general'): Promise<NewsArticle[]> {
  const cacheKey = `market_news_${category}`;
  const cached = cache.get<NewsArticle[]>(cacheKey);
  if (cached) return cached;

  if (!FINNHUB_API_KEY) {
    return getMockNews();
  }

  try {
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_API_KEY}`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();

    const articles: NewsArticle[] = data.slice(0, 20).map((item: any) => ({
      id: item.id?.toString() || `${item.datetime}-${item.headline?.slice(0, 20)}`,
      headline: item.headline || '',
      summary: item.summary || '',
      source: item.source || 'Unknown',
      url: item.url || '',
      image: item.image || '',
      datetime: item.datetime ? item.datetime * 1000 : Date.now(),
      category: item.category || 'general',
      related: item.related || '',
    }));

    cache.set(cacheKey, articles, 300);
    return articles;
  } catch (error) {
    console.error('Error fetching market news:', error);
    return getMockNews();
  }
}

export async function getCurrencyRates(): Promise<MarketQuote[]> {
  const cacheKey = 'currency_rates';
  const cached = cache.get<MarketQuote[]>(cacheKey);
  if (cached) return cached;

  if (!FINNHUB_API_KEY) {
    return getMockCurrencyRates();
  }

  try {
    const quotes = await Promise.all(
      CURRENCY_PAIRS.map(async ({ symbol, name }) => {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const response = await fetchWithTimeout(url);
        if (!response.ok) throw new Error(`Failed to fetch ${symbol}`);
        const data = await response.json();

        return {
          symbol: name,
          name,
          current: data.c || 0,
          change: data.d || 0,
          changePercent: data.dp || 0,
          high: data.h || 0,
          low: data.l || 0,
          open: data.o || 0,
          previousClose: data.pc || 0,
          timestamp: data.t ? data.t * 1000 : Date.now(),
        };
      })
    );

    cache.set(cacheKey, quotes, 60);
    return quotes;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return getMockCurrencyRates();
  }
}

function getMockMarketIndices(): MarketQuote[] {
  const now = Date.now();
  return [
    { symbol: 'SPY', name: 'S&P 500', current: 596.42, change: 3.21, changePercent: 0.54, high: 598.10, low: 593.80, open: 594.50, previousClose: 593.21, timestamp: now },
    { symbol: 'QQQ', name: 'NASDAQ', current: 518.73, change: 5.82, changePercent: 1.13, high: 520.50, low: 514.20, open: 515.00, previousClose: 512.91, timestamp: now },
    { symbol: 'DIA', name: 'DOW', current: 438.52, change: -1.23, changePercent: -0.28, high: 440.10, low: 436.80, open: 439.00, previousClose: 439.75, timestamp: now },
    { symbol: 'IWM', name: 'Russell 2000', current: 224.18, change: 2.45, changePercent: 1.10, high: 225.50, low: 222.30, open: 223.00, previousClose: 221.73, timestamp: now },
  ];
}

function getMockCurrencyRates(): MarketQuote[] {
  const now = Date.now();
  return [
    { symbol: 'EUR/USD', name: 'EUR/USD', current: 1.0842, change: 0.0023, changePercent: 0.21, high: 1.0860, low: 1.0815, open: 1.0830, previousClose: 1.0819, timestamp: now },
    { symbol: 'GBP/USD', name: 'GBP/USD', current: 1.2654, change: -0.0018, changePercent: -0.14, high: 1.2680, low: 1.2630, open: 1.2670, previousClose: 1.2672, timestamp: now },
    { symbol: 'USD/JPY', name: 'USD/JPY', current: 156.42, change: 0.85, changePercent: 0.55, high: 156.80, low: 155.60, open: 155.90, previousClose: 155.57, timestamp: now },
    { symbol: 'USD/CHF', name: 'USD/CHF', current: 0.9012, change: 0.0015, changePercent: 0.17, high: 0.9025, low: 0.8990, open: 0.9000, previousClose: 0.8997, timestamp: now },
  ];
}

function getMockNews(): NewsArticle[] {
  const now = Date.now();
  return [
    {
      id: '1',
      headline: 'Fed Signals Potential Rate Cuts in 2025 as Inflation Cools',
      summary: 'Federal Reserve officials hinted at possible interest rate reductions later this year as inflation continues to moderate toward the central bank\'s 2% target.',
      source: 'Reuters',
      url: 'https://reuters.com',
      image: '',
      datetime: now - 1800000,
      category: 'economy',
      related: 'SPY,QQQ,TLT',
    },
    {
      id: '2',
      headline: 'Tech Giants Rally on Strong Earnings Outlook',
      summary: 'Major technology companies led market gains after analysts raised earnings forecasts citing robust demand for AI-related products and services.',
      source: 'Bloomberg',
      url: 'https://bloomberg.com',
      image: '',
      datetime: now - 3600000,
      category: 'technology',
      related: 'AAPL,MSFT,GOOGL,NVDA',
    },
    {
      id: '3',
      headline: 'Oil Prices Surge Amid Middle East Supply Concerns',
      summary: 'Crude oil futures jumped over 3% as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.',
      source: 'Financial Times',
      url: 'https://ft.com',
      image: '',
      datetime: now - 5400000,
      category: 'commodities',
      related: 'XLE,USO,CVX',
    },
    {
      id: '4',
      headline: 'European Markets Close Higher on ECB Policy Optimism',
      summary: 'European equities ended the session with gains as investors anticipate a more accommodative monetary policy stance from the European Central Bank.',
      source: 'WSJ',
      url: 'https://wsj.com',
      image: '',
      datetime: now - 7200000,
      category: 'markets',
      related: 'EFA,VGK,FEZ',
    },
    {
      id: '5',
      headline: 'Bond Yields Retreat as Safe-Haven Demand Increases',
      summary: 'Treasury yields fell across the curve as investors sought safety amid global economic uncertainty and mixed corporate earnings reports.',
      source: 'CNBC',
      url: 'https://cnbc.com',
      image: '',
      datetime: now - 9000000,
      category: 'bonds',
      related: 'TLT,IEF,BND',
    },
    {
      id: '6',
      headline: 'Hedge Funds Increase Bets on Emerging Markets',
      summary: 'Major hedge funds are increasing their exposure to emerging market equities, citing attractive valuations and improving economic fundamentals.',
      source: 'Bloomberg',
      url: 'https://bloomberg.com',
      image: '',
      datetime: now - 10800000,
      category: 'markets',
      related: 'EEM,VWO,IEMG',
    },
  ];
}

export function getMarketDataStatus(): { hasApiKey: boolean; cacheStats: any } {
  return {
    hasApiKey: !!FINNHUB_API_KEY,
    cacheStats: cache.getStats(),
  };
}
