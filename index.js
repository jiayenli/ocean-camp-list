const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const user = [];
const dataPanel = document.querySelector("#data-panel");
const modalImage = document.querySelector("#modal-inner-image");
const modalInfo = document.querySelector("#modal-inner-info");
const paginator = document.querySelector("#paginator")
const USER_PER_PAGE = 12
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector("#search-form")
const teacherReset = document.querySelector(".teacher")
let filteredUser = []

//請求取得 API 資料
axios
  .get(INDEX_URL)
  .then((response) => {
    user.push(...response.data.results);
    renderPaginator(user.length)
    renderUserList(getUserByPage(1));
  
  })
  .catch((err) => console.log(err));

//頭項資訊點擊事件
dataPanel.addEventListener("click", function (event) {
  if (event.target.matches(".card-detail")) {
    console.log(event.target.dataset.id)
    showUserModal(event.target.dataset.id);
  }
});

//頁碼點擊事件
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUserByPage(page))
})

//搜尋bar
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }

  filteredUser = user.filter((item) =>
    item.name.toLowerCase().includes(keyword)
  )
  renderPaginator(filteredUser.length)
  renderUserList(getUserByPage(1))
})

//點擊師資陣容
teacherReset.addEventListener('click', function onPaginatorClicked(event) {
  filteredUser = user
  renderPaginator(user.length)
  renderUserList(getUserByPage(1));
})


///////////函式區////////////
//渲染個人頭像頁面
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    // title, image
    rawHTML += ` 
      <div class="border-right col-sm-3 mt-2">
        <div class="card border-0 mt-2 p-3 card text-center">
          <img src="${item.avatar}" class="card-img "  style="border-radius: 100%;" >
          <h4 class="card-title" >${item.name}</h4>
          <a href="#" class=" card-detail btn btn-secondary"  data-toggle="modal" data-target="#exampleModal" data-id="${item.id}" >More</a>
        </div>
      </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//渲染彈出視窗
function showUserModal(id) {
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalImage.innerHTML = `<img src="${data.avatar}" class="modal-card-image" style="width:100%;">`;
    modalInfo.innerHTML = `
    <p>Name：${data.name}</p>
    <p>Gender：${data.gender}</p>
    <p>Birthday：${data.birthday}</p>
    <p>age：${data.age}</p>
    <p>region：${data.region}</p>
    <p>email:${data.email}</p>`;
  });
}

//分頁
function getUserByPage(page) {
  const startIndex = (page - 1) * USER_PER_PAGE
  const data = filteredUser.length ? filteredUser : user
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

//頁碼
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

