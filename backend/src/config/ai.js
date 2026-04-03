const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function requestGeminiFoodSafetyAnalysis({
  foodName,
  foodType,
  preparedAt,
  notes,
  imageBase64,
  imageMimeType,
  nowIsoString,
}) {
  if (!GEMINI_API_KEY) {
    const error = new Error("Gemini API key is not configured.");
    error.status = 500;
    throw error;
  }

  const prompt = `
You are a food safety assistant for donation logistics in India.
Return only strict JSON (no markdown or code fences).

Input:
- Food Name: ${foodName || ""}
- Food Type: ${foodType || ""}
- Prepared At (local): ${preparedAt || ""}
- Current Time (local): ${nowIsoString || ""}
- Storage Notes: ${notes || ""}

Tasks:
1) Identify or confirm the food name.
2) Estimate total safe hours from preparation time in normal conditions.
3) Estimate safe-hour extension if notes indicate refrigeration/cold storage.
4) Estimate spoilage risk and urgency.
5) Provide reason.

JSON schema:
{
  "detectedFoodName": "string",
  "baseSafeHours": number,
  "suggestedStorageExtensionHours": number,
  "spoilageRisk": "Low|Medium|High",
  "urgency": "Low|Medium|High|Do Not Donate",
  "confidence": number,
  "reason": "string"
}
`.trim();

  const parts = [{ text: prompt }];
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType || "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload?.error?.message || "Gemini request failed.");
    error.status = response.status;
    throw error;
  }

  return payload;
}

module.exports = {
  requestGeminiFoodSafetyAnalysis,
};
