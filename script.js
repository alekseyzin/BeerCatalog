import {Api} from './api.js'
import {Render} from './render.js'
import {Favorite} from "./favorite.js";
import {
    searchInput, searchButton, recentSearchElement, beerList, loadMoreButton,
    scrollUpButton, favoritesButton, favoritesList, beerCardContent
} from './constants.js'

const api = new Api()
const render = new Render()
const favorite = new Favorite()

function isInputEmpty(value) {
    return !value.length
}

function highlightingForInputs(isError, element) {
    isError ? element.classList.add('is-invalid') : element.classList.remove('is-invalid')
}

function scrollToFirstCard() {
    const firstCard = document.body.querySelector('.card')

    firstCard.scrollIntoView({block: "start", behavior: "smooth"})
}

async function getBeersData (searchValue) {
    const bearsData = await api.searchBear(searchValue)

    return {bearsData, beerList, favorites: favorite.favoritesId, isSearch: true}
}

async function searchBearsHandler() {
    const searchValue = searchInput.value.trim()
    const isSearchEmpty = isInputEmpty(searchValue)

    highlightingForInputs(isSearchEmpty, searchInput)

    if (!isSearchEmpty) {
        const renderData = await getBeersData(searchValue)

        render.renderBearsList(renderData)
        renderData.bearsData.length && scrollToFirstCard()
        renderData.bearsData.length && api.setSearchValueToDataBase(searchValue)
        api.recentSearches.length && render.renderRecentSearchList(api.recentSearches, recentSearchElement)
        activateLoadMoreButton()
    }
}

async function searchInputHandler(e) {
    if (e.key === 'Enter') {
        await searchBearsHandler()
    }
}

async function searchByResentSearch(e) {
    const resentSearchElem = 'resent-search-block'

    if (e.target.classList.contains(resentSearchElem)) {
        const searchValue = e.target.textContent
        const renderData = await getBeersData(searchValue)

        searchInput.value = searchValue
        render.renderBearsList(renderData)
        scrollToFirstCard()
    }
}

async function loadMoreHandler() {
    const bearsData = await api.loadMoreBears(beerList)

    render.renderBearsList({bearsData, beerList, favorites: favorite.favoritesId, isSearch: false})
}

function isBeerListFilled () {
    return beerList.children.length && !beerList.children[0].classList.contains('empty-data')
}

function activateLoadMoreButton() {
    loadMoreButton.style.display = isBeerListFilled() ? 'block' : 'none'
}

function toggleScrollButton() {
    const distanceToFirstBeerBlock = 200

    scrollUpButton.style.display = pageYOffset > distanceToFirstBeerBlock ? 'block' : 'none'
}

function isButtonByClass (element, classElem) {
    return element.classList.contains(classElem)
}

function controllerBeerItemFavoriteStatus(e) {
    const favoriteBtn = 'btn-add-fav'

    if (isButtonByClass(e.target, favoriteBtn)) {
        favorite.toggleBeerItemFavoriteStatus(e, favoritesButton)
    }
}

async function renderFavoritesList() {
    const favorites = await favorite.getAllFavorites()
    const elementForContent = document.body.querySelector('.fav-list')

    favorite.renderFavorites(favorites, elementForContent)
}

async function removeFavoriteFromFavoriteList(e) {
    favorite.removeBeerItemFromFavorites(e.target.id)
    await renderFavoritesList()
    favorite.setCountFavoritesToButton(favoritesButton)
    favorite.synchronizationFavoriteBtnsInBeerList(beerList)
}

async function renderBeerItemHTMLToModal (e) {
    const headerBeerItem = 'beer-item-head'

    if (e.target.classList.contains(headerBeerItem)) {
        const beerData = await api.getBeerItemById(e.target.id)
        const beerCardData = {
            beerCardElement: beerCardContent,
            beerData: beerData[0],
            favorites: favorite.favoritesId
        }

        render.renderBeerCard(beerCardData)
    }
}

function controllerBeerCardFavoriteStatus (e) {
    const favoriteBtn = 'btn-add-fav-card'

    if (isButtonByClass (e.target,favoriteBtn)){
        favorite.toggleBeerItemFavoriteStatus(e, favoritesButton)
        favorite.synchronizationFavoriteBtnsInBeerList(beerList)
    }
}

searchButton.addEventListener('click', searchBearsHandler)
searchInput.addEventListener('keydown', searchInputHandler)
recentSearchElement.addEventListener('click', searchByResentSearch)
loadMoreButton.addEventListener('click', loadMoreHandler)
window.addEventListener('scroll', toggleScrollButton);
scrollUpButton.addEventListener('click', scrollToFirstCard)
beerList.addEventListener('click', controllerBeerItemFavoriteStatus)
favoritesButton.addEventListener('click', renderFavoritesList)
favoritesList.addEventListener('click', removeFavoriteFromFavoriteList)
beerList.addEventListener('click', renderBeerItemHTMLToModal)
beerCardContent.addEventListener('click', controllerBeerCardFavoriteStatus)
