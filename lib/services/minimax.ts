interface MinimaxImageRequest {
  model: string
  prompt: string
  aspect_ratio?: string
  num_inference_steps?: number
  guidance_scale?: number
}

interface MinimaxImageResponse {
  id: string
  created: number
  data: Array<{
    url: string
    revised_prompt?: string
  }>
}

export class MinimaxService {
  private apiKey: string
  private baseUrl = 'https://api.minimax.io/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateImage(prompt: string, options?: {
    aspectRatio?: string
    numInferenceSteps?: number
    guidanceScale?: number
  }): Promise<MinimaxImageResponse> {
    const requestBody: MinimaxImageRequest = {
      model: 'image-01',
      prompt,
      aspect_ratio: options?.aspectRatio || '1:1',
      num_inference_steps: options?.numInferenceSteps || 20,
      guidance_scale: options?.guidanceScale || 7.5
    }

    console.log('Minimax API Request:', {
      url: `${this.baseUrl}/image_generation`,
      body: requestBody,
      headers: {
        'Authorization': `Bearer ${this.apiKey.substring(0, 20)}...`,
        'Content-Type': 'application/json'
      }
    })

    const response = await fetch(`${this.baseUrl}/image_generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Minimax API Response Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Minimax API Error:', errorText)
      throw new Error(`Minimax API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Minimax API Success:', result)
    return result
  }
}

export function createMinimaxService(): MinimaxService | null {
  const apiKey = process.env.MINIMAX_API_KEY
  
  if (!apiKey) {
    console.warn('MINIMAX_API_KEY not found in environment variables')
    return null
  }

  return new MinimaxService(apiKey)
}

