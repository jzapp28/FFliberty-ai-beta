import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { createManualToolStreamResponse } from '@/lib/streaming/create-manual-tool-stream'
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { Model } from '@/lib/types/models'
import { isProviderEnabled } from '@/lib/utils/registry'
import { createMinimaxService } from '@/lib/services/minimax'
import { cookies } from 'next/headers'

export const maxDuration = 30

const DEFAULT_MODEL: Model = {
  id: 'gpt-4o-mini',
  name: 'GPT-4o mini',
  provider: 'OpenAI',
  providerId: 'openai',
  enabled: true,
  toolCallType: 'native'
}

async function handleImageGeneration(messages: any[]) {
  console.log('🎨 Image generation request received')
  
  const minimaxService = createMinimaxService()
  
  if (!minimaxService) {
    console.error('❌ Minimax API key not configured')
    throw new Error('Minimax API key not configured')
  }

  // Get the last user message as the prompt
  const lastMessage = messages[messages.length - 1]
  const prompt = lastMessage?.content || ''

  console.log('🎨 Image prompt:', prompt)

  if (!prompt.trim()) {
    console.error('❌ No prompt provided for image generation')
    throw new Error('No prompt provided for image generation')
  }

  try {
    console.log('🎨 Calling Minimax API...')
    const result = await minimaxService.generateImage(prompt, {
      aspectRatio: '1:1',
      numInferenceSteps: 20,
      guidanceScale: 7.5
    })

    console.log('✅ Minimax API response received:', result)

    const imageUrls = (result.data as any)?.image_urls || result.data || []
    
    // Create content with markdown image
    let content = `I've generated an image for you: "${prompt}"\n\n`
    
    if (Array.isArray(imageUrls)) {
      imageUrls.forEach((url: string, index: number) => {
        content += `![Generated Image ${index + 1}](${url})\n\n`
      })
    } else if (typeof imageUrls === 'string') {
      content += `![Generated Image](${imageUrls})\n\n`
    }

    console.log('🎨 Returning image content:', content)

    // Create a proper AI SDK data stream response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send text delta in AI SDK format
        const textData = `0:"${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`
        controller.enqueue(encoder.encode(textData))
        
        // Send finish message
        const finishData = `d:{"finishReason":"stop","usage":{"promptTokens":1,"completionTokens":1}}\n`
        controller.enqueue(encoder.encode(finishData))
        
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })

  } catch (error) {
    console.error('❌ Minimax image generation error:', error)
    
    const errorMessage = `Sorry, I encountered an error generating the image: ${error instanceof Error ? error.message : 'Unknown error'}`
    
    // Create error stream in AI SDK format
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const textData = `0:"${errorMessage.replace(/"/g, '\\"')}"\n`
        controller.enqueue(encoder.encode(textData))
        
        const finishData = `d:{"finishReason":"stop","usage":{"promptTokens":1,"completionTokens":1}}\n`
        controller.enqueue(encoder.encode(finishData))
        
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  }
}

export async function POST(req: Request) {
  try {
    const { messages, id: chatId, chatMode } = await req.json()
    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')
    const userId = await getCurrentUserId()

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const modelJson = cookieStore.get('selectedModel')?.value
    const searchMode = cookieStore.get('search-mode')?.value === 'true'
    
    console.log('🔍 Search Mode Debug:', {
      searchModeCookie: cookieStore.get('search-mode')?.value,
      searchMode,
      chatMode
    })

    // Handle image generation mode with Minimax
    if (chatMode === 'image') {
      return await handleImageGeneration(messages)
    }

    let selectedModel = DEFAULT_MODEL

    if (modelJson) {
      try {
        selectedModel = JSON.parse(modelJson) as Model
      } catch (e) {
        console.error('Failed to parse selected model:', e)
      }
    }

    if (
      !isProviderEnabled(selectedModel.providerId) ||
      selectedModel.enabled === false
    ) {
      return new Response(
        `Selected provider is not enabled ${selectedModel.providerId}`,
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    }

    const supportsToolCalling = selectedModel.toolCallType === 'native'

    return supportsToolCalling
      ? createToolCallingStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode,
          userId,
          chatMode
        })
      : createManualToolStreamResponse({
          messages,
          model: selectedModel,
          chatId,
          searchMode,
          userId,
          chatMode
        })
  } catch (error) {
    console.error('API route error:', error)
    return new Response('Error processing your request', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
