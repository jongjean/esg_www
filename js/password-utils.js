/**
 * 한국ESG학회 - 비밀번호 유틸리티
 * password-utils.js
 * Version: 2025-01-21
 */

/**
 * SHA-256 해싱 함수
 * @param {string} password - 평문 비밀번호
 * @returns {Promise<string>} SHA-256 해시값 (16진수 문자열)
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * 비밀번호 강도 체크
 * @param {string} password - 비밀번호
 * @returns {object} { strength: number (0-4), text: string, color: string }
 */
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    
    let result = {
        strength: 0,
        text: '-',
        color: '#666'
    };
    
    if (strength === 0) {
        result = { strength: 0, text: '-', color: '#666' };
    } else if (strength <= 2) {
        result = { strength: 1, text: '약함', color: '#e74c3c' };
    } else if (strength === 3) {
        result = { strength: 2, text: '보통', color: '#f39c12' };
    } else if (strength === 4) {
        result = { strength: 3, text: '강함', color: '#27ae60' };
    } else {
        result = { strength: 4, text: '매우 강함', color: '#1e7e34' };
    }
    
    return result;
}

/**
 * 비밀번호 검증
 * @param {string} password - 비밀번호
 * @returns {object} { valid: boolean, message: string }
 */
function validatePassword(password) {
    if (!password || password.length === 0) {
        return { valid: false, message: '비밀번호를 입력해주세요.' };
    }
    
    if (password.length < 8) {
        return { valid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
    }
    
    if (password.length > 100) {
        return { valid: false, message: '비밀번호는 최대 100자까지 가능합니다.' };
    }
    
    // 영문, 숫자, 특수문자 중 2가지 이상 포함
    let typeCount = 0;
    if (password.match(/[a-zA-Z]/)) typeCount++;
    if (password.match(/\d/)) typeCount++;
    if (password.match(/[^a-zA-Z\d]/)) typeCount++;
    
    if (typeCount < 2) {
        return { valid: false, message: '영문, 숫자, 특수문자 중 2가지 이상 포함해야 합니다.' };
    }
    
    return { valid: true, message: '사용 가능한 비밀번호입니다.' };
}

/**
 * 이메일 형식 검증
 * @param {string} email - 이메일
 * @returns {boolean}
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 전화번호 형식 검증 (한국)
 * @param {string} phone - 전화번호
 * @returns {boolean}
 */
function validatePhone(phone) {
    // 010-1234-5678, 01012345678, 010 1234 5678 모두 허용
    const phoneRegex = /^01[0-9][-\s]?\d{3,4}[-\s]?\d{4}$/;
    return phoneRegex.test(phone);
}

/**
 * 전화번호 포맷팅 (010-1234-5678)
 * @param {string} phone - 전화번호
 * @returns {string}
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
}
