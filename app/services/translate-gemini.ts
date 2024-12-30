import { google } from '@ai-sdk/google'
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
  const tokens = source.length

  const sections =
    tokens > MAX_TOKENS ? splitMarkdownByHeaders(source) : [source]

  let finalDestinationText = ''

  try {
    for (const section of sections) {
      const ret = await generateText({
        model: google('gemini-2.0-flash-exp'),
        system: systemPrompt,
        prompt: section,
      })
      finalDestinationText += `${ret.text}\n`
    }

    return {
      type: 'success',
      destinationText: finalDestinationText,
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
