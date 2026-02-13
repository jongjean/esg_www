/**
 * 한국ESG학회 - 회원가입 시스템
 * signup.js
 * Version: 2025-01-21
 */

// 이메일 중복 확인 상태
let emailChecked = false;
let emailAvailable = false;

/**
 * 회원가입 모달 열기
 */
function openSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 폼 초기화
        document.getElementById('signupForm').reset();
        emailChecked = false;
        emailAvailable = false;
        
        // 검증 메시지 초기화
        document.getElementById('emailCheckResult').textContent = '';
        document.getElementById('passwordMatchResult').textContent = '';
        document.getElementById('passwordStrengthText').textContent = '-';
        document.getElementById('passwordStrengthBar').className = 'password-strength-bar';
    }
}

/**
 * 회원가입 모달 닫기
 */
function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * 로그인 모달로 전환
 */
function switchToLogin() {
    closeSignupModal();
    setTimeout(() => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }, 300);
}

/**
 * 이메일 중복 확인
 */
async function checkEmailDuplicate() {
    const emailInput = document.getElementById('signupEmail');
    const email = emailInput.value.trim();
    const resultSpan = document.getElementById('emailCheckResult');
    
    // 이메일 형식 검증
    if (!email) {
        resultSpan.textContent = '이메일을 입력해주세요.';
        resultSpan.className = 'validation-message error';
        emailChecked = false;
        emailAvailable = false;
        return;
    }
    
    if (!validateEmail(email)) {
        resultSpan.textContent = '올바른 이메일 형식이 아닙니다.';
        resultSpan.className = 'validation-message error';
        emailChecked = false;
        emailAvailable = false;
        return;
    }
    
    // API로 중복 확인
    try {
        const response = await fetch(`tables/members/${email}`);
        
        if (response.ok) {
            // 이메일이 이미 존재함
            resultSpan.textContent = '이미 사용 중인 이메일입니다.';
            resultSpan.className = 'validation-message error';
            emailChecked = true;
            emailAvailable = false;
        } else if (response.status === 404) {
            // 이메일 사용 가능
            resultSpan.textContent = '✓ 사용 가능한 이메일입니다.';
            resultSpan.className = 'validation-message success';
            emailChecked = true;
            emailAvailable = true;
        } else {
            throw new Error('이메일 확인 실패');
        }
    } catch (error) {
        console.error('이메일 중복 확인 실패:', error);
        resultSpan.textContent = '이메일 확인 중 오류가 발생했습니다.';
        resultSpan.className = 'validation-message error';
        emailChecked = false;
        emailAvailable = false;
    }
}

/**
 * 비밀번호 가시성 토글
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

/**
 * 전체 약관 동의 토글
 */
function toggleAllTerms() {
    const agreeAll = document.getElementById('agreeAll');
    const checkboxes = document.querySelectorAll('.term-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = agreeAll.checked;
    });
}

/**
 * 약관 보기
 */
function showTerms(type) {
    let title = '';
    let content = '';
    
    if (type === 'terms') {
        title = '이용약관';
        content = `
            <h3>제1조 (목적)</h3>
            <p>본 약관은 한국ESG학회(이하 "학회")가 제공하는 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
            
            <h3>제2조 (회원가입)</h3>
            <p>1. 회원가입은 이용자가 약관의 내용에 동의하고 학회가 정한 가입양식에 따라 회원정보를 기입함으로써 신청합니다.</p>
            <p>2. 학회는 이용자의 신청에 대하여 승낙함을 원칙으로 하며, 다음 각 호의 경우 승낙을 거부할 수 있습니다.</p>
            
            <h3>제3조 (회원의 의무)</h3>
            <p>회원은 본 약관 및 관계법령을 준수하여야 하며, 학회의 업무를 방해하는 행위를 하여서는 안됩니다.</p>
        `;
    } else if (type === 'privacy') {
        title = '개인정보처리방침';
        content = `
            <h3>1. 개인정보의 수집 및 이용 목적</h3>
            <p>학회는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않습니다.</p>
            
            <h3>2. 수집하는 개인정보의 항목</h3>
            <p>- 필수항목: 이메일, 비밀번호, 이름</p>
            <p>- 선택항목: 전화번호, 소속 기관</p>
            
            <h3>3. 개인정보의 보유 및 이용기간</h3>
            <p>회원탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.</p>
            
            <h3>4. 개인정보의 제3자 제공</h3>
            <p>학회는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.</p>
        `;
    }
    
    alert(`${title}\n\n${content.replace(/<[^>]*>/g, '\n')}`);
}

// 페이지 로드 시 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    // 회원가입 폼 제출 이벤트
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // 회원가입 모달 오버레이 클릭 시 닫기 (모달 컨텐츠는 제외)
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        signupModal.addEventListener('click', function(e) {
            // 모달 최외곽을 직접 클릭했을 때만 닫기
            if (e.target === signupModal) {
                closeSignupModal();
            }
        });
        
        // 오버레이를 클릭했을 때도 닫기
        const signupOverlay = signupModal.querySelector('.login-modal-overlay');
        if (signupOverlay) {
            signupOverlay.addEventListener('click', function(e) {
                if (e.target === signupOverlay) {
                    closeSignupModal();
                }
            });
        }
        
        // 모달 컨텐츠 내부 클릭은 이벤트 전파 중지
        const signupContent = signupModal.querySelector('.login-modal-content');
        if (signupContent) {
            signupContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
    
    // 비밀번호 강도 체크
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const result = checkPasswordStrength(this.value);
            const strengthBar = document.getElementById('passwordStrengthBar');
            const strengthText = document.getElementById('passwordStrengthText');
            
            strengthBar.className = 'password-strength-bar';
            if (result.strength === 1) {
                strengthBar.classList.add('weak');
            } else if (result.strength === 2) {
                strengthBar.classList.add('medium');
            } else if (result.strength >= 3) {
                strengthBar.classList.add('strong');
            }
            
            strengthText.textContent = result.text;
            strengthText.style.color = result.color;
        });
    }
    
    // 비밀번호 확인 체크
    const passwordConfirmInput = document.getElementById('signupPasswordConfirm');
    if (passwordConfirmInput) {
        passwordConfirmInput.addEventListener('input', function() {
            const password = document.getElementById('signupPassword').value;
            const passwordConfirm = this.value;
            const resultSpan = document.getElementById('passwordMatchResult');
            
            if (passwordConfirm.length > 0) {
                if (password === passwordConfirm) {
                    resultSpan.textContent = '✓ 비밀번호가 일치합니다.';
                    resultSpan.className = 'validation-message success';
                } else {
                    resultSpan.textContent = '✗ 비밀번호가 일치하지 않습니다.';
                    resultSpan.className = 'validation-message error';
                }
            } else {
                resultSpan.textContent = '';
            }
        });
    }
    
    // 이메일 입력 변경 시 중복 확인 초기화
    const emailInput = document.getElementById('signupEmail');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            emailChecked = false;
            emailAvailable = false;
            const resultSpan = document.getElementById('emailCheckResult');
            resultSpan.textContent = '';
        });
    }
    
    // 개별 약관 체크 시 전체 동의 체크박스 업데이트
    const termCheckboxes = document.querySelectorAll('.term-checkbox');
    termCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const agreeAll = document.getElementById('agreeAll');
            const allChecked = Array.from(termCheckboxes).every(cb => cb.checked);
            agreeAll.checked = allChecked;
        });
    });
});

/**
 * 회원가입 처리
 */
async function handleSignup(e) {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중지
    
    const submitBtn = document.querySelector('.signup-submit-btn');
    const originalText = submitBtn.innerHTML;
    
    try {
        // 폼 데이터 수집
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
        const name = document.getElementById('signupName').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const affiliation = document.getElementById('signupAffiliation').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const agreePrivacy = document.getElementById('agreePrivacy').checked;
        
        // 유효성 검증
        if (!emailChecked || !emailAvailable) {
            alert('이메일 중복 확인을 해주세요.');
            return false; // 명시적으로 false 반환
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            alert(passwordValidation.message);
            return false;
        }
        
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return false;
        }
        
        if (!name) {
            alert('이름을 입력해주세요.');
            return false;
        }
        
        if (!agreeTerms || !agreePrivacy) {
            alert('필수 약관에 동의해주세요.');
            return false;
        }
        
        // 전화번호 검증 (선택 항목이지만 입력했다면 형식 검증)
        if (phone && !validatePhone(phone)) {
            alert('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
            return false;
        }
        
        // 로딩 표시
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 가입 처리 중...';
        submitBtn.disabled = true;
        
        // 비밀번호 해싱
        const hashedPassword = await hashPassword(password);
        
        // 회원가입 데이터 생성
        const memberData = {
            id: email,
            password: hashedPassword,
            name: name,
            name_en: '',
            role: 'user',
            status: 'active',
            phone: phone ? formatPhone(phone) : '',
            affiliation: affiliation,
            department: '',
            position: '',
            member_type: '',
            join_date: new Date().toISOString(),
            last_login: ''
        };
        
        // API 호출
        const response = await fetch('tables/members', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memberData)
        });
        
        if (response.ok) {
            alert('회원가입이 완료되었습니다!\n로그인 후 서비스를 이용하실 수 있습니다.');
            closeSignupModal();
            
            console.log('✅ 회원가입 완료 - 로그인 모달 열기 준비');
            
            // 로그인 모달 열기
            setTimeout(() => {
                const loginModal = document.getElementById('loginModal');
                if (loginModal) {
                    console.log('✅ 로그인 모달 발견 - 열기 시작');
                    loginModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    // 이메일 자동 입력
                    const loginIdInput = document.getElementById('loginId');
                    if (loginIdInput) {
                        loginIdInput.value = email;
                        console.log('✅ 이메일 자동 입력:', email);
                    }
                } else {
                    console.error('❌ 로그인 모달을 찾을 수 없음');
                }
            }, 500);
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '회원가입에 실패했습니다.');
        }
    } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다.\n' + error.message);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
    
    return false; // 폼 제출 방지
}
