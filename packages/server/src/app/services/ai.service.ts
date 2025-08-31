import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { environment } from '../../environment';
import {
  GoogleGenerativeAI,
  ResponseSchema,
  SchemaType,
} from '@google/generative-ai';
import { SetService } from './set.service';
import { emit } from '../clients/websocket';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly setService: SetService) {}

  async getCardInfoFromAI(filename: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(environment.geminiApiKey);

    const sets: string[] = this.setService.get();

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
          format: 'enum',
        },
        collector_number: {
          type: SchemaType.INTEGER,
        },
        foil: {
          type: SchemaType.BOOLEAN,
        },
      },
      required: ['name', 'set', 'collector_number'],
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    this.logger.debug(`filename : ${filename}`);
    const asset = this.fileToGenerativePart(filename, 'image/jpeg');
    const prompt = `You are an expert in Magic: The Gathering trading card game. 
    You are tasked to determine if the given image contains a Magic: The Gathering card.
    If it doesn't contain a card, you MUST return an error status.
    
    If it does contain a card :
    Extract the name, set code, foilness and the collector number from the given image.
    A set code is a string of 3 or 4 characters.
    List of valid of set code : ${sets.join(', ')}.
    Collector number is a number between 1 and 999.
    Be careful, you may find the set size next to the collector number, which is not the collector number.
    The card is considered foil if has a star next to the set code.
    The card is considered non foil if has a dot next to the set code.
    
    You MUST find the card name at the top of the card.
    You MUST find the set code at the bottom left of the card.
    You MUST find the collector number at the bottom left of the card.
    You MUST find the foil attribute at the bottom left of the card, next to the set code. 
    The card is considered foil if it has a star next to the set code, and non foil if it has a dot next to the set code.
    
    If you have found at least one of these attributes, then error MUST be equal to false
    `;

    emit('waiting_ai');
    const generatedResponse = await model.generateContent([prompt, asset]);
    const card = generatedResponse.response.text();
    this.logger.debug(`GoogleGenAI response: ${card}`);
    emit('ai_finished');
    return card;
  }

  private fileToGenerativePart(path: string, mimeType: string) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString('base64'),
        mimeType,
      },
    };
  }
}
