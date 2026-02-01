import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting: simple in-memory store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

// Input validation
function validateInput(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const { action, content, secret } = body;
  
  if (!secret || typeof secret !== 'string') {
    return { valid: false, error: 'Admin authentication required' };
  }
  
  if (!action || typeof action !== 'string') {
    return { valid: false, error: 'Action is required' };
  }
  
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Content is required' };
  }
  
  // Prevent excessively long inputs (potential abuse)
  if (content.length > 10000) {
    return { valid: false, error: 'Content too long (max 10000 characters)' };
  }
  
  // Validate action is a known type
  const validActions = [
    'write_description', 'improve', 'professional', 'shorten', 'seo_summary',
    'write_bio', 'recruiter_language', 'ats_optimize', 'add_impact',
    'one_liner', 'interview_points', 'value_proposition', 'resume_bullets'
  ];
  
  if (!validActions.includes(action)) {
    return { valid: false, error: 'Invalid action' };
  }
  
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Input validation
    const validation = validateInput(body);
    if (!validation.valid) {
      console.error('AI Writer validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { action, content, context, secret } = body;
    
    // Admin authentication check
    const adminSecret = Deno.env.get('ADMIN_SECRET');
    if (!adminSecret || secret !== adminSecret) {
      console.error('AI Writer: Unauthorized access attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Rate limiting by action type
    if (isRateLimited(`ai-writer-${action}`)) {
      console.warn('AI Writer: Rate limit exceeded');
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'write_description':
        systemPrompt = `You are a professional portfolio writer. Write compelling, concise descriptions for portfolio items. 
Focus on impact, achievements, and value. Use active voice and professional tone. 
Keep descriptions between 2-4 sentences unless specified otherwise.`;
        userPrompt = `Write a professional description for ${context?.type || 'this item'}: "${content}"
${context?.techStack ? `Tech stack: ${context.techStack}` : ''}
${context?.category ? `Category: ${context.category}` : ''}`;
        break;

      case 'improve':
        systemPrompt = `You are an expert editor. Improve the given text to be more professional, clear, and engaging.
Maintain the original meaning but enhance the language and structure.`;
        userPrompt = `Improve this text for a professional portfolio:\n\n"${content}"`;
        break;

      case 'professional':
        systemPrompt = `You are a corporate communications expert. Transform casual text into polished, professional content suitable for executive audiences.`;
        userPrompt = `Make this text more professional and polished:\n\n"${content}"`;
        break;

      case 'shorten':
        systemPrompt = `You are a concise writer. Condense text to its essential message while keeping it impactful.
Aim for 1-2 sentences maximum.`;
        userPrompt = `Shorten this for a portfolio card:\n\n"${content}"`;
        break;

      case 'seo_summary':
        systemPrompt = `You are an SEO specialist. Create search-optimized summaries that include relevant keywords naturally.
Focus on discoverability and engagement.`;
        userPrompt = `Create an SEO-friendly summary for this ${context?.type || 'content'}:\n\n"${content}"`;
        break;

      case 'write_bio':
        systemPrompt = `You are a professional biography writer. Create compelling, authentic bios that highlight expertise and personality.
Use third person unless specified. Keep it engaging but professional.`;
        userPrompt = `Write a professional bio based on this information:\n${content}`;
        break;

      case 'recruiter_language':
        systemPrompt = `You are a recruiter who reads hundreds of resumes daily. Rewrite content to immediately grab a recruiter's attention.
Use the Problem → Solution → Outcome format. Lead with impact. Use active verbs. Be specific about achievements.
Keep it scannable - recruiters spend 6-15 seconds on first pass.`;
        userPrompt = `Rewrite this project description in recruiter-friendly language:\n\n"${content}"
${context?.techStack ? `Tech stack: ${context.techStack}` : ''}`;
        break;

      case 'ats_optimize':
        systemPrompt = `You are an ATS (Applicant Tracking System) optimization expert. Enhance content to match keywords that recruiters search for.
Include industry-standard terminology. Use exact skill names (e.g., "Python" not "programming"). 
Make the content keyword-rich but natural-sounding.`;
        userPrompt = `Optimize this for ATS systems and recruiter keyword searches:\n\n"${content}"
${context?.category ? `Field: ${context.category}` : ''}`;
        break;

      case 'add_impact':
        systemPrompt = `You are a metrics-focused resume writer. Add measurable impact statements to descriptions.
If no specific numbers are provided, suggest realistic placeholder metrics (XX%, X hours saved, etc).
Focus on: time saved, efficiency improved, revenue impact, scale achieved, problems solved.`;
        userPrompt = `Add measurable impact to this description:\n\n"${content}"`;
        break;

      case 'one_liner':
        systemPrompt = `You are a headline writer for tech portfolios. Create punchy, impactful one-line summaries.
Format: [Action verb] + [what you built] + [measurable result].
Example: "Built NLP pipeline reducing review time by 60%"`;
        userPrompt = `Create a powerful one-line summary for:\n\n"${content}"`;
        break;

      case 'interview_points':
        systemPrompt = `You are an interview coach. Generate 3-4 talking points for discussing this project in interviews.
Format each point as: 
- Challenge faced
- Technical decision made  
- Result achieved
Keep points concise and story-ready.`;
        userPrompt = `Generate interview talking points for this project:\n\n"${content}"
${context?.techStack ? `Tech used: ${context.techStack}` : ''}`;
        break;

      case 'value_proposition':
        systemPrompt = `You are a personal branding expert. Write a compelling value proposition for a tech professional.
Keep it to 1-2 sentences. Focus on: what you do + who you help + unique value you bring.
Make it memorable and recruiter-ready.`;
        userPrompt = `Write a value proposition based on:\n\n"${content}"`;
        break;

      case 'resume_bullets':
        systemPrompt = `You are a resume bullet point expert. Generate 3-5 strong resume bullet points.
Each bullet should: start with a power verb, include metrics when possible, highlight technical skills.
Format: • [Power verb] [what you did] [impact/result]`;
        userPrompt = `Generate resume bullet points for:\n\n"${content}"
${context?.techStack ? `Tech stack: ${context.techStack}` : ''}`;
        break;

      default:
        systemPrompt = `You are a helpful writing assistant for a professional portfolio website.`;
        userPrompt = content;
    }

    console.log(`AI Writer: Processing ${action} request (admin authenticated)`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service is busy. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('AI gateway error:', response.status);
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content?.trim() || '';

    console.log(`AI Writer: Generated ${generatedText.length} chars for ${action}`);

    return new Response(
      JSON.stringify({ text: generatedText }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Writer error:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
