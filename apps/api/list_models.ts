import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({});
  const response = await ai.models.list();
  for await (const model of response) {
    console.log(model.name);
  }
}
main().catch(console.error);
