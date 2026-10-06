
const cl = console.log;

const movieModel = document.getElementById('movieModel')
const backDrop = document.getElementById('backDrop')
const movieForm = document.getElementById('movieForm')
const title = document.getElementById('title')
const poster = document.getElementById('poster')
const genre = document.getElementById('genre')
const rating = document.getElementById('rating')
const description = document.getElementById('description')
const movieContainer = document.getElementById('movieContainer')
const submitBtn = document.getElementById('submitBtn')
const updateBtn = document.getElementById('updateBtn')
const addTxt = document.getElementById('addTxt')
const updateTxt = document.getElementById('updateTxt')
const closeModel = document.querySelectorAll('.closeModel')

const BASE_URL = `https://crud-i-d1819-default-rtdb.asia-southeast1.firebasedatabase.app`;
const MOVIE_URL = `${BASE_URL}/oldmovie.json`

const state = {
  moviesArr: [],
  editId: null
}

function movieRating(rating) {
  if (rating >= 7) {
    return "badge-success"
  } else if (rating >= 5 && rating < 7) {
    return "badge-warning"
  } else {
    return "badge-danger"
  }
}

function snackBar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon
  })
}

// function onModelToggle() {
//   movieModel.classList.toggle('active');
//   backDrop.classList.toggle('active')
//   updateBtn.classList.add('d-none')
//   submitBtn.classList.remove('d-none')
//   // movieForm.reset()
// }

function objToarr(obj) {

  state.moviesArr = Object.entries(obj).map(ele => ({ ...ele[1], id: ele[0] }))
  // for (const key in obj) {
  //   obj[key].id = key;
    // state.moviesArr.unshift(obj)
  // }
}

function showHideSpinar(flag) {
  if (flag) {
    spinner.classList.remove('d-none')
  } else {
    spinner.classList.add('d-none')
  }
}

function onModelToggle() {
  movieModel.classList.toggle('active')
  backDrop.classList.toggle('active')
  updateBtn.classList.add('d-none')
  submitBtn.classList.remove('d-none')
  addTxt.classList.remove('d-none')
  updateTxt.classList.add('d-none')
  movieForm.reset()
  // closeModel.classList.toggle('d-none')

}
function makeApiCall(url, method, body = null) {
  body = body ? JSON.stringify(body) : null;
  return fetch(url, {
    method: method,
    body: body,
    headers: {
      "content-type": "application/json",
      "auth": "JWT TOKEN.."
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error..`)
      }
      return res.json()
    })
}

function showonUI(arr) {
  let res = ``;
  arr.forEach(movie => {
    res += `<div class="col-md-3" id="${movie.id}">
                <div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${movie.title}</h4>
                                <small>Created At :${movie.createdAt}</small><br>
                               ${movie.updatedAt ? `<small>Updated At :${movie.updatedAt}</small>` : "<br>"} 
                            </div>
                            <div class="col-2">
                                <h5 class="m-0"><span class="badge ${movieRating(movie.rating)}">${movie.rating}</span></h5>
                            </div>
                            
                        </div>
                    </div>
                    <div class="card-body py-0">
                        <figure>
                            <img src="${movie.poster}" alt="${movie.title}">
                            <figcaption class="m-0">
                                <h5 class="m-0">${movie.title}</h5>
                                <p class="m-0">
                                    <span>Genre :${movie.genre}</span><br>
                                    ${movie.description}
                                    </p>
                            </figcaption>                            
                        </figure>
                    </div>                   
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-sec"> Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-pri">Remove</button>
                    </div>
                </div>
            </div>`
  })
  movieContainer.innerHTML = res;
}

function fetchMovies() {
  showHideSpinar(true)
  makeApiCall(MOVIE_URL)
    .then(data => {
      objToarr(data)
      showonUI(state.moviesArr)
    })
    .catch(err => {
      cl(err)
      snackBar(err, 'error')
    })
    .finally(() => {
      showHideSpinar()
    })
}
fetchMovies()
function onSubmitMovie(eve) {
  eve.preventDefault()
  let newMovie = {
    createdAt: new Date().toLocaleDateString("en-IN"),
    updatedAt: null,
    title: title.value,
    poster: poster.value,
    rating: rating.value,
    genre: genre.value,
    description: description.value
  }
  // cl(newMovie)
  makeApiCall(MOVIE_URL, "POST", newMovie)
    .then(data => {
      newMovie.id = data.name;
      state.moviesArr.unshift(newMovie)
      let col = document.createElement('div')
      col.className = `col-md-3 mb-3`
      col.id = newMovie.id
      col.innerHTML = `<div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${newMovie.title}</h4>
                                <small>Created At :${newMovie.createdAt}</small><br>
                                ${newMovie.updatedAt ? `<small>Updated At :${newMovie.updatedAt}</small>` : "<br>"}
                            </div>
                            <div class="col-2">
                                <h5 class="m-0"><span class="badge ${movieRating(newMovie.rating)}">${newMovie.rating}</span></h5>
                            </div>
                            
                        </div>
                    </div>
                    <div class="card-body py-0">
                        <figure>
                            <img src="${newMovie.poster}" alt="${newMovie.title}">
                            <figcaption class="m-0">
                                <h5 class="m-0">${newMovie.title}</h5>
                                <p class="m-0">
                                    <span>Genre :${newMovie.genre}</span><br>
                                    ${newMovie.description}
                                    </p>
                            </figcaption>                            
                        </figure>
                    </div>                   
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-sec"> Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-pri">Remove</button>
                    </div>
                </div>`
      movieContainer.append(col)
      onModelToggle()

    })
}

function onEdit(ele) {
  let EDIT_ID = ele.closest('.col-md-3').id;
  state.editId = EDIT_ID;
  const EDIT_URL = `${BASE_URL}/oldmovie/${EDIT_ID}.json`
  showHideSpinar(true)
  makeApiCall(EDIT_URL)
    .then(data => {
      onModelToggle()
      title.value = data.title
      poster.value = data.poster
      description.value = data.description
      rating.value = data.rating
      genre.value = data.genre

      updateBtn.classList.remove('d-none')
      submitBtn.classList.add('d-none')
      addTxt.classList.add('d-none')
      updateTxt.classList.remove('d-none')

    })
    .catch(err =>{
      cl(err)
    })
    .finally(() => {
      showHideSpinar()
    })
}

function onUpdateMovie(ele){
  let UPDATE_ID = state.editId
  const UPDATE_URL = `${BASE_URL}/oldmovie/${UPDATE_ID}.json`
  let oldObj = state.moviesArr.find(movie => movie.id === UPDATE_ID)  
  let UPDATE_OBJ = {
    createdAt : oldObj.createdAt,
    updatedAt : new Date().toLocaleDateString("en-IN"),
    title : title.value,
    poster : poster.value,
    description : description.value,
    genre : genre.value,
    rating : rating.value
  }
  // cl(UPDATE_OBJ)
  showHideSpinar(true)
  makeApiCall(UPDATE_URL, "PATCH", UPDATE_OBJ)
  .then(data => {
    let getIndex = state.moviesArr.findIndex(m => m.id === UPDATE_ID)
    state.moviesArr[getIndex] = UPDATE_OBJ;
    let col = document.getElementById(UPDATE_ID)
    col.innerHTML = `<div class="card movieCard">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4 class="m-0">${UPDATE_OBJ.title}</h4>
                                <small>Created At :${UPDATE_OBJ.createdAt}</small><br>
                                ${UPDATE_OBJ.updatedAt ? `<small>Updated At :${UPDATE_OBJ.updatedAt}</small>` : "<br>"}
                            </div>
                            <div class="col-2">
                                <h5 class="m-0"><span class="badge ${movieRating(UPDATE_OBJ.rating)}">${UPDATE_OBJ.rating}</span></h5>
                            </div>
                            
                        </div>
                    </div>
                    <div class="card-body py-0">
                        <figure>
                            <img src="${UPDATE_OBJ.poster}" alt="${UPDATE_OBJ.title}">
                            <figcaption class="m-0">
                                <h5 class="m-0">${UPDATE_OBJ.title}</h5>
                                <p class="m-0">
                                    <span>Genre :${UPDATE_OBJ.genre}</span><br>
                                    ${UPDATE_OBJ.description}
                                    </p>
                            </figcaption>                            
                        </figure>
                    </div>                   
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" type="button" class="btn btn-sm btn-sec"> Edit</button>
                        <button onclick="onRemove(this)" type="button" class="btn btn-sm btn-pri">Remove</button>
                    </div>
                </div>`
                onModelToggle()
  })
  .catch(err => {
    cl(err)
  })
  .finally(() => {
    showHideSpinar()
  })
}

function onRemove(ele){
  let REMOVE_ID = ele.closest('.col-md-3').id
  // cl(REMOVE_ID)
  let REMOVE_URL = `${BASE_URL}/oldmovie/${REMOVE_ID}.json`
  Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    showHideSpinar(true)
    makeApiCall(REMOVE_URL, "DELETE")
    .then(data => {
      let getIndex = state.moviesArr.findIndex(m => m.id === REMOVE_ID)
      state.moviesArr.splice(getIndex, 1)
      ele.closest('.col-md-3').remove()
    })
    .catch(err => {
      cl(err)
    })
    .finally(() => {
      showHideSpinar()
    })
  }
});
}

movieForm.addEventListener('submit', onSubmitMovie)
showModelBtn.addEventListener('click', onModelToggle)
closeModel.forEach(m => {
  m.addEventListener('click', onModelToggle)
})
updateBtn.addEventListener('click', onUpdateMovie)

