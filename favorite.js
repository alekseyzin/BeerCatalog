export class Favorite {
    constructor() {
        this.favorites = []
    }

    setInFavoritesOnlyUniqueVal = () => {
        this.favorites = [...new Set(this.favorites)]
    }

    setBearItemToFavorite = (idBearItem) => {
        this.favorites.push(idBearItem)
        this.setInFavoritesOnlyUniqueVal()
    }

    availableButton = (button) => {
        button.disabled = false
    }

    setCountFavoritesToButton = (button) => {
        button.textContent = `Favorites (${this.favorites.length})`
    }

    changeColorButton = (button) => {
        button.classList.remove('btn-warning')
        button.classList.add('btn-danger')
    }
}