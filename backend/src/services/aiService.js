const { requestGeminiFoodSafetyAnalysis } = require("../config/ai");

const DEFAULT_SAFE_HOURS = 8;
const SAFE_HOURS_BY_FOOD = [
  { keywords: ["rabdi", "curd", "yogurt", "milk", "cream"], hours: 6 },
  { keywords: ["paneer", "chicken", "fish", "egg", "meat"], hours: 8 },
  { keywords: ["rice", "pulao", "pulav", "dal", "curry", "sabzi"], hours: 10 },
  { keywords: ["barfi", "besan", "ladoo", "sweet"], hours: 16 },
  { keywords: ["dry", "roti", "paratha"], hours: 12 },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pickSafeHours(foodName) {
  const lowerName = String(foodName || "").toLowerCase();
  const matched = SAFE_HOURS_BY_FOOD.find(item =>
    item.keywords.some(keyword => lowerName.includes(keyword))
  );
  return matched ? matched.hours : DEFAULT_SAFE_HOURS;
}

function parseGeminiJsonFromResponse(payload) {
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      return JSON.parse(match[0]);
    } catch (nestedError) {
      return null;
    }
  }
}

function getStorageExtensionFromNotes(notes, baseSafeHours) {
  const normalized = String(notes || "").toLowerCase();
  if (!normalized) {
    return 0;
  }

  if (/(frozen|freezer|deep freeze)/.test(normalized)) {
    return 48;
  }
  if (/(fridge|refrigerat|cold storage|chiller)/.test(normalized)) {
    return Math.max(10, Math.round(baseSafeHours * 1.5));
  }
  if (/(insulated|cool box|ice pack)/.test(normalized)) {
    return 6;
  }
  return 0;
}

function getRiskAndUrgency(remainingHours) {
  if (remainingHours <= 0) {
    return { spoilageRisk: "High", urgency: "Do Not Donate" };
  }
  if (remainingHours <= 4) {
    return { spoilageRisk: "Medium", urgency: "High" };
  }
  if (remainingHours <= 8) {
    return { spoilageRisk: "Low", urgency: "Medium" };
  }
  return { spoilageRisk: "Low", urgency: "Low" };
}

async function checkFoodSafety({ foodName, preparedAt, foodType, notes, imageBase64, imageMimeType }) {
  const preparedTimestamp = new Date(preparedAt).getTime();
  if (Number.isNaN(preparedTimestamp)) {
    const error = new Error("Invalid preparedAt value.");
    error.status = 400;
    throw error;
  }

  const now = Date.now();
  const elapsedHours = Math.max(0, (now - preparedTimestamp) / (1000 * 60 * 60));

  let detectedFoodName = foodName;
  let baseSafeHours = pickSafeHours(foodName);
  let aiSuggestedStorageExtensionHours = 0;
  let aiReason = "";
  let aiConfidence = 0.65;
  let source = "fallback-rules";

  try {
    const rawGeminiResponse = await requestGeminiFoodSafetyAnalysis({
      foodName,
      foodType,
      preparedAt,
      notes,
      imageBase64,
      imageMimeType,
      nowIsoString: new Date(now).toISOString(),
    });

    const parsed = parseGeminiJsonFromResponse(rawGeminiResponse);
    if (parsed) {
      detectedFoodName = parsed.detectedFoodName || detectedFoodName;
      if (typeof parsed.baseSafeHours === "number") {
        baseSafeHours = clamp(parsed.baseSafeHours, 1, 96);
      }
      if (typeof parsed.suggestedStorageExtensionHours === "number") {
        aiSuggestedStorageExtensionHours = clamp(parsed.suggestedStorageExtensionHours, 0, 96);
      }
      if (typeof parsed.confidence === "number") {
        aiConfidence = clamp(parsed.confidence, 0.1, 0.99);
      }
      aiReason = parsed.reason || "";
      source = "gemini";
    }
  } catch (error) {
    source = "fallback-rules";
  }

  const notesStorageExtensionHours = getStorageExtensionFromNotes(notes, baseSafeHours);
  const totalSafeHours = clamp(
    baseSafeHours + Math.max(aiSuggestedStorageExtensionHours, notesStorageExtensionHours),
    1,
    168
  );

  const remainingHours = Math.max(0, totalSafeHours - elapsedHours);
  const isSafe = remainingHours > 0;
  const { spoilageRisk, urgency } = getRiskAndUrgency(remainingHours);

  const reasons = [];
  reasons.push(`Estimated total safe window: ${totalSafeHours} hours from preparation.`);
  if (notesStorageExtensionHours > 0) {
    reasons.push(
      `Storage note detected ("${notes}"), extension applied (+${notesStorageExtensionHours}h).`
    );
  }
  if (aiReason) {
    reasons.push(aiReason);
  }

  return {
    isSafe,
    status: isSafe ? "Safe" : "Unsafe",
    detectedFoodName,
    spoilageRisk,
    estimatedExpiryHours: Number(remainingHours.toFixed(1)),
    estimatedExpiryAt: new Date(now + remainingHours * 60 * 60 * 1000).toISOString(),
    confidence: Number(aiConfidence.toFixed(2)),
    urgency,
    baseSafeHours,
    storageExtensionHours: Math.max(aiSuggestedStorageExtensionHours, notesStorageExtensionHours),
    totalSafeHours,
    source,
    reason: reasons.join(" "),
  };
}

module.exports = {
  checkFoodSafety,
};
