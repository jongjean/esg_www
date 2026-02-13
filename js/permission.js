/**
 * 한국ESG학회 - 권한 관리 시스템
 * permission.js
 * Version: 2025-01-21
 */

// 권한 계층 구조
const ROLE_HIERARCHY = {
    'super_admin': 3,  // 최고관리자
    'admin': 2,        // 관리자
    'user': 1          // 사용자
};

// 권한 한글명
const ROLE_NAMES = {
    'super_admin': '최고관리자',
    'admin': '관리자',
    'user': '사용자'
};

/**
 * 현재 로그인한 사용자 정보 가져오기
 * @returns {object|null} 사용자 정보
 */
function getCurrentUser() {
    // sessionStorage만 확인 (자동 로그인 제거)
    const sessionUser = sessionStorage.getItem('user');
    return sessionUser ? JSON.parse(sessionUser) : null;
}

/**
 * 사용자가 로그인했는지 확인
 * @returns {boolean}
 */
function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * 사용자 권한 확인
 * @param {string} requiredRole - 필요한 권한 (super_admin, admin, user)
 * @returns {boolean}
 */
function hasPermission(requiredRole) {
    const user = getCurrentUser();
    
    if (!user) {
        return false;
    }
    
    const userRoleLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
}

/**
 * 최고관리자 권한 확인
 * @returns {boolean}
 */
function isSuperAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'super_admin';
}

/**
 * 관리자 이상 권한 확인 (관리자 또는 최고관리자)
 * @returns {boolean}
 */
function isAdmin() {
    return hasPermission('admin');
}

/**
 * 페이지 접근 권한 확인 (권한 없으면 리다이렉트)
 * @param {string} requiredRole - 필요한 권한
 * @param {string} redirectUrl - 리다이렉트할 URL (기본: 메인 페이지)
 */
function checkPagePermission(requiredRole, redirectUrl = '../../index.html') {
    if (!isLoggedIn()) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = redirectUrl;
        return;
    }
    
    if (!hasPermission(requiredRole)) {
        const user = getCurrentUser();
        alert(`접근 권한이 없습니다.\n필요 권한: ${ROLE_NAMES[requiredRole]}\n현재 권한: ${ROLE_NAMES[user.role]}`);
        window.location.href = redirectUrl;
        return;
    }
}

/**
 * 특정 기능에 대한 권한 확인 (경고 메시지만 표시)
 * @param {string} requiredRole - 필요한 권한
 * @param {string} featureName - 기능 이름
 * @returns {boolean}
 */
function checkFeaturePermission(requiredRole, featureName = '이 기능') {
    if (!isLoggedIn()) {
        alert('로그인이 필요합니다.');
        return false;
    }
    
    if (!hasPermission(requiredRole)) {
        const user = getCurrentUser();
        alert(`${featureName}을(를) 사용할 권한이 없습니다.\n필요 권한: ${ROLE_NAMES[requiredRole]}\n현재 권한: ${ROLE_NAMES[user.role]}`);
        return false;
    }
    
    return true;
}

/**
 * UI 요소의 권한 기반 표시/숨김 처리
 * @param {string} selector - CSS 선택자
 * @param {string} requiredRole - 필요한 권한
 */
function toggleElementByPermission(selector, requiredRole) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        if (hasPermission(requiredRole)) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
}

/**
 * 페이지 로드 시 권한 기반 UI 초기화
 */
function initializePermissionUI() {
    // data-permission 속성을 가진 모든 요소 처리
    const permissionElements = document.querySelectorAll('[data-permission]');
    
    permissionElements.forEach(element => {
        const requiredRole = element.getAttribute('data-permission');
        
        if (!hasPermission(requiredRole)) {
            element.style.display = 'none';
        }
    });
    
    // data-permission-disabled 속성을 가진 요소는 비활성화
    const disableElements = document.querySelectorAll('[data-permission-disabled]');
    
    disableElements.forEach(element => {
        const requiredRole = element.getAttribute('data-permission-disabled');
        
        if (!hasPermission(requiredRole)) {
            element.disabled = true;
            element.style.opacity = '0.5';
            element.style.cursor = 'not-allowed';
            
            element.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`이 기능을 사용할 권한이 없습니다.\n필요 권한: ${ROLE_NAMES[requiredRole]}`);
            });
        }
    });
}

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializePermissionUI();
    
    console.log('🔐 권한 시스템 초기화 완료');
    
    const user = getCurrentUser();
    if (user) {
        console.log(`👤 현재 사용자: ${user.name} (${ROLE_NAMES[user.role]})`);
    } else {
        console.log('👤 비로그인 상태');
    }
});
