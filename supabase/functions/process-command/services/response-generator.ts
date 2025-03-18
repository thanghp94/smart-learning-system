
export async function generateResponse(analysis: any, result: any, apiKey: string) {
  try {
    // Use OpenAI to generate a friendly response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `Bạn là một trợ lý ảo hỗ trợ quản lý trường học.
            Hãy tạo một phản hồi ngắn gọn, thân thiện về kết quả của hành động được yêu cầu.
            Phản hồi bằng tiếng Việt, ngắn gọn (dưới 100 từ).`
          },
          { 
            role: 'user', 
            content: `Lệnh được phân tích: ${JSON.stringify(analysis)}
            Kết quả thực hiện: ${JSON.stringify(result)}
            Hãy tạo phản hồi phù hợp.`
          }
        ],
        temperature: 0.7,
      }),
    });

    const responseData = await response.json();
    const responseText = responseData.choices[0]?.message?.content || '';
    
    return responseText;
  } catch (error) {
    console.error('Error generating response:', error);
    return result.success 
      ? `Đã thực hiện thành công: ${result.message}`
      : `Không thể thực hiện: ${result.message}`;
  }
}
