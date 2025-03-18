import { google } from '@ai-sdk/google'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { generateText } from 'ai'
import { splitMarkdownByHeaders } from '~/libs/split-markdown'

interface TranslateSuccess {
  type: 'success'
  destinationText: string
}

interface TranslateError {
  type: 'error'
  error: string
}

export const countTokens = async (text: string, model: string) => {
  const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '',
  )
  const genModel = genAI.getGenerativeModel({ model })
  const result = await genModel.countTokens(text)
  return result.totalTokens
}

const MAX_TOKENS = 8192 as const

interface TranslateProps {
  systemPrompt: string
  source: string
}

export const translateByGemini = async ({
  systemPrompt,
  source,
}: TranslateProps): Promise<TranslateSuccess | TranslateError> => {
  const tokens = await countTokens(source, 'gemini-2.0-flash')

  const sections =
    tokens > MAX_TOKENS ? splitMarkdownByHeaders(source) : [source]

  let finalDestinationText = ''

  try {
    for (const section of sections) {
      const ret = await generateText({
        model: google('gemini-2.0-flash'),
        system: systemPrompt,
        prompt: section,
        experimental_continueSteps: true,
      })
      finalDestinationText += `${ret.text}\n`
    }

    return {
      type: 'success',
      destinationText: finalDestinationText,
    }
  } catch (e) {
    console.log(e)
    let errorMessage = ''
    if (e instanceof Error) {
      errorMessage = `${e.name}: ${e.message}, ${e.stack}`
    } else {
      errorMessage = String(e)
    }
    return { type: 'error', error: errorMessage }
  }
}
