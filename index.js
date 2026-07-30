import * as Carousel from "./Carousel.js";

// DOM elements and API key
const  API_KEY = "secret key hehe";
const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const favsBtn = document.getElementById("getFavouritesBtn");

// Axios defaults
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;


let favsMap = {};


axios.interceptors.request.use((config) => {
  if (progressBar) {
    progressBar.style.width = "0%";
  }
  config.startTime = new Date().getTime();
  console.log("Sending request to:", config.url);

  document.body.style.cursor = "progress";
  return config;
});
