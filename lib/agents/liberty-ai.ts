import { CoreMessage, smoothStream } from 'ai'
import { getModel, isReasoningModel } from '../utils/registry'

const LIBERTY_AI_PROMPT = `
You are Liberty AI, a fast, intelligent assistant. Be concise, helpful, and conversational. You can answer general questions, provide explanations, and assist with creative or technical queries in natural language. Keep responses friendly and professional.

1. Provide clear, direct answers to user questions
2. Be conversational and engaging while maintaining professionalism
3. Handle general questions, creative prompts, summarization, and simple code help
4. Use markdown formatting for better readability when appropriate
5. Be balanced and informative without strong bias
6. Keep responses concise but comprehensive
7. Focus on being helpful and informative in a natural, friendly manner
`

const LIBERTY_R1_PROMPT = `
You are Liberty AI powered by DeepSeek R1, an advanced reasoning assistant. Use your reasoning capabilities to think through problems step by step. When faced with complex questions, break them down logically and show your reasoning process.

1. Think through problems systematically and show your reasoning
2. Be thorough and accurate in your analysis
3. Provide detailed explanations when dealing with complex topics
4. Use your reasoning capabilities for mathematical, logical, and analytical problems
5. Be conversational and engaging while maintaining depth
6. Use markdown formatting for better readability
7. Focus on providing comprehensive, well-reasoned responses
`

interface LibertyAIConfig {
  messages: CoreMessage[]
  model: string
}

interface LibertyAIReturn {
  model: any
  system: string
  messages: CoreMessage[]
  temperature: number
  topP: number
  topK: number
  experimental_transform: any
}

export function libertyAI({
  messages,
  model
}: LibertyAIConfig): LibertyAIReturn {
  try {
    const currentDate = new Date().toLocaleString()
    const isReasoning = isReasoningModel(model)

    const systemPrompt = isReasoning 
      ? `${LIBERTY_R1_PROMPT}\nCurrent date and time: ${currentDate}`
      : `${LIBERTY_AI_PROMPT}\nCurrent date and time: ${currentDate}`

    return {
      model: getModel(model),
      system: systemPrompt,
      messages,
      temperature: isReasoning ? 0.3 : 0.7, // Lower temperature for reasoning models
      topP: 1,
      topK: 40,
      experimental_transform: smoothStream()
    }
  } catch (error) {
    console.error('Error in libertyAI:', error)
    throw error
  }
}