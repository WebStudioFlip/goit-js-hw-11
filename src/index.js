'use strict';
// https://pixabay.com/
import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



import { PixabayAPI } from './js/pixabay-api';
import galleryCardsTemplate from './template/card.hbs';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', event => {
  event.preventDefault();
console.log(event)
  const keyword = event.currentTarget.elements['searchQuery'].value;

  if (keyword.trim() === '') {
    return;
  }

  pixabayAPI.keyword = keyword;
  pixabayAPI.page = 1;

  galleryListEl.innerHTML = '';

  pixabayAPI
    .fetchPhotos()
    .then(({ data } = {}) => {
        console.log(data)
      if (data.hits.length === 0) {
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      if (data.total_pages === 1) {
        galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
      loadMoreBtnEl.classList.remove('is-hidden');
    })
    .catch(err => {
      console.log(err);
    });
});

loadMoreBtnEl.addEventListener('click', event => {
  pixabayAPI.page += 1;

  pixabayAPI
    .fetchPhotos()
    .then(({ data } = {}) => {
      if (data.hits.length === 0) {
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      if (data.total_pages === pixabayAPI.page) {
        galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
      loadMoreBtnEl.classList.remove('is-hidden');
    })
    .catch(err => {
      console.log(err);
    });
});