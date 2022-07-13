const movieBody = document.querySelector('.movies__body');

export function showPagination(movies) {
    const maxPages = movies.total_pages;
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');
    movieBody.insertAdjacentElement('beforeend',paginationContainer);
    for (let i = 1; i <= maxPages;i++){
      if (i>10 || i == maxPages) break;
      paginationContainer.insertAdjacentHTML('beforeend',`
        <div class="pagination__item" data-page="${i}">${i}</div>
      `);
    }
  }