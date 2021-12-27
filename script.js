let news = []
let page = 1;
let total_page = 0;
let menuBtn = document.querySelectorAll(".menu-btn")
menuBtn.forEach((menu)=> menu.addEventListener("click", (e) =>getNewsByTopic(e)))

let searchBtn = document.querySelector(".search-btn")
let url;
console.log(searchBtn)


// 각 함수에서 필요한 url을 만든다
// api 호출 함수를 부른다
const getNews = async() => {
    try{
        let header = new Headers({'x-api-key':'HczDzcDhY32VygHq3U67QzUBcCIS8qz4xEzIDLj5smY'})
        url.searchParams.set('page', page)
        console.log(url)
        let response = await fetch(url,{headers:header});
        let data = await response.json()
        if(response.status === 200){
            if(data.total_hits === 0){
                throw new Error("검색된 결과 값이 없습니다.")
            }
            console.log("받는 데이터가 뭐지 ?", data)
            news = data.articles
            total_page = data.total_page
            page = data.page
            console.log(news)
            render()
            pagenation()
        }else{
            throw new Error(data.message)
        }
    }catch(error){
        console.log("잡힌 에러는", error.message)
        errorRender(error.message)
    }
    
}

const getLatestNews = async() =>{
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=4`)
    getNews()
}

const getNewsByKeyword = async () => {
    //1. 검색 키워드 읽어오기
    //2. url에 검색 키워드 붙이기
    //3. 헤더준비
    //4. url부르기
    //5. 데이터 가져오기
    //6. 데이터 보여주기


    let keyword = document.querySelector("#search").value
    console.log(keyword)
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=4`)
    getNews()
}

//토픽
const getNewsByTopic = async (e) =>{
    console.log("클릭됨", e.target.textContent)
    let topic = e.target.textContent.toLowerCase()
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=4`)
    getNews()
}



//render 함수

const render = () => {
    let newsHTML = ''
    newsHTML = news.map((item) =>{
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="image-size" src="${item.media}" alt="">
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div>
                ${item.rights} * ${item.published_date}
            </div>
        </div>
    </div>`
    }).join('');

    document.querySelector('#news-board').innerHTML = newsHTML
}

const errorRender = (message) =>{
    let errorHTML = `<div>${message}</div>`
    document.querySelector('#news-board').innerHTML = errorHTML
}


const pagenation = () => {
    let pagenationHTML =`<li class="page-item disabled">
    <a class="page-link" onclick="moveToPage(${page -1})")>Previous</a>
  </li>`;
    //total_page
    //page
    //page group
    let pageGroup = Math.ceil(page/5)
    //last
    let last = pageGroup*5
    //first
    let first = last - 4
    //first~last 페이지 프린트

    for(let i=first; i<=last; i++){
        pagenationHTML += 
        `<li class="page-item ${page ===i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    pagenationHTML += `<li class="page-item">
    <a class="page-link" href="#" onclick="moveToPage(${page + 1})">Next</a>
    </li>`
    document.querySelector(".pagination").innerHTML = pagenationHTML

}

const moveToPage = (pageNum) =>{
    //1. 이동하고 싶은 페이지를 알아야지
    page = pageNum
    //2. 이동하고 싶은 페이지를 가지고 api호출해야지
    getNews()
}


searchBtn.addEventListener("click", getNewsByKeyword)
getLatestNews();

