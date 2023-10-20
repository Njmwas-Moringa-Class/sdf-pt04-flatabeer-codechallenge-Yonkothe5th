document.addEventListener('DOMContentLoaded', function () {
    const baseURL = 'http://localhost:3000';
    let currentBeerId = 1;

    const beerList = document.getElementById('beer-list');
    const beerDetails = document.querySelector('.beer-details');

    function fetchJSON(url, options = {}) {
        const beerDetails = document.querySelector('.beer-details');
        // We use the fetch function to send a request to the specified URL.
        return fetch(url, options)
        .then(function (response) {
    // We wait for the response to come back and then convert it to JSON format.
            return response.json();
    });
    }

    function fetchBeers() {
        fetchJSON(`${baseURL}/beers`).then(function (beers) {
        beerList.innerHTML = '';
        beers.forEach(function (beer) {
        addBeerToList(beer);
        });
        fetchBeerDetails(currentBeerId);
    });
    }

    function fetchBeerDetails(id) {
        fetchJSON(`${baseURL}/beers/${id}`).then(function (beer) {
        displayBeerDetails(beer);
    });
    }

    function addBeerToList(beer) {
        const li = document.createElement('li');
        li.textContent = beer.name;
        li.addEventListener('click', function () {
        currentBeerId = beer.id;
        fetchBeerDetails(currentBeerId);
    });
        beerList.appendChild(li);
    }

    function displayBeerDetails(beer) {
        beerDetails.innerHTML = `
        <h2>${beer.name}</h2>
        <img src="${beer.image_url}" alt="${beer.name}" />
        <p><em>${beer.description}</em></p>
        <h3>Customer Reviews</h3>
        <ul id="review-list">
            ${generateReviewList(beer.reviews)}
        </ul>
        `;
    }

    function generateReviewList(reviews) {
        let reviewList = '';
        reviews.forEach(function (review) {
        reviewList += `<li>${review}</li>`;
    });
        return reviewList;
    }

    fetchBeers();
});