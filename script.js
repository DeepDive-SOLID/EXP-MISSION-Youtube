const API_KEY = "AIzaSyCyveNIV0JR2ezy8cSu_sbfRDiW0e7xE6s";

let videos = [];
const videoList = document.querySelector(".videoContainer");
const searchBtn = document.querySelector(".searchBtn");
const searchInput = document.querySelector(".searchInput");
const sideBtn = document.querySelectorAll(".sideItem button");
const menuToggle = document.getElementById("menuToggle");
const sidebarBtns = document.querySelector(".sidebar");
const topBtn = document.querySelectorAll(".topBtn");

// 비디오 리스트 만들기
const videoBody = () => {
  // youtube API 로드
  loadYoutubeAPI();
  // 이벤트 함수
  addEventListeners();
};

// 공통 API 호출 함수
const fetchYoutubeData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    alert("유튜브 API 호출 실패");
    console.error("API 호출 실패", error);
    return [];
  }
};

// 채널 프로필 가져오는 함수
const channelProfile = async (channelId) => {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`;
  const items = await fetchYoutubeData(url);
  return items[0]?.snippet?.thumbnails?.default?.url || "";
};

// 처음 페이지 로딩 시 인기 영상 로드
const loadYoutubeAPI = async () => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=12&key=${API_KEY}`;
  videos = await fetchYoutubeData(url);
  addTodoElement();
};

// 검색 결과 로드
const searchVideos = async (query) => {
  // 1차: 검색어로 videoId 목록 가져오기
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${query}&key=${API_KEY}`;
  const searchItems = await fetchYoutubeData(searchUrl);
  const videoIds = searchItems.map(item => item.id.videoId).filter(Boolean).join(',');

  // 2차: videoId로 통계 포함 정보 조회
  const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
  videos = await fetchYoutubeData(detailUrl);

  addTodoElement();
};

// 요소 그리기
const addTodoElement = async () => {
  videoList.innerHTML = "";

  for (const video of videos) {
    const { title, thumbnails, channelTitle, channelId, publishedAt } = video.snippet;

    // 프로필 이미지 가져오기
    const profileImgUrl = await channelProfile(channelId);

    // 조회수
    const viewCount = video.statistics?.viewCount;

    // 썸네일
    const thumbImg = document.createElement("img");
    thumbImg.className = "thumbnail";
    thumbImg.src = thumbnails.medium.url;
    thumbImg.alt = title;

    const videoEl = document.createElement("div");
    videoEl.className = "videoItem";

    const videoInfo = document.createElement("div");
    videoInfo.className = "videoInfo";

    const profileContainer = document.createElement("div");
    profileContainer.className = "profileContainer";

    const profileIcon = document.createElement("img");
    profileIcon.className = "profileIcon";
    profileIcon.src = profileImgUrl;
    profileIcon.alt = channelTitle;

    profileContainer.appendChild(profileIcon);

    const textContainer = document.createElement("div");
    textContainer.className = "textContainer";

    const titleEl = document.createElement("h3");
    titleEl.className = "videoTitle";
    titleEl.textContent = title;

    const channelEl = document.createElement("p");
    channelEl.className = "channelTitle";
    channelEl.textContent = channelTitle;

    const infoEl = document.createElement("p");
    infoEl.className = "metaInfo";

    const date = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    infoEl.textContent = `조회수 ${Number(viewCount).toLocaleString()}회 · ${diffDays}일 전`;

    textContainer.appendChild(titleEl);
    textContainer.appendChild(channelEl);
    textContainer.appendChild(infoEl);

    const dotBtnContainer = document.createElement("div");
    dotBtnContainer.className = "dotBtnContainer";

    const dotBtn = document.createElement("button");
    dotBtn.className = "icon icon-dots";
    dotBtnContainer.appendChild(dotBtn);

    videoInfo.appendChild(profileContainer);
    videoInfo.appendChild(textContainer);
    videoInfo.appendChild(dotBtnContainer);

    videoEl.appendChild(thumbImg);
    videoEl.appendChild(videoInfo);

    videoList.appendChild(videoEl);
  }
};

// 이벤트 설정
const addEventListeners = () => {
  // 사이드바 이벤트
  sidebarBtnEvent();

  // 검색 이벤트
  searchBtnEvent();

  // 햄버거 메뉴 버튼 이벤트
  menuToggleEvent();

  // 상단 필터링 이벤트
  topBtnEvent();
};

// 사이드바 이벤트
const sidebarBtnEvent = () => {
  sideBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const query = btn.innerText.trim();
      searchVideos(query);
    });
  });
};

// 검색 이벤트
const searchBtnEvent = () => {
  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return;
    searchVideos(query);
  });
};

// 햄버거 메뉴 버튼 이벤트
const menuToggleEvent = () => {
  menuToggle.addEventListener("click", () => {
    sidebarBtns.classList.toggle("active");
  });
};

// 상단 필터링 이벤트
const topBtnEvent = () => {
  topBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const query = btn.innerText.trim();
      searchVideos(query);
    });
  });
};

videoBody();
