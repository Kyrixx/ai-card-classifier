const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const fs = require('fs');
const sets = require('./sets.json');
const { io } = require('./websocket');

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

  let parse = [...JSON.parse(fs.readFileSync('./src/sets.json').toString())];

  const schema = {
    "type": "object",
    "properties": {
      "name": {
        type: SchemaType.STRING,
        nullable: false,
      },
      "set": {
        "type": SchemaType.STRING,
        nullable: false,
        enum: parse,
      },
      "collector_number": {
        "type": SchemaType.INTEGER,
        nullable: false,
        minimum: 1,
        maximum: 999
      },
      "foil": {
        type: SchemaType.BOOLEAN
      }
    },
    "required": ["name", "set", "collector_number"]
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const asset = fileToGenerativePart(filename, 'image/jpeg');
  const prompt =
    `You are an expert in Magic: The Gathering trading card game. 
    Extract the name, set code, foilness and the collector number from the given image.
    A set code is a string of 3 or 4 characters.
    List of valid of set code : ${sets.join(', ')}.
    Collector number is a number between 1 and 999.
    The card is considered foil if has a star next to the set code.
    The card is considered non foil if has a dot next to the set code.
    
    You MUST find the card name at the top of the card.
    You MUST find the set code at the bottom left of the card.
    You MUST find the collector number at the bottom left of the card.
    You MUST find the foil attribute at the bottom left of the card.
    `;

  io.emit('waiting_ai');
  const generatedResponse = await model.generateContent([prompt, asset]);
  const card = generatedResponse.response.text();
  io.emit('ai_finished');
  return card;
}

module.exports = { getCardInfoFromAI: getAIInfo };
