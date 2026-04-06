const express = require('express');

const generatePricingSuggestion = async (req, res) => {
    const { base_price, occupancy, occasions, historical_summary, demand_matrix } = req.body;

    const prompt = `You are Roomora AI Pricing Expert for Indian hotels.
Analyze the hotel data and suggest the best room price + multiplier.
Prioritize: high occupancy, major Indian occasions (Diwali, Holi, Eid, Christmas, weddings, local festivals), competitor demand, and historical patterns.
Be conservative but profitable. Return ONLY valid JSON. No explanations outside JSON.

Data Context:
- Base Price: ${base_price}
- Current Occupancy: ${occupancy}%
- Upcoming Occasions: ${JSON.stringify(occasions)}
- Historical Summary: ${historical_summary || 'N/A'}
- Demand Matrix: ${JSON.stringify(demand_matrix || {})}

Return JSON EXACTLY like this:
{
  "suggested_price": number,
  "multiplier": number,
  "reasoning": "short 1-2 sentence explanation in simple English",
  "confidence": number,
  "occasion_impact": "e.g. Diwali surge +45%"
}`;

    try {
        const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.3';

        const ollamaRes = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: ollamaModel,
                prompt: prompt,
                stream: false,
                format: 'json'
            })
        });

        if (!ollamaRes.ok) {
            throw new Error(`Ollama API error: ${ollamaRes.status} ${ollamaRes.statusText}`);
        }

        const data = await ollamaRes.json();
        const result = JSON.parse(data.response);

        // Audit Logging Logic equivalent: AI requests should also be audited or at least cleanly passed
        console.log(`[Ollama AI] Suggestion generated for base ${base_price} at ${occupancy}% occupancy.`);
        
        return res.json(result);
    } catch (err) {
        console.error('[Ollama Error]:', err.message);
        return res.status(503).json({
            error: "AI suggestion unavailable",
            fallback: "Use manual multiplier"
        });
    }
};

module.exports = { generatePricingSuggestion };
