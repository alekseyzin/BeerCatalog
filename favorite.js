import {Url} from './url.js'

export class Favorite {
    constructor() {
        this.favoritesId = []
    }

    setInFavoritesOnlyUniqueVal = () => {
        this.favoritesId = [...new Set(this.favoritesId)]
    }

    setBearItemToFavorite = (idBearItem) => {
        this.favoritesId.push(idBearItem)
        this.setInFavoritesOnlyUniqueVal()
    }

    availableButton = (button) => {
        button.disabled = false
    }

    setCountFavoritesToButton = (button) => {
        button.textContent = `Favorites (${this.favoritesId.length})`
    }

    changeAddButtonToRemove = (button) => {
        button.classList.remove('btn-warning')
        button.classList.add('btn-danger')
        button.textContent = `Remove`
    }

    getBearItemById = async (id) => {
        const item = await fetch(`${Url.getApiUrl()}/${id}`);

        return await item.json()
    }

    getAllFavorites = async () => {
        const favorites = []

        for (const item of this.favoritesId) {

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
        let favoritesHTMLContent = ``

        favorites.forEach(item => {
            favoritesHTMLContent += this.getHTMLFavoriteItem(item)
        })

        elementForContent.innerHTML = favoritesHTMLContent
    }

    removeFavoriteItem = (id) => {
        this.favoritesId = this.favoritesId.filter(item => item !== id)
    }
}
