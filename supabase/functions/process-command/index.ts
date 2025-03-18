
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { analyzeCommand } from "./services/command-analyzer.ts";
import { executeCommand } from "./services/command-executor.ts";
import { generateResponse } from "./services/response-generator.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured. Please set the OPENAI_API_KEY in your Supabase project.');
    }

    const { command } = await req.json();
    
    if (!command) {
      throw new Error('No command provided');
    }

    console.log('Processing command:', command);

    // Step 1: Analyze the command to determine intent and extract entities
    const parsedAnalysis = await analyzeCommand(command, openAIApiKey);
    
    // Step 2: Execute the command based on the analysis
    const result = await executeCommand(parsedAnalysis);
    
    // Step 3: Generate a human-friendly response
    const responseText = await generateResponse(parsedAnalysis, result, openAIApiKey);
    
    return new Response(JSON.stringify({ 
      result,
      parsedCommand: parsedAnalysis,
      responseText
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in process-command function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
