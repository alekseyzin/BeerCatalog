import {Url} from './url.js'

export class Favorite {

    getFavorites() {
        return localStorage.favorites ? JSON.parse(localStorage.favorites) : []
    }

    setBearItemToFavorite = (idBearItem) => {
        !localStorage.favorites && localStorage.setItem('favorites', '[]')

        let favorites = JSON.parse(localStorage.favorites)

        favorites.push(+idBearItem)
        favorites = [...new Set(favorites)]
        localStorage.favorites = JSON.stringify(favorites)
    }

    toggleAvailableButton = (button) => {
        button.disabled = !this.getFavorites().length
    }

    setCountFavoritesToButton = (button) => {
        button.textContent = `Favorites (${this.getFavorites().length})`
    }

    getBearItemById = async (id) => {
        const item = await fetch(`${Url.getApiUrl()}/${id}`);

        return await item.json()
    }

    getAllFavorites = async () => {
        const favorites = []

        for (const item of this.getFavorites()) {

            const itemData = await this.getBearItemById(item)
            favorites.push(itemData[0])
        }

        return favorites
    }

    getHTMLFavoriteItem(data) {
        return `
            <li class="media">
                 <img src="${data.image_url}" class="mr-3 fav-img" alt="${data.name}">
                 <div class="media-body">
                   <h5 class="mt-0 mb-1">${data.name}</h5>
                   ${data.description}
                 </div>
                 <button id="${data.id}" type="button" class="btn btn-danger">Remove</button>
            </li>
        `
    }

    renderFavorites = (favorites, elementForContent) => {
        const favoritesHTMLContent = favorites.reduce((html, id) => {
            return html + this.getHTMLFavoriteItem(id)
        }, '')

        elementForContent.innerHTML = favoritesHTMLContent
    }

    removeBeerItemFromFavorites = (id) => {
        let favorites = this.getFavorites()

        favorites = favorites.filter(item => item !== +id)
        localStorage.favorites = JSON.stringify(favorites)
    }

    setFavoriteStatusToButton (elem) {
        elem.classList.add('btn-danger')
        elem.classList.remove('btn-warning')
        elem.textContent = `Remove`
        elem.setAttribute('favorite', 'true')
    }

    removeFavoriteStatusFromButton (elem) {
        elem.classList.add('btn-warning')
        elem.classList.remove('btn-danger')
        elem.textContent = `Add`
        elem.setAttribute('favorite', 'false')
    }

    synchronizationFavoriteBtnsInBeerList (beerList) {
        const favoriteBtns = beerList.querySelectorAll('.btn-add-fav')

        favoriteBtns.forEach(elem => {
            if (this.getFavorites().includes(+elem.id)) {
                this.setFavoriteStatusToButton(elem)
            } else {
                this.removeFavoriteStatusFromButton(elem)
            }
        })
    }

    isFavoriteStatusActive (element) {
        return element.getAttribute('favorite') === 'false'
    }

    toggleBeerItemFavoriteStatus (e, favoritesButton) {
        if(this.isFavoriteStatusActive(e.target)) {
            this.setBearItemToFavorite(e.target.id)
            this.setFavoriteStatusToButton(e.target)
        } else {
            this.removeBeerItemFromFavorites(e.target.id)
            this.removeFavoriteStatusFromButton(e.target)
        }
        this.toggleAvailableButton(favoritesButton)
        this.setCountFavoritesToButton(favoritesButton)
    }
}
