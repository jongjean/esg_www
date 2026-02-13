/**
 * 한국ESG학회 - 로그인 및 인증 시스템
 * auth.js
 * Version: 2025-01-19-v4 (로그아웃 버튼 디버깅)
 */

// 효과음 파일 경로
const SOUND_EFFECTS = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // 클릭 효과음
    success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // 성공 효과음
    error: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3' // 오류 효과음
};

// 효과음 재생 함수
function playSound(soundType) {
    try {
        const audio = new Audio(SOUND_EFFECTS[soundType]);
        audio.volume = 0.15; // 음량 15%
        audio.play().catch(err => console.log('Sound play failed:', err));
    } catch (err) {
        console.log('Sound initialization failed:', err);
    }
}

// 로그인 모달 관리
class LoginModal {
    constructor() {
        this.modal = document.getElementById('loginModal');
        this.loginBtns = [
            document.getElementById('loginBtn'),
            document.getElementById('topLoginBtn')
        ];
        this.closeBtn = this.modal?.querySelector('.login-modal-close');
        this.overlay = this.modal?.querySelector('.login-modal-overlay');
        this.form = document.getElementById('loginForm');
        
        this.init();
    }
    
    init() {
        // 로그인 상태 확인 (모달 없어도 실행)
        this.checkLoginStatus();
        
        if (!this.modal) return;
        
        // 로그인 버튼 이벤트
        this.loginBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    playSound('click');
                    this.open();
                });
            }
        });
        
        // 닫기 버튼 이벤트
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                playSound('click');
                this.close();
            });
        }
        
        // 모달 바깥 영역 클릭 시 닫기
        this.modal.addEventListener('click', (e) => {
            // 모달 자체를 클릭했을 때만 닫기 (오버레이나 빈 공간)
            if (e.target === this.modal || e.target === this.overlay) {
                console.log('🔵 모달 바깥 영역 클릭 - 닫기');
                playSound('click');
                this.close();
            }
        });
        
        // 모달 컨텐츠 내부 클릭 시 이벤트 전파 중지
        const modalContent = this.modal.querySelector('.login-modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('🔵 모달 컨텐츠 내부 클릭 - 이벤트 전파 중지');
            });
        }
        
        // ESC 키로 닫기 (중복 방지)
        if (!this._escHandlerAdded) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                    console.log('🔑 ESC 키로 모달 닫기');
                    playSound('click');
                    this.close();
                }
            });
            this._escHandlerAdded = true;
        }
        
        // 폼 제출 이벤트
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // 로그인 상태 확인
        this.checkLoginStatus();
    }
    
    open() {
        console.log('🔵 로그인 모달 열기 시도');
        if (!this.modal) {
            console.error('❌ 로그인 모달을 찾을 수 없음');
            return;
        }
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('✅ 로그인 모달 열림');
        
        // 첫 번째 입력 필드에 포커스
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input[type="email"]');
            if (firstInput) firstInput.focus();
        }, 300);
    }
    
    close() {
        console.log('🔴 로그인 모달 닫기');
        if (!this.modal) return;
        
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // 폼 초기화
        if (this.form) this.form.reset();
        
        // 에러 메시지 제거
        const errorMsg = this.modal.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
        
        console.log('✅ 로그인 모달 닫힘');
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const loginId = document.getElementById('loginId').value;
        const password = document.getElementById('loginPassword').value;
        // rememberMe 제거 - 항상 세션 스토리지만 사용
        
        // 로딩 상태 표시
        const submitBtn = this.form.querySelector('.login-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
        submitBtn.disabled = true;
        
        // 기존 에러 메시지 제거
        const existingError = this.modal.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        try {
            // Table API로 회원 조회
            const response = await fetch(`tables/members/${loginId}`);
            
            if (!response.ok) {
                throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
            
            const memberData = await response.json();
            
            // 비밀번호 해싱 및 검증
            const hashedPassword = await hashPassword(password);
            
            if (memberData.password !== hashedPassword) {
                throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
            
            // 계정 상태 확인
            if (memberData.status !== 'active') {
                throw new Error('비활성화된 계정입니다. 관리자에게 문의하세요.');
            }
            
            playSound('success');
            
            // 로그인 성공 - 사용자 데이터 저장
            const userData = {
                id: memberData.id,
                name: memberData.name,
                role: memberData.role,
                status: memberData.status,
                member_type: memberData.member_type || '',
                loginTime: new Date().toISOString()
            };
            
            // 항상 세션 스토리지만 사용 (자동 로그인 제거)
            sessionStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ 세션 스토리지에 사용자 정보 저장');
            
            // 마지막 로그인 시간 업데이트
            await fetch(`tables/members/${loginId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    last_login: new Date().toISOString()
                })
            });
            
            // 성공 애니메이션
            this.modal.querySelector('.login-modal-content').classList.add('login-success');
            
            // 성공 메시지 표시
            this.showMessage('로그인 성공!', 'success');
            
            setTimeout(() => {
                this.close();
                this.updateLoginStatus(userData);
                
                // 페이지 새로고침 제거 (메뉴만 업데이트)
                // window.location.reload();
            }, 1000);
            
        } catch (error) {
            playSound('error');
            
            console.error('로그인 오류:', error);
            
            // 로그인 실패
            this.modal.querySelector('.login-modal-content').classList.add('login-error');
            setTimeout(() => {
                this.modal.querySelector('.login-modal-content').classList.remove('login-error');
            }, 500);
            
            this.showMessage(error.message || '로그인에 실패했습니다.', 'error');
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `error-message ${type}-message`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            ${message}
        `;
        messageDiv.style.cssText = `
            padding: 12px 16px;
            margin-top: 15px;
            border-radius: 8px;
            background: ${type === 'error' ? '#fee' : '#efe'};
            color: ${type === 'error' ? '#c33' : '#3c3'};
            border: 1px solid ${type === 'error' ? '#fcc' : '#cfc'};
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: slideDown 0.3s ease;
        `;
        
        this.form.appendChild(messageDiv);
    }
    
    checkLoginStatus() {
        const user = this.getUser();
        if (user) {
            // body에 user-logged-in 클래스 추가
            document.body.classList.add('user-logged-in');
            console.log('✅ 기존 로그인 상태 확인:', user.name);
            // JavaScript로 직접 메뉴 제어
            this.updateMenuDisplay(true);
        } else {
            // 로그아웃 상태
            document.body.classList.remove('user-logged-in');
            this.updateMenuDisplay(false);
        }
    }
    
    getUser() {
        // sessionStorage만 확인 (자동 로그인 제거)
        const sessionUser = sessionStorage.getItem('user');
        return sessionUser ? JSON.parse(sessionUser) : null;
    }
    
    updateMenuDisplay(isLoggedIn) {
        console.log(`🔍 메뉴 업데이트 시작 - 로그인 상태: ${isLoggedIn}`);
        
        // 마이페이지 드롭다운만 찾기
        const navItems = document.querySelectorAll('.nav-item.has-dropdown');
        
        navItems.forEach(navItem => {
            const navLink = navItem.querySelector('.nav-link');
            if (!navLink) return;
            
            const navText = navLink.textContent.trim();
            
            // 마이페이지 드롭다운인지 확인
            if (!navText.includes('마이페이지')) return;
            
            const dropdown = navItem.querySelector('.dropdown-menu');
            if (!dropdown) return;
            
            const menuItems = dropdown.querySelectorAll('li');
            
            menuItems.forEach(item => {
                const link = item.querySelector('a');
                if (!link) return;
                
                const href = link.getAttribute('href') || '';
                const text = link.textContent.trim();
                const linkId = link.id || '';
                
                // 게스트 전용 메뉴 (회원가입, 로그인)
                const isGuestMenu = href.includes('signup.html') || 
                                   text.includes('로그인') || 
                                   text.includes('회원가입') ||
                                   linkId === 'loginBtn';
                
                // 로그인 사용자 전용 메뉴
                const isUserMenu = href.includes('mypage/profile.html') || 
                                  href.includes('mypage/payment.html') || 
                                  href.includes('mypage/history.html') || 
                                  href.includes('mypage/paper.html') || 
                                  href.includes('mypage/event.html') || 
                                  href.includes('mypage/certificate.html') || 
                                  text.includes('로그아웃') || 
                                  text.includes('회원정보 관리') || 
                                  text.includes('회비 납부') || 
                                  text.includes('납부 내역') || 
                                  text.includes('논문 투고 현황') || 
                                  text.includes('행사·세미나 신청') || 
                                  text.includes('회원증·증명서') ||
                                  linkId === 'logoutBtn';
                
                // 로그인 상태에 따라 표시/숨김
                if (isLoggedIn) {
                    // 로그인 상태: 게스트 메뉴 숨김, 사용자 메뉴 표시
                    if (isGuestMenu) {
                        item.style.display = 'none';
                    } else if (isUserMenu) {
                        item.style.display = 'block';
                    }
                } else {
                    // 로그아웃 상태: 게스트 메뉴 표시, 사용자 메뉴 숨김
                    if (isGuestMenu) {
                        item.style.display = 'block';
                    } else if (isUserMenu) {
                        item.style.display = 'none';
                    }
                }
            });
        });
        
        console.log(`✅ 메뉴 업데이트 완료 - 로그인 상태: ${isLoggedIn}`);
    }
    
    updateLoginStatus(user) {
        // body에 user-logged-in 클래스 추가
        document.body.classList.add('user-logged-in');
        
        // 사용자 이름 표시 (있으면)
        const userName = document.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.name;
        }
        
        // JavaScript로 직접 메뉴 제어
        this.updateMenuDisplay(true);
        
        console.log('✅ 로그인 상태 업데이트:', user.name);
    }
    
    logout() {
        playSound('click');
        
        // 스토리지에서 사용자 정보 삭제
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // body에서 user-logged-in 클래스 제거
        document.body.classList.remove('user-logged-in');
        
        // JavaScript로 직접 메뉴 제어
        this.updateMenuDisplay(false);
        
        console.log('✅ 로그아웃 완료');
        
        // 페이지 새로고침 (선택사항)
        setTimeout(() => {
            // window.location.reload();
        }, 500);
    }
}

/**
 * 로그인 모달에서 회원가입 모달로 전환
 */
function switchToSignup() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setTimeout(() => {
        if (typeof openSignupModal === 'function') {
            openSignupModal();
        }
    }, 300);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = new LoginModal();
    
    // 로그아웃 버튼 이벤트 (ID로 찾기)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.logout();
        });
    }
    
    // 로그아웃 버튼 이벤트 (클래스로도 찾기 - 호환성)
    const logoutBtnClass = document.querySelector('.logout-btn');
    if (logoutBtnClass) {
        logoutBtnClass.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.logout();
        });
    }
});

// 메뉴 클릭 효과음 추가
document.addEventListener('DOMContentLoaded', () => {
    // 모든 네비게이션 링크에 효과음 추가
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-menu a, .status-link, .status-btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // 드롭다운 토글은 효과음만 재생하고 페이지 이동 안 함
            if (link.classList.contains('nav-link') && link.parentElement.classList.contains('has-dropdown')) {
                playSound('click');
                return;
            }
            
            // 일반 링크는 효과음 재생
            if (!e.defaultPrevented) {
                playSound('click');
            }
        });
    });
    
    // 버튼에도 효과음 추가
    const buttons = document.querySelectorAll('button:not(.login-modal-close):not(.logout-btn)');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('click');
        });
    });
});
