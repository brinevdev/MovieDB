const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';
const IMAGEPATH = 'https://image.tmdb.org/t/p/w500/'
const movieContainer = document.querySelector('.movies__items');
const genresContainer = document.querySelector('.navbar__genre');
fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&language=ru-RU&`)
    .then(response => response.json())
    .then(movies => showMovie(movies));


function getGenre(genresId){
   const genres = [{"id":28,"name":"боевик"},{"id":12,"name":"приключения"},{"id":16,"name":"мультфильм"},{"id":35,"name":"комедия"},{"id":80,"name":"криминал"},{"id":99,"name":"документальный"},{"id":18,"name":"драма"},{"id":10751,"name":"семейный"},{"id":14,"name":"фэнтези"},{"id":36,"name":"история"},{"id":27,"name":"ужасы"},{"id":10402,"name":"музыка"},{"id":9648,"name":"детектив"},{"id":10749,"name":"мелодрама"},{"id":878,"name":"фантастика"},{"id":10770,"name":"телевизионный фильм"},{"id":53,"name":"триллер"},{"id":10752,"name":"военный"},{"id":37,"name":"вестерн"}]
   let genresAll = [];
   for (let genreId of genresId){
    genresAll.push(genres.find((genre)=>genre.id === genreId).name);
   }
   return genresAll.join(', ')
}

function showMovie(movies) {
    console.log(movies);
    movieContainer.innerHTML = '';
    for (const movie of movies.results) {
        movieContainer.insertAdjacentHTML('beforeend',`
        <div class="movies__item movie">
        <a href=' ' class="movie__image">
            <img src='${IMAGEPATH}${movie.poster_path}' alt="${movie.title}" >
        </a>
        <div class="movie__body">
            <a href=' ' class="movie__title">${movie.title}</a>
            <div class="movie__genre"><span class="bold">Жанр:</span> ${getGenre(movie.genre_ids)}</div> 
            <div class="movie__year"><span class="bold">Дата премьеры:</span> ${movie.release_date}</div>
            <div class="movie__rate">${movie.vote_average}</div>
        </div>
    </div>
        `)
    }
  }

  genresContainer.addEventListener('click',(e)=>{
    const genre = e.target;
    const genres = document.querySelectorAll('.genre__item');
    genres.forEach(genre => {
      genre.classList.remove('genre__item_active');  
    });
    genre.classList.toggle('genre__item_active');
    filterByGenre(genre.dataset.genreId);
  }) 

  function filterByGenre(genreId){
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&language=ru-RU&with_genres=${genreId}`)
    .then(response => response.json())
    .then(movies => showMovie(movies));
  }