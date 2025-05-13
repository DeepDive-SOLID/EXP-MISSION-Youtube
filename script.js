const API_KEY = "AIzaSyDROEfnqTXxcMRjTZuaal_tfR7qU5Rq5xw";

const videoList = document.querySelector(".videoContainer");

// 인기 영상 불러오기
async function loadPopularVideos() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&maxResults=12&key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const videos = data.items;

  renderVideoList(videos);
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
  videoList.innerHTML = ""; // 초기화

  for (const video of videos) {
    const { title, channelTitle, publishedAt, thumbnails, channelId } =
      video.snippet;
    const viewCount = video.statistics?.viewCount;

    const profileImgUrl = await fetchChannelThumbnail(channelId); // 🔥 프로필 이미지 요청

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

// 사이드바 열고 닫기
const Sidebar = () => {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
  });
};

// 네비게이션바 슬라이드 버튼
const navbtn = () => {
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

// 이벤트 리스너
document.addEventListener("DOMContentLoaded", () => {
  Sidebar();
  navbtn();
  loadPopularVideos();
});
