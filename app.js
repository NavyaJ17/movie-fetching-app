
let input = document.querySelector('.main-input');
let btn = document.querySelector('.btn');
let container = document.querySelector('.container');
let popular = {
	url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
	id: 'popular'
}
let upcoming = {
	url: 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',
	id: 'upcoming'
};
let topRated = {
	url: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
	id: 'top-rated'
};

btn.addEventListener('click', ()=>{
	container.innerHTML = '';
	fetch(`https://api.themoviedb.org/3/search/movie?query=${input.value}&api_key=c165cf1c932571e22c49b1202bd3b32d`)
	.then(response => response.json())
	.then(response => results(response, 'card', container))
	.catch(error => console.log(error))
	document.querySelector('#results').style.display = 'block';
	input.value = '';
});

function results(response, type, container){
  for(let item of response.results){
    if(item.poster_path != null){
		let div = document.createElement('div');
		div.classList.add(type);
		container.appendChild(div);

		details(item.id)
		.then(html => {
		if(type === 'upcoming'){
			div.innerHTML = `<img src=http://image.tmdb.org/t/p/w185${item.poster_path} alt=img> </img> <div class=rate><i class="fa-solid fa-star fa-xs"></i>${item.vote_average} </div> ${html}`
			div.children[1].style.color = getColor(item.vote_average)
		}
		else{
			if(type === 'top-rated'){
				div.innerHTML = `<img src=http://image.tmdb.org/t/p/w300${item.backdrop_path} alt=img> </img> <p>${item.title}</p><h6><i class="fa-solid fa-star fa-xs"></i>${item.vote_average}</h6> ${html}`;
			
			}
			else{
				div.innerHTML = `<img src=http://image.tmdb.org/t/p/w185${item.poster_path} alt=img> </img> <p>${item.title}</p><h6><i class="fa-solid fa-star fa-xs"></i>${item.vote_average}</h6> ${html}`;
				console.log(div.innerHTML)
			}
			div.children[2].style.color = getColor(item.vote_average)
        }
        
        if(type === 'popular'){
			div.addEventListener('mouseover', ()=>{
				let pseudo = document.querySelector('.pseudo')
				pseudo.style.backgroundImage = `url("http://image.tmdb.org/t/p/w1280${item.backdrop_path}")`;
				pseudo.style.opacity = "20%"
			})
        }  
      });
    }
  }
}

function extras(type){
	const options = {
		method: 'GET',
		headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTY1Y2YxYzkzMjU3MWUyMmM0OWIxMjAyYmQzYjMyZCIsInN1YiI6IjY1NjIxMjlmMjQ0MTgyMDBlYmU0Nzk3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b4bDLt7RTJBvjqMoL1Ha5pt1KAMcG_oKQIR8W7I-lGs'
		}
	};
	fetch(type.url, options)
	.then(response => response.json())
	.then(response => results(response, type.id, document.querySelector(`#${type.id}`)))
	.catch(err => console.log(err));
}

function getColor(vote){
	if(vote < 4) return 'red'
	else if(vote < 7) return 'yellow'
	else return 'green'
}

function details(id){
	const options = {
		method: 'GET',
		headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMTY1Y2YxYzkzMjU3MWUyMmM0OWIxMjAyYmQzYjMyZCIsInN1YiI6IjY1NjIxMjlmMjQ0MTgyMDBlYmU0Nzk3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.b4bDLt7RTJBvjqMoL1Ha5pt1KAMcG_oKQIR8W7I-lGs'
		}
	};
	
	return fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
		.then(response => response.json())
		.then(response => {
		return `<div class="details"> <img src="http://image.tmdb.org/t/p/w300${response.backdrop_path}" alt=img> </img> <p>${response.release_date.slice(0,4)} • ${response.runtime} min • ${response.original_language} • ${response.genres[0].name}</p> <h6>${response.overview}</h6></div>`
		})
		.catch(err => console.error(err));
}

extras(popular);
extras(upcoming);
extras(topRated);