const apiKey = "AIzaSyBky3EuLMDKY-KVHJP_-hdX-q9K41RLK78";
const regionCode = "KR";
const maxResults = 20;
let nextPageToken = "";
let isLoading = false;

const container = document.querySelector(".video-grid");

// 채널 썸네일 가져오기
const fetchChannelThumbnail = async (channelId) => {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return (
            data.items[0]?.snippet?.thumbnails?.default?.url ||
            "assets/images/avatars/avatar-1.png"
        );
    } catch {
        return "assets/images/avatars/avatar-1.png";
    }
};

// 인기 영상 로딩
const fetchPopularVideos = async () => {
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
            const { id, snippet, statistics } = video;
            const title = snippet.title;
            const author = snippet.channelTitle;
            const views = Number(statistics.viewCount).toLocaleString();
            const date = new Date(snippet.publishedAt).toLocaleDateString();
            const channelId = snippet.channelId;

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
        console.error("API 요청 오류:", err);
    } finally {
        isLoading = false;
    }
};

// 카테고리 영상
const fetchVideosByCategory = async (categoryId) => {
    isLoading = true;

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=${categoryId}&regionCode=${regionCode}&maxResults=${maxResults}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        nextPageToken = data.nextPageToken;

        data.items.forEach(async (video) => {
            const { id, snippet, statistics } = video;
            const title = snippet.title;
            const author = snippet.channelTitle;
            const views = Number(statistics.viewCount).toLocaleString();
            const date = new Date(snippet.publishedAt).toLocaleDateString();
            const channelId = snippet.channelId;

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
};

// 검색 영상
const searchVideos = async (query) => {
    if (!query) return;
    isLoading = true;
    container.innerHTML = "";
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
};

// 초기 로딩
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

// DOM 로드 시: 홈/로고 클릭 처리 + 사이드바 메뉴 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
    const sidebarHome = document.querySelector("#sidebar-home");
    const youtubeLogo = document.querySelector(".youtube-logo");
    const links = document.querySelectorAll(".sidebar-link");

    const goHome = () => {
        container.innerHTML = "";
        nextPageToken = "";
        fetchPopularVideos();
    };

    if (sidebarHome) sidebarHome.addEventListener("click", goHome);
    if (youtubeLogo) youtubeLogo.addEventListener("click", goHome);

    links.forEach((link) => {
        link.addEventListener("click", () => {
            links.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");

            const category = link.dataset.category;
            container.innerHTML = "";
            nextPageToken = "";

            if (category === "home") {
                fetchPopularVideos();
            } else if (category) {
                fetchVideosByCategory(category);
            }
        });
    });
});

// 검색 이벤트 등록
document.querySelector(".search-button")?.addEventListener("click", () => {
    const query = document.querySelector(".search-bar").value.trim();
    searchVideos(query);
});

document.querySelector(".search-bar")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const query = e.target.value.trim();
        searchVideos(query);
    }
});
