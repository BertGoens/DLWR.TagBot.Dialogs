export interface IPagerOptions {
	requestedPage: number
	pageSize: number
	documents: any[]
}
export const Pager = () => {
	const isPagePossible = (options: IPagerOptions) => {
		const newLowerbound = options.requestedPage * (options.pageSize + 1)
		return options.documents[newLowerbound] ? true : false
	}

	const takePage = (options: IPagerOptions) => {
		const index = options.requestedPage || 0
		const lowerBound = index * options.pageSize
		const upperBound = lowerBound + options.pageSize
		const results = options.documents.slice(lowerBound, upperBound)

		const nextPageOptions: IPagerOptions = {
			documents: options.documents,
			pageSize: options.pageSize,
			requestedPage: index + 1,
		}

		const previousPageOptions: IPagerOptions = {
			documents: options.documents,
			pageSize: options.pageSize,
			requestedPage: index - 1,
		}

		const nextPage = Pager().IsPagePossible(nextPageOptions)
		const prevPage = Pager().IsPagePossible(previousPageOptions)

		const pagesRounded = options.documents.length / options.pageSize
		const countPages = Math.ceil(pagesRounded)

		return {
			documents: results,
			page: index,
			pageTotal: countPages,
			nextPagePossible: nextPage,
			previousPagePossible: prevPage,
		}
	}

	return {
		IsPagePossible: isPagePossible,
		TakePage: takePage,
	}
}
