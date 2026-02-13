/**
 * 한국ESG학회 - 드롭다운 로그아웃 자동 생성 스크립트
 * 모든 페이지에서 로그인/로그아웃 메뉴를 자동으로 제어
 */

(function() {
    function initLoginMenu() {
        const isLoggedIn = !!(localStorage.getItem('user') || sessionStorage.getItem('user'));
        
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        
        dropdowns.forEach(dropdown => {
            // 🔥 로그아웃 버튼이 없으면 자동 생성
            let hasLogout = false;
            dropdown.querySelectorAll('li').forEach(li => {
                const link = li.querySelector('a');
                if (link && (link.id === 'logoutBtn' || link.textContent.includes('로그아웃'))) {
                    hasLogout = true;
                }
            });
            
            if (!hasLogout) {
                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = '<a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> 로그아웃</a>';
                dropdown.appendChild(logoutLi);
            }
            
            // 메뉴 표시/숨김 제어
            const menuItems = dropdown.querySelectorAll('li');
            
            menuItems.forEach(item => {
                const link = item.querySelector('a');
                if (!link) return;
                
                const href = link.getAttribute('href') || '';
                const text = link.textContent.trim();
                const linkId = link.id || '';
                
                // 게스트 메뉴 (로그아웃 상태)
                const isGuest = href.includes('signup.html') || 
                               href.includes('login.html') || 
                               text.includes('회원가입') || 
                               text.includes('로그인') ||
                               linkId === 'loginBtn' ||
                               linkId === 'topLoginBtn';
                
                // 사용자 메뉴 (로그인 상태)
                const isUser = href.includes('profile.html') || 
                              href.includes('payment.html') || 
                              href.includes('history.html') || 
                              href.includes('paper.html') || 
                              href.includes('event.html') || 
                              href.includes('certificate.html') || 
                              text.includes('로그아웃') || 
                              text.includes('회원정보') ||
                              text.includes('회비') ||
                              text.includes('납부') ||
                              text.includes('논문') ||
                              text.includes('행사') ||
                              text.includes('세미나') ||
                              text.includes('회원증') ||
                              text.includes('증명서') ||
                              linkId === 'logoutBtn';
                
                // 로그인 상태에 따라 표시/숨김
                if (isLoggedIn) {
                    item.style.display = isGuest ? 'none' : (isUser ? 'block' : '');
                } else {
                    item.style.display = isGuest ? 'block' : (isUser ? 'none' : '');
                }
            });
        });
        
        // 로그아웃 버튼 클릭 이벤트
        const logoutButtons = document.querySelectorAll('#logoutBtn');
        logoutButtons.forEach(btn => {
            if (btn && !btn.dataset.logoutListenerAdded) {
                btn.dataset.logoutListenerAdded = 'true';
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    sessionStorage.removeItem('user');
                    
                    // 경로에 따라 적절한 index.html로 이동
                    const depth = (window.location.pathname.match(/\//g) || []).length;
                    let indexPath = 'index.html';
                    if (depth > 2) {
                        indexPath = '../'.repeat(depth - 2) + 'index.html';
                    }
                    
                    setTimeout(() => {
                        window.location.href = indexPath;
                    }, 300);
                });
            }
        });
    }
    
    // 페이지 로드 시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initLoginMenu, 100);
        });
    } else {
        setTimeout(initLoginMenu, 100);
    }
    
    // 페이지 완전 로드 후에도 실행
    window.addEventListener('load', function() {
        setTimeout(initLoginMenu, 500);
    });
})();
