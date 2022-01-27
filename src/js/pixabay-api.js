'use strict';

import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '25431607-9b845b328937ccad399b1bbc0';

  constructor(keyword = null) {
    this.page = 1;
    this.keyword = keyword;
    this.perPage = 40
  }

  // ?q=${this.keyword}&page=${this.page}&per_page=40&key=${this.#API_KEY}

  fetchPhotos() {
     return axios.get(`${this.#BASE_URL}` , {
      params: {
        q: this.keyword,
        page: this.page,
        per_page: this.perPage,
        key: this.#API_KEY,
        image_type: "photo",
         orientation: "horizontal",
         safesearch: true,
      },
    }
    );
  }  
}
