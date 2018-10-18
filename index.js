'use strict';

const apiKey = 'ugi2889p0Blcnpbz4r7lIaJKIoeZDB5g5AH7FVfC'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each park object in the data 
    //array, add a list item to the results 
    //list with the park name, description,
    //and website url
    $('#results-list').append(
      `<li><a href="${responseJson.data[i].url}"><h1>${responseJson.data[i].fullName}</h1></a>
       <p>${responseJson.data[i].description}</p>
       <img src='${responseJson.data[i].images[0].url}'>
      </li>`
    )};
  $('#results').removeClass('hidden');
}; 

function getNationalParks(query, maxResults=10) {
  const params = {
    stateCode: query,
    'fields': 'images',
    //'fields': 'addresses',
    limit: maxResults-1,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchTerm, maxResults);
  });
}

$(watchForm);