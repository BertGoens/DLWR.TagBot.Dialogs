import axios from 'axios'
import { logInfo, logSilly } from '../util/logger'
import { LogHandleAxiosError } from '../util/axios-helpers'
import { getStoreUrl } from '../util/store-helper'

const myStoreUrl = getStoreUrl({
	devStore: process.env.KEYWORD_LOCAL_STORE,
	prodStore: process.env.KEYWORD_STORE,
})

logInfo('Keyword StoreUrl:', myStoreUrl)

const store = axios.create({
	baseURL: myStoreUrl,
})

export interface IKeywordCollection {
	documents: [
		{
			id: string
			keyPhrases: string[]
		}
	]
	errors: string[]
}

async function GetKeywords(filepath: string): Promise<IKeywordCollection> {
	const params = '?path=' + encodeURIComponent(filepath)
	const safeParams = encodeURI(params)
	const url = store.defaults.baseURL + safeParams

	try {
		logSilly(url)
		const result = await store.get(safeParams)
		logInfo(result.config.method, result.status, result.config.url)
		return result.data
	} catch (error) {
		LogHandleAxiosError({ error: error, url: url })
	}
}

export const KeywordStore = {
	GetKeywords: GetKeywords,
}
