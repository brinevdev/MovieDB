import { query } from "./query.js";
import { showMovie } from "./movies.js";
import { filterByGenre } from "./navigation.js";
import { filterByYear } from "./navigation.js";
import { searchByTitle } from "./navigation.js";
import { showPagination } from "./pagination.js";


const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';
const defaultQuery = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&language=ru-RU&primary_release_year=2021`;
const genresContainer = document.querySelector('.navbar__genre');
const filterByYearBtn = document.querySelector('#year-filter-btn');
const searchBtn = document.querySelector('#search-btn');
const searchReturnBtn = document.querySelector('.search-alert');
const menu = document.querySelector('.menu__list');


function show(query) {
  fetch(query)
    .then(response => response.json())
    .then(movies => showMovie(movies))
    .then((movies)=>{
      showPagination(movies);
      window.scrollTo(0,0);
      document.querySelector('.pagination').addEventListener('click',paginationHandler);
    })
}
show(defaultQuery);

function paginationHandler(e){
  if (e.target.classList.contains('pagination__item')) {
    query.page = e.target.dataset.page;
    show(query.getQuery());
}
}

genresContainer.addEventListener('click',(e)=>{
    const genre = e.target;
    const genres = document.querySelectorAll('.genre__item');
    genres.forEach(genre => {
      genre.classList.remove('genre__item_active');  
    });
    genre.classList.toggle('genre__item_active');
    show(filterByGenre(genre.dataset.genreId));
  }) 

filterByYearBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const year = document.querySelector('#year-filter-input').value
    console.log(year);
    if (year){
        show(filterByYear(year));
    }
})

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const filmTitle = document.querySelector('#search-input').value;
    if (filmTitle){
        searchByTitle(filmTitle);
    }
  })

searchReturnBtn.addEventListener('click',()=>{
    document.querySelector('.search-alert').style.top = '-100%'
  })
 
menu.addEventListener('click',menuHandler);  

function menuHandler(e){
    e.preventDefault();
    if (e.target.classList.contains('menu__link')) {
      const links = document.querySelectorAll('.menu__link');
      links.forEach((link)=>link.classList.remove('active'));
      e.target.classList.toggle('active');
      const link = e.target.dataset.menu;
      switch (link) {
        case 'main':
          query.type = 'main';
          break;
        case 'newReleases':
          query.type = 'newReleases';
          break;
        case 'upcoming':
          query.type = 'upcoming';
          break;
        case 'top100':
          query.type = 'top100'
          break
        default:
          query.type = 'main'
          break
      }
      query.page = 1;
      query.filters =[];
      document.querySelector('.navbar').style.display = 'block';
      body.classList.toggle('active');
      nav.classList.toggle('active');
      show(query.getQuery());
    }
}


const menuIcon = document.querySelector('.menu__icon');
const nav = document.querySelector('.menu');
const body = document.body;


menuIcon.addEventListener('click',(e)=>{
    body.classList.toggle('active');
    nav.classList.toggle('active');
});
