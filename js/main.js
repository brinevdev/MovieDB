const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';
const IMAGEPATH = 'https://image.tmdb.org/t/p/w500/'
const defaultQuery = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate&language=ru-RU&primary_release_year=2021`;
const movieContainer = document.querySelector('.movies__items');
const movieBody = document.querySelector('.movies__body');
const genresContainer = document.querySelector('.navbar__genre');
const filterByYearBtn = document.querySelector('#year-filter-btn');
const searchBtn = document.querySelector('#search-btn');
const searchReturnBtn = document.querySelector('.search-alert');
const menu = document.querySelector('.menu__list');
let page = 1;
let query = {
  type: 'main',
  query: '',
  page: 1,
  filters: [

  ],
  getDefaultParams: function(){ 
    return [{name:'page',value: this.page || 1,},{name:'language',value:'ru-RU',}]
  },
  getQuery: function(params) {
    switch(this.type) {
      case 'main' :
        this.query = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}`
        break;
      case 'upcoming':
        this.query = `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}`
        break;
        case 'newReleases':
        this.query = `https://api.themoviedb.org/3/movie/now_playing?api_key=${APIKEY}`
        break
    }
    let defaultParams = this.getDefaultParams().map((param)=>`${param.name}=${param.value}`).join('&');
    this.query = this.query + '&' + defaultParams;

    if (this.filters) {
      let filters = this.filters.map((param)=>`${param.name}=${param.value}`).join('&');
      this.query = this.query + '&' + filters;
    }
    if(params){
      let queryParams = params.map((param)=>`${param.name}=${param.value}`).join('&');
      this.query = this.query + '&' + queryParams;
    }

    return this.query
    }
  }

function show(query) {
  fetch(query)
    .then(response => response.json())
    .then(movies => showMovie(movies))
}
show(defaultQuery);

function showPagination() {
  movieBody.insertAdjacentHTML('beforeend',`
  <div class="pagination">
    <div class="pagination__item" data-page="1">1</div>
    <div class="pagination__item" data-page="2">2</div>
    <div class="pagination__item" data-page="3">3</div>
    <div class="pagination__item" data-page="4">4</div>
    <div class="pagination__item" data-page="5">5</div>
    <div class="pagination__item" data-page="6">6</div>
    <div class="pagination__item" data-page="7">7</div>
    <div class="pagination__item" data-page="8">8</div>
    <div class="pagination__item" data-page="9">9</div>
    <div class="pagination__item" data-page="10">10</div>
  </div>
`);
}



function getGenre(genresId){
   const genres = [{"id":28,"name":"боевик"},{"id":12,"name":"приключения"},{"id":16,"name":"мультфильм"},{"id":35,"name":"комедия"},{"id":80,"name":"криминал"},{"id":99,"name":"документальный"},{"id":18,"name":"драма"},{"id":10751,"name":"семейный"},{"id":14,"name":"фэнтези"},{"id":36,"name":"история"},{"id":27,"name":"ужасы"},{"id":10402,"name":"музыка"},{"id":9648,"name":"детектив"},{"id":10749,"name":"мелодрама"},{"id":878,"name":"фантастика"},{"id":10770,"name":"телевизионный фильм"},{"id":53,"name":"триллер"},{"id":10752,"name":"военный"},{"id":37,"name":"вестерн"}]
   let genresAll = [];
   for (let genreId of genresId){
    genresAll.push(genres.find((genre)=>genre.id === genreId).name);
   }
   return genresAll.join(', ')
}

function showMovie(movies) {
    movieBody.innerHTML = `<div class="movies__items"> </div>`;
    const movieContainer = document.querySelector('.movies__items');
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
      showPagination();
      window.scrollTo(0,0);
      document.querySelector('.pagination').addEventListener('click',paginationHandler);
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
    query.page = 1;
    query.filters.push({name: 'with_genres',value: genreId})
    fetch(query.getQuery())
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
    query.page = 1;
    query.filters.push({name: 'primary_release_year',value: year})
    fetch(query.getQuery())
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
      movieBody.innerHTML = '';
      movieBody.insertAdjacentHTML('beforeend',`
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
        default:
          query.type = 'main'
          break
      }
      query.page = 1;
      query.filters =[];
      show(query.getQuery());
    }
  }

  menu.addEventListener('click',menuHandler);

  function paginationHandler(e){
    if (e.target.classList.contains('pagination__item')) {
      page = e.target.dataset.page;
      console.log('page',page);
      query.page = page;
      show(query.getQuery());
  }
  }

