'use strict';

// variables for navbar menu toggle
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navbarMenuBtn = document.querySelector('.navbar-menu-btn');

// variables for navbar search toggle
// const navbarForm = document.querySelector('.navbar-form');
// const navbarFormCloseBtn = document.querySelector('.navbar-form-close');
// const navbarSearchBtn = document.querySelector('.navbar-search-btn');

const navbarFormSearch = document.getElementById('navbar-form-search');
const searchList = document.getElementById('search-list');
const bannerCard = document.getElementById('banner-card');
const recSlider = document.getElementById('rec-slider');
const simSlider = document.getElementById('sim-slider');

// navbar menu toggle function
function navIsActive() {
  header.classList.toggle('active');
  nav.classList.toggle('active');
  navbarMenuBtn.classList.toggle('active');
}

navbarMenuBtn.addEventListener('click', navIsActive);

// navbar search toggle function
// const searchBarIsActive = () => navbarForm.classList.toggle('active');

// navbarSearchBtn.addEventListener('click', searchBarIsActive);
// navbarFormCloseBtn.addEventListener('click', searchBarIsActive);


// load movies from API
async function loadMovies(searchTerm){
  const URL = `https://api.themoviedb.org/3/search/movie?api_key=17c1e1719ea27ef03e5ffaa82642e722&query=${searchTerm}&page=1&include_adult=false`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data);
  // if(data.Response == "True") 
  displayMovieList(data.results);
}

function findMovies(){
  let searchTerm = (navbarFormSearch.value).trim();
  if(searchTerm.length > 0){
    searchList.classList.remove('hide-search-list');
    loadMovies(searchTerm);
  }else{
    searchList.classList.add('hide-search-list');
  }
}


function displayMovieList(movies){
  searchList.innerHTML = "";
  for(let idx = 0; idx < movies.length; idx++){
    let movieListItem = document.createElement('div');
    // console.log(movieListItem);
    movieListItem.dataset.id = movies[idx].id;
    movieListItem.classList.add('search-list-item');
    let moviePoster = 0;
    if(movies[idx].poster_path == null){
    moviePoster = "./assets/js/image_not_found.png";
    }
    else{
    moviePoster = `https://image.tmdb.org/t/p/w200${movies[idx].poster_path} `;
    }
    movieListItem.innerHTML = `
    <div class="search-item-thumbnail">
      <img src="${moviePoster}">
    </div>
    <div class="search-item-info">
      <h3>${movies[idx].title}</h3>
      <p>${movies[idx].release_date}</p>
    </div>
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails(){
  const searchListMovies = searchList.querySelectorAll('.search-list-item');
  searchListMovies.forEach(movie => {
    movie.addEventListener('click', async() => {
      searchList.classList.add('hide-search-list');
      navbarFormSearch.value = "";
      const result = await fetch(`https://api.themoviedb.org/3/movie/${movie.dataset.id}?api_key=17c1e1719ea27ef03e5ffaa82642e722&append_to_response=casts,videos,images,releases`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details){
  const genreNames = details.genres.map(genre => genre.name).join(', ');
  const castNames = details.casts.cast.slice(0, 5).map(cast => cast.name).join(', ');
  // const castNames = details.casts.cast.map(cast => cast.name).join(', ');
  const directorName = details.casts.crew.filter(person => person.job === "Director").map(director => director.name);
  
  bannerCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/original/${details.backdrop_path}" class="banner-img" alt="">

          <div class="card-content">

            <ul class="card-info1">
              <div class="card-info1-item">
                <p class="item-name">Cast</p>
                <p>${castNames}</p>
              </div>
              <div class="card-info1-item">
                <p class="item-name">Directed By</p>
                <p>${directorName}</p>
              </div>
            </ul>

            <p class="card-overview">
              ${details.overview}
            </p>

            <div class="card-info2">

              <div class="genre">
                <ion-icon name="film"></ion-icon>
                <span>${genreNames}</span>
              </div>

              <div class="year">
                <ion-icon name="calendar"></ion-icon>
                <span>${details.release_date}</span>
              </div>

              <div class="duration">
                <ion-icon name="time"></ion-icon>
                <span>${details.runtime}min</span>
              </div>

              <div class="vote_average">
              <ion-icon name="star-outline"></ion-icon>
              ${details.vote_average}
              </div>

            </div>

            <h2 class="card-title">${details.title}</h2>
          </div>
          `;
  transData(details.id);
}

async function transData(id){
  const resultRec = await fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=17c1e1719ea27ef03e5ffaa82642e722&language=en-US&page=1`);
  const movieRecDetails = await resultRec.json();
  createRecMovieCard(movieRecDetails.results);
  const resultSim = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=17c1e1719ea27ef03e5ffaa82642e722&language=en-US&page=1`);
  const movieSimDetails = await resultSim.json();
  createSimMovieCard(movieSimDetails.results);
}

function createRecMovieCard(movies){
  recSlider.innerHTML = '';
  for(let idx = 0; idx < movies.length; idx++){
    // console.log(movies[idx]);
    let movieSliderItem = document.createElement('div');
    // console.log(movieSliderItem);
    movieSliderItem.dataset.id = movies[idx].id;
    movieSliderItem.classList.add('movie-card');
    let moviePoster = 0;
    if(!movies[idx].poster_path){
    moviePoster = "./assets/js/image_not_found.png"
    }
    else{
    moviePoster = `https://image.tmdb.org/t/p/w200${movies[idx].poster_path} `
    }
    movieSliderItem.innerHTML = `
      <div class="card-head">
        <img src="${moviePoster}" alt="" class="card-img">
        <div class="card-overlay">
          <div class="bookmark">
            <ion-icon name="bookmark-outline"></ion-icon>
          </div>
          <div class="rating">
            <ion-icon name="star-outline"></ion-icon>
            <span>${movies[idx].vote_average}</span>
          </div>
          <div class="play">
            <ion-icon name="play-circle-outline"></ion-icon>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${movies[idx].title}</h3>
        <div class="card-info">
          <span class="year">${movies[idx].release_date}</span>
        </div>
      </div>
    `;
    recSlider.appendChild(movieSliderItem);
  }
   loadRecMovieDetails();
}

function createSimMovieCard(movies){
  simSlider.innerHTML = '';
  for(let idx = 0; idx < movies.length; idx++){
    // console.log(movies[idx]);
    let movieSliderItem = document.createElement('div');
    // console.log(movieSliderItem);
    movieSliderItem.dataset.id = movies[idx].id;
    movieSliderItem.classList.add('movie-card');
    let moviePoster = 0;
    if(!movies[idx].poster_path){
    moviePoster = "./assets/js/image_not_found.png"
    }
    else{
    moviePoster = `https://image.tmdb.org/t/p/w200${movies[idx].poster_path} `
    }
    movieSliderItem.innerHTML = `
      <div class="card-head">
        <img src="${moviePoster}" alt="" class="card-img">
        <div class="card-overlay">
          <div class="bookmark">
            <ion-icon name="bookmark-outline"></ion-icon>
          </div>
          <div class="rating">
            <ion-icon name="star-outline"></ion-icon>
            <span>${movies[idx].vote_average}</span>
          </div>
          <div class="play">
            <ion-icon name="play-circle-outline"></ion-icon>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${movies[idx].title}</h3>
        <div class="card-info">
          <span class="year">${movies[idx].release_date}</span>
        </div>
      </div>
    `;
    simSlider.appendChild(movieSliderItem);
  }
   loadSimMovieDetails();
}

function loadRecMovieDetails(){
  const recSliderMovies = recSlider.querySelectorAll('.movie-card');
  recSliderMovies.forEach(movie => {
    movie.addEventListener('click', async() => {
      const result = await fetch(`https://api.themoviedb.org/3/movie/${movie.dataset.id}?api_key=17c1e1719ea27ef03e5ffaa82642e722&append_to_response=casts,videos,images,releases`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}

function loadSimMovieDetails(){
  const simSliderMovies = simSlider.querySelectorAll('.movie-card');
  simSliderMovies.forEach(movie => {
    movie.addEventListener('click', async() => {
      const result = await fetch(`https://api.themoviedb.org/3/movie/${movie.dataset.id}?api_key=17c1e1719ea27ef03e5ffaa82642e722&append_to_response=casts,videos,images,releases`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}



/* ----------------------filter(Top-rated, Popuar, Now Playing)----------------------------------------*/

const moviesGrid1 = document.getElementById('movies-grid1');

const topRated = document.getElementById('top-rated');
const popular = document.getElementById('popular');
const nowPlaying = document.getElementById('now-playing');

const loadMoreButton1 = document.getElementById('load-more1');

topRated.addEventListener('click', selectFilter);
popular.addEventListener('click', selectFilter);
nowPlaying.addEventListener('click', selectFilter);


let page = 1;

function selectFilter(){
  page = 1;
  if (topRated.checked) {
    topratedMovies();
  } else if (popular.checked) {
    popularMovies();
  } else if (nowPlaying.checked) {
    nowplayingMovies();
  }
}

async function topratedMovies() {
  loadMoreButton1.style.display = 'block';
  const URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=17c1e1719ea27ef03e5ffaa82642e722&language=en-US&page=${page}`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  moviesGrid1.innerHTML = '';
  createMovieGrid(data.results);
  loadMoreButton1.removeEventListener('click', popularLoadMore);
  loadMoreButton1.removeEventListener('click', nowplayingLoadMore);
  loadMoreButton1.addEventListener('click', topratedLoadMore);
}

async function popularMovies(){
  loadMoreButton1.style.display = 'block';
  const URL = `https://api.themoviedb.org/3/movie/popular?api_key=17c1e1719ea27ef03e5ffaa82642e722&language=en-US&page=${page}`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  moviesGrid1.innerHTML = '';
  createMovieGrid(data.results);
  loadMoreButton1.removeEventListener('click', topratedLoadMore);
  loadMoreButton1.removeEventListener('click', nowplayingLoadMore);
  loadMoreButton1.addEventListener('click', popularLoadMore);
}

async function nowplayingMovies(){
  loadMoreButton1.style.display = 'block';
  const URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=17c1e1719ea27ef03e5ffaa82642e722&language=en-US&page=${page}`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  moviesGrid1.innerHTML = '';
  createMovieGrid(data.results);
  loadMoreButton1.removeEventListener('click', topratedLoadMore);
  loadMoreButton1.removeEventListener('click', popularLoadMore);
  loadMoreButton1.addEventListener('click', nowplayingLoadMore);
}

async function topratedLoadMore() {
  const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=17c1e1719ea27ef03e5ffaa82642e722&language=en-US&page=${page+1}`;
  const result = await fetch(`${url}`);
  const moviedata = await result.json();
  if (moviedata.results.length > 0){
    createMovieGrid(moviedata.results);
    page++;
  }
  else{
    loadMoreButton1.style.display = 'none';
  }
}

async function popularLoadMore() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=17c1e1719ea27ef03e5ffaa82642e722&language=en-US&page=${page+1}`;
  const result = await fetch(`${url}`);
  const moviedata = await result.json();
  if (moviedata.results.length > 0){
    createMovieGrid(moviedata.results);
    page++;
  }
  else{
    loadMoreButton1.style.display = 'none';
  }
}
   
async function nowplayingLoadMore() {
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=17c1e1719ea27ef03e5ffaa82642e722&region=AU&page=${page+1}`;
  const result = await fetch(`${url}`);
  const moviedata = await result.json();
  if (moviedata.results.length > 0){
    createMovieGrid(moviedata.results);
    page++;
  }
  else{
    loadMoreButton1.style.display = 'none';
  }
}
   



function createMovieGrid(movies){
    for(let idx = 0; idx < movies.length; idx++){
      // console.log(movies[idx]);
      let movieGridItem = document.createElement('div');
      // console.log(movieSliderItem);
      movieGridItem.dataset.id = movies[idx].id;
      movieGridItem.classList.add('movie-card');
      let moviePoster = 0;
      if(!movies[idx].poster_path){
      moviePoster = "./assets/js/image_not_found.png"
      }
      else{
      moviePoster = `https://image.tmdb.org/t/p/w200${movies[idx].poster_path} `
      }
      movieGridItem.innerHTML = `
        <div class="card-head">
          <img src="${moviePoster}" alt="" class="card-img">
          <div class="card-overlay">
            <div class="bookmark">
              <ion-icon name="bookmark-outline"></ion-icon>
            </div>
            <div class="rating">
              <ion-icon name="star-outline"></ion-icon>
              <span>${movies[idx].vote_average}</span>
            </div>
            <div class="play">
              <ion-icon name="play-circle-outline"></ion-icon>
            </div>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${movies[idx].title}</h3>
          <div class="card-info">
            <span class="year">${movies[idx].release_date}</span>
          </div>
        </div>
      `;
      moviesGrid1.appendChild(movieGridItem);
    }
     loadGridMovieDetails();
}


function loadGridMovieDetails(){
  const gridMovies = Array.from(moviesGrid1.querySelectorAll('.movie-card'))
  .concat(Array.from(moviesGrid2.querySelectorAll('.movie-card')));
  gridMovies.forEach(movie => {
    movie.addEventListener('click', async() => {
      const result = await fetch(`https://api.themoviedb.org/3/movie/${movie.dataset.id}?api_key=17c1e1719ea27ef03e5ffaa82642e722&append_to_response=casts,videos,images,releases`);
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
    });
  });
}



/* ----------------------filter(Genre, Language)----------------------------------------*/

const moviesGrid2 = document.getElementById('movies-grid2');
const genreSelect = document.querySelector('#genre');
const languageSelect = document.querySelector('#language');

genreSelect.addEventListener('change', handleFilterChange);
languageSelect.addEventListener('change', handleFilterChange);

const loadMoreButton2 = document.getElementById('load-more2');

// loadMoreButton2.addEventListener('click', filterLoadMore);

async function handleFilterChange() {
  const genre = genreSelect.value;
  const language = languageSelect.value;
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=17c1e1719ea27ef03e5ffaa82642e722&sort_by=vote_count.desc&language=en-US`;

  if (genre !== 'all') {
    url += `&with_genres=${genre}`;
  }

  if (language !== 'all'){
    url += `&with_original_language=${language}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  const movies = data.results;

  moviesGrid2.innerHTML = '';
  createMovieGrid2(movies);
  page = 1;
  loadMoreButton2.removeEventListener('click', filterLoadMore);
  loadMoreButton2.addEventListener('click', filterLoadMore);
  // console.log(2);
  
}


async function filterLoadMore() {
  const genre = genreSelect.value;
  const language = languageSelect.value;
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=17c1e1719ea27ef03e5ffaa82642e722&sort_by=vote_count.desc&language=en-US`;

  if (genre !== 'all') {
    url += `&with_genres=${genre}`;
  }

  if (language !== 'all'){
    url += `&with_original_language=${language}`;
  }

  url += `&page=${page+1}`;
  const result = await fetch(`${url}`);
  const moviedata = await result.json();
  if (moviedata.results.length > 0){
    createMovieGrid2(moviedata.results);
    page++;
  }
  else{
    loadMoreButton2.style.display = 'none';
  }

}

function createMovieGrid2(movies){
  for(let idx = 0; idx < movies.length; idx++){
    let movieGridItem = document.createElement('div');
    movieGridItem.dataset.id = movies[idx].id;
    movieGridItem.classList.add('movie-card');
    let moviePoster = 0;
    if(!movies[idx].poster_path){
    moviePoster = "./assets/js/image_not_found.png"
    }
    else{
    moviePoster = `https://image.tmdb.org/t/p/w200${movies[idx].poster_path} `
    }
    movieGridItem.innerHTML = `
      <div class="card-head">
        <img src="${moviePoster}" alt="" class="card-img">
        <div class="card-overlay">
          <div class="bookmark">
            <ion-icon name="bookmark-outline"></ion-icon>
          </div>
          <div class="rating">
            <ion-icon name="star-outline"></ion-icon>
            <span>${movies[idx].vote_average}</span>
          </div>
          <div class="play">
            <ion-icon name="play-circle-outline"></ion-icon>
          </div>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${movies[idx].title}</h3>
        <div class="card-info">
          <span class="year">${movies[idx].release_date}</span>
        </div>
      </div>
    `;
    moviesGrid2.appendChild(movieGridItem);
  }
   loadGridMovieDetails();
}

