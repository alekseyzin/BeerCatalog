import {Url} from './url.js'

export class Api {

    constructor() {
        this.itemPerPage = 5
    }

    async getDataFromApi(url) {
        try {
            const response = await fetch(url)

            if (response.status === 400) {
                throw new Error('error')
            }
            return await response.json()
        } catch (e) {
            return ['notLoad']
        }
    }

    creatorApiUrl(page, searchValue) {
        return `${Url.getApiUrl()}?page=${page}&per_page=${this.itemPerPage}&beer_name=${searchValue}`
    }

    searchBear = async (searchValue) => {
        this.lastSearch = searchValue

        const firstPage = 1
        const url = this.creatorApiUrl(firstPage, searchValue)

        return await this.getDataFromApi(url)
    }

    getPageNumber(elementBearsList) {
        const countElements = elementBearsList.children.length

        return countElements / this.itemPerPage + 1
    }

    loadMoreBears = async (elementBearsList) => {
        const pageNumber = this.getPageNumber(elementBearsList)
        const url = this.creatorApiUrl(pageNumber, this.lastSearch)

        return await this.getDataFromApi(url)
    }

    getBeerItemById = async (id) => {
        const item = await fetch(`${Url.getApiUrl()}/${id}`);

        return await item.json()
    }

    setRecentSearch(searchValue) {
        !localStorage.recentSearches && localStorage.setItem('recentSearches', '[]')

        const recentSearches = JSON.parse(localStorage.recentSearches)
        const indx = recentSearches.findIndex(item => item.searchValue === searchValue)

        if (indx !== -1) {
            recentSearches[indx].count++
        } else {
            recentSearches.push({searchValue, count: 1})
        }
        localStorage.recentSearches = JSON.stringify(recentSearches)
    }

    getRecentSearches() {
        return localStorage.recentSearches ? JSON.parse(localStorage.recentSearches) : []
    }
}
