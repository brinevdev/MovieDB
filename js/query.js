const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';
export  let query = {
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
        case 'top100':
          this.query = `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}`
          break;
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