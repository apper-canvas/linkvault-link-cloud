import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse request body
    const { bookmarkId } = await req.json();

    // Validate input
    if (!bookmarkId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Bookmark ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch bookmark data from database
    const bookmarkResponse = await apperClient.getRecordById('bookmark_c', bookmarkId, {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "url_c"}},
        {"field": {"Name": "description_c"}},
        {"field": {"Name": "tags_c"}}
      ]
    });

    if (!bookmarkResponse.success || !bookmarkResponse.data) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Bookmark not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const bookmark = bookmarkResponse.data;

    // Get OpenAI API key
    const openaiApiKey = await apper.getSecret('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(JSON.stringify({
        success: false,
        message: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare prompt for OpenAI
    const prompt = `Analyze this bookmark and provide a quality score from 1-10 based on the following criteria:

Title: ${bookmark.title_c || 'No title'}
URL: ${bookmark.url_c || 'No URL'}
Description: ${bookmark.description_c || 'No description'}
Tags: ${bookmark.tags_c || 'No tags'}

Scoring Criteria:
- Title clarity and descriptiveness (1-3 points)
- Description quality and informativeness (1-3 points)
- URL credibility and relevance (1-2 points)
- Tags relevance and categorization (1-2 points)

Provide your response in the following JSON format:
{
  "score": <number between 1-10>,
  "reasoning": "<brief explanation of the score>"
}`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a bookmark quality analyzer. Provide concise, objective scores based on the given criteria.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      return new Response(JSON.stringify({
        success: false,
        message: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const openaiData = await openaiResponse.json();
    
    // Parse OpenAI response
    let scoreData;
    try {
      const content = openaiData.choices[0].message.content;
      scoreData = JSON.parse(content);
    } catch (parseError) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to parse OpenAI response'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate score
    const score = parseFloat(scoreData.score);
    if (isNaN(score) || score < 1 || score > 10) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid score received from OpenAI'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update bookmark with score
    const updateResponse = await apperClient.updateRecord('bookmark_c', {
      records: [{
        Id: bookmarkId,
        score_c: score
      }]
    });

    if (!updateResponse.success) {
      return new Response(JSON.stringify({
        success: false,
        message: updateResponse.message || 'Failed to update bookmark score'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: {
        bookmarkId,
        score,
        reasoning: scoreData.reasoning
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});