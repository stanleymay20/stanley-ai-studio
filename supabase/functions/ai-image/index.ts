import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')

// Rate limiting: simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window (lower for image generation)
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

interface GenerateRequest {
  title: string
  category?: string
  style?: 'clean' | 'professional' | 'tech' | 'minimal'
  type?: 'project' | 'book' | 'video' | 'profile' | 'course'
  secret: string
}

// Input validation
function validateInput(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const { title, secret, style, type } = body;
  
  if (!secret || typeof secret !== 'string') {
    return { valid: false, error: 'Admin authentication required' };
  }
  
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Title is required' };
  }
  
  if (title.length > 500) {
    return { valid: false, error: 'Title too long (max 500 characters)' };
  }
  
  // Validate style if provided
  const validStyles = ['clean', 'professional', 'tech', 'minimal'];
  if (style && !validStyles.includes(style)) {
    return { valid: false, error: 'Invalid style' };
  }
  
  // Validate type if provided
  const validTypes = ['project', 'book', 'video', 'profile', 'course'];
  if (type && !validTypes.includes(type)) {
    return { valid: false, error: 'Invalid type' };
  }
  
  return { valid: true };
}

function buildPrompt(options: GenerateRequest): string {
  const { title, category, style, type } = options

  const styleDescriptions: Record<string, string> = {
    clean: 'Clean, modern aesthetic with soft gradients, minimal elements, and a fresh color palette',
    professional: 'Professional, corporate-friendly design with elegant typography and subtle geometric patterns',
    tech: 'Futuristic tech aesthetic with circuit patterns, code elements, neural networks, and AI-inspired visuals in blue/purple tones',
    minimal: 'Ultra-minimalist design with bold typography, lots of white space, and single accent colors',
  }

  const typeContext: Record<string, string> = {
    project: 'software project or tech application',
    book: 'book cover with elegant and literary aesthetic',
    video: 'video thumbnail that is eye-catching and dynamic',
    profile: 'professional portrait background or avatar style',
    course: 'online course or educational content',
  }

  const styleDesc = styleDescriptions[style || 'professional']
  const typeDesc = typeContext[type || 'project']

  // Sanitize title to prevent prompt injection
  const sanitizedTitle = title.replace(/[<>{}[\]]/g, '').substring(0, 200);

  let prompt = `Create a ${type === 'video' || type === 'course' ? '16:9 aspect ratio' : type === 'book' ? '3:4 portrait' : 'square'} thumbnail image for a ${typeDesc} titled "${sanitizedTitle}".`
  
  if (category) {
    const sanitizedCategory = String(category).replace(/[<>{}[\]]/g, '').substring(0, 100);
    prompt += ` The category is ${sanitizedCategory}.`
  }

  prompt += ` Style: ${styleDesc}. The image should be portfolio-safe, clean, and professional. Do not include any text or words in the image - it should be purely visual/abstract. Ultra high resolution.`

  return prompt
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    
    // Input validation
    const validation = validateInput(body);
    if (!validation.valid) {
      console.error('AI Image validation failed:', validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { title, category, style, type, secret } = body as GenerateRequest

    // Admin authentication check
    const adminSecret = Deno.env.get('ADMIN_SECRET');
    if (!adminSecret || secret !== adminSecret) {
      console.error('AI Image: Unauthorized access attempt');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    if (isRateLimited('ai-image-generation')) {
      console.warn('AI Image: Rate limit exceeded');
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`AI Image: Generating for "${title}" (${type}, ${style}) - admin authenticated`)

    const prompt = buildPrompt(body as GenerateRequest)

    // Call the Lovable AI API for image generation
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      })
    })

    if (!response.ok) {
      console.error('AI API error:', response.status)
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('AI response received')

    // Extract the image URL from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url

    if (!imageUrl) {
      console.error('No image in response')
      throw new Error('No image generated')
    }

    // Upload the base64 image to Supabase storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Decode base64 image
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '')
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

    // Generate filename
    const fileName = `ai-generated/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('Failed to store generated image')
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(fileName)

    console.log('AI Image: Stored successfully')

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Image error:', error instanceof Error ? error.message : 'Unknown error')
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
