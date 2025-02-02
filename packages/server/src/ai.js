const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const sets = require('./sets.json');

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function getAIInfo(filename) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const schema = {
    "type": "object",
    "properties": {
      "name": {
        type: "string",
        nullable: false,
      },
      "set": {
        "type": "string",
        nullable: false,
      },
      "collector_number": {
        "type": "number",
        nullable: false,
      }
    }
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const asset = fileToGenerativePart(filename, 'image/jpeg');
  const prompt =
    `You are an expert in Magic: The Gathering trading card game. 
    Extract the name, set code and the collector number from the image.
    List of valid of set code : ${sets.join(', ')}.
    Collector number is a number between 1 and 999.`;

  const generatedResponse = await model.generateContent([prompt, asset]);
  const card = generatedResponse.response.text();
  console.log(card)
  return card;
}

module.exports = { getCardInfoFromAI: getAIInfo };
