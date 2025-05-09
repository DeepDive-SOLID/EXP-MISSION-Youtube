const apiKey = "AIzaSyBky3EuLMDKY-KVHJP_-hdX-q9K41RLK78";
const regionCode = "KR";
const maxResults = 20;
let nextPageToken = "";
let isLoading = false;

const container = document.querySelector(".video-grid");

async function fetchChannelThumbnail(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return (
            data.items[0]?.snippet?.thumbnails?.default?.url ||
            "assets/images/avatars/avatar-1.png"
        );
    } catch {
        return "assets/images/avatars/avatar-1.png"; // fallback
    }
}

async function fetchPopularVideos() {
    if (isLoading) return;
    isLoading = true;

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${apiKey}${
        nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        nextPageToken = data.nextPageToken;

        data.items.forEach(async (video) => {
            const id = video.id;
            const title = video.snippet.title;
            const author = video.snippet.channelTitle;
            const views = Number(video.statistics.viewCount).toLocaleString();
            const date = new Date(
                video.snippet.publishedAt
            ).toLocaleDateString();
            const channelId = video.snippet.channelId;

            const profileImg = await fetchChannelThumbnail(channelId);

            const videoElement = document.createElement("div");
            videoElement.className = "video-preview";
            videoElement.innerHTML = `
                <div class="thumbnail-row" data-id="${id}">
                    <img class="thumbnail-img" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="100%" height="200">
                </div>
                <div class="video-info-grid">
                    <div class="channel-picture">
                        <img class="profile-picture" src="${profileImg}">
                    </div>
                    <div class="video-info">
                        <p class="video-title">${title}</p>
                        <p class="video-author">${author}</p>
                        <p class="video-stats">${views} views · ${date}</p>
                    </div>
                </div>
            `;

            container.appendChild(videoElement);

            videoElement
                .querySelector(".thumbnail-row")
                .addEventListener("click", function () {
                    this.innerHTML = `
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>
                `;
                });
        });
    } catch (error) {
        console.error("API 요청 오류:", error);
    } finally {
        isLoading = false;
    }
}

fetchPopularVideos();

// 무한 스크롤 감지
window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    if (scrollTop + windowHeight >= fullHeight - 300) {
        fetchPopularVideos();
    }
});

// 검색 이벤트 리스너 및 함수
const searchButton = document.querySelector(".search-button");
const searchInput = document.querySelector(".search-bar");

searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    searchVideos(query);
});

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const query = searchInput.value.trim();
        searchVideos(query);
    }
});

async function searchVideos(query) {
    if (!query) return;
    isLoading = true;
    container.innerHTML = ""; // 기존 목록 초기화
    nextPageToken = "";

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
        query
    )}&regionCode=${regionCode}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        for (const item of data.items) {
            const videoId = item.id.videoId;
            const title = item.snippet.title;
            const author = item.snippet.channelTitle;
            const date = new Date(
                item.snippet.publishedAt
            ).toLocaleDateString();

            const videoElement = document.createElement("div");
            videoElement.className = "video-preview";
            videoElement.innerHTML = `
                <div class="thumbnail-row" data-id="${videoId}">
                    <img class="thumbnail-img" src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg">
                </div>
                <div class="video-info-grid">
                    <div class="channel-picture">
                        <img class="profile-picture" src="assets/images/avatars/avatar-1.png">
                    </div>
                    <div class="video-info">
                        <p class="video-title">${title}</p>
                        <p class="video-author">${author}</p>
                        <p class="video-stats">${date}</p>
                    </div>
                </div>
            `;
            container.appendChild(videoElement);

            videoElement
                .querySelector(".thumbnail-row")
                .addEventListener("click", function () {
                    this.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
                `;
                });
        }
    } catch (err) {
        console.error("검색 실패:", err);
    } finally {
        isLoading = false;
    }
}

// 유튜브 로고 또는 홈 클릭 시
document.addEventListener("DOMContentLoaded", () => {
    const sidebarHome = document.querySelector("#sidebar-home");
    const youtubeLogo = document.querySelector(".youtube-logo");

    const goHome = () => {
        container.innerHTML = "";
        nextPageToken = "";
        fetchPopularVideos();
    };

    if (sidebarHome) {
        sidebarHome.addEventListener("click", goHome);
    }

    if (youtubeLogo) {
        youtubeLogo.addEventListener("click", goHome);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar-link");

    links.forEach((link) => {
        link.addEventListener("click", () => {
            // 모든 링크에서 active 제거
            links.forEach((l) => l.classList.remove("active"));

            // 현재 클릭된 링크에 active 추가
            link.classList.add("active");

            // 카테고리 로딩 처리
            const category = link.dataset.category;
            container.innerHTML = "";
            nextPageToken = "";

            if (category === "home") {
                fetchPopularVideos();
            } else {
                fetchVideosByCategory(category);
            }
        });
    });
});

async function fetchVideosByCategory(categoryId) {
    isLoading = true;

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=${categoryId}&regionCode=${regionCode}&maxResults=${maxResults}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        nextPageToken = data.nextPageToken;

        data.items.forEach(async (video) => {
            const id = video.id;
            const title = video.snippet.title;
            const author = video.snippet.channelTitle;
            const views = Number(video.statistics.viewCount).toLocaleString();
            const date = new Date(
                video.snippet.publishedAt
            ).toLocaleDateString();
            const channelId = video.snippet.channelId;

            const profileImg = await fetchChannelThumbnail(channelId);

            const videoElement = document.createElement("div");
            videoElement.className = "video-preview";
            videoElement.innerHTML = `
                <div class="thumbnail-row" data-id="${id}">
                    <img class="thumbnail-img" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="100%" height="200">
                </div>
                <div class="video-info-grid">
                    <div class="channel-picture">
                        <img class="profile-picture" src="${profileImg}">
                    </div>
                    <div class="video-info">
                        <p class="video-title">${title}</p>
                        <p class="video-author">${author}</p>
                        <p class="video-stats">${views} views · ${date}</p>
                    </div>
                </div>
            `;

            container.appendChild(videoElement);

            videoElement
                .querySelector(".thumbnail-row")
                .addEventListener("click", function () {
                    this.innerHTML = `
                    <iframe width="100%" height="200" src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>
                `;
                });
        });
    } catch (err) {
        console.error("카테고리 영상 로딩 오류:", err);
    } finally {
        isLoading = false;
    }
}
