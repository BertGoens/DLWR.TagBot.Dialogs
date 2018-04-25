import axios from 'axios'
import { logInfo, logSilly } from '../util/logger'
import { LogHandleAxiosError } from '../util/axios-helpers'
import { getStoreUrl } from '../util/store-helper'

const myStoreUrl = getStoreUrl({
	devStore: process.env.SETTINGS_LOCAL_STORE,
	prodStore: process.env.SETTINGS_STORE,
})

logInfo('Settings StoreUrl:', myStoreUrl)

const store = axios.create({
	baseURL: myStoreUrl,
})

export interface ISettings {
	userId?: string
	channelId?: string
	botMutedUntill?: Date
	lastMessageSent?: Date
}

async function GetSettingsById(id: string, channel?: string): Promise<ISettings> {
	const safeParams = `?id=${encodeURIComponent(id)}`
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

async function SaveSettingsById(id: string, settings: ISettings): Promise<ISettings> {
	const safeParams = `?id=${encodeURIComponent(id)}`
	const url = store.defaults.baseURL + safeParams
	try {
		logSilly(url)
		const result = await store.put(safeParams, settings)
		logInfo(result.config.method, result.status, result.config.url)
		return result.data
	} catch (error) {
		LogHandleAxiosError({ error: error, url: url })
	}
}

async function CreateSettings(settings: ISettings): Promise<ISettings> {
	const safeParams = ''
	const url = store.defaults.baseURL + safeParams
	try {
		const result = await store.post(safeParams, settings)
		logInfo(result.config.method, result.status, result.config.url)
		return result.data
	} catch (error) {
		LogHandleAxiosError({ error: error, url: url })
	}
}

export const SettingsStore = {
	CreateSettings: CreateSettings,
	SaveSettingsById: SaveSettingsById,
	GetSettingsById: GetSettingsById,
}
