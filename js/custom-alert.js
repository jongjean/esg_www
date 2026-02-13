/**
 * 커스텀 알림 모달 (브라우저 중앙 표시)
 * 
 * 사용법:
 * showCustomAlert('제목', '메시지');
 * showCustomAlert('⚠️ 경고', '내용을 입력해주세요.');
 */

function showCustomAlert(title, message, callback) {
    // message가 함수면 callback으로 처리 (title만 있는 경우)
    if (typeof message === 'function') {
        callback = message;
        message = title;
        title = '알림';
    }
    
    // 기존 알림 제거
    const existing = document.getElementById('customAlertModal');
    if (existing) {
        existing.remove();
    }
    
    // 새 알림 생성
    const modal = document.createElement('div');
    modal.id = 'customAlertModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 12000;
        animation: fadeIn 0.3s ease-in-out;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px 50px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 450px;
            animation: slideDown 0.3s ease-out;
        ">
            <div style="
                width: 70px;
                height: 70px;
                margin: 0 auto 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <i class="fas fa-info-circle" style="font-size: 2.5rem; color: white;"></i>
            </div>
            <h3 style="
                font-size: 1.6rem;
                color: #2d3748;
                margin: 0 0 15px 0;
                font-weight: 700;
            ">${title}</h3>
            <p style="
                font-size: 1.1rem;
                color: #4a5568;
                margin: 0 0 25px 0;
                line-height: 1.6;
            ">${message || ''}</p>
            <button id="customAlertBtn" style="
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 12px 40px;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            ">확인</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 확인 버튼 클릭 이벤트
    const btn = document.getElementById('customAlertBtn');
    btn.addEventListener('click', () => {
        modal.remove();
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
    
    // 배경 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    });
}

// 전역 함수로 노출
window.showCustomAlert = showCustomAlert;
