# EXP-MISSION-Youtube

# 미션
1. HTML과 CSS를 활용해 동영상 목록 구성
2. JavaScript를 이용해 검색 및 필터링 기능 구현
3. 반응형 웹 적용


# 결과물  
### 큰화면
![image](https://github.com/user-attachments/assets/9d4ef1af-9245-469c-b03c-841a6031947d)  

### 작은 화면 (사이드바 열린 모습 -> 사이드바 닫힌 모습)
![image](https://github.com/user-attachments/assets/b8120378-1606-4d49-8a72-937f900160c8)
![image](https://github.com/user-attachments/assets/8c3250d3-9672-4436-ad61-57232c0b39d9)


# script.js
1. videoBody() : 비디오 리스트 만들기
2. loadYoutubeAPI() : youtube API 로드(처음 페이지 로딩 시 인기 영상 로드)
3. addTodoElement() : 요소 그리기
   - getChannelThumbnail() : 채널 프로필 이미지 가져오는 함수
4. addEventListeners() : 이벤트 설정 
   - sidebarBtnEvent : 사이드바 이벤트
   - searchBtnEvent : 검색 이벤트
   - menuToggleEvent : 햄버거 메뉴 버튼 이벤트
   - topBtnEvent : 필터링 이벤트
5. searchVideos() : 검색 결과 로드
   - 기존에 카테고리 리스트를 가져오는 API중 없는 카테고리도 있어서 검색 이벤트를 통해서 모든 이벤트 처리 진행
   - 검색 API는 statistics(통계:조회수)를 제공하지 않기 때문에 2단계 절차 필요
     - 검색 : search.list로 videoId 얻기
     - 상세조회 : videos.list로 videoId의 정보를 얻기
6. fetchYoutubeData() : 공통 API 호출 함수
