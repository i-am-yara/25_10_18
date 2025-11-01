const API_URL = "https://68f3513ffd14a9fcc4286bf9.mockapi.io";

const collectionName = "movies";

async function deleteMovie(elementId) {
  try {
    const response = await fetch(`${API_URL}/${collectionName}/${elementId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchMovies();
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log(error);
  }
}

function editMovie(index) {
  const modal = document.querySelector(".js-modal");
  modal.classList.remove("hidden");
  const modalForm = document.querySelector(".js-modal-form");

  const movie = movieCatalog[index];

  modalForm["title"].value = movie.title;
  modalForm["director"].value = movie.director;
  modalForm["year"].value = movie.year;
  modalForm["genres"].value = movie.genres.join(", ");
  modalForm["rating"].value = movie.rating;
  modalForm["availableOnline"].checked = movie.isAvailableOnStreaming;
  modalForm["favourite"].checked = movie.isFavourite;
  modalForm.dataset.index = index;
  modalForm.dataset.id = movie.id;
}

// window.deleteMovie = deleteMovie; // Не найкращий варіант

function showCatalog() {
  let tableBodyHTML = "";

  movieCatalog.forEach((movie, index) => {
    tableBodyHTML += `<tr>
        <td>${index + 1}</td>
        <td>${movie.title}</td>
        <td>${movie.director}</td>
        <td>${movie.year}</td>
        <td class="genres">${movie.genres.join(", ")}</td>
        <td>${movie.rating.toFixed(1)}</td>
        <td>${movie.isAvailableOnStreaming ? "Так" : "Ні"}</td>
        <td class="${movie.isFavourite ? "favourite" : ""}">
          ${movie.isFavourite ? "❤" : "–"}
        </td>
        <td>
          <button class="js-delete" type="button" title="Видалити" data-index=${index} data-id=${
      movie.id
    } >🗑</button>
          <button class="js-edit" type="button" title="Редагувати"  data-index=${index} data-id=${
      movie.id
    }>🖋️</button>
        </td>
        </tr>`;
  });

  tableBody.innerHTML = tableBodyHTML;
}

async function saveMovie(event) {
  event.preventDefault();

  const form = event.target;
  const title = form["title"].value;
  const director = form["director"].value;
  const year = parseInt(form["year"].value, 10);

  if (year > new Date().getFullYear() + 1) {
    alert("Рік випуску не може бути більшим за поточний рік + 1.");
    return;
  }

  const genres = form["genres"].value
    .split(",")
    .map((genre) => genre.trim().toLowerCase())
    .filter((genre) => genre.length > 0);
  const rating = parseFloat(form["rating"].value);
  const isAvailableOnStreaming = form["availableOnline"].checked;
  const isFavourite = form["favourite"].checked;

  console.log(`
Назва: ${title}; 
Режисер: ${director};
Рік: ${year};
Жанри: ${genres.join(", ")};
Рейтинг: ${rating.toFixed(1)};
Доступний на стрімінгу: ${isAvailableOnStreaming ? "Так" : "Ні"};
Улюблений: ${isFavourite ? "Так" : "Ні"}`);

  if (form.classList.contains("js-modal-form")) {
    const movieId = form.dataset.id;
    try {
      const response = await fetch(`${API_URL}/${collectionName}/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          director,
          year,
          genres,
          rating,
          isAvailableOnStreaming,
          isFavourite,
        }),
      });

      if (response.ok) {
        await fetchMovies();
      } else {
        ("Error during add movie");
      }
    } catch (error) {
      console.log(error);
    }

    document.querySelector(".js-modal").classList.add("hidden");
  } else if (form.classList.contains("js-movie-form")) {
    try {
      const response = await fetch(`${API_URL}/${collectionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          director,
          year,
          genres,
          rating,
          isAvailableOnStreaming,
          isFavourite,
        }),
      });

      if (response.ok) {
        await fetchMovies();
      } else {
        ("Error during add movie");
      }
    } catch (error) {
      console.log(error);
    }
  }

  localStorage.setItem("movieCatalog", JSON.stringify(movieCatalog));
  showCatalog();

  form.reset();
}

// function fetchMovies() {
//   fetch(`${API_URL}/${collectionName}`)
//     .then((resposnse) => {
//       return resposnse.json();
//     })
//     .then((data) => {
//       console.log(data);
//       movieCatalog = data;
//       showCatalog();
//     })
//     .catch((reason) => {
//       console.log(reason);
//     });
// }

async function fetchMovies() {
  try {
    const resposnse = await fetch(`${API_URL}/${collectionName}`);
    const data = await resposnse.json();

    // console.log(data);
    movieCatalog = data;
    showCatalog();
  } catch (err) {
    console.log(err);
  }
}

const cat = localStorage.getItem("movieCatalog");

let movieCatalog;
fetchMovies();
// if (cat) {
//   movieCatalog = JSON.parse(cat);
// } else {
//   movieCatalog = movie;
//   localStorage.setItem("movieCatalog", JSON.stringify(movieCatalog));
// }

const tableBody = document.querySelector("#movieTable tbody");

tableBody.addEventListener("click", (event) => {
  // if (event.target.tagName === "BUTTON") {
  //   deleteMovie(event.target.dataset.index);
  // }

  if (event.target.classList.contains("js-delete")) {
    deleteMovie(event.target.dataset.id);
  }

  if (event.target.classList.contains("js-edit")) {
    editMovie(event.target.dataset.index);
  }
});

const my_form = document.querySelector(".js-movie-form");
const modalForm = document.querySelector(".js-modal-form");

my_form.onsubmit = saveMovie;
modalForm.onsubmit = saveMovie;

document.querySelector(".js-modal-close").onclick = () => {
  document.querySelector(".js-modal").classList.add("hidden");
  modalForm.reset();
};

document.querySelector(".js-clear").onclick = () => {
  localStorage.removeItem("movieCatalog");
  movieCatalog = [];
  showCatalog();
  alert("Каталог очищено");
};

// GET;
// POST;
// PATCH / PUT;
// DELETE;

// RestAPI;
