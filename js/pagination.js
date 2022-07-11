const movieBody = document.querySelector('.movies__body');

export function showPagination() {
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