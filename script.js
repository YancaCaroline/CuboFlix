const todosOsFilmes = document.querySelector(".movies");
const btnAnterior = document.querySelector(".btn-prev");
const btnProximo = document.querySelector(".btn-next");
const dia = document.querySelector(".highlight");
const diaVideoLink = document.querySelector(".highlight__video-link");
const diaVideo = document.querySelector(".highlight__video");
const diaInfo = document.querySelector(".highlight__info");
const diaTituloResumo = document.querySelector(".highlight__title-rating");
const diaTitulo = document.querySelector(".highlight__title");
const diaResumo = document.querySelector(".highlight__rating");
const diaGeneroComum = document.querySelector(".highlight__genre-launch");
const diaGenero = document.querySelector(".highlight__genres");
const diaComum = document.querySelector(".highlight__launch");
const diaDescricao = document.querySelector(".highlight__description");
const modalTitulo = document.querySelector(".modal__title");
const modalImagem = document.querySelector(".modal__img");
const modalDescricao = document.querySelector(".modal__description");
const modalGenero = document.querySelector(".modal__genre-average");
const modalGeneros = document.querySelector(".modal__genres");
const modalComum = document.querySelector(".modal__average");
const filmeModal = document.querySelector(".modal");
const input = document.querySelector(".input");

let indiceInicial = 0;
let indiceFinal = 5;
let respostaDosFilmes;

async function requisicaoDeFilmes(retorno) {
  const promiseResposta = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
  );
  const filmes = await promiseResposta.json();

  const promiseRespostaFilmeDia = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
  );
  const filmesDia = await promiseRespostaFilmeDia.json();

  const promiseRespostaVideo = await fetch(
    "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
  );
  const video = await promiseRespostaVideo.json();
  return retorno(filmes, filmesDia, video);
}

function teste() {
  requisicaoDeFilmes((filmes, filmesDia, video) => {
    respostaDosFilmes = filmes.results;
    let paginaDeFilme = filmes.results.slice(indiceInicial, indiceFinal);
    paginaDeFilme.forEach((filme) => {
      criarElementos(filme);
    });
    paginaFilme();
    filmeEVideoDoDia(filmesDia, video);
  });
}
teste();

function paginaFilme() {
  todosOsFilmes.innerHTML = "";
  let paginaDeFilme = respostaDosFilmes.slice(indiceInicial, indiceFinal);
  paginaDeFilme.forEach((filme) => {
    criarElementos(filme);
  });
}

function criarElementos(filme) {
  const movie = document.createElement("div");
  const filmeInfo = document.createElement("div");
  const filmeTitulo = document.createElement("span");
  const filmeResumo = document.createElement("span");
  const filmeId = document.createElement("p");
  const filmeImagem = document.createElement("img");
  movie.classList.add("movie");
  filmeInfo.classList.add("movie__info");
  filmeTitulo.classList.add("movie__title");
  filmeResumo.classList.add("movie__rating");
  movie.style.backgroundImage = `url(${filme.poster_path})`;
  filmeTitulo.textContent = filme.title;
  filmeResumo.textContent = filme.vote_average;
  filmeImagem.src = "./assets/estrela.svg";
  filmeImagem.alt = "Estrela";
  filmeId.textContent = filme.id;
  filmeId.classList.add("hidden");
  movie.addEventListener("click", (event) => {
    const filmeClicado = event.target;
    const id = filmeClicado.querySelector("p");
    modal(id.textContent);
  });

  movie.append(filmeInfo, filmeId);
  filmeInfo.append(filmeTitulo, filmeResumo);
  filmeResumo.append(filmeImagem);
  todosOsFilmes.append(movie);
}

btnAnterior.addEventListener("click", () => {
  if (indiceInicial > 5) {
    indiceInicial = respostaDosFilmes.length - 6;
    indiceFinal = respostaDosFilmes.length - 1;
  } else {
    indiceInicial -= 5;
    indiceFinal -= 5;
  }
  paginaFilme();
});

btnProximo.addEventListener("click", () => {
  if (indiceInicial > respostaDosFilmes.length - 6) {
    indiceInicial = 0;
    indiceFinal = 5;
  } else {
    indiceInicial += 5;
    indiceFinal += 5;
  }
  paginaFilme();
});

function filmeEVideoDoDia(filme, video) {
  diaVideo.style.backgroundImage = `url(${filme.backdrop_path})`;
  diaVideo.style.backgroundSize = "100%";
  diaTitulo.textContent = filme.title;
  diaResumo.textContent = filme.vote_average;
  let generosFilme = "";
  filme.genres.forEach((genero) => {
    generosFilme += `${genero.name}, `;
  });
  diaGenero.textContent = generosFilme;
  const dataFilme = new Date(filme.release_date);
  const formatarData = Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  });

  diaComum.textContent = formatarData.format(dataFilme);

  diaDescricao.textContent = filme.overview;
  diaVideoLink.href = `https://www.youtube.com/watch?v=${video.results[0].key}`;
}

function modal(id) {
  modalFilmes(id, (resposta) => {
    modalTitulo.textContent = resposta.title;
    modalImagem.src = resposta.backdrop_path;
    modalDescricao.textContent = resposta.overview;
    modalComum.textContent = resposta.vote_average;
  });
  filmeModal.classList.remove("hidden");
}

async function modalFilmes(id, retorno) {
  const promiseResposta = await fetch(
    `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`
  );

  const respostaFilme = await promiseResposta.json();
  return retorno(respostaFilme);
}

filmeModal.addEventListener("click", () => {
  filmeModal.classList.add("hidden");
});

input.addEventListener("keyup", (event) => {
  input.value = input.value.trim();
  if (event.key != "Enter") {
    return;
  }
  if (!input.value) {
    indiceInicial = 0;
    indiceFinal = 5;
    teste();
    return;
  }

  buscarFilme(input.value, (resposta) => {
    respostaDosFilmes = resposta.results;
    indiceInicial = 0;
    indiceFinal = 5;
    paginaFilme();
    input.value = "";
  });
});

async function buscarFilme(pesquisa, retorno) {
  const promiseResposta = await fetch(
    ` https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=${pesquisa}**`
  );

  const respostaFilme = await promiseResposta.json();
  return retorno(respostaFilme);
}
