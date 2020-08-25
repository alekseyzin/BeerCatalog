export class Render {

    getHTMLBeerItem (data) {
        return `
            <div class="card mb-3">
                <div class="row no-gutters bear-card">
                    <div class="col-md-4 d-flex flex-column align-items-center justify-content-center">
                        <img src="${data.image_url}" class="card-img bear-card-img" alt="${data.name} style="height=auto">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${data.name}</h5>
                            <p class="card-text bear-description">${data.description}</p>
                            <p class="card-text"><small class="text-muted">${data.contributed_by}</small></p>
                            <button id="${data.id}" type="button" class="btn btn-warning btn-add-fav">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    renderBearsList = (data, elementBearsList, isSearch) => {
        let htmlBearsList = isSearch ? `` : elementBearsList.innerHTML

        if (data.length) {
            data.forEach(item => {
                htmlBearsList += this.getHTMLBeerItem(item)
            })
        } else {
            htmlBearsList += `<div class="alert alert-warning empty-data" role="alert">
                                  There were no properties found for the given bear.
                            </div>`
        }

        elementBearsList.innerHTML = htmlBearsList
    }

    renderRecentSearchList = ({bearsData, searchValue, recentSearchElement}) => {
        if (bearsData.length) {
            const searchItem = document.createElement('span')

            searchItem.innerText = searchValue
            recentSearchElement.appendChild(searchItem)
            recentSearchElement.classList.add('visible')
        }
    }
}
