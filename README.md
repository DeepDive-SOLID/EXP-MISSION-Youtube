# EXP-MISSION-Youtube

# 기능 요약
- 유튜브 로고 또는 홈 클릭 시 인기 영상 불러옴
- 스크롤 하면 영상 20개씩 로드
![스크린샷 2025-05-09 171547](https://github.com/user-attachments/assets/bd494b3a-6091-4b2b-8fc6-8d8cca05595a)
- 사이드바 각 카테고리별 영상 불러옴
![스크린샷 2025-05-09 171624](https://github.com/user-attachments/assets/c3446f84-a7c3-4f6c-a38e-27c98e670cf5)
- 검색 기능 (엔터로 검색 가능)
![스크린샷 2025-05-09 171606](https://github.com/user-attachments/assets/62627b35-b5ff-49b5-a9f9-f1ca51b92fcd)
- 반응형
![스크린샷 2025-05-09 172017](https://github.com/user-attachments/assets/c86e11ea-e473-4ecc-b0b9-1c824cd38856)

# 채널 프로필 이미지 가져오기
- fetchChannelThumbnail(channelId)
  - 주어진 channelId로 해당 채널의 썸네일 이미지 URL을 반환
  - 실패 시 기본 이미지로 fallback

# 인기 영상 목록 불러오기
- fetchPopularVideos()
  - 인기 영상(chart=mostPopular)을 가져와 .video-grid에 렌더링
  - 각 영상 썸네일은 클릭 시 iframe으로 변경
  - 채널 프로필 이미지도 함께 표시
 
# 검색 기능 구현
- searchVideos(query)
  - 사용자가 검색한 키워드를 기반으로 YouTube 영상 검색
  - videoId를 이용해 렌더링

# 카테고리별 영상 불러오기
- fetchVideosByCategory(categoryId)
  - videoCategoryId 값을 통해 해당 카테고리의 인기 영상 불러오기
  - data-category 속성에 따라 사이드바 메뉴 클릭 시 호출됨

# 무한 스크롤 처리
`window.addEventListener("scroll", ...)`
  - 사용자가 스크롤 하단 300px 근처까지 도달하면 fetchPopularVideos() 호출
  - nextPageToken을 활용하여 다음 페이지 영상 로드

# 검색 이벤트 연결
`searchButton.addEventListener("click", ...)
searchInput.addEventListener("keydown", ...)`
  - 검색 버튼 클릭 또는 Enter 키 입력 시 searchVideos() 호출

# 무한 스크롤 처리
`window.addEventListener("scroll", ...)`
  - 사용자가 스크롤 하단 300px 근처까지 도달하면 fetchPopularVideos() 호출
  - nextPageToken을 활용하여 다음 페이지
 영상 로드

# 유튜브 로고 및 홈 버튼 클릭 처리

`

    document.addEventListener("DOMContentLoaded", () => {
        const sidebarHome = ...

        const youtubeLogo = ...
        
        const goHome = () => {
            container.innerHTML = "";
            nextPageToken = "";
            fetchPopularVideos();
        };
        
        sidebarHome.addEventListener("click", goHome);
        youtubeLogo.addEventListener("click", goHome);
    });
`
  - YouTube 로고 또는 "Home" 버튼 클릭 시 인기 영상 목록으로 초기화

# 사이드바 메뉴 클릭 처리 및 active 스타일 적용
`

      document.addEventListener("DOMContentLoaded", () => {
          const links = document.querySelectorAll(".sidebar-link");
          
          links.forEach((link) => {
              link.addEventListener("click", () => ...
`
  - .sidebar-link 요소 클릭 시:
    - .active 클래스 관리 (스타일 강조)
    - data-category="home"이면 인기 영상
    - 나머지는 카테고리 ID를 기준으로 필터링

