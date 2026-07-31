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
// Response Interceptor
axios.interceptors.response.use(
  (res) => {
    const timeTaken = new Date().getTime() - res.config.startTime;
    console.log("Done in " + timeTaken + "ms");

    document.body.style.cursor = "default";
    return res;
  },
  (err) => {
    document.body.style.cursor = "default";
    return Promise.reject(err);
  }
);
// Update loading progress bar
function updateProgress(e) {
  if (e.lengthComputable && progressBar) {
    const percent = Math.round((e.loaded * 100) / e.total);
    progressBar.style.width = percent + "%";
  } else if (progressBar) {
    progressBar.style.width = "100%";
  }
}


function buildCarousel(items) {
  Carousel.clear();
  infoDump.innerHTML = "";

  if (!items || items.length === 0) {
    infoDump.innerHTML = "<p>No images found.</p>";
    return;
  }

  // Loop through images and add slides
  for (let i = 0; i < items.length; i++) {
    const cat = items[i];
    
    let catName = "Cat Image";
    if (cat.breeds && cat.breeds.length > 0 && cat.breeds[0].name) {
      catName = cat.breeds[0].name;
    }

    const slide = Carousel.createCarouselItem(cat.url, catName, cat.id);

    if (i === 0) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
Carousel.appendCarouselItem(slide);
  }

  // Fill out breed info box using the first image
  const firstCat = items[0];
  if (firstCat && firstCat.breeds && firstCat.breeds.length > 0) {
    const breed = firstCat.breeds[0];
    infoDump.innerHTML = `
      <h2>${breed.name}</h2>
      <p><strong>Origin:</strong> ${breed.origin || "Unknown"}</p>
      <p><strong>Temperament:</strong> ${breed.temperament || "N/A"}</p>
      <p>${breed.description || "No description provided."}</p>
    `;
  }

  Carousel.start();
}

// Populate drop-down on load
export async function initialLoad() {
  try {
    const res = await axios.get("/breeds", {
      onDownloadProgress: updateProgress,
    });

    const breeds = res.data;
    breedSelect.innerHTML = '<option value="" disabled selected>Select a breed...</option>';

    for (let i = 0; i < breeds.length; i++) {
      const opt = document.createElement("option");
      opt.value = breeds[i].id;
      opt.textContent = breeds[i].name;
      breedSelect.appendChild(opt);
    }

    if (breeds.length > 0) {
      breedSelect.value = breeds[0].id;
      handleBreedSelect();
    }
  } catch (err) {
    console.error("Failed to load breed list:", err);
    infoDump.innerHTML = "<p>Could not load breeds.</p>";
  }
}


   