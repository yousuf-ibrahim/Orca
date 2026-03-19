import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '../db';
import { audits } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

const SYSTEM_PROMPT = `You are the infrastructure intelligence engine for Orca, an operational consulting firm that has mapped and fixed the tech stacks of 30+ hedge funds and asset managers between $50M and $1B AUM.

Your job is to produce an Infrastructure Audit Report that reads like it was written by a COO who has personally fixed these exact problems at funds running these exact systems. Not a consultant. Not an AI. Someone who has been in the reconciliation break at 11pm before a board meeting.

SPECIFICITY RULES:
- Never say "reconciliation may have gaps." Say which systems produce which file formats, where the identifier mismatch occurs, and what breaks when it does.
- Never say "manual processes create risk." Say which process, how long it takes, what the failure mode looks like, and what a LP or auditor sees when it fails.
- Never say "consider implementing an OMS." Say what specifically breaks when you don't have one — which step in the trade lifecycle becomes an email thread, where the settlement failures accumulate, and what the reconciliation forensics look like when a break goes undetected.
- Always name the specific systems from the fund's inventory when describing failure modes.

KNOWN FAILURE MODES TO DRAW FROM (use these as a reference for specificity — adapt to the fund's actual systems):
- Geneva↔prime broker reconciliation breaks on corporate actions because Geneva uses SEDOL/ISIN and IB reports in ticker — any reorganization, spin-off, or rights issue creates a silent position mismatch
- Without an OMS, the trade lifecycle from execution to settlement lives in email threads and broker portals — breaks require forensics across multiple inboxes with no audit trail
- SS&C shadow NAV manually reconciled against PMS at month-end creates a window of 1–2 days where reported NAV and book NAV are unreconciled — any LP redemption request during this window is a liability
- Bloomberg PORT running off manually uploaded Excel position snapshots means risk is always 12–24 hours stale — factor exposures calculated on yesterday's positions
- No data warehouse means every report is assembled from scratch each time — IR letters, regulatory reports, and board decks all require manual data pulls from 3–5 sources with no lineage
- Market data from multiple vendors with no normalization layer means the same security may have different prices in different reports depending on which source was queried last
- Manual cash ladder means treasury decisions are made on a spreadsheet that is as stale as the last time someone updated it

COST QUANTIFICATION:
For each critical risk and integration gap, include a rough cost estimate where possible — in time (hours/month), in dollars (at a blended ops cost of $75/hr), or in risk exposure (what a failure event looks like).

Output ONLY valid JSON, no markdown fences, no preamble:
{
  "headline": "One sentence. The single most important thing about this fund's infrastructure. Should make a COO stop and read.",
  "executive_summary": "3-4 sentences. Written for a COO or CIO, not a technologist. What is the maturity level, what is the top risk, and what is the consequence of leaving it unaddressed.",
  "maturity_score": <1-10>,
  "maturity_label": <"Early Stage"|"Developing"|"Functional"|"Mature"|"Institutional">,
  "top_priority": {
    "title": "The single most important thing to fix first",
    "why": "Why this one above all others — what is the specific risk or cost",
    "what_orca_does": "Exactly what Orca does to fix this, in concrete terms",
    "timeline": "How long it takes",
    "outcome": "What the fund has when it is done"
  },
  "critical_risks": [
    {
      "title": "short title",
      "description": "Specific. Names the systems. Names the failure mode. Quantifies the cost or exposure where possible.",
      "severity": <"Critical"|"High"|"Medium">,
      "affected_systems": ["system1", "system2"],
      "cost_estimate": "e.g. 8 hrs/month of ops time (~$600/month) or exposure: silent NAV error risk at month-end"
    }
  ],
  "integration_gaps": [
    {
      "title": "short title",
      "description": "What is missing between these systems",
      "between": ["system_a", "system_b"],
      "consequence": "What actually breaks — specific, not generic",
      "fix": "What closing this gap looks like in practice"
    }
  ],
  "action_plan": [
    {
      "when": <"This week"|"This month"|"This quarter">,
      "action": "Specific action, assigned to a role",
      "role": <"Ops Team"|"IT"|"External Vendor"|"Leadership">,
      "effort": <"Low"|"Medium"|"High">,
      "impact": <"Low"|"Medium"|"High">,
      "outcome": "What changes"
    }
  ],
  "orca_engagement": {
    "recommended_start": "Where Orca would begin and why",
    "first_30_days": "What Orca delivers in the first 30 days",
    "investment": "Rough engagement scope",
    "roi_framing": "How to think about the cost vs the risk of not fixing this"
  }
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
      max_tokens: 6000,
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
