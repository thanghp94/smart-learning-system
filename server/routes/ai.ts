import type { Express, Request, Response } from "express";
import { handleError } from "./utils";

export const registerAIRoutes = (app: Express) => {
  // AI Command processing route
  app.post("/api/ai/generate", async (req: Request, res: Response) => {
    try {
      const { prompt, model = 'gpt-4o-mini', type = 'text' } = req.body;

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(400).json({ 
          error: 'OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.' 
        });
      }

      if (type === 'image') {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: '1024x1024',
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'Failed to generate image');
        }

        res.json({ 
          imageUrls: data.data.map((img: any) => img.url),
          data: data
        });
      } else {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: 'You are a helpful assistant that provides information for a school management system.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'Failed to generate text');
        }

        const generatedText = data.choices[0]?.message?.content || '';
        res.json({ generatedText, data });
      }
    } catch (error) {
      handleError(res, error, 'AI generation failed');
    }
  });
};
