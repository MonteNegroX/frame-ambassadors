export async function POST(request: Request) {
  const { tweetUrl } = await request.json();

  // 1. Extract Tweet ID from URL
  // Supports: x.com/user/status/ID and twitter.com/user/status/ID
  const match = tweetUrl?.match(/status\/(\d+)/);
  if (!match) {
    return Response.json({ isValid: false, reason: "Invalid tweet URL", confidence: 0 });
  }
  const tweetId = match[1];

  // 2. Fetch tweet text via Composio Twitter API
  let tweetText = "";
  try {
    const composioRes = await fetch(
      "https://backend.composio.dev/api/v3/tools/execute/TWITTER_RECENT_SEARCH",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.COMPOSIO_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity_id: process.env.COMPOSIO_ENTITY_ID,
          connected_account_id: process.env.COMPOSIO_CONNECTION_ID,
          arguments: {
            query: `conversation_id:${tweetId}`,
            tweet_fields: ["text"],
          },
        }),
      }
    );
    const composioData = await composioRes.json();
    tweetText =
      composioData?.data?.data?.[0]?.text ||
      composioData?.data?.text ||
      "";
  } catch (e) {
    console.error("[QVAC] Composio fetch failed:", e);
    return Response.json({
      isValid: false,
      reason: "Could not fetch tweet. Is it public?",
      confidence: 0,
    });
  }

  if (!tweetText) {
    return Response.json({
      isValid: false,
      reason: "Tweet not found or account is protected",
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
    const response = await fetch(`${QVAC_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "LLAMA_3_2_1B_INST_Q4_0",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 80,
      }),
    });

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();
    // Extract JSON even if the LLM adds surrounding text
    const jsonMatch = raw.match(/\{[^}]+\}/);
    if (!jsonMatch) throw new Error("No JSON in QVAC response");
    const result = JSON.parse(jsonMatch[0]);

    // Return result + original tweet text for UI preview
    return Response.json({ ...result, tweetText });
  } catch (error) {
    console.error("[QVAC] LLM error:", error);
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
