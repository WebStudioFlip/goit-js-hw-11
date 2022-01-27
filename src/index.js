'use strict';
// https://pixabay.com/
import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';



import { PixabayAPI } from './js/pixabay-api';
import galleryCardsTemplate from './template/card.hbs';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', async (event) => {
  event.preventDefault();
console.log(event)
  const keyword = event.currentTarget.elements['searchQuery'].value;

  if (keyword.trim() === '') {
    return;
  }

  pixabayAPI.keyword = keyword;
  pixabayAPI.page = 1;

  galleryListEl.innerHTML = '';
let { data } = await pixabayAPI.fetchPhotos()
       console.log(data)
      if (data.hits.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      if (data.totalHits <= pixabayAPI.perPage) {
        galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
        
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
      Notify.info(`Hooray! We found ${data.totalHits} images.`);
      loadMoreBtnEl.classList.remove('is-hidden');
      let gallery = new SimpleLightbox('.gallery a');
      scrolCustom ()
    
});

loadMoreBtnEl.addEventListener('click', async (event) => {
  pixabayAPI.page += 1;
  let { data } = await pixabayAPI.fetchPhotos()
  console.log(data)
      if (data.hits.length === 0) {
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }

      if (data.totalHits <= pixabayAPI.page*pixabayAPI.perPage) {
        galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
        loadMoreBtnEl.classList.add('is-hidden');
        Notify.failure("We're sorry, but you've reached the end of search results.");
        
        return;
      }

      galleryListEl.insertAdjacentHTML('beforeend', galleryCardsTemplate(data.hits));
      loadMoreBtnEl.classList.remove('is-hidden');  
      let total =  pixabayAPI.page*pixabayAPI.perPage;
      Notify.info(`Showing ${total} of ${data.totalHits} images`);
      let gallery = new SimpleLightbox('.gallery a'); 
      scrolCustom ()
});

function scrolCustom () {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}