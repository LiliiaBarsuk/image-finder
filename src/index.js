import './main.css';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
const axios = require('axios').default;



const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery')
}
// var lightbox = new SimpleLightbox(".gallery a", { captionDelay: 250 });
const URL = 'https://pixabay.com/api/';

refs.form.addEventListener('submit', onFormSubmit)
refs.btnLoadMore.addEventListener('click', onLoadMore)

let inputData 
let page = 1
let lightbox

function onFormSubmit(e) {
     e.preventDefault()
     inputData = e.target[0].value
     page = 1
     refs.gallery.innerHTML = ""
     

    fetchData(inputData, page).then((image) => {
        const { data: { hits } } = image

        if (hits.length === 0) {
          refs.btnLoadMore.classList.add("is-hidden");
          Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
          return
        }

        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits))
        lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
        lightbox.refresh(); 
        Notiflix.Notify.success(`Hooray! We found ${image.data.totalHits} images.`);
        refs.btnLoadMore.classList.remove("is-hidden"); 
    }) 
}

function onLoadMore() {
     page += 1
    
    fetchData(inputData, page).then((image) => {
        const { data: { hits } } = image
        let totalPage = image.data.totalHits / hits.length
        if (hits.length === 0) {
          refs.btnLoadMore.classList.add("is-hidden");
          Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
          return
        }
        if (page > totalPage) {
          refs.btnLoadMore.classList.add("is-hidden");
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          return
        }
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits))
        lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
        lightbox.refresh(); 
    })

}

async function fetchData(clientData, page) {
    try {
      return await axios.get(URL, {
        params: {
            key: '29505818-5cb88c7f65aac8c7d69f01816',
            q: `${clientData}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: 40,
            page: `${page}`
        }
      });
      
    } catch (error) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
      
}

function createMarkup(arrayOfImg) {
    return arrayOfImg.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
        <a href="${largeImageURL}" class="gallery-link"><img src="${webformatURL}" class='gallery-img' alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>`
      
    }).join("")
}


