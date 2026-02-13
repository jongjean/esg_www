/**
 * 공통 헤더 로드 스크립트
 * 모든 페이지에서 동일한 헤더를 사용하도록 함
 */

(function() {
    // 현재 페이지 경로 확인
    const currentPath = window.location.pathname;
    
    // 루트 경로 계산 (페이지 깊이에 따라)
    let rootPath = '';
    if (currentPath.includes('/pages/')) {
        const depth = (currentPath.match(/\//g) || []).length - 1;
        rootPath = '../'.repeat(depth - 1);
    }
    
    // 헤더 로드
    fetch(rootPath + 'includes/header.html')
        .then(response => response.text())
        .then(html => {
            // 헤더를 body 시작 부분에 삽입
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // 경로 수정 (절대 경로를 상대 경로로)
            if (rootPath) {
                const header = document.querySelector('.header');
                
                // 로고 링크 수정
                const logoLink = header.querySelector('#logoLink');
                if (logoLink) logoLink.href = rootPath + 'index.html';
                
                // 로고 이미지 수정
                const logoImg = header.querySelector('.logo-img');
                if (logoImg) logoImg.src = rootPath + 'images/logo.png';
                
                // 모든 메뉴 링크 수정
                const menuLinks = header.querySelectorAll('a[href^="/"]');
                menuLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.setAttribute('href', rootPath + href.substring(1));
                });
            }
            
            // 헤더 로드 완료 이벤트 발생
            document.dispatchEvent(new Event('headerLoaded'));
            
            // 기존 메뉴 스크립트 초기화
            initializeMenu();
        })
        .catch(error => {
            console.error('헤더 로드 실패:', error);
        });
    
    /**
     * 메뉴 초기화
     */
    function initializeMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const menuOverlay = document.querySelector('#menuOverlay');
        
        if (mobileMenuBtn && navMenu && menuOverlay) {
            // 모바일 메뉴 토글
            mobileMenuBtn.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // 오버레이 클릭시 메뉴 닫기
            menuOverlay.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }
        
        // 로그아웃 버튼 이벤트
        const logoutBtn = document.querySelector('#logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // 로그아웃 처리
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userInfo');
                alert('로그아웃되었습니다.');
                window.location.href = rootPath + 'index.html';
            });
        }
        
        // 로그인 상태 확인 및 메뉴 표시/숨김
        updateAuthMenu();
    }
    
    /**
     * 로그인 상태에 따라 메뉴 표시/숨김
     */
    function updateAuthMenu() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const loggedOutItems = document.querySelectorAll('.auth-only.logged-out');
        const loggedInItems = document.querySelectorAll('.auth-only.logged-in');
        
        if (isLoggedIn) {
            loggedOutItems.forEach(item => item.style.display = 'none');
            loggedInItems.forEach(item => item.style.display = 'block');
        } else {
            loggedOutItems.forEach(item => item.style.display = 'block');
            loggedInItems.forEach(item => item.style.display = 'none');
        }
    }
})();
