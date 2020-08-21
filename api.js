export class Api {

    searchBear = async (searchValue) => {
        const url = `https://api.punkapi.com/v2/beers?per_page=5&beer_name=${searchValue}`
        const response = await fetch(url)

        return  await response.json()
    }
}
