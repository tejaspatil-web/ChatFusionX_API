import { googleGenerativeAI } from "../connection/ai.connection.js";

async function getAiResponse(req, res) {
  try {
    const prompt = req.body.prompt;
    const history = req.body.history;
    const generativeAIModel = new googleGenerativeAI();
    const model = generativeAIModel.generativeAIConnection();
    const chat = model.startChat({
      history: history,
    });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json(text);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
}

export { getAiResponse };
