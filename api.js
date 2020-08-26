import {Url} from './url.js'

export class Api {

    constructor() {
        this.itemPerPage = 5
        this.recentSearches = []
    }

    async getDataFromApi (url) {
        const response = await fetch(url)

        return await response.json()
    }

    creatorApiUrl (page, searchValue) {
        return `${Url.getApiUrl()}?page=${page}&per_page=${this.itemPerPage}&beer_name=${searchValue}`
    }

    searchBear = async (searchValue) => {
        this.lastSearch = searchValue

        const firstPage = 1
        const url = this.creatorApiUrl (firstPage, searchValue)

        return await this.getDataFromApi(url)
    }

    getPageNumber (elementBearsList) {
        const countElements = elementBearsList.children.length

        return countElements / this.itemPerPage + 1
    }

    loadMoreBears = async (elementBearsList) => {
        const pageNumber = this.getPageNumber(elementBearsList)
        const url = this.creatorApiUrl (pageNumber, this.lastSearch)

        return await this.getDataFromApi(url)
    }

    getBeerItemById = async (id) => {
        const item = await fetch(`${Url.getApiUrl()}/${id}`);

        return await item.json()
    }

    setSearchValueToDataBase (searchValue) {
        const indx = this.recentSearches.findIndex(item => item.searchValue === searchValue)
        if (indx !== -1) {
            this.recentSearches[indx].count++
        } else {
            this.recentSearches.push({searchValue, count: 1})
        }
        console.log(this.recentSearches)
    }
}
