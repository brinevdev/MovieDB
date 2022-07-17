import { query } from "./query.js";
import { showMovie } from "./movies.js";
const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';

export function getGenre(genresId){
    const genres = [{"id":28,"name":"боевик"},{"id":12,"name":"приключения"},{"id":16,"name":"мультфильм"},{"id":35,"name":"комедия"},{"id":80,"name":"криминал"},{"id":99,"name":"документальный"},{"id":18,"name":"драма"},{"id":10751,"name":"семейный"},{"id":14,"name":"фэнтези"},{"id":36,"name":"история"},{"id":27,"name":"ужасы"},{"id":10402,"name":"музыка"},{"id":9648,"name":"детектив"},{"id":10749,"name":"мелодрама"},{"id":878,"name":"фантастика"},{"id":10770,"name":"телевизионный фильм"},{"id":53,"name":"триллер"},{"id":10752,"name":"военный"},{"id":37,"name":"вестерн"}]
    let genresAll = [];
    for (let genreId of genresId){
     genresAll.push(genres.find((genre)=>genre.id === genreId).name);
    }
    return genresAll.join(', ')
 }

export function filterByGenre(genreId){
    query.page = 1;
    query.filters = [{name: 'with_genres',value: genreId}];
    return query.getQuery()
}

export function filterByYear(year){
    query.page = 1;
    query.filters = [{name: 'primary_release_year',value: year}]
    return query.getQuery()
}

export function searchByTitle(title){
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=ru-RU&query=${title}`)
    .then(response => response.json())
    .then(movies => {
        if (movies.results.length===0){
            document.querySelector('.movie__body').innerHTML = '';
            document.querySelector('.search-alert').style.top= '50px'
        } else {
            document.querySelector('.search-alert').style.top= '-100%'
            showMovie(movies)
        }
    });
}
