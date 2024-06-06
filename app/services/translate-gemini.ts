import { calcTokenCostUSD, callGemini } from './gemini'

interface TranslateSuccess {
  type: 'success'
  destinationText: string
  inputTokens?: number
  outputTokens?: number
  cost?: number
}

interface TranslateError {
  type: 'error'
  error: string
}

const MODEL = 'gemini-1.5-flash-latest' as const

interface TranslateProps {
  systemPrompt: string
  source: string
}
export const translateByGemini = async ({
  systemPrompt,
  source,
}: TranslateProps): Promise<TranslateSuccess | TranslateError> => {
  try {
    const response = await callGemini({
      system: systemPrompt,
      model: MODEL,
      maxTokens: 8192,
      message: source,
    })

    return {
      type: 'success',
      destinationText: response.content,
      inputTokens: response.usage?.promptTokenCount,
      outputTokens: response.usage?.candidatesTokenCount,
      cost: response.usage && calcTokenCostUSD(MODEL, response.usage),
    }
  } catch (e) {
    let errorMessage = ''
    if (e instanceof Error) {
      errorMessage = `${e.name}: ${e.message}, ${e.stack}`
    } else {
      errorMessage = String(e)
    }
    return { type: 'error', error: errorMessage }
  }
}
