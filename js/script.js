const apiKey = "FI8z8d66ASGjHEw0iOYzSD9tUTmOwrrH";
let offsetTrend = 0;
let offsetSearch = 0;

// armarlo despues con domcontentload
document.addEventListener('DOMContentLoaded', function(){
    getTrendGifs();
});


//dropdown menu
let dropButton = document.getElementById("dropdownBtn");
let dropContent = document.getElementById("menuToShow");

dropButton.addEventListener("click", () => {
    if (dropContent.classList.contains("hidden")) {
      dropContent.classList.remove("hidden")
    }else{
        dropContent.classList.add("hidden");
    }
  });


let dayTheme = document.getElementById("sailor-day");

dayTheme.addEventListener("click", () => {
    var head = document.getElementsByTagName('HEAD')[0];  
    var link = document.createElement('link'); 
    link.rel = 'stylesheet';  
    link.type = 'text/css'; 
    link.href = './estilos/sailorday.css';  
    head.appendChild(link);    
});

let nightTheme = document.getElementById("sailor-night");

nightTheme.addEventListener("click", () => {
    var head = document.getElementsByTagName('HEAD')[0];
    var link = document.createElement('link'); 
    link.rel = 'stylesheet';  
    link.type = 'text/css'; 
    link.href = './estilos/sailornight.css';  
    head.appendChild(link);
});

//autocomplete
let searchContent = document.getElementById("gif-searcher");
searchContent.addEventListener('keyup', ()=>{
  if(searchContent.value.length >=1){
    document.getElementById("search-button").classList.add("color-changer");
  }
  if(searchContent.value.length <1){
    document.getElementById("search-button").classList.remove("color-changer");

  }
    if (searchContent.value.length <3) {
    document.getElementById('autocomplete-recom').classList.add("hidden");
   return;
 } 
 let urlAutocomplete = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${searchContent.value}&limit=3`;
 const contenedor = document.getElementById("autocomplete-recom");
try{
  const data = fetch(urlAutocomplete)
  .then(response => response.json())
  .then(data =>{
    console.log(data.data)
    while (contenedor.lastElementChild) {
      contenedor.removeChild(contenedor.lastElementChild);
    };
    
    data.data.forEach(element=>{
      const internContainer = document.createElement('div');
      internContainer.classList.add('suggested');
      internContainer.addEventListener('click', (e)=>{
        searchContent.value = e.target.innerHTML;
        console.log(e.target);
      });
      const suggestions = document.createElement('p');
      suggestions.innerHTML = element.name;
      internContainer.appendChild(suggestions);
      contenedor.appendChild(internContainer);
    })
    document.getElementById('autocomplete-recom').classList.remove("hidden");

})
}
catch(error){
console.log(error);
}
});


//search gifs
const gifSearcher = document.getElementById("search-button");
let valueContent;
gifSearcher.addEventListener("click", () =>{
  limit = 20;
  valueContent = searchContent.value;
  if (valueContent.length == 0){
    searchContent.setAttribute('placeholder', "Ooops, la búsqueda no ha arrojado resultados. Intentalo de nuevo.")
    document.getElementById('hidden-search').style.display = "none";
    return;
  }
  let urlSearch = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${valueContent}&limit=${limit}&offset=${offsetSearch}&rating=g&lang=en`;
  document.getElementById('hidden-search').style.display = "block";
  document.getElementById('search-button').classList.add("change-color");
  document.getElementById('results-p').innerHTML = `${valueContent} (resultados)`;
  const contenedor = document.getElementById("search-results");
  while (contenedor.lastElementChild) {
    contenedor.removeChild(contenedor.lastElementChild);
  };
  try{
    const data = fetch(urlSearch)
    .then(response => response.json())
    .then(data =>{
      console.log(data.data)
      data.data.forEach(element=>{
        const internContainer = document.createElement('div');
        internContainer.classList.add('intern-container');
        contenedor.appendChild(internContainer);
        const title = document.createElement('p');
          title.classList.add('gif-title');
          title.classList.add("gradient");
          title.innerHTML = element.title.split("GIF")[0];
          internContainer.appendChild(title);
          
        const gif = document.createElement('img');
        gif.src = element.images.fixed_height.url;
        internContainer.appendChild(gif);
      })
      offsetSearch += limit;
  })
  document.getElementById('autocomplete-recom').classList.add('hidden');
}
catch(error){
  console.log(error)
}
});

const loadMoreGifs = document.getElementById('search-more-results');
loadMoreGifs.addEventListener('click', ()=>{
  let urlSearch = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${valueContent}&limit=${limit}&offset=${offsetSearch}&rating=g&lang=en`;
  const contenedor = document.getElementById("search-results");
  try{
    const data = fetch(urlSearch)
    .then(response => response.json())
    .then(data =>{
      console.log(data.data)
      data.data.forEach(element=>{
        const internContainer = document.createElement('div');
        internContainer.classList.add('intern-container');
        contenedor.appendChild(internContainer);
        const title = document.createElement('p');
          title.classList.add('gif-title');
          title.classList.add("gradient");
          title.innerHTML = element.title.split("GIF")[0];
          internContainer.appendChild(title);
          
        const gif = document.createElement('img');
        gif.src = element.images.fixed_height.url;
        internContainer.appendChild(gif);
      })
      offsetSearch += limit;
  })
}
catch(error){
  console.log(error)
}
});




//suggested gifs
async function getSuggestedGifs(suggestion) {
    let urlSuggested = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=cat&limit=4&offset=0&rating=g&lang=en`;
    const contenedor = document.getElementById("suggestedCont");
    try{
      const data = await fetch(urlSuggested)
      .then(response => response.json())
      .then(data =>{
        console.log(data.data)
        data.data.forEach(element=>{
          const internContainer = document.createElement('div');
          internContainer.classList.add('intern-container');
          contenedor.appendChild(internContainer);
          const contTitle = document.createElement('div'); 
          contTitle.classList.add('suggested-title');
          internContainer.appendChild(contTitle);

          const title = document.createElement('p');
          contTitle.appendChild(title);

          const contSvg = document.createElement('div');
          contSvg.classList.add("svg-cross");
          contTitle.appendChild(contSvg);

          title.classList.add('gif-title');
          title.classList.add("gradient");
          title.innerHTML = element.title.split("GIF")[0];
          //agregar div ver más
          const seeMore = document.createElement('div');
          seeMore.classList.add('botton-see-more');
          internContainer.appendChild(seeMore);
          const aSee = document.createElement('a');
          aSee.href = element.bitly_url;
          aSee.innerHTML = "Ver más...";
          aSee.setAttribute('target', "_blank");
          seeMore.appendChild(aSee);

          

          const gif = document.createElement('img');
          gif.src = element.images.fixed_height.url;
          internContainer.appendChild(gif);
        })
      })
    }
    catch(error){
      console.log(error)
    }
}
getSuggestedGifs();

// trending gifs

  async function getTrendGifs() {
    const limit = 16;
    let urlTrending = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}&rating=PG&offset=${offsetTrend}`;
    const contenedor = document.getElementById("trendingCont");
    try{
      const data = await fetch(urlTrending)
      .then(response => response.json())
      .then(data =>{
        console.log(data);
        data.data.forEach(element => {
                 // crear contenedor y darle estilo
          const internContainer = document.createElement('div');
          internContainer.classList.add('trend-intern-container');
          //crear iframe y cambiarle la source
          const gif = document.createElement('img');
          gif.src = element.images.fixed_height.url;
          //agregar titulos
          const title = document.createElement('p');
          title.classList.add('gif-title-low');
          title.classList.add("gradient");
          title.innerHTML = element.title.split("GIF")[0];
          contenedor.appendChild(internContainer);
          internContainer.appendChild(gif);
          internContainer.appendChild(title);
          
          });
        });
        offsetTrend += limit;
      }
     
    catch(error) {
        console.log(error)
    }
  }

window.addEventListener('scroll', function(){
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        getTrendGifs();
    }
});
