const APIKEY = 'e0ec4c232335ffc08d42a11556a54ec5';
export  let query = {
    type: 'main',
    query: '',
    page: 1,
    filters: [
  
    ],
    getDefaultParams: function(){ 
      return [{name:'page',value: this.page || 1,},{name:'language',value:'ru-RU',},{name:"region",value:'UA'},]
    },
    getQuery: function(params) {
      let date = new Date();
      let currentDate = `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0'+ (date.getMonth() + 1) }-${date.getDate() > 9 ? date.getDate() : '0'+ date.getDate()}`;
      date.setMonth(date.getMonth()+12);
      let upcomingDate = `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0'+ (date.getMonth() + 1) }-${date.getDate() > 9 ? date.getDate() : '0'+ date.getDate()}`;
      switch(this.type) {
        case 'main' :
          this.query = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}`
          break;
        case 'upcoming':
          this.query = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}`
          this.filters.push({name:'sort_by',value:'primary_release_date.asc'});
          this.filters.push({name:"primary_release_date.gte",value:`${currentDate}`});
          this.filters.push({name:"primary_release_date.lte",value:`${upcomingDate}`});
          break;
        case 'newReleases':
          this.filters.push({name:'sort_by',value:'primary_release_date.desc'});
          this.filters.push({name:"primary_release_date.lte",value:`${currentDate}`});
          this.query = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKEY}`
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