import { logInfo, logError } from '../util'

export const LogHandleAxiosError = ({ error: error, url: url }) => {
	logInfo(`${error.response && error.response.status} ${url}`)
	if (error.response) {
		logInfo(
			'The request was made and the server responded with a status code' +
				'that falls out of the range of 2xx'
		)
		logError(error.message)
	} else if (error.request) {
		logInfo('The request was made but no response was received')
		//logError(error.request);
	} else {
		logInfo('Something happened in setting up the request that triggered an Error')
		logError('Error', error.message)
	}
}
