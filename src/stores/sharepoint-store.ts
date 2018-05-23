import axios, { AxiosResponse } from 'axios'
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
	timeout: 3000,
})

export interface IResponse {
	Documents: IDocument[]
	Fields: IFieldFull[]
}

export interface IFieldBasic {
	Title: string
	Type: string
	Id: string
}

export interface IFieldFull extends IFieldBasic {
	TypeProperties: {}
}

export interface IDocument {
	Title: string
	Tags: string[]
	Path: string
	Author: string
	MissingProperties: IFieldBasic[]
	AvailableTags?: string[]
}

export interface IQueryOptions {
	title?: string[]
	author?: string[]
	filetype?: string[]
}

export async function GetDocuments(q: IQueryOptions): Promise<AxiosResponse<IResponse>> {
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
		// TODO HACK REMOVE ME
		store.defaults.baseURL = 'http://192.168.0.107:8080/speedhack'
		logSilly(url)
		const result = await store.get(safeParams)
		logInfo(result.config.method, result.status, result.config.url)
		// TODO HACK REMOVE ME
		store.defaults.baseURL = 'http://192.168.0.107/api/SharePoint'
		return result
	} catch (error) {
		LogHandleAxiosError({ error: error, url: url })
	}
}

export async function GetTaxonomyValues(taxstoreGuid: string): Promise<AxiosResponse<string[]>> {
	const route = '/GetTaxonomyStoreValues'
	const safeParams = `?guid=${encodeURIComponent(taxstoreGuid)}`
	const url = store.defaults.baseURL + route + safeParams
	try {
		logSilly(url)
		const result = await store.get(route + safeParams)
		logInfo(result.config.method, result.status, result.config.url)
		return result
	} catch (error) {
		LogHandleAxiosError({ error: error, url: url })
	}
}

// TODO Future
export async function SaveDocument(document: IDocument) {
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
