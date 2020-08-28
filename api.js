import {Url} from './url.js'

export class Api {

    constructor() {
        this.itemPerPage = 5
    }

    async getDataFromApi (url) {
        const response = await fetch(url)

        return await response.json()
    }

    searchBear = async (searchValue) => {
        this.lastSearch = searchValue

        const url = `${Url.getApiUrl()}?per_page=${this.itemPerPage}&beer_name=${searchValue}`

        return await this.getDataFromApi(url)
    }

    getPageNumber (elementBearsList) {
        const countElements = elementBearsList.children.length

        return countElements / this.itemPerPage + 1
    }

    loadMoreBears = async (elementBearsList) => {
        const pageNumber = this.getPageNumber(elementBearsList)
        const url = `${Url.getApiUrl()}?page=${pageNumber}&per_page=${this.itemPerPage}&beer_name=${this.lastSearch}`

        return await this.getDataFromApi(url)
    }
}
