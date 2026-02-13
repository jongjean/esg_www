/**
 * 공통 모달 시스템
 * alert() 대체용 커스텀 모달
 */

// 모달 HTML 생성 및 DOM에 추가
function initCustomModal() {
    if (document.getElementById('customModalOverlay')) return;
    
    const modalHTML = `
        <div id="customModalOverlay" class="custom-modal-overlay">
            <div class="custom-modal">
                <div class="custom-modal-header">
                    <div class="custom-modal-icon" id="modalIcon">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3 class="custom-modal-title" id="modalTitle">알림</h3>
                </div>
                <div class="custom-modal-body" id="modalBody">
                    메시지가 여기에 표시됩니다.
                </div>
                <div class="custom-modal-footer">
                    <button class="custom-modal-btn custom-modal-btn-primary" id="modalConfirmBtn">
                        확인
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 이벤트 리스너
    const overlay = document.getElementById('customModalOverlay');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    
    confirmBtn.addEventListener('click', closeCustomModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeCustomModal();
        }
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeCustomModal();
        }
    });
}

// 모달 열기
function showCustomModal(message, type = 'info', title = null) {
    initCustomModal();
    
    const overlay = document.getElementById('customModalOverlay');
    const icon = document.getElementById('modalIcon');
    const titleEl = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    // 아이콘 및 타입 설정
    icon.className = 'custom-modal-icon ' + type;
    
    const icons = {
        success: 'fa-check',
        error: 'fa-times',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const titles = {
        success: '성공',
        error: '오류',
        warning: '경고',
        info: '알림'
    };
    
    icon.querySelector('i').className = 'fas ' + (icons[type] || icons.info);
    titleEl.textContent = title || titles[type] || titles.info;
    
    // 메시지 내용 (줄바꿈 처리)
    body.innerHTML = message.replace(/\n/g, '<br>');
    
    // 모달 표시
    overlay.classList.add('active');
    
    // body 스크롤 막기
    document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeCustomModal() {
    const overlay = document.getElementById('customModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// alert 함수 오버라이드 (선택적)
function replaceAlert() {
    window.originalAlert = window.alert;
    window.alert = function(message) {
        showCustomModal(message, 'info');
    };
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomModal);
} else {
    initCustomModal();
}

// 전역 함수로 내보내기
window.showCustomModal = showCustomModal;
window.closeCustomModal = closeCustomModal;
window.replaceAlert = replaceAlert;
