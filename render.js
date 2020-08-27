export class Render {

    getHTMLBeerItem(data, isFavorite) {
        return `
            <div class="card mb-3">
                <div class="row no-gutters bear-card">
                    <div class="col-md-4 d-flex flex-column align-items-center justify-content-center">
                        <img src="${data.image_url}" class="card-img bear-card-img" alt="${data.name} 
                        style=" height=auto">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">
                                <a id="${data.id}" class="beer-item-head" data-toggle="modal" 
                                data-target="#modalBeerItem" href="#">${data.name}</a>
                            </h5>
                            <p class="card-text bear-description">${data.description}</p>
                            <p class="card-text"><small class="text-muted">${data.contributed_by}</small></p>
                            <button favorite="${isFavorite}" id="${data.id}" type="button" 
                                    class="btn ${isFavorite ? 'btn-danger' : 'btn-warning'} btn-add-fav">
                                ${isFavorite ? "Remove" : "Add"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    getHTMLBeerItemNotFond() {
        return `<div class="alert alert-warning empty-data error-beer" role="alert">
                     There were no properties found for the given bear.
                </div>`
    }

    isAddErrorToBeersList (bearsData, beerList) {
        const errorBlock = '.error-beer'
        return bearsData[0] === 'notLoad' && !beerList.querySelector(errorBlock)
    }

    isAddBearsToList (bearsData) {
        return bearsData.length && bearsData[0] !== 'notLoad'
    }

    isDisplayErrorWhenSearch (isSearch, bearsData) {
        return isSearch && !bearsData.length
    }

    renderBearsList = ({bearsData, beerList, favorites, isSearch}) => {
        let htmlBearsList = isSearch ? `` : beerList.innerHTML

        if (this.isAddErrorToBeersList(bearsData, beerList)) {
            htmlBearsList += this.getHTMLBeerItemNotFond()
        } else if (this.isAddBearsToList(bearsData)) {
            htmlBearsList = bearsData.reduce((html, item) => {
                return `${html} ${favorites.includes(item.id)
                    ? this.getHTMLBeerItem(item, true)
                    : this.getHTMLBeerItem(item, false)}`
            }, '')
        } else if (this.isDisplayErrorWhenSearch(isSearch, bearsData)) {
            htmlBearsList = this.getHTMLBeerItemNotFond()
        }
        beerList.innerHTML = htmlBearsList
    }

    getHTMLBRecentSearchItem(data) {
        return `
            <div>
               <span class="resent-search-block">${data.searchValue}</span> 
               <span class="ml-1">(${data.count})</span>
            </div>
        `
    }

    renderRecentSearchList = (recentSearches, recentSearchElement) => {
        const recentSearchesHtml = recentSearches.reduce((html, data) => {
            return `${html} ${this.getHTMLBRecentSearchItem(data)}`
        }, '')

        recentSearchElement.innerHTML = recentSearchesHtml
        recentSearchElement.classList.add('visible')
    }

    getHTMLBeerCard(data, isFavorite) {
        return `
            <div class="card">
              <img src="${data.image_url}" class="card-img-top beer-card-img" alt="${data.name}">
              <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <p class="card-text">${data.description}</p>
                <button favorite="${isFavorite}" id="${data.id}" type="button" 
                        class="btn ${isFavorite ? 'btn-danger' : 'btn-warning'} btn-add-fav-card">
                        ${isFavorite ? "Remove" : "Add"}
                </button>
              </div>
            </div>
        `
    }

    renderBeerCard = ({beerCardElement, beerData, favorites}) => {
        const isFavorite = favorites.includes(beerData.id)

        beerCardElement.innerHTML = isFavorite
            ? this.getHTMLBeerCard(beerData, true)
            : this.getHTMLBeerCard(beerData, false)
    }
}
