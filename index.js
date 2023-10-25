document.addEventListener('DOMContentLoaded', function () {
    const baseURL = 'http://localhost:3000';
    let currentBeerId = 1;

    const beerList = document.getElementById('beer-list');
    const beerDetails = document.querySelector('.beer-details');

    function fetchJSON(url, options = {}) {
        return fetch(url, options).then(function (response) {
        return response.json();
    });
    }

    function fetchBeers() {
    return fetchJSON(`${baseURL}/beers`).then(function (beers) {
        // Clear the beer list before populating it
        beerList.innerHTML = '';
        for (let i = 0; i < beers.length; i++) {
        addBeerToList(beers[i]);
        }
        fetchBeerDetails(currentBeerId);
    });
    }

    function fetchBeerDetails(id) {
        return fetchJSON(`${baseURL}/beers/${id}`).then(function (beer) {
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
        beerDetails.innerHTML = '<h2>' + beer.name + '</h2>' +
        '<img src="' + beer.image_url + '" alt="' + beer.name + '" />' +
        '<p><em>' + beer.description + '</em></p>' +
        '<form id="description-form">' +
        '<label for="description">Edited Description:</label>' +
        '<textarea id="description">' + beer.description + '</textarea>' +
        '<button type="submit">Update Beer</button>' +
        '</form>' +
        '<h3>Customer Reviews</h3>' +
        '<ul id="review-list">' +
        generateReviewList(beer.reviews) +
        '</ul>' +
        '<form id="review-form">' +
        '<label for="review">Your Review:</label>' +
        '<textarea id="review"></textarea>' +
        '<button type="submit">Add review</button>' +
        '</form>';

        document.getElementById('description-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const newDescription = document.getElementById('description').value;
        updateBeer(currentBeerId, { description: newDescription });
        });

        document.getElementById('review-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const newReview = document.getElementById('review').value;
        // Use concat to add the new review to the existing reviews
        updateBeer(currentBeerId, { reviews: beer.reviews.concat(newReview) });
        });

        document.getElementById('review-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
        const index = event.target.getAttribute('data-index');
          // Use slice to remove the clicked review from the array
        const updatedReviews = beer.reviews.slice(0, index).concat(beer.reviews.slice(index + 1));
        updateBeer(currentBeerId, { reviews: updatedReviews });
        }
    });
    }

    function updateBeer(id, data) {
    return fetch(`${baseURL}/beers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(function (response) {
        return response.json();
    });
    }

    function generateReviewList(reviews) {
        let reviewList = '';
        for (let i = 0; i < reviews.length; i++) {
        reviewList += '<li data-index="' + i + '">' + reviews[i] + '</li>';
        }
        return reviewList;
    }

    fetchBeers();
});