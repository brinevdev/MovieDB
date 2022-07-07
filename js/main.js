const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';
const IMAGEPATH = 'https://image.tmdb.org/t/p/w500/'
const movieContainer = document.querySelector('.movies__items');
const genresContainer = document.querySelector('.navbar__genre');
const filterByYearBtn = document.querySelector('#year-filter-btn');
const searchBtn = document.querySelector('#search-btn');
const searchReturnBtn = document.querySelector('.search-alert')

function initialSearch() {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&language=ru-RU&`)
    .then(response => response.json())
    .then(movies => showMovie(movies))
    .then(()=>{
      
    })
}
initialSearch()





function getGenre(genresId){
   const genres = [{"id":28,"name":"боевик"},{"id":12,"name":"приключения"},{"id":16,"name":"мультфильм"},{"id":35,"name":"комедия"},{"id":80,"name":"криминал"},{"id":99,"name":"документальный"},{"id":18,"name":"драма"},{"id":10751,"name":"семейный"},{"id":14,"name":"фэнтези"},{"id":36,"name":"история"},{"id":27,"name":"ужасы"},{"id":10402,"name":"музыка"},{"id":9648,"name":"детектив"},{"id":10749,"name":"мелодрама"},{"id":878,"name":"фантастика"},{"id":10770,"name":"телевизионный фильм"},{"id":53,"name":"триллер"},{"id":10752,"name":"военный"},{"id":37,"name":"вестерн"}]
   let genresAll = [];
   for (let genreId of genresId){
    genresAll.push(genres.find((genre)=>genre.id === genreId).name);
   }
   return genresAll.join(', ')
}

function showMovie(movies) {
    movieContainer.innerHTML = '';
    for (const movie of movies.results) {
        movieContainer.insertAdjacentHTML('beforeend',`
        <div class="movies__item movie" data-movie-id="${movie.id}">
        <a href=' ' class="movie__image">
            <img src='${IMAGEPATH}${movie.poster_path}' alt="${movie.title}" >
        </a>
        <div class="movie__body">
            <a href='' class="movie__title">${movie.title}</a>
            <div class="movie__genre"><span class="bold">Жанр:</span> ${getGenre(movie.genre_ids)}</div> 
            <div class="movie__year"><span class="bold">Дата премьеры:</span> ${movie.release_date}</div>
            <div class="movie__rate">${movie.vote_average}</div>
        </div>
    </div>
        `)
    }
      const movie = document.querySelectorAll('.movie');
      movie.forEach((item)=>item.addEventListener('click',showMovieDescription));
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

  filterByYearBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const year = document.querySelector('#year-filter-input').value
    console.log(year);
    if (year){
        filterByYear(year);
    }
})

  function filterByYear(year){
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&language=ru-RU&primary_release_year=${year}`)
    .then(response => response.json())
    .then(movies => showMovie(movies));
  }

  searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const filmTitle = document.querySelector('#search-input').value;
    if (filmTitle){
        searchByTitle(filmTitle);
    }
  })

function searchByTitle(title){
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=ru-RU&query=${title}`)
    .then(response => response.json())
    .then(movies => {
        if (movies.results.length===0){
            movieContainer.innerHTML = '';
            document.querySelector('.search-alert').style.transform = 'scale(1)'
        } else {
            document.querySelector('.search-alert').style.transform = 'scale(0)'
            showMovie(movies)
        }
    });
  }

  searchReturnBtn.addEventListener('click',()=>{
    document.querySelector('.search-alert').style.transform = 'scale(0)'
    initialSearch();
  })
 
  function showMovieDescription(e,id) {
    e.preventDefault();
    if (e.target.tagName === 'IMG' || e.target.classList.contains('movie__title')){
      const movie = e.target.closest('.movie')
      const movieId = movie.dataset.movieId;
     fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${APIKEY}&language=ru-RU`)
    .then(response => response.json())
    .then(movie => {
      movieContainer.innerHTML = '';
      movieContainer.insertAdjacentHTML('beforeend',`
      <div class="movie-description">
      <div class="movie-description__title">
          ${movie.title}
      </div>
      <div class="movie-description__body">
          <div class="movie-description__poster">
              <div class="movie-desription__image"> 
                <img src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}" alt="">
              </div>
              <div class="movie-description__overwiev">
                 ${movie.overview || 'Описание для фильма отсутствует'}
              </div>
          </div>
          <div class="movie-descrption__info info-movie">
          <div class="info-movie__status"><span class="bold">Рейтинг:</span><span class="green-text">${movie.vote_average || 'Неизвестен'}</span></div>
            <div class="info-movie__budget"><span class="bold">Бюджет: </span> <span class="green-text">${movie.budget ? movie.budget +' $' : 'Неизвестен'}</span> </div>
            <div class="info-movie__revenue"><span class="bold">Сборы: </span> <span class="green-text">${movie.revenue ? movie.revenue +' $' : 'Неизвестны'}</span> </div>
            <div class="info-movie__genre"><span class="bold">Жанры: </span><span class="green-text">${movie.genres.map((genre)=>genre.name).join(', ')}</span></div>
            <div class="info-movie__company"><span class="bold">Киностудии: </span><span class="green-text">${movie.production_companies.map((company)=>company.name).join(', ')}</span></div>
            <div class="info-movie__runtime"><span class="bold">Продложительность: </span><span class="green-text">${movie.runtime || 'Неизвестна'} мин. </span></div>
            <div class="info-movie__release-date"><span class="bold">Дата релиза:</span><span class="green-text">${movie.release_date || 'Неизвестна'}</span></div>
          </div>
      </div>
      </div>
        `);
        showActors(movie.id);
    }
    );
    }  
  }


  function showActors(movieId){
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${APIKEY}&language=ru-RU`)
    .then(response => response.json())
    .then(result => {
    const movieDescription = document.querySelector('.movie-description');
    movieDescription.insertAdjacentHTML("beforeend",`
    <div class="movie-decription__actors actors">
      <div class="actors__title">В ролях</div>
      <div class="actors__items"></div>
    </div>
    ` );
    const actorsContainer = document.querySelector('.actors__items');
    let actors = result.cast;
    for (let i=0;i<10;i++){ 
      actorsContainer.insertAdjacentHTML('beforeend',`
      <div class="actors__item actor">
        <div class="actor__avatar">
          <img src="${actors[i].profile_path ? 'https://image.tmdb.org/t/p/w200/'+ actors[i].profile_path : 'https://dthezntil550i.cloudfront.net/kg/latest/kg1802132010216500004834729/1280_960/557d644f-12f3-49e1-bb66-23c16400540d.png'}" alt="">
        </div>
      <div class="actor__info">
          <div class="actor__name">
             <span class='bold'>ФИО: </span> <span class='green-text'>${actors[i].name}</span>
          </div>
          <div class="actor__role">
          <span class='bold'> Роль:</span> <span class='green-text'> ${actors[i].character}</span>
          </div>
      </div>
    </div>`)
    }
    })
  }