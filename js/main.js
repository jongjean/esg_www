// ==========================================
// 🔥 버전 확인: FINAL20250119
// ==========================================
console.log('🚀 main.js 로드 - 버전: FINAL20250119');
console.log('⏰ 로드 시간:', new Date().toISOString());

// 🔥 즉시 localStorage 확인
const heroSlidesCheck = localStorage.getItem('esg_hero_slides');
if (heroSlidesCheck) {
    console.log('✅ 포스팅툴 데이터 감지:', JSON.parse(heroSlidesCheck).length + '개');
} else {
    console.log('⚠️ 포스팅툴 데이터 없음');
}

// ==========================================
// Global Navigation Builder
// ==========================================
function getNavBasePath() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/pages/')) {
        const afterPages = path.split('/pages/')[1] || '';
        const segments = afterPages.split('/').filter(Boolean);
        return '../'.repeat(segments.length);
    }
    return '';
}

function getHomeLinkPath() {
    return getNavBasePath() + 'index.html';
}

const NAVIGATION_ITEMS = [
    {
        label: '학회소개',
        icon: 'fas fa-building',
        href: 'pages/about/greeting.html',
        matches: ['/pages/about/'],
        children: [
            { label: '학회장 인사말', href: 'pages/about/greeting-new.html' },
            { label: '설립 목적·비전', href: 'pages/about/purpose.html' },
            { label: '연혁', href: 'pages/about/history.html' },
            { label: '정관·규정', href: 'pages/about/constitution.html' },
            { label: 'CI·BI', href: 'pages/about/ci.html' },
            { label: '오시는 길', href: 'pages/about/location.html' },
            { label: '웹 둘러보기', href: 'pages/sitemap.html' }
        ]
    },
    {
        label: '학회조직',
        icon: 'fas fa-users',
        href: 'pages/organization/executives.html',
        matches: ['/pages/organization/'],
        children: [
            { label: '임원진', href: 'pages/organization/executives.html' },
            { label: '위원회', href: 'pages/organization/committees.html' },
            { label: '분과학회·연구회', href: 'pages/organization/divisions.html' }
        ]
    },
    {
        label: '회원안내',
        icon: 'fas fa-user-check',
        href: 'pages/member/types-new.html',
        matches: ['/pages/member/'],
        children: [
            { label: '회원 구분', href: 'pages/member/types-new.html' },
            { label: '가입 절차', href: 'pages/member/process.html' },
            { label: '회비 안내', href: 'pages/member/fee.html' },
            { label: '회원 혜택', href: 'pages/member/benefits.html' },
            { label: '회원사 소개', href: 'pages/member/companies.html' }
        ]
    },
    {
        label: '핵심사업',
        icon: 'fas fa-star',
        href: 'pages/core/forum-new.html',
        matches: ['/pages/core/'],
        children: [
            { label: 'ESG 주요사업', href: 'pages/core/main-services.html' },
            { label: '월드ESG포럼', href: 'pages/core/forum-new.html' },
            { label: '한국ESG대상', href: 'pages/core/award.html' },
            { label: '한국ESG조례대상', href: 'pages/core/ordinance.html' },
            { label: '월요학술세미나', href: 'pages/core/seminar.html' }
        ]
    },
    {
        label: '학술지·논문',
        icon: 'fas fa-book',
        href: 'pages/journal/about.html',
        matches: ['/pages/journal/'],
        children: [
            { label: '학술지 소개', href: 'pages/journal/about.html' },
            { label: '논문 투고 안내', href: 'pages/journal/submission.html' },
            { label: '편집위원회', href: 'pages/journal/editorial.html' },
            { label: '심사 규정', href: 'pages/journal/review.html' },
            { label: '논문 아카이브', href: 'pages/journal/archive.html' },
            { label: 'DBPIA 논문 검색', href: 'pages/journal/dbpia-embed.html' }
        ]
    },

    {
        label: 'ESG정책·연구',
        icon: 'fas fa-chart-line',
        href: 'pages/policy/research.html',
        matches: ['/pages/policy/'],
        children: [
            { label: 'ESG 정책 연구', href: 'pages/policy/research.html' },
            { label: 'ESG 지표·표준', href: 'pages/policy/standards.html' },
            { label: '법·제도 분석', href: 'pages/policy/law.html' },
            { label: '국제 ESG 동향', href: 'pages/policy/global.html' },
            { label: '연구보고서', href: 'pages/policy/reports.html' }
        ]
    },
    {
        label: 'ESG뉴스',
        icon: 'fas fa-newspaper',
        href: 'pages/news/main.html',
        matches: ['/pages/news/'],
        children: [
            { label: 'ESG 주요 뉴스', href: 'pages/news/main.html' },
            { label: '정책·입법 동향', href: 'pages/news/policy.html' },
            { label: '기업 ESG 사례', href: 'pages/news/cases.html' },
            { label: '학회 보도자료', href: 'pages/news/press.html' },
            { label: '기고·칼럼', href: 'pages/news/column.html' },
            { label: '영상 콘텐츠', href: 'pages/news/video.html' },
            { label: '코리아ESG뉴스', href: 'pages/news/esg-news-embed.html' }
        ]
    },
    {
        label: '커뮤니티',
        icon: 'fas fa-comments',
        href: 'pages/community/notice.html',
        matches: ['/pages/community/'],
        children: [
            { label: '공지사항', href: 'pages/community/notice.html' },
            { label: '자유게시판', href: 'pages/community/free-board.html' },
            { label: '학술·정책 토론', href: 'pages/community/discussion.html' },
            { label: '회원 소식', href: 'pages/community/member-news.html' },
            { label: 'Q&A', href: 'pages/community/qna.html' }
        ]
    },
    {
        label: '자료실',
        icon: 'fas fa-folder-open',
        href: 'pages/materials/academic.html',
        matches: ['/pages/materials/'],
        children: [
            { label: '학술자료', href: 'pages/materials/academic.html' },
            { label: '정책자료', href: 'pages/materials/policy.html' },
            { label: '발표자료', href: 'pages/materials/presentation.html' },
            { label: 'ESG 리포트', href: 'pages/materials/report.html' },
            { label: '영상자료', href: 'pages/materials/video.html' }
        ]
    },
    {
        label: '후원·기부',
        icon: 'fas fa-hand-holding-heart',
        href: 'pages/support/guide.html',
        matches: ['/pages/support/'],
        children: [
            { label: '후원 안내', href: 'pages/support/guide.html' },
            { label: '기업 후원', href: 'pages/support/corporate.html' },
            { label: '개인 기부', href: 'pages/support/personal.html' },
            { label: '기부금 사용 내역', href: 'pages/support/usage.html' }
        ]
    },
    {
        label: '마이페이지',
        icon: 'fas fa-user-circle',
        href: 'pages/mypage/profile.html',
        matches: ['/pages/mypage/', '/pages/auth/'],
        children: [
            { label: '회원가입', href: 'pages/auth/signup.html', icon: 'fas fa-user-plus' },
            { label: '로그인', href: 'pages/auth/login.html', icon: 'fas fa-sign-in-alt' },
            { label: '회원정보 관리', href: 'pages/mypage/profile.html' },
            { label: '회비 납부', href: 'pages/mypage/payment.html' },
            { label: '납부 내역', href: 'pages/mypage/history.html' },
            { label: '논문 투고 현황', href: 'pages/mypage/paper.html' },
            { label: '행사·세미나 신청', href: 'pages/mypage/event.html' },
            { label: '회원증·증명서', href: 'pages/mypage/certificate.html' }
        ]
    }
];

function updateGlobalFooter() {
    const footers = document.querySelectorAll('.footer');
    if (!footers.length) {
        return;
    }

    const basePath = getNavBasePath();
    const homeHref = getHomeLinkPath();

    footers.forEach(footer => {
        footer.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <a href="${homeHref}" class="logo-home-link">
                            <img src="${basePath}images/logo.png" alt="한국ESG학회" class="footer-logo-img">
                        </a>
                        <p class="footer-tagline">지속가능한 미래를 위한 ESG 연구와 실천</p>
                    </div>
                    <div class="footer-info">
                        <h4>사단법인 한국ESG학회</h4>
                        <ul class="footer-info-list">
                            <li><strong>회장:</strong> 고문현</li>
                            <li><strong>Tel.</strong> 010-4263-7715</li>
                            <li><strong>주소:</strong> [06978] 서울특별시 동작구 상도로 369, 숭실대학교 진리관 508호</li>
                            <li><strong>개인정보관리책임자:</strong> 고문현 (kohmh@ssu.ac.kr)</li>
                            <li><strong>홈페이지관리책임자:</strong> 강종진 (mail@iuci.kr)</li>
                        </ul>
                    </div>
                    <div class="footer-links">
                        <h4>바로가기</h4>
                        <ul class="footer-links-list">
                            <li><a href="${basePath}pages/sitemap.html">사이트맵</a></li>
                            <li><a href="${basePath}pages/about/greeting-new.html">학회소개</a></li>
                            <li><a href="${basePath}pages/member/process.html">회원가입</a></li>
                            <li><a href="${basePath}pages/community/notice.html">공지사항</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2025 Korean ESG Association. All Rights Reserved.</p>
                    <p class="footer-credit">Design by Korean ESG Association</p>
                </div>
            </div>
        `;
    });
}

function ensureLogoLinks() {
    const homeHref = getHomeLinkPath();
    const logoImages = document.querySelectorAll('img[src$="logo.png"]');

    logoImages.forEach(img => {
        const parentLink = img.closest('a');

        if (parentLink) {
            parentLink.href = homeHref;
            parentLink.classList.add('logo-home-link');
            return;
        }

        const wrapper = document.createElement('a');
        wrapper.href = homeHref;
        wrapper.classList.add('logo-home-link');
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
    });
}

function ensureMenuOverlayElement() {
    let overlay = document.getElementById('menuOverlay');
    if (overlay) {
        return overlay;
    }

    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.id = 'menuOverlay';

    const header = document.querySelector('.header');
    if (header) {
        header.insertAdjacentElement('afterend', overlay);
    } else {
        document.body.insertBefore(overlay, document.body.firstChild);
    }

    return overlay;
}

function ensureUserStatusBar() {
    const basePath = getNavBasePath();
    const header = document.querySelector('.header');
    const overlay = ensureMenuOverlayElement();

    let statusBar = document.querySelector('.user-status-fixed');
    const statusTemplate = `
        <div class="user-status-logged-out">
            <a href="${basePath}pages/sitemap.html" class="status-link status-link-sitemap">사이트맵</a>
            <span class="status-divider">|</span>
            <a href="${basePath}pages/member/process.html" class="status-link status-link-signup">회원가입</a>
            <span class="status-divider">|</span>
            <a href="${basePath}pages/mypage/profile.html" class="status-link status-link-login">로그인</a>
        </div>
        <div class="user-status-logged-in" style="display: none;">
            <span class="user-info">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">홍길동</span>님
            </span>
            <span class="status-divider">|</span>
            <a href="${basePath}pages/mypage/profile.html" class="status-btn status-btn-mypage">마이페이지</a>
            <span class="status-divider">|</span>
            <button class="status-btn logout-btn" type="button">로그아웃</button>
        </div>
    `.trim();

    if (!statusBar) {
        statusBar = document.createElement('div');
        statusBar.className = 'user-status-fixed';
        statusBar.innerHTML = statusTemplate;

        if (overlay && overlay.parentNode) {
            overlay.insertAdjacentElement('afterend', statusBar);
        } else if (header) {
            header.insertAdjacentElement('afterend', statusBar);
        } else {
            document.body.insertBefore(statusBar, document.body.firstChild);
        }
    } else {
        statusBar.innerHTML = statusTemplate;

        if (overlay && statusBar.previousElementSibling !== overlay) {
            overlay.insertAdjacentElement('afterend', statusBar);
        } else if (!overlay && header && statusBar.previousElementSibling !== header) {
            header.insertAdjacentElement('afterend', statusBar);
        }
    }

    return statusBar;
}

function buildNavigationMenu(navMenu) {
    if (!navMenu) return;

    const basePath = getNavBasePath();
    const currentPath = window.location.pathname.replace(/\\/g, '/');

    navMenu.innerHTML = '';

    NAVIGATION_ITEMS.forEach(item => {
        const navItem = document.createElement('li');
        navItem.classList.add('nav-item');

        const hasChildren = Array.isArray(item.children) && item.children.length > 0;
        if (hasChildren) {
            navItem.classList.add('has-dropdown');
        }

        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = basePath + item.href;
        
        // 아이콘 추가
        if (item.icon) {
            const icon = document.createElement('i');
            icon.className = item.icon;
            link.appendChild(icon);
            link.appendChild(document.createTextNode(' ' + item.label));
        } else {
            link.textContent = item.label;
        }
        
        navItem.appendChild(link);

        let matchFound = false;

        if (hasChildren) {
            const dropdown = document.createElement('ul');
            dropdown.className = 'dropdown-menu';

            item.children.forEach(child => {
                const childItem = document.createElement('li');
                const childLink = document.createElement('a');
                childLink.href = basePath + child.href;
                
                // 아이콘이 있으면 추가
                if (child.icon) {
                    const icon = document.createElement('i');
                    icon.className = child.icon;
                    childLink.appendChild(icon);
                    childLink.appendChild(document.createTextNode(' ' + child.label));
                } else {
                    childLink.textContent = child.label;
                }

                if (currentPath.includes(child.href.replace('pages/', '/pages/'))) {
                    childLink.classList.add('active');
                    matchFound = true;
                }

                childItem.appendChild(childLink);
                dropdown.appendChild(childItem);
            });

            navItem.appendChild(dropdown);
        }

        if (!matchFound) {
            const normalizedHref = item.href ? item.href.replace('pages/', '/pages/') : '';
            if (normalizedHref && currentPath.includes(normalizedHref)) {
                matchFound = true;
            } else if (Array.isArray(item.matches) && item.matches.some(match => currentPath.includes(match))) {
                matchFound = true;
            } else if (currentPath === '/' && item.href === 'index.html') {
                matchFound = true;
            }
        }

        if (matchFound) {
            navItem.classList.add('active');
            link.classList.add('active');
        }

        navMenu.appendChild(navItem);
    });
}

// ==========================================
// Mobile Menu Toggle
// ==========================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = ensureMenuOverlayElement();

let dropdowns = [];

if (navMenu) {
    buildNavigationMenu(navMenu);
    dropdowns = document.querySelectorAll('.nav-item.has-dropdown');
}

document.addEventListener('DOMContentLoaded', () => {
    updateGlobalFooter();
    ensureLogoLinks();
    ensureUserStatusBar();
});

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        if (menuOverlay) {
            menuOverlay.classList.toggle('active');
        }
    });
}

// 오버레이 클릭 시 메뉴 닫기
if (menuOverlay && navMenu) {
    menuOverlay.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
}

// 햄버거 메뉴 헤더(메뉴) 클릭 시 메뉴 닫고 홈으로 이동
if (navMenu) {
    navMenu.addEventListener('click', (e) => {
        // nav-menu 자체를 클릭했고, 상단 영역(::before 헤더 부분)을 클릭한 경우
        if (window.innerWidth <= 1020 && 
            e.target === navMenu && 
            e.offsetY <= 35) { // 헤더 높이 내부
            
            e.preventDefault();
            e.stopPropagation();
            
            // 메뉴 닫기
            navMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            
            // 현재 페이지 경로에 따라 홈 경로 계산
            const currentPath = window.location.pathname;
            let homePath = 'index.html';
            
            // pages 폴더 내부인 경우
            if (currentPath.includes('/pages/')) {
                const depth = currentPath.split('/pages/')[1].split('/').length - 1;
                homePath = '../'.repeat(depth + 1) + 'index.html';
            }
            
            // 홈으로 이동
            setTimeout(() => {
                window.location.href = homePath;
            }, 200);
        }
    });
}

// Dropdown Menu Handling
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    
    if (!link || !dropdownMenu) {
        return;
    }

    // Mobile: click to toggle
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1020) {
            e.preventDefault();
            
            // 다른 모든 드롭다운 닫기
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // 현재 드롭다운 토글
            dropdown.classList.toggle('active');
        }
    });

    // Desktop: CSS handles hover, but we ensure visibility
    // No need for explicit JS handling on desktop - CSS :hover is more reliable
});

// 스와이프로 메뉴 닫기 (터치 디바이스)
let touchStartX = 0;
let touchEndX = 0;

if (navMenu) {
    navMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    navMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        // 왼쪽으로 스와이프 (50px 이상)
        if (touchStartX - touchEndX > 50) {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
        }
    }
}

// ==========================================
// Hero Slider - 동적 렌더링 (포스팅툴 연동)
// ==========================================

// 슬라이드 동적 생성
/**
 * 히어로 슬라이드 로드 (slide-utils.js 사용)
 */
function loadHeroSlides() {
    const sliderContainer = document.querySelector('.slider-container');
    
    console.log('🚀 main.js - loadHeroSlides 시작');
    
    if (!sliderContainer) {
        console.error('❌ .slider-container를 찾을 수 없습니다!');
        return;
    }
    
    try {
        // SlideStorage에서 읽기
        let slides = SlideStorage.getAll();
        
        // 1~3번 슬라이드가 없으면 기본 데이터 추가
        const slide1Exists = slides.find(s => s.id === 'slide_001');
        const slide2Exists = slides.find(s => s.id === 'slide_002');
        const slide3Exists = slides.find(s => s.id === 'slide_003');
        
        if (!slide1Exists) {
            slides.push(new SlideData({
                id: 'slide_001',
                order: 1,
                image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&h=1080&fit=crop',
                title: '한국ESG학회',
                description: '환경(Environment), 사회(Social), 거버넌스(Governance)를 선도하는 학회',
                buttonText: '자세히 보기',
                buttonLink: 'pages/about/greeting-new.html'
            }));
        }
        
        if (!slide2Exists) {
            slides.push(new SlideData({
                id: 'slide_002',
                order: 2,
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=1080&fit=crop',
                title: '지속가능한 미래를 위한 연구',
                description: 'ESG 경영의 학문적 기반을 다지고 실천적 변화를 이끕니다',
                buttonText: '연구 보기',
                buttonLink: 'pages/research/studies.html'
            }));
        }
        
        if (!slide3Exists) {
            slides.push(new SlideData({
                id: 'slide_003',
                order: 3,
                image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop',
                title: '학술 활동 및 교류',
                description: 'ESG 전문가와 학자들의 활발한 학술 교류의 장',
                buttonText: '학술대회 보기',
                buttonLink: 'pages/conference/schedule.html'
            }));
        }
        
        // 4~5번 슬라이드가 없으면 추가
        const slide4Exists = slides.find(s => s.id === 'slide_004');
        const slide5Exists = slides.find(s => s.id === 'slide_005');
        
        if (!slide4Exists) {
            slides.push(new SlideData({
                id: 'slide_004',
                order: 4,
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop',
                title: '회원 혜택',
                description: '학회 회원님들께 제공되는 다양한 혜택과 지원 프로그램',
                buttonText: '혜택 보기',
                buttonLink: 'pages/members/benefits.html'
            }));
        }
        
        if (!slide5Exists) {
            slides.push(new SlideData({
                id: 'slide_005',
                order: 5,
                image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=1080&fit=crop',
                title: '함께하는 ESG',
                description: '기업과 함께 만들어가는 지속가능한 내일',
                buttonText: '참여하기',
                buttonLink: 'pages/support/partnership.html'
            }));
        }
        
        // order 순으로 정렬
        slides.sort((a, b) => a.order - b.order);
        
        // 저장
        SlideStorage.saveAll(slides);
        console.log('✅ 슬라이드 로드 완료:', slides.length, '개');
        
        // 기존 슬라이드 제거
        sliderContainer.innerHTML = '';
        console.log('🎨 슬라이드 렌더링 시작:', slides.length, '개');
        
        // SlideRenderer로 렌더링
        slides.forEach((slide, index) => {
            SlideRenderer.renderMainSlide(sliderContainer, slide, index === 0);
        });
        
        console.log('🎉 메인 슬라이드 로드 완료!');
        
    } catch (error) {
        console.error('❌ 슬라이드 로드 오류:', error);
        console.error('   스택:', error.stack);
    }
}

// 페이지 로드 시 슬라이드 렌더링 - DOM 준비 후 실행
function initializeSlider() {
    console.log('🎬 슬라이더 초기화 시작');
    
    // 1. 슬라이드 로드
    loadHeroSlides();
    
    // 2. 슬라이더 컨트롤 설정 (슬라이드 로드 후!)
    setTimeout(() => {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const dotsContainer = document.querySelector('.slider-dots');
        
        console.log('🎨 슬라이드 개수:', slides.length);
        
        let currentSlide = 0;
        let slideInterval;
        let dots = [];
        
        if (slides.length > 0 && dotsContainer) {
            // 기존 dots 삭제
            dotsContainer.innerHTML = '';
            
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            dots = document.querySelectorAll('.dot');
            console.log('✅ 슬라이더 컨트롤 생성:', dots.length + '개');
        }
        
        function goToSlide(n) {
            if (slides.length === 0) return;
            
            slides[currentSlide].classList.remove('active');
            dots[currentSlide]?.classList.remove('active');
            
            currentSlide = n;
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide]?.classList.add('active');
        }
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        // 자동 슬라이드
        function startSlider() {
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        function stopSlider() {
            clearInterval(slideInterval);
        }
        
        if (slides.length > 1) {
            startSlider();
            
            const sliderContainer = document.querySelector('.hero-slider');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', stopSlider);
                sliderContainer.addEventListener('mouseleave', startSlider);
            }
        }
        
        console.log('✅ 슬라이더 초기화 완료');
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSlider);
} else {
    initializeSlider();
}

// ==========================================
// Navigation Menu (이하 다른 기능)
// ==========================================
// Scroll to Top Button
// ==========================================
const scrollToTopBtn = document.querySelector('.scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// Smooth Scroll for Anchor Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// Scroll Animation (Fade In on Scroll)
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ==========================================
// Form Validation (if forms exist)
// ==========================================
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
                
                // Remove error styling after user types
                field.addEventListener('input', () => {
                    field.style.borderColor = '';
                });
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            alert('모든 필수 항목을 입력해주세요.');
        }
    });
});

// ==========================================
// Header Scroll Effect
// ==========================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// Lazy Loading Images
// ==========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ==========================================
// Close mobile menu when clicking outside
// ==========================================
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// ==========================================
// Keyboard Navigation for Accessibility
// ==========================================
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// ==========================================
// Print Page Styles
// ==========================================
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// ==========================================
// Console Welcome Message
// ==========================================
console.log('%c한국ESG학회 공식 웹사이트', 'font-size: 20px; font-weight: bold; color: #1e7e34;');
console.log('%c환경(Environment), 사회(Social), 거버넌스(Governance)를 선도하는 학회', 'font-size: 14px; color: #666;');
console.log('%cWebsite developed with ❤️ by Korean ESG Association', 'font-size: 12px; color: #999;');

// ==========================================
// User Login Status Management
// ==========================================
const userStatusLoggedOut = document.querySelector('.user-status-logged-out');
const userStatusLoggedIn = document.querySelector('.user-status-logged-in');
const logoutBtn = document.querySelector('.logout-btn');
const userNameDisplay = document.querySelector('.user-name');

// 로그인 상태 확인 (localStorage 사용)
function checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        showLoggedInStatus(userData);
    } else {
        showLoggedOutStatus();
    }
}

// 로그인 상태 표시
function showLoggedInStatus(userData) {
    if (userStatusLoggedOut) userStatusLoggedOut.style.display = 'none';
    if (userStatusLoggedIn) userStatusLoggedIn.style.display = 'flex';
    if (userNameDisplay) userNameDisplay.textContent = userData.name || '회원';
}

// 로그아웃 상태 표시
function showLoggedOutStatus() {
    if (userStatusLoggedOut) userStatusLoggedOut.style.display = 'flex';
    if (userStatusLoggedIn) userStatusLoggedIn.style.display = 'none';
}

// 로그아웃 버튼 이벤트
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('user');
            showLoggedOutStatus();
            alert('로그아웃 되었습니다.');
        }
    });
}

// 페이지 로드 시 로그인 상태 확인
checkLoginStatus();

// 테스트용 로그인 함수 (실제로는 로그인 페이지에서 호출)
// 예시: testLogin({name: '홍길동', email: 'hong@example.com'});
window.testLogin = function(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    checkLoginStatus();
    alert('로그인 되었습니다: ' + userData.name);
};

// ==========================================
// Disable contentEditable and design mode
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 디자인 모드 비활성화
    document.designMode = 'off';
    
    // 모든 contenteditable 속성 제거
    document.querySelectorAll('[contenteditable]').forEach(element => {
        element.removeAttribute('contenteditable');
    });
    
    // body에 user-select 스타일 적용 (복사는 가능하지만 편집 UI 방지)
    document.body.style.userSelect = 'text';
    document.body.style.webkitUserSelect = 'text';
    document.body.style.mozUserSelect = 'text';
    document.body.style.msUserSelect = 'text';
});

// 브라우저 기본 편집 기능 비활성화
document.addEventListener('selectstart', (e) => {
    // contenteditable이 true인 요소가 아닌 경우에만 허용
    if (e.target.getAttribute('contenteditable') === 'true') {
        return true;
    }
});

// 키보드 단축키로 편집 모드 진입 방지
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+I (디자인 모드 토글 방지)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
});