/**
 * 한국ESG학회 - 회원가입 신청서 처리
 * application.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const applicationForm = document.getElementById('applicationForm');
    
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplicationSubmit);
        
        // 관심 분야 체크박스 최소 1개 선택 검증
        const interestsCheckboxes = document.querySelectorAll('input[name="interests"]');
        interestsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateInterests);
        });
    }
});

function validateInterests() {
    const interestsCheckboxes = document.querySelectorAll('input[name="interests"]');
    const checkedCount = Array.from(interestsCheckboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
        interestsCheckboxes[0].setCustomValidity('최소 1개 이상의 관심 분야를 선택해주세요.');
    } else {
        interestsCheckboxes.forEach(cb => cb.setCustomValidity(''));
    }
}

async function handleApplicationSubmit(e) {
    e.preventDefault();
    
    // 효과음 재생
    if (typeof playSound === 'function') {
        playSound('click');
    }
    
    // 관심 분야 검증
    const interestsCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
    if (interestsCheckboxes.length === 0) {
        showMessage('최소 1개 이상의 관심 분야를 선택해주세요.', 'error');
        return;
    }
    
    // 개인정보 동의 검증
    const privacyConsent = document.getElementById('privacyConsent');
    if (!privacyConsent.checked) {
        showMessage('개인정보 수집 및 이용에 동의해주세요.', 'error');
        privacyConsent.focus();
        return;
    }
    
    // 폼 데이터 수집
    const formData = new FormData(e.target);
    const data = {};
    
    // 기본 필드 수집
    for (let [key, value] of formData.entries()) {
        if (key !== 'interests') {
            data[key] = value;
        }
    }
    
    // 관심 분야 배열로 수집
    data.interests = Array.from(interestsCheckboxes).map(cb => cb.value);
    
    // 제출 버튼 비활성화
    const submitBtn = e.target.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 신청서 제출 중...';
    submitBtn.disabled = true;
    
    try {
        // 시뮬레이션: 실제로는 서버로 데이터 전송
        await simulateSubmission(data);
        
        // 성공 효과음
        if (typeof playSound === 'function') {
            playSound('success');
        }
        
        // 성공 메시지 표시
        showSuccessPage(data);
        
        // 폼 초기화
        e.target.reset();
        
        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        // 오류 효과음
        if (typeof playSound === 'function') {
            playSound('error');
        }
        
        // 오류 메시지 표시
        showMessage('신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        
        // 버튼 복원
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function simulateSubmission(data) {
    return new Promise((resolve) => {
        // 서버 전송 시뮬레이션 (2초 지연)
        setTimeout(() => {
            console.log('신청서 데이터:', data);
            resolve();
        }, 2000);
    });
}

function showMessage(message, type) {
    // 기존 메시지 제거
    const existingMessage = document.querySelector('.message-box');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 새 메시지 생성
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message message-box`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        ${message}
    `;
    
    // 폼 상단에 추가
    const formSection = document.querySelector('.form-section');
    if (formSection) {
        formSection.parentElement.insertBefore(messageDiv, formSection);
        
        // 메시지로 스크롤
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 5초 후 자동 제거
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
}

function showSuccessPage(data) {
    // 신청서 폼 숨기기
    const applicationForm = document.getElementById('applicationForm');
    applicationForm.style.display = 'none';
    
    // 성공 페이지 생성
    const successPage = document.createElement('div');
    successPage.className = 'success-page';
    successPage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>회원 가입 신청이 완료되었습니다!</h2>
            <p class="success-subtitle">신청해주셔서 감사합니다.</p>
            
            <div class="success-info-box">
                <h3><i class="fas fa-info-circle"></i> 다음 단계 안내</h3>
                <div class="success-steps">
                    <div class="success-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>신청서 검토</h4>
                            <p>제출하신 신청서를 검토하겠습니다 (영업일 기준 2-3일 소요)</p>
                        </div>
                    </div>
                    <div class="success-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>회비 납부 안내</h4>
                            <p>승인 후 등록하신 이메일로 회비 납부 안내를 보내드립니다</p>
                        </div>
                    </div>
                    <div class="success-step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>회원 승인</h4>
                            <p>회비 납부 확인 후 정식 회원으로 승인됩니다</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="submitted-info">
                <h4><i class="fas fa-user"></i> 신청 정보</h4>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">이름:</span>
                        <span class="info-value">${data.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">이메일:</span>
                        <span class="info-value">${data.email}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">회원 유형:</span>
                        <span class="info-value">${getMemberTypeName(data.memberType)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">신청일시:</span>
                        <span class="info-value">${new Date().toLocaleString('ko-KR')}</span>
                    </div>
                </div>
            </div>
            
            <div class="success-actions">
                <a href="../../index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i> 홈으로 가기
                </a>
                <a href="process.html" class="btn btn-secondary">
                    <i class="fas fa-info-circle"></i> 회원안내 보기
                </a>
            </div>
            
            <div class="contact-info">
                <p><i class="fas fa-question-circle"></i> 문의사항이 있으시면 언제든지 연락주세요.</p>
                <p><i class="fas fa-envelope"></i> kohmh@ssu.ac.kr | <i class="fas fa-phone"></i> 010-4263-7715</p>
            </div>
        </div>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .success-page {
            min-height: 600px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            animation: fadeIn 0.6s ease;
        }
        
        .success-content {
            max-width: 800px;
            width: 100%;
            text-align: center;
        }
        
        .success-icon {
            font-size: 80px;
            color: #27ae60;
            margin-bottom: 30px;
            animation: scaleIn 0.6s ease;
        }
        
        .success-content h2 {
            font-size: 32px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .success-subtitle {
            font-size: 18px;
            color: #7f8c8d;
            margin-bottom: 40px;
        }
        
        .success-info-box {
            background: linear-gradient(135deg, #f0fff4 0%, #e8f8f0 100%);
            border: 2px solid #27ae60;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: left;
        }
        
        .success-info-box h3 {
            font-size: 20px;
            font-weight: 700;
            color: #27ae60;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .success-steps {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .success-step {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            background: white;
            padding: 20px;
            border-radius: 10px;
        }
        
        .step-number {
            width: 40px;
            height: 40px;
            background: #27ae60;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 700;
            flex-shrink: 0;
        }
        
        .step-content h4 {
            font-size: 16px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        .step-content p {
            font-size: 14px;
            color: #7f8c8d;
            line-height: 1.6;
        }
        
        .submitted-info {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            text-align: left;
        }
        
        .submitted-info h4 {
            font-size: 18px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-label {
            font-weight: 600;
            color: #6c757d;
            min-width: 80px;
        }
        
        .info-value {
            color: #2c3e50;
            font-weight: 500;
        }
        
        .success-actions {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .contact-info {
            padding-top: 30px;
            border-top: 2px solid #e9ecef;
            color: #7f8c8d;
        }
        
        .contact-info p {
            margin: 8px 0;
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .success-icon {
                font-size: 60px;
            }
            
            .success-content h2 {
                font-size: 24px;
            }
            
            .success-subtitle {
                font-size: 16px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .success-actions {
                flex-direction: column;
            }
            
            .success-actions .btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 폼을 성공 페이지로 교체
    applicationForm.parentElement.appendChild(successPage);
}

function getMemberTypeName(type) {
    const types = {
        'regular': '정회원',
        'associate': '준회원',
        'student': '학생회원',
        'corporate': '기업회원'
    };
    return types[type] || type;
}
