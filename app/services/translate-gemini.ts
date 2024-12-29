import { splitMarkdownByHeaders } from '~/libs/split-markdown'
import { calcTokenCostUSD, callGemini, countTokens } from './gemini'

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

const MODEL = 'gemini-2.0-flash-exp' as const
const MAX_TOKENS = 8192 as const

interface TranslateProps {
  systemPrompt: string
  source: string
}

export const translateByGemini = async ({
  systemPrompt,
  source,
}: TranslateProps): Promise<TranslateSuccess | TranslateError> => {
  const tokens = await countTokens(source, MODEL)

  const sections =
    tokens > MAX_TOKENS ? splitMarkdownByHeaders(source) : [source]

  let finalDestinationText = ''
  let totalInputTokens = 0
  let totalOutputTokens = 0
  let totalCost = 0

  try {
    for (const section of sections) {
      const response = await callGemini({
        system: systemPrompt,
        model: MODEL,
        maxTokens: MAX_TOKENS,
        message: section,
      })

      finalDestinationText += `${response.content}\n`
      totalInputTokens += response.usage?.promptTokenCount || 0
      totalOutputTokens += response.usage?.candidatesTokenCount || 0
      totalCost += response.usage ? calcTokenCostUSD(MODEL, response.usage) : 0
    }

    return {
      type: 'success',
      destinationText: finalDestinationText,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      cost: totalCost,
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
