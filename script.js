import {Api} from './api.js'
import {Render} from './render.js'
import {Favorite} from "./favorite.js";
import {
    searchInput, searchButton, recentSearchElement, beerList, loadMoreButton,
    scrollUpButton, favoritesButton, favoritesList
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
        const dataRecentSearch = {bearsData: renderData.bearsData, searchValue, recentSearchElement}

        render.renderBearsList(renderData)
        render.renderRecentSearchList(dataRecentSearch)
        renderData.bearsData.length && scrollToFirstCard()
        activateLoadMoreButton()
    }
}

async function searchInputHandler(e) {
    if (e.key === 'Enter') {
        await searchBearsHandler()
    }
}

async function searchByResentSearch(e) {
    const searchValue = e.target.textContent
    const renderData = await getBeersData(searchValue)

    searchInput.value = searchValue
    render.renderBearsList(renderData)
    scrollToFirstCard()
}

async function loadMoreHandler() {
    const bearsData = await api.loadMoreBears(beerList)
    const renderData = {bearsData, beerList, favorites: favorite.favoritesId, isSearch: false}

    render.renderBearsList(renderData)
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

function isAddToFavoriteBtn (element) {
    return element.classList.contains('btn-add-fav')
}

function isFavoriteStatusActive (element) {
    return element.getAttribute('favorite') === 'false'
}

function toggleBeerItemFavoriteStatus (e) {
    if(isFavoriteStatusActive(e.target)) {
        favorite.setBearItemToFavorite(e.target.id)
        e.target.setAttribute('favorite', 'true')
    } else {
        favorite.removeBeerItemFromFavorites(e.target.id)
        e.target.setAttribute('favorite', 'false')
    }
    favorite.toggleAvailableButton(favoritesButton)
    favorite.setCountFavoritesToButton(favoritesButton)
    favorite.toggleNameAddToFavoritesButton(e.target)
}

function controllerBeerItemFavoriteStatus(e) {
    if (isAddToFavoriteBtn(e.target)) {
        toggleBeerItemFavoriteStatus(e)
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
