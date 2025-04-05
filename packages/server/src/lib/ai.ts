import { GoogleGenerativeAI, ResponseSchema, SchemaType } from '@google/generative-ai';
import * as fs from 'fs';
import { emit } from './websocket';
import { fetchSets } from './sets';

function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

export async function getCardInfoFromAI(filename: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY ?? '';
  if (!apiKey || apiKey === '') {
    throw new Error('GEMINI_API_KEY is not set');
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  let sets = fetchSets().map((set) => set.toUpperCase());

  const schema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      error: {
        type: SchemaType.BOOLEAN,
        nullable: false,
      },
      name: {
        type: SchemaType.STRING,
      },
      set: {
        type: SchemaType.STRING,
        enum: sets,
      },
      collector_number: {
        type: SchemaType.INTEGER,
      },
      foil: {
        type: SchemaType.BOOLEAN
      }
    },
    required: ["name", "set", "collector_number"]
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
    You are tasked to determine if the given image contains a Magic: The Gathering card.
    If it doesn't contain a card, you should return an error status.
    
    If it does contain a card :
    Extract the name, set code, foilness and the collector number from the given image.
    A set code is a string of 3 or 4 characters.
    List of valid of set code : ${sets.join(', ')}.
    Collector number is a number between 1 and 999.
    The card is considered foil if has a star next to the set code.
    The card is considered non foil if has a dot next to the set code.
    
    You MUST find the card name at the top of the card.
    You MUST find the set code at the bottom left of the card.
    You MUST find the collector number at the bottom left of the card.
    You MUST find the foil attribute at the bottom left of the card, next to the set code.
    
    Then, error should be false.
    `;

  emit('waiting_ai');
  const generatedResponse = await model.generateContent([prompt, asset]);
  const card = generatedResponse.response.text();
  emit('ai_finished');
  return card;
}

