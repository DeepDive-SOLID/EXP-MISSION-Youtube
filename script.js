const API_KEY = "AIzaSyB6bBEgqhrS_OexJv53P7x3rQTrmdVVHsI";

const videoGrid = document.querySelector(".video-grid");
const searchBtn = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-bar");
const categoryBtn = document.querySelectorAll(".category-button");

let data = [];

const fetchYoutubeData = async () => {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=kr&maxResults=30&key=${API_KEY}`);
    const resData = await res.json();
    data = resData.items;

    videoElement();
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
  }
};

const fetchYouTubeChannel = async (id) => {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&key=${API_KEY}`);
    const resData = await res.json();
    return resData.items[0]?.snippet?.thumbnails?.default?.url || "";
  } catch (e) {
    console.log(e);
  }
};

const fetchSearch = async (query) => {
  const searchUrl = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${query}&key=${API_KEY}`);
  const searchItems = await searchUrl.json();
  console.log(searchItems);
  const videoIds = searchItems.items
    .map((item) => item.id.videoId)
    .filter(Boolean)
    .join(",");

  const detailUrl = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`);
  const res = await detailUrl.json();
  data = res.items;

  videoGrid.innerHTML = "";
  videoElement();
};

const fetchCategory = async (categoryId) => {
  const category = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=KR&videoCategoryId=${categoryId}&maxResults=12&key=${API_KEY}`);
  console.log(category);
  const res = await category.json();
  data = res.items;

  videoGrid.innerHTML = "";
  videoElement();
};

const videoElement = async () => {
  for (const items of data) {
    const viewCount = items.statistics.viewCount;
    const profileImgUrl = await fetchYouTubeChannel(items?.snippet?.channelId);

    const videoContainer = document.createElement("div");
    videoContainer.classList.add("video-preview");

    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail-row");

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.src = items.snippet.thumbnails.medium.url;

    const thumbnailTimeDiv = document.createElement("div");
    thumbnailTimeDiv.classList.add("video-time");

    const videoInfoContainer = document.createElement("div");
    videoInfoContainer.classList.add("video-info-grid");

    const channelDiv = document.createElement("div");
    channelDiv.classList.add("channel-picture");

    const profileImg = document.createElement("img");
    profileImg.classList.add("profile-picture");
    profileImg.src = profileImgUrl;

    const videoInfoDiv = document.createElement("div");
    videoInfoDiv.classList.add("video-info");

    const videoTitleP = document.createElement("p");
    videoTitleP.classList.add("video-title");
    let title = items.snippet.title.length >= 35 ? items.snippet.title.slice(0, 34) + "..." : items.snippet.title;
    videoTitleP.innerText = title;

    const videoAuthorP = document.createElement("p");
    videoAuthorP.classList.add("video-author");
    videoAuthorP.innerText = items.snippet.channelTitle;

    const videoStatsP = document.createElement("p");
    videoStatsP.classList.add("video-stats");

    const date = new Date(items.snippet.publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    videoStatsP.innerText = `조회수 ${Number(viewCount).toLocaleString()}회 · ${diffDays}일 전`;

    videoInfoDiv.append(videoTitleP, videoAuthorP, videoStatsP);
    channelDiv.append(profileImg);

    videoInfoContainer.append(channelDiv, videoInfoDiv);

    thumbnailDiv.append(thumbnail, thumbnailTimeDiv);

    videoContainer.append(thumbnailDiv, videoInfoContainer);

    videoGrid.appendChild(videoContainer);
  }
};

const addSearchBtn = () => {
  searchBtn.addEventListener("click", async () => {
    console.log(1);
    const query = searchInput.value.trim();
    if (!query) return;
    fetchSearch(query);
  });
};

categoryBtn.forEach((items) => {
  items.addEventListener("click", () => {
    categoryBtn.forEach((b) => b.classList.remove("choice"));
    items.classList.add("choice");

    const category = items.dataset;
    if (category == "0") {
      fetchYoutubeData();
    } else {
      fetchCategory(category.set);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchYoutubeData();

  addSearchBtn();
});
