import {Api} from './api.js'
import {Render} from './render.js'
import {Favorite} from "./favorite.js";

const api = new Api()
const render = new Render()
const favorite = new Favorite()
const searchInput = document.body.querySelector('.search-input')
const searchButton = document.body.querySelector('.search-button')
const recentSearchElement = document.body.querySelector('.recent-searches')
const beerList = document.body.querySelector('.bears-list')
const loadMoreButton = document.body.querySelector('.load-more-button')
const scrollUpButton = document.body.querySelector('.scroll-up-button')
const favoritesButton = document.body.querySelector('.btn-favorites')
const favoritesList = document.body.querySelector('.fav-list')


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
    const bearsData = await api.searchBear(searchValue)

    searchInput.value = searchValue
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

function  addToFavoriteHolder(e) {
    if (e.target.classList.contains('btn-add-fav')) {
        favorite.setBearItemToFavorite(e.target.id)
        favorite.availableButton(favoritesButton)
        favorite.setCountFavoritesToButton(favoritesButton)
        favorite.changeAddButtonToRemove(e.target)
    }
}

async function getFavoritesHolder () {
    const favorites = await favorite.getAllFavorites()
    const elementForContent = document.body.querySelector('.fav-list')

    favorite.renderFavorites(favorites, elementForContent)
}

async function removeFavoriteItemHandler (e) {
    favorite.removeFavoriteItem(e.target.id)
    await getFavoritesHolder ()
    favorite.setCountFavoritesToButton(favoritesButton)
}

searchButton.addEventListener('click', searchBearsHandler)
searchInput.addEventListener('keydown', searchInputHandler)
recentSearchElement.addEventListener('click', searchByResentSearch)
loadMoreButton.addEventListener('click', loadMoreHandler)
window.addEventListener('scroll', toggleScrollButton);
scrollUpButton.addEventListener('click', scrollToFirstCard)
beerList.addEventListener('click', addToFavoriteHolder)
favoritesButton.addEventListener('click', getFavoritesHolder)
favoritesList.addEventListener('click', removeFavoriteItemHandler)
