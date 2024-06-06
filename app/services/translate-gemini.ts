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

type GeminiModel = Parameters<typeof callGemini>[0]['model']

interface TranslateProps {
  systemPrompt: string
  model: GeminiModel
  source: string
}
export const translateByGemini = async ({
  systemPrompt,
  model,
  source,
}: TranslateProps): Promise<TranslateSuccess | TranslateError> => {
  try {
    const response = await callGemini({
      system: systemPrompt,
      model,
      maxTokens: 8192,
      message: source,
    })

    return {
      type: 'success',
      destinationText: response.content,
      inputTokens: response.usage?.promptTokenCount,
      outputTokens: response.usage?.candidatesTokenCount,
      cost: response.usage && calcTokenCostUSD(model, response.usage),
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
