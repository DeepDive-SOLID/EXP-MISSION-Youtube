# EXP-MISSION-YouTube
### 유튜버 사이트 목업 만들기
결과물
![스크린샷 2025-05-21 오후 1 15 14](https://github.com/user-attachments/assets/452dfef1-ef8f-4bee-bb86-224f56dd27d8)

<br>


파일별 구성요소
## index.html 

- header : 상단 바 클래스
  - 왼쪽 섹션 : 로고 및 사이드 바 토글 버튼
  - 검색 영역 : 텍스트 입력창, 키보드 버튼, 검색 버튼, 마이크 버튼
  - 프로필 영역 : 만들기 버튼, 알림 종 버튼, 프로필 아이콘

<br>

- aside(sidebar) : 사이드 바 메뉴 영역
  - ul과 li 구조로 메뉴 나열
  - 각 항목마다 data-type 속성 사용
  - 속성 값을 사용하여 필터링 기능 적용 (현재는 홈, Shorts, 구독, 오프라인 저장 동영상 탭만 적용)
  - 홈 : 인기 동영상 필터링
  - Shorts : 인기 Shorts 동영상 필터링
  - 구독 : 더미 데이터 출력
  - 오프라인 저장 동영상 : 저장한 동영상 표시 (현재는 데이터를 안넣어서 저장되지 않았음을 보여줌)

<br>

- nav : 카테고리 메뉴 영역
  - 각 카테고리 별 버튼으로 동작
  - 속성에는 카테고리 id, 카테고리 텍스트 값으로 정보를 저장하고 JS에서 동작.

<br>

- main : 동영상 비디오 카드 컨테이너 영역
  - 유튜브 동영상을 실질적으로 보여주는 영역
  - JS 파일의 API를 사용하여 영상의 썸네일, 제목, 조회수, 게시일 등 영상의 비디오 카드를 삽입
 
<br>

## styles.css
- index.html의 스타일 css 파일

<br>

## script.js
- 유튜브 API를 활용하여 html 기능 동작과 동영상 정보를 조작.

<details>
<summary>fetchVideos(): 동영상 쿼리 함수</summary>
<div markdown="1">

``` javascript
function fetchVideos(query = null) {
  if (!query) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=12&key=${API_KEY}`;
    fetch(url)
      .then(res => res.json())
      .then(data => renderVideoCards(data.items))
      .catch(err => {
        console.error("YouTube API 오류:", err);
        content.innerHTML = "<p>영상을 불러오지 못했습니다.</p>";
      });
  } else {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&regionCode=KR&order=date&q=${encodeURIComponent(query)}&maxResults=12&key=${API_KEY}`;
    fetch(searchUrl)
      .then(res => res.json())
      .then(data => {
        const videoIds = data.items.map(item => item.id.videoId).join(",");
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
        return fetch(detailsUrl);
      })
      .then(res => res.json())
      .then(data => renderVideoCards(data.items))
      .catch(err => {
        console.error("YouTube API 오류:", err);
        content.innerHTML = "<p>영상을 불러오지 못했습니다.</p>";
      });
  }
}
```

</div>
</details>

<details>
<summary>fetchCategory(): 카테고리 클릭 시 동영상 로딩 함수</summary>
<div markdown="1">

``` javascript
function fetchCategory(categoryId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&videoCategoryId=${categoryId}&maxResults=12&key=${API_KEY}`;
  fetch(url)
    .then(res => res.json())
    .then(data => renderVideoCards(data.items))
    .catch(err => {
      console.error("카테고리 인기 영상 오류:", err);
      content.innerHTML = "<p>카테고리 영상을 불러오지 못했습니다.</p>";
    });
}
```

</div>
</details>

<details>
<summary>renderVideoCards(): 비디오 카드 렌더링 함수</summary>
<div markdown="1">

``` javascript
function renderVideoCards(items) {
  content.innerHTML = "";
  items.forEach(item => {
    const { snippet, statistics = {} } = item;
    const videoId = item.id.videoId || item.id;
    const { title, thumbnails, channelTitle, publishedAt } = snippet;
    const viewCount = statistics.viewCount ? formatViews(statistics.viewCount) : "";

    //비디오 요소 그리기
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
        <img src="${thumbnails.medium.url}" alt="${title}" />
      </a>
      <div class="video-info">
        <h3>${title}</h3>
        <p>${channelTitle}</p>
        <p>조회수 ${viewCount} · ${formatTime(publishedAt)}</p>
      </div>
    `;
    content.appendChild(card);
  });
}
```

</div>
</details>

<details>
<summary>dummyDataVideos(): 더미 데이터 렌더링 함수</summary>
<div markdown="1">

``` javascript
function dummyDataVideos() {
  //더미 데이터
  const dummySubs = [
    {
      title: "React 실전 강의 - useEffect 완전 정복",
      channel: "프론트엔드 개발자",
      views: "1.1만회",
      uploaded: "2일 전",
      thumbnail: "https://placehold.co/300x200?text=React"
    },
    {
      title: "JavaScript 비동기 완벽 가이드",
      channel: "코딩의 신",
      views: "2.3만회",
      uploaded: "4일 전",
      thumbnail: "https://placehold.co/300x200?text=Async+JS"
    },
    {
      title: "Node.js로 백엔드 만들기",
      channel: "백엔드 하는 남자",
      views: "9800회",
      uploaded: "1주 전",
      thumbnail: "https://placehold.co/300x200?text=Node.js"
    }
  ];

  //더미 데이터 요소 그리기
  content.innerHTML = "";
  dummySubs.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}" />
      <div class="video-info">
        <h3>${video.title}</h3>
        <p>${video.channel}</p>
        <p>조회수 ${video.views} · ${video.uploaded}</p>
      </div>
    `;
    content.appendChild(card);
  });
}
```

</div>
</details>

<details>
<summary>formatViews(): 동영상 조회수 계산 함수</summary>
<div markdown="1">

``` javascript
function formatViews(views) {
  const num = Number(views);
  if (num >= 100000000) return (num / 100000000).toFixed(1) + "억회";
  if (num >= 10000) return (num / 10000).toFixed(1) + "만회";
  return num.toLocaleString() + "회";
}
```

</div>
</details>

<details>
<summary>formatViews(): 동영상 게시일 계산 함수</summary>
<div markdown="1">

``` javascript
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) {
    return `${years}년 전`;
  } else if (months >= 1) {
    return `${months}달 전`;
  } else if (days >= 1) {
    return `${days}일 전`;
  } else if (hours >= 1) {
    return `${hours}시간 전`;
  } else {
    return `${minutes}분 전`;
  }
}
```

</div>
</details>

<details>
<summary>이벤트 리스너</summary>
<div markdown="1">

``` javascript
//검색 창 버튼 클릭 이벤트
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchVideos(query);
});

//검색 창 엔터 입력 이벤트
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") searchButton.click();
});

//로고 클릭시 새로고침 이벤트
logo.addEventListener("click", () => {
  location.reload();
});

//사이드 바 클릭 이벤트
sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    sidebarItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");

    const type = item.dataset.type;
    switch (type) {
      case "home":
        fetchVideos();
        break;
      case "shorts":
        fetchVideos("쇼츠 인기");
        break;
      case "subs":
        dummyDataVideos();
        break;
      case "library":
        content.innerHTML = "<p style='padding: 20px;'>📁 보관된 영상이 없습니다.</p>";
        break;
    }
  });
});

const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("toggleSidebar");

//사이드 바 토글 클릭 이벤트
toggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  content.style.marginLeft = sidebar.classList.contains("collapsed") ? "72px" : "200px";
});

const categoryButtons = document.querySelectorAll(".category-btn");
// 카테고리 버튼 이벤트
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const categoryId = btn.dataset.categoryId;

    if (categoryId !== undefined && categoryId !== "") {
      fetchCategory(categoryId); //API의 카테고리 id 기반 검색
    } else if (btn.dataset.category === "전체") {
      fetchVideos(); //전체 카테고리는 첫 화면과 같은 영상이 나오게 설정
    } else {
      const keyword = btn.dataset.category;
      fetchVideos(keyword); //카테고리 id가 제대로 안나오는 것들은 키워드로 설정
    }
  });
});
```

</div>
</details>
