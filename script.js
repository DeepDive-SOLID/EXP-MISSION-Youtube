const API_KEY = "AIzaSyCyveNIV0JR2ezy8cSu_sbfRDiW0e7xE6s";
const videoList = document.querySelector(".videoContainer");

// 인기 영상 불러오기
async function loadPopularVideos() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=30&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  renderVideoList(data.items);
}

// 카테고리별 영상 검색
async function searchVideosByCategory(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
    query
  )}&regionCode=KR&key=${API_KEY}`;
  const searchData = await fetch(searchUrl).then((res) => res.json());
  const videoIds = searchData.items.map((item) => item.id.videoId).join(",");

  const detailUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
  const detailData = await fetch(detailUrl).then((res) => res.json());
  return detailData.items;
}

// 채널 프로필 이미지 가져오기
async function fetchChannelThumbnail(channelId) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return (
    data.items[0]?.snippet?.thumbnails?.default?.url ||
    "asset/sidebar/youtube_circle.png"
  );
}

// 영상 카드 렌더링
async function renderVideoList(videos) {
  videoList.innerHTML = "";

  for (const video of videos) {
    const { title, channelTitle, publishedAt, thumbnails, channelId } =
      video.snippet;
    const viewCount = video.statistics?.viewCount;
    const profileImgUrl = await fetchChannelThumbnail(channelId);

    const card = document.createElement("div");
    card.className = "videoItem";
    card.innerHTML = `
        <img src="${thumbnails.medium.url}" alt="thumbnail" class="thumbnail" />
        <div class="videoInfo">
          <img src="${profileImgUrl}" class="profileIcon" />
          <div>
            <h3 class="videoTitle">${title}</h3>
            <p class="channelTitle">${channelTitle}</p>
            <p class="metaInfo">조회수 ${Number(
              viewCount
            ).toLocaleString()}회 · ${getRelativeDate(publishedAt)}</p>
          </div>
        </div>
      `;
    videoList.appendChild(card);
  }
}

// 업로드 시간 계산
function getRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

// 카테고리별 영상 검색
function setupCategoryButtons() {
  const buttons = document.querySelectorAll(".nav-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.category;

      if (category === "전체") {
        loadPopularVideos();
      } else {
        const results = await searchVideosByCategory(category);
        renderVideoList(results);
      }
    });
  });
}

// 사이드바 열고 닫기
function Sidebar () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });
};

// 네비게이션바 슬라이드 버튼
function navbtn (){
  const navButtons = document.getElementById("navButtons");
  const navLeft = document.getElementById("navLeft");
  const navRight = document.getElementById("navRight");

  navLeft.addEventListener("click", () => {
    navButtons.scrollBy({ left: -200, behavior: "smooth" });
  });

  navRight.addEventListener("click", () => {
    navButtons.scrollBy({ left: 200, behavior: "smooth" });
  });
};

// 검색 기능
function setupSearchBar() {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query === "") return;

    const results = await searchVideosByCategory(query);
    renderVideoList(results);
  });

  // Enter 키로도 검색 가능
  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query === "") return;

      const results = await searchVideosByCategory(query);
      renderVideoList(results);
    }
  });
}

// 초기화
function setupLogoClick() {
  const logo = document.getElementById("youtubeLogo");
  if (!logo) return;

  logo.addEventListener("click", () => {
    // 카테고리 버튼 active 해제 후 "전체"로 초기화
    const buttons = document.querySelectorAll(".nav-btn");
    buttons.forEach((btn) => btn.classList.remove("active"));
    const allBtn = document.querySelector('[data-category="전체"]');
    if (allBtn) allBtn.classList.add("active");

    // 인기 영상 다시 불러오기
    loadPopularVideos();
  });
}

// 이벤트 리스너
document.addEventListener("DOMContentLoaded", () => {
  Sidebar();
  navbtn();
  loadPopularVideos();
  setupSearchBar();
  setupCategoryButtons();
  setupLogoClick();
});
