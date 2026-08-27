export async function POST(request: Request) {
  const { tweetUrl } = await request.json();
  console.log(`\n[QVAC DEBUG] Starting verification for: ${tweetUrl}`);

  // 1. Extract Tweet ID from URL
  const match = tweetUrl?.match(/status\/(\d+)/);
  if (!match) {
    console.error("[QVAC DEBUG] Invalid URL format");
    return Response.json({ isValid: false, reason: "Invalid tweet URL", confidence: 0 });
  }
  const tweetId = match[1];

  // 2. Fetch tweet text via Composio Twitter API
  let tweetText = "";
  // 2. Fetch tweet text via fxtwitter.com (no API key needed!)
  try {
    // Use regex to replace either x.com or twitter.com with fxtwitter.com once
    const fxUrl = tweetUrl.replace(/(x|twitter)\.com/, "fxtwitter.com");
    console.log(`[QVAC DEBUG] Scraping text from: ${fxUrl}`);
    
    const response = await fetch(fxUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
      }
    });
    const html = await response.text();
    
    // Extract text from <meta property="og:description" content="...">
    const metaMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
    if (metaMatch && metaMatch[1]) {
      // Fix HTML entities
      tweetText = metaMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      console.log(`[QVAC DEBUG] Extracted text via FixTwitter: "${tweetText}"`);
    } else {
      throw new Error("Could not find meta description in HTML");
    }
  } catch (e) {
    console.error("[QVAC DEBUG] Scraping failed:", e);
    return Response.json({
      isValid: false,
      reason: "Could not read tweet text. Is the URL correct?",
      confidence: 0,
    });
  }

  if (!tweetText || tweetText.length < 5) {
    console.warn("[QVAC DEBUG] Tweet text too short or empty");
    return Response.json({
      isValid: false,
      reason: "Tweet content is empty or too short",
      confidence: 0,
    });
  }

  // 3. Send tweet text to QVAC local LLM for AI analysis
  const prompt = `You are a strict content moderator for FRAME OS, a Web3 influencer platform.
Analyze the tweet below. Reply ONLY with a raw JSON object — no explanation, no markdown.

Tweet: "${tweetText.slice(0, 500)}"

Evaluate ALL of the following:
1. Does it mention FRAME OS, @frameonx, the ambassador program, or the waitlist?
2. Is the tone positive or neutral (not hostile or spam)?
3. Is it genuine content (not just emojis or a single word)?
4. Is it at least 5 words long?

Scoring: All 4 met → confidence ~0.9. Only mention → confidence ~0.6. None → isValid: false.

Reply strictly as: {"isValid": true, "reason": "brief reason", "confidence": 0.92}`;

  const QVAC_URL = process.env.QVAC_SERVER_URL || "http://localhost:3001";

  try {
    console.log("[QVAC DEBUG] Sending to local LLM...");
    const response = await fetch(`${QVAC_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "QWEN3_600M_INST_Q4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 80,
      }),
    });

    const data = await response.json();
    console.log("[QVAC DEBUG] Received from LLM:", JSON.stringify(data));
    
    if (data.error) {
      throw new Error(`LLM Error: ${data.error}`);
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from LLM");
    }

    const raw = data.choices[0].message.content.trim();

    const jsonMatch = raw.match(/\{[^}]+\}/);
    if (!jsonMatch) throw new Error("No JSON in QVAC response");
    const result = JSON.parse(jsonMatch[0]);

    console.log(`[QVAC DEBUG] Result: ${result.isValid ? "✅ VALID" : "❌ REJECTED"} (${result.reason})`);
    return Response.json({ ...result, tweetText });
  } catch (error) {
    console.error("[QVAC DEBUG] LLM error:", error);
    return Response.json(
      {
        isValid: false,
        reason: "AI verification offline. Run: qvac serve --port 3001",
        confidence: 0,
      },
      { status: 503 }
    );
  }
}
