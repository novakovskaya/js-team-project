import filmCardsTpl from '../templates/film-template.hbs';
import NewApiService from './apiClass';
import { debounce, toNumber } from 'lodash';
import { refs } from './refs.js';
import Notifications from './pNotify';

const { input, filmCards, loadMore } = refs;
const newApiService = new NewApiService();
const filmsElements = filmCards.children;
const notifications = new Notifications();

import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
input.addEventListener('input', debounce(findFilmByWord, 1200));

function findFilmByWord(e) {
  newApiService.query = e.target.value.trim();
  filmCards.innerHTML = '';

  if (newApiService.query !== '') {
    newApiService.resetPage();
    fetchFilms();
    notifications.showSuccess();
  } else {
    getFilmsByDefault();
    // error => console.log(error);
  }
}

function findFilmById(e) {
  newApiService.filmId = e.target.value;

  if (newApiService.filmId !== '') {
    newApiService.fetchFullInfo().catch(error => {
      console.log(error);
    });
  }
}

async function getFilmsByDefault() {
  try {
    appendFilmCardsMarkup(await newApiService.fetchTrends());
    if (newApiService.query === '') {
      notifications.showTrends();
    } else {
      notifications.showSuccess();
    }

    if (filmsElements.length === 0) {
      error => console.log(error);
    }
  } catch {
    error => console.log(error);
  }
}
getFilmsByDefault();

async function fetchFilms() {
  try {
    appendFilmCardsMarkup(await newApiService.fetchByKeyWord());

    if (filmsElements.length === 0) {
      error => console.log(error);
    }
  } catch {
    error => console.log(error);
  }
}

function appendFilmCardsMarkup(films) {
  filmCards.innerHTML = filmCardsTpl(films);
  getGenres();
}

/* ----- PAGINATION ------ */

const options = {
  totalItems: 20000,
  itemsPerPage: 20,
  visiblePages: 5,
  centerAlign: true,
  template: {
    currentPage:
      '<strong class="tui-page-btn tui-is-selected" style="background-color: #ff6b01; border-radius: 5px;">{{page}}</strong>',
  },
};

const pagination = new Pagination('pagination', options);

pagination.on('afterMove', function (eventData) {
  newApiService.page = eventData.page;
  getFilmsByDefault();
  filmCards.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
});

/* ----- GENRES ------ */

async function getGenres() {
  const genresList = await newApiService.fetchGenresList();

  //Заміняє ID на жанр
  const filmGenre = filmCards.querySelectorAll('.js-film-genre');
  const filmGenresArray = [...filmGenre];
  filmGenresArray.map(filmGenre => {
    genresList.map(genreObject => {
      if (toNumber(filmGenre.textContent) === genreObject.id) {
        filmGenre.textContent = genreObject.name;
      }
    });
  });

  // Обрізає жанри якщо їх більше як 2
  const filmGenres = filmCards.querySelectorAll('.js-film-genres');
  const filmGenreArray = [...filmGenres];
  filmGenreArray.map(genreArr => {
    if (genreArr.children.length > 2) {
      [...genreArr.children].splice(0, 2);
    }
  });
}
