import {Api} from './api.js'
import {Render} from './render.js'

const api = new Api()
const render = new Render()
const searchInput = document.body.querySelector('.search-input')
const searchButton = document.body.querySelector('.search-button')
const recentSearchElement = document.body.querySelector('.recent-searches')
const baerList = document.body.querySelector('.bears-list')

function isInputEmpty (value) {
    return  !value.length
}

function highlightingForInputs (isError, element) {
    isError ? element.classList.add('is-invalid') : element.classList.remove('is-invalid')
}

function scrollToFirstCard () {
    const firstCard = document.body.querySelector('.card')

    firstCard.scrollIntoView({block: "start", behavior: "smooth"})
}

async  function searchBearsHandler () {
    const searchValue = searchInput.value.trim()
    const isSearchEmpty = isInputEmpty(searchValue)

    highlightingForInputs(isSearchEmpty, searchInput)

    if (!isSearchEmpty) {
        const bearsData = await api.searchBear(searchValue)
        const dataRecentSearch = {bearsData, searchValue, recentSearchElement}

        render.renderBearsList(bearsData, baerList)
        render.renderRecentSearchList(dataRecentSearch)
        scrollToFirstCard()
    }
}

async function searchInputHandler (e) {
    if(e.key === 'Enter') {
        await  searchBearsHandler()
    }
}

async function searchByResentSearch (e) {
    const searchValue = e.target.textContent
    const bearsData = await api.searchBear(searchValue)

    render.renderBearsList(bearsData, baerList)
    scrollToFirstCard()
}

searchButton.addEventListener('click', searchBearsHandler)
searchInput.addEventListener('keydown', searchInputHandler)
recentSearchElement.addEventListener('click', searchByResentSearch)
