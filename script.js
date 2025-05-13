const API_KEY = "AIzaSyDROEfnqTXxcMRjTZuaal_tfR7qU5Rq5xw";

const videoList = document.querySelector(".Content");

const loadPopularVideos = async () => {
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=KR&maxResults=12&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("🔥 인기 영상 목록:", data.items);
  } catch (error) {
    console.error("Error fetching popular videos:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadPopularVideos();
});

// 사이드바 열고 닫기
const Sidebar = () => {
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
  
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
    });
  };  

document.addEventListener("DOMContentLoaded", () => {
  Sidebar();


});

