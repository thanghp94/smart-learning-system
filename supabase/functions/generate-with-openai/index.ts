
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY in your Supabase project.');
    }

    const { prompt, model = 'gpt-4o-mini', type = 'text' } = await req.json();

    if (type === 'image') {
      // Generate image using DALL-E 3
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
      
      return new Response(JSON.stringify({ 
        imageUrls: data.data.map((img: any) => img.url),
        data: data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Text generation with GPT
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

      return new Response(JSON.stringify({ generatedText, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-with-openai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
