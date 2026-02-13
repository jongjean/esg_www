/**
 * 서브페이지 로그인 모달 자동 추가 스크립트
 * subpage-login.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // 이미 로그인 모달이 있으면 리턴
    if (document.getElementById('loginModal')) {
        return;
    }
    
    // 현재 페이지 경로 확인 (상대 경로 계산용)
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    let basePath = '';
    
    // depth에 따라 상대 경로 설정
    if (depth === 3) {
        // pages/about/greeting.html 같은 경우
        basePath = '../../';
    } else if (depth === 2) {
        // pages/sitemap.html 같은 경우
        basePath = '../';
    } else {
        // index.html
        basePath = '';
    }
    
    // 로그인 링크를 모달 트리거로 변경
    const loginLinks = document.querySelectorAll('a[href*="mypage/profile.html"]');
    loginLinks.forEach(link => {
        // href가 마이페이지로 가는 링크만 처리
        if (link.textContent.trim() === '로그인' || link.id === 'topLoginBtn') {
            link.href = '#';
            link.id = link.id || 'loginBtn_' + Math.random().toString(36).substr(2, 9);
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof playSound === 'function') {
                    playSound('click');
                }
                const modal = document.getElementById('loginModal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
    });
    
    // 로그인 모달 HTML 추가
    const modalHTML = `
    <div class="login-modal" id="loginModal">
        <div class="login-modal-overlay"></div>
        <div class="login-modal-content">
            <button class="login-modal-close" aria-label="닫기">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="login-header">
                <h2><i class="fas fa-user-circle"></i> 로그인</h2>
                <p>한국ESG학회 회원 로그인</p>
            </div>
            
            <form class="login-form" id="loginForm">
                <div class="form-group">
                    <label for="loginId">
                        <i class="fas fa-envelope"></i> 아이디 (이메일)
                    </label>
                    <input type="email" id="loginId" name="loginId" placeholder="example@email.com" required autocomplete="username">
                </div>
                
                <div class="form-group">
                    <label for="loginPassword">
                        <i class="fas fa-lock"></i> 비밀번호
                    </label>
                    <input type="password" id="loginPassword" name="loginPassword" placeholder="비밀번호를 입력하세요" required autocomplete="current-password">
                </div>
                
                <div class="form-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="rememberMe" name="rememberMe">
                        <span>로그인 상태 유지</span>
                    </label>
                    <a href="#" class="forgot-link">비밀번호 찾기</a>
                </div>
                
                <button type="submit" class="login-submit-btn">
                    <i class="fas fa-sign-in-alt"></i> 로그인
                </button>
                
                <div class="login-footer">
                    <p>아직 회원이 아니신가요?</p>
                    <a href="${basePath}pages/member/application.html" class="register-link">회원가입 하기</a>
                </div>
            </form>
        </div>
    </div>
    `;
    
    // body에 모달 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // login.css가 로드되어 있는지 확인
    const hasLoginCSS = Array.from(document.styleSheets).some(sheet => {
        try {
            return sheet.href && sheet.href.includes('login.css');
        } catch (e) {
            return false;
        }
    });
    
    // CSS가 없으면 동적으로 추가
    if (!hasLoginCSS) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = basePath + 'css/login.css';
        document.head.appendChild(link);
    }
    
    // auth.js가 로드되어 있는지 확인
    const hasAuthJS = Array.from(document.scripts).some(script => {
        return script.src && script.src.includes('auth.js');
    });
    
    // auth.js가 없으면 동적으로 추가
    if (!hasAuthJS) {
        const script = document.createElement('script');
        script.src = basePath + 'js/auth.js';
        document.body.appendChild(script);
    } else {
        // auth.js가 이미 있으면 LoginModal 초기화
        setTimeout(() => {
            if (typeof LoginModal !== 'undefined') {
                new LoginModal();
            }
        }, 100);
    }
});
