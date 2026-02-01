import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')

interface GenerateRequest {
  title: string
  category?: string
  style?: 'clean' | 'professional' | 'tech' | 'minimal'
  type?: 'project' | 'book' | 'video' | 'profile'
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
  }

  const styleDesc = styleDescriptions[style || 'professional']
  const typeDesc = typeContext[type || 'project']

  let prompt = `Create a ${type === 'video' ? '16:9 aspect ratio' : 'square'} thumbnail image for a ${typeDesc} titled "${title}".`
  
  if (category) {
    prompt += ` The category is ${category}.`
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

    const body: GenerateRequest = await req.json()
    const { title, category, style, type } = body

    if (!title?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Generating image for: "${title}" (${type}, ${style})`)

    const prompt = buildPrompt(body)
    console.log('Prompt:', prompt)

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
      const errorText = await response.text()
      console.error('AI API error:', response.status, errorText)
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('AI response received')

    // Extract the image URL from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data))
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

    console.log('Image stored successfully:', publicUrl)

    return new Response(
      JSON.stringify({ url: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate image' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
