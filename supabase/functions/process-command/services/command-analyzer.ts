
export async function analyzeCommand(command: string, apiKey: string) {
  console.log('Analyzing command:', command);

  const analyzeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `You are an assistant that analyzes commands for a school management system.
          Extract the intent and entities from the command.
          Return ONLY a JSON object with the following structure:
          {
            "intent": "<one of: add_student, send_email, update_student, schedule_class, check_info, other>",
            "confidence": <number between 0 and 1>,
            "entities": {
              "student_name": "<student name if present>",
              "parent_name": "<parent name if present>",
              "phone": "<phone number if present>",
              "email": "<email if present>",
              "class": "<class if present>",
              "subject": "<email subject if it's an email command>",
              "message": "<email message or additional details>"
            }
          }
          Do not include any explanations or additional text, just the JSON.`
        },
        { role: 'user', content: command }
      ],
      temperature: 0.1,
    }),
  });

  const analysisData = await analyzeResponse.json();
  const analysisResult = analysisData.choices[0]?.message?.content || '';
  
  let parsedAnalysis;
  try {
    parsedAnalysis = JSON.parse(analysisResult);
    console.log('Parsed analysis:', parsedAnalysis);
    return parsedAnalysis;
  } catch (e) {
    console.error('Error parsing analysis result:', e);
    console.log('Raw analysis result:', analysisResult);
    throw new Error('Failed to parse command analysis');
  }
}
