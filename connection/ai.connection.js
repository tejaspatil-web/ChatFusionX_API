import { GoogleGenerativeAI } from "@google/generative-ai";

export class googleGenerativeAI {
  generativeAIConnection() {
    const genAI = new GoogleGenerativeAI(process.env.GEMENIAPIKEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    return model;
  }
}
