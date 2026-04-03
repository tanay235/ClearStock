const { checkFoodSafety } = require("../services/aiService");

async function runFoodSafetyCheck(req, res, next) {
  try {
    const { foodName, preparedAt, foodType, notes, imageBase64, imageMimeType } = req.body || {};

    if (!foodName || !preparedAt) {
      return res.status(400).json({
        message: "foodName and preparedAt are required.",
      });
    }

    const result = await checkFoodSafety({
      foodName,
      preparedAt,
      foodType,
      notes,
      imageBase64,
      imageMimeType,
    });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  runFoodSafetyCheck,
};
