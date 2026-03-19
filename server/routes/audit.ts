import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '../db';
import { audits } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

const SYSTEM_PROMPT = `You are Orca's infrastructure intelligence engine. You analyze hedge fund and asset manager operational tech stacks and produce expert Infrastructure Audit Reports.

You have deep operational experience across portfolio management systems (Geneva, d1g1t, Addepar), reconciliation between custodians and shadow NAV systems, OMS/EMS trade lifecycle, market data vendor management, risk system integration, and data warehouse architecture.

Be specific. Name real failure modes by their actual names. Reference real system integration patterns. If a fund has no OMS, say exactly what breaks. If they use Geneva and Interactive Brokers with no middleware, name the specific reconciliation failures that creates. Never use generic consulting language. Sound like a COO who has fixed these problems at 20 funds.

Output ONLY valid JSON, no markdown, no preamble:
{
  "executive_summary": "2-3 sentences. Specific. What is the headline risk and maturity level.",
  "maturity_score": <1-10 integer>,
  "maturity_label": <"Early Stage"|"Developing"|"Functional"|"Mature"|"Institutional">,
  "critical_risks": [
    {
      "title": "short title",
      "description": "1-2 sentences, specific to their actual systems",
      "severity": <"Critical"|"High"|"Medium">,
      "affected_systems": ["system1", "system2"]
    }
  ],
  "integration_gaps": [
    {
      "title": "short title",
      "description": "what is missing or manual between these systems",
      "between": ["system_a", "system_b"],
      "consequence": "what actually breaks when this gap exists"
    }
  ],
  "quick_wins": [
    {
      "title": "action title",
      "description": "exactly what to do and why",
      "effort": <"Low"|"Medium"|"High">,
      "impact": <"Low"|"Medium"|"High">,
      "time_to_value": "e.g. 1 week"
    }
  ],
  "roadmap": [
    {
      "phase": <1|2|3>,
      "title": "phase name",
      "timeline": "e.g. Weeks 1-4",
      "actions": ["specific action 1", "specific action 2"],
      "outcome": "what the fund has at the end of this phase"
    }
  ],
  "orca_recommendation": "One paragraph. What Orca would specifically do first for this fund, why, and what the outcome would be. Concrete, not generic."
}`;

router.post('/generate', async (req, res) => {
  try {
    const { formData, firmName } = req.body;

    if (!formData || !firmName) {
      return res.status(400).json({ error: 'formData and firmName are required' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
    }

    const client = new Anthropic({ apiKey });

    const userMessage = `Please analyze this hedge fund's infrastructure and generate a detailed audit report:

${JSON.stringify(formData, null, 2)}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    let report: any;
    try {
      report = JSON.parse(content.text);
    } catch {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        report = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from Claude response');
      }
    }

    const [audit] = await db.insert(audits).values({
      firmName,
      formData,
      report,
    }).returning();

    res.json({ id: audit.id });
  } catch (error: any) {
    console.error('Audit generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate audit report' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid audit ID' });
    }

    const [audit] = await db.select().from(audits).where(eq(audits.id, id));
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json(audit);
  } catch (error: any) {
    console.error('Error fetching audit:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch audit' });
  }
});

export default router;
