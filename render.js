export class Render {

    renderBearsList = (data, elementBearsList) => {
        let htmlBearsList = ``

        if (data.length) {
            data.forEach(item => {
                htmlBearsList += `<div class="card mb-3">
                <div class="row no-gutters bear-card">
                    <div class="col-md-4 d-flex flex-column align-items-center justify-content-center">
                        <img src="${item.image_url}" class="card-img bear-card-img" alt="${item.name} style="height=auto ">
                    </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text bear-description">${item.description}</p>
                                <p class="card-text"><small class="text-muted">${item.contributed_by}</small></p>
                            </div>
                        </div>
                    </div>
                </div>`
            })
        } else {
            htmlBearsList = `<div class="alert alert-warning" role="alert">
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
