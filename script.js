import {Api} from './api.js'
import {Render} from './render.js'

const api = new Api()
const render = new Render()
const searchInput = document.body.querySelector('.search-input')
const searchButton = document.body.querySelector('.search-button')
const recentSearchElement = document.body.querySelector('.recent-searches')
const beerList = document.body.querySelector('.bears-list')
const loadMoreButton = document.body.querySelector('.load-more-button')
const scrollUpButton = document.body.querySelector('.scroll-up-button')


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

        render.renderBearsList(bearsData, beerList, true)
        render.renderRecentSearchList(dataRecentSearch)
        bearsData.length && scrollToFirstCard()
        activateLoadMoreButton()
    }
}

async function searchInputHandler (e) {
    if(e.key === 'Enter') {
        await  searchBearsHandler()
    }
}

async function searchByResentSearch (e) {
    const searchValue = e.target.textContent
    searchInput.value = searchValue
    const bearsData = await api.searchBear(searchValue)

    render.renderBearsList(bearsData, beerList, true)
    scrollToFirstCard()
}

async function loadMoreHandler () {
    const bearsData = await api.loadMoreBears(beerList)
    render.renderBearsList(bearsData, beerList)
}

function activateLoadMoreButton () {
    if (beerList.children.length && !beerList.children[0].classList.contains('empty-data')) {
        loadMoreButton.style.display = 'block'
    } else {
        loadMoreButton.style.display = 'none'
    }
}

function toggleScrollButton () {
    if (pageYOffset > 200) {
        scrollUpButton.style.display = 'block'
    } else {
        scrollUpButton.style.display = 'none'
    }
}

searchButton.addEventListener('click', searchBearsHandler)
searchInput.addEventListener('keydown', searchInputHandler)
recentSearchElement.addEventListener('click', searchByResentSearch)
loadMoreButton.addEventListener('click', loadMoreHandler)
window.addEventListener('scroll', toggleScrollButton);
scrollUpButton.addEventListener('click', scrollToFirstCard)
