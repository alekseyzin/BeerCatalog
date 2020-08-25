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
        const item = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
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

    renderFavorites = (favorites, elementForContent) => {
        let favoritesHTMLContent = ``

        favorites.forEach(item => {
            favoritesHTMLContent += `
                <li class="media">
                    <img src="${item.image_url}" class="mr-3 fav-img" alt="${item.name}">
                    <div class="media-body">
                      <h5 class="mt-0 mb-1">${item.name}</h5>
                      ${item.description}
                    </div>
                    <button id="${item.id}" type="button" class="btn btn-danger">Remove</button>
                </li>
            `
        })

        elementForContent.innerHTML = favoritesHTMLContent
    }

    removeFavoriteItem = (id) => {
        this.favoritesId = this.favoritesId.filter(item => item !== id)
    }
}
