import axios from 'axios'
import { LogHandleAxiosError } from '../util/axios-helpers'
import { logInfo, logSilly } from '../util/logger'
import { getStoreUrl } from '../util/store-helper'

const myStoreUrl = getStoreUrl({
	devStore: process.env.SHAREPOINT_LOCAL_STORE,
	prodStore: process.env.SHAREPOINT_STORE,
})

logInfo('SharePoint StoreUrl:', myStoreUrl)

const store = axios.create({
	baseURL: myStoreUrl,
})

export interface IDocument {
	Title: string
	Tags: string[]
	Path: string
	Author: string
	MissingProperties: string
	AvailableTags: string[]
}

export interface IQueryOptions {
	title?: string[]
	author?: string[]
	filetype?: string[]
}

async function GetDocuments(q: IQueryOptions): Promise<IDocument[]> {
	// match the query language
	// https://docs.microsoft.com/en-us/sharepoint/dev/general-development/keyword-query-language-kql-syntax-reference
	// Example url:
	// http://....?searchquery=(filetype:docx) (filetype:txt)
	const fillParams = (q: IQueryOptions) => {
		let result = '?searchQuery='

		if (q.title) {
			q.title.forEach((myTitle) => {
				result += `(title:${encodeURIComponent(myTitle)}*) `
			})
		}
		if (q.author) {
			q.author.forEach((myAuthor) => {
				result += `(author:${encodeURIComponent(myAuthor)}*) `
			})
		}
		if (q.filetype) {
			q.filetype.forEach((myFiletype) => {
				result += `(filetype:${encodeURIComponent(myFiletype)}) `
			})
		}

		return result
	}

	const params = fillParams(q)
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

async function SaveDocument(document: IDocument) {
	const tagUrlArray = document.Tags.map((myTag) => {
		return '&tags=' + encodeURIComponent(myTag)
	})
	const params = `?file=${encodeURIComponent(document.Path)}${tagUrlArray.join('')}`
	const safeParams = encodeURI(params)

	const url = store.defaults.baseURL + safeParams

	try {
		logSilly(url)
		const result = await store.post(safeParams)
		logInfo(result.config.method, result.status, result.config.url)
		return result.data
	} catch (error) {
		LogHandleAxiosError({ error: error, url: url })
	}
}

export const SharePointStore = {
	GetDocuments: GetDocuments,
	SaveDocument: SaveDocument,
}
