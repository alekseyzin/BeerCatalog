export class Api {

    constructor() {
        this.itemPerPage = 5
    }

    searchBear = async (searchValue) => {
        this.lastSearch = searchValue
        const url = `https://api.punkapi.com/v2/beers?per_page=${this.itemPerPage}&beer_name=${searchValue}`
        const response = await fetch(url)

        return await response.json()
    }

    getPageNumber (elementBearsList) {
        const countElements = elementBearsList.children.length
        const pageNumber = countElements / this.itemPerPage + 1
        return pageNumber
    }

    loadMoreBears = async (elementBearsList) => {
        const pageNumber = this.getPageNumber(elementBearsList)
        const url = `https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=${this.itemPerPage}&beer_name=${this.lastSearch}`
        const response = await fetch(url)
        return await response.json()
    }
}
