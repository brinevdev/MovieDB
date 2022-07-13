import {getGenre} from './navigation.js'


const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';
const movieBody = document.querySelector('.movies__body');
const IMAGEPATH = 'https://image.tmdb.org/t/p/w500/'



export function showMovie(movies) {
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
      const movie = document.querySelectorAll('.movie');
      movie.forEach((item)=>item.addEventListener('click',showMovieDescription));
      return movies
  }

  
  function showMovieDescription(e,id) {
    e.preventDefault();
    document.querySelector('.navbar').style.display = 'none';
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
              <div class="movie-description__image"> 
                <img src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}" alt="">
              </div>
              <div class="movie-description__overview">
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