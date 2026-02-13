/**
 * 한국ESG학회 - 로그인 상태 관리
 */

// 로그인 상태 관리 클래스
class AuthManager {
    constructor() {
        this.storageKey = 'esg_user_auth';
        this.init();
    }

    // 초기화
    init() {
        this.updateUI();
        this.attachEventListeners();
    }

    // 로그인 상태 확인
    isLoggedIn() {
        const auth = localStorage.getItem(this.storageKey);
        if (!auth) return false;
        
        try {
            const authData = JSON.parse(auth);
            // 토큰 만료 확인 (7일)
            if (authData.expiry && Date.now() > authData.expiry) {
                this.logout();
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // 사용자 정보 가져오기
    getUserInfo() {
        const auth = localStorage.getItem(this.storageKey);
        if (!auth) return null;
        
        try {
            const authData = JSON.parse(auth);
            return authData.user || null;
        } catch (e) {
            return null;
        }
    }

    // 로그인 처리
    login(userData) {
        const authData = {
            user: userData,
            expiry: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7일 후 만료
            loginTime: Date.now()
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(authData));
        this.updateUI();
        
        // 로그인 성공 메시지
        this.showNotification('로그인되었습니다.', 'success');
        
        // 메인 페이지로 이동 - 삭제됨 (리다이렉트 제거)
        // setTimeout(() => {
        //     window.location.href = '/index.html';
        // }, 1000);
    }

    // 로그아웃 처리
    logout() {
        localStorage.removeItem(this.storageKey);
        this.updateUI();
        
        // 로그아웃 성공 메시지
        this.showNotification('로그아웃되었습니다.', 'info');
        
        // 메인 페이지로 이동 - 삭제됨 (리다이렉트 제거)
        // setTimeout(() => {
        //     window.location.href = '/index.html';
        // }, 1000);
    }

    // UI 업데이트
    updateUI() {
        if (this.isLoggedIn()) {
            document.body.classList.add('user-logged-in');
            const userInfo = this.getUserInfo();
            this.updateUserDisplay(userInfo);
        } else {
            document.body.classList.remove('user-logged-in');
        }
    }

    // 사용자 정보 표시 업데이트
    updateUserDisplay(userInfo) {
        if (!userInfo) return;

        // 마이페이지 메뉴 텍스트 업데이트 (선택사항)
        const myPageLink = document.querySelector('.nav-link .fa-user-circle');
        if (myPageLink && myPageLink.parentElement) {
            const linkText = myPageLink.parentElement;
            // 아이콘 다음에 사용자 이름 표시 가능
            // linkText.innerHTML = `<i class="fas fa-user-circle"></i> ${userInfo.name}님`;
        }
    }

    // 이벤트 리스너 연결
    attachEventListeners() {
        // 로그아웃 버튼
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('로그아웃하시겠습니까?')) {
                    this.logout();
                }
            });
        }
    }

    // 알림 메시지 표시
    showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existing = document.querySelector('.auth-notification');
        if (existing) existing.remove();

        // 새 알림 생성
        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // 애니메이션
        setTimeout(() => notification.classList.add('show'), 10);

        // 3초 후 제거
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 로그인 필요 페이지 접근 제한
    requireAuth() {
        if (!this.isLoggedIn()) {
            alert('로그인이 필요한 페이지입니다.');
            window.location.href = '/pages/auth/login.html';
            return false;
        }
        return true;
    }
}

// 전역 인스턴스 생성
const authManager = new AuthManager();

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    authManager.updateUI();
});
