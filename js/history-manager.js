/**
 * 한국ESG학회 - 히스토리 관리
 * history-manager.js
 */

// 로컬 저장소 키
const STORAGE_KEYS = {
    SLIDES: 'esg_hero_slides',
    HISTORY: 'esg_main_history'
};

// 현재 선택된 버전
let selectedVersion = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('히스토리 관리 초기화 시작...');
    
    // 권한 체크
    checkAdminPermission();
    
    // 히스토리 로드
    loadHistory();
    
    // 이벤트 리스너 등록
    initEventListeners();
    
    console.log('히스토리 관리 초기화 완료!');
});

/**
 * 관리자 권한 체크
 */
function checkAdminPermission() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    if (!user.id) {
        alert('로그인이 필요합니다.');
        window.location.href = '../../index.html';
        return;
    }
    
    console.log('관리자 권한 확인됨:', user.name);
}

/**
 * 히스토리 로드
 */
function loadHistory() {
    try {
        const historyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{"versions": []}');
        
        console.log('히스토리 로드:', historyData.versions.length + '개 버전');
        
        if (historyData.versions.length === 0) {
            showEmptyHistory();
        } else {
            renderHistoryList(historyData.versions);
        }
        
    } catch (error) {
        console.error('히스토리 로드 오류:', error);
        alert('히스토리를 불러오는 중 오류가 발생했습니다.');
    }
}

/**
 * 빈 히스토리 표시
 */
function showEmptyHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = `
        <div class="empty-history">
            <i class="fas fa-inbox"></i>
            <p>저장된 히스토리가 없습니다.</p>
            <small>포스팅툴에서 변경사항을 저장하면 히스토리가 생성됩니다.</small>
        </div>
    `;
}

/**
 * 히스토리 목록 렌더링
 */
function renderHistoryList(versions) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    versions.forEach((version, index) => {
        const item = createHistoryItem(version, index);
        historyList.appendChild(item);
    });
}

/**
 * 히스토리 아이템 생성
 */
function createHistoryItem(version, index) {
    const item = document.createElement('div');
    item.className = 'history-item';
    
    if (version.isCurrent) {
        item.classList.add('current');
    }
    
    item.dataset.versionId = version.id;
    item.onclick = () => selectVersion(version);
    
    const timestamp = new Date(version.timestamp);
    const timeStr = formatTimestamp(timestamp);
    
    item.innerHTML = `
        <div class="history-header">
            <div class="history-title">
                ${version.isCurrent ? '<span class="current-badge">현재</span>' : `<span class="version-badge">v${version.version}</span>`}
                ${version.title}
            </div>
        </div>
        <div class="history-meta">
            <i class="fas fa-user"></i> ${version.authorName}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <i class="fas fa-clock"></i> ${timeStr}
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <i class="fas fa-images"></i> ${version.slides.length}개 슬라이드
        </div>
        ${version.description ? `<div class="history-description">${version.description}</div>` : ''}
    `;
    
    return item;
}

/**
 * 타임스탬프 포맷팅
 */
function formatTimestamp(date) {
    const now = new Date();
    const diff = now - date;
    
    // 1분 미만
    if (diff < 60 * 1000) {
        return '방금 전';
    }
    
    // 1시간 미만
    if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `${minutes}분 전`;
    }
    
    // 24시간 미만
    if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours}시간 전`;
    }
    
    // 7일 미만
    if (diff < 7 * 24 * 60 * 60 * 1000) {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        return `${days}일 전`;
    }
    
    // 그 외: 날짜 표시
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}.${month}.${day} ${hour}:${minute}`;
}

/**
 * 버전 선택
 */
function selectVersion(version) {
    selectedVersion = version;
    
    // 목록에서 active 표시
    document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.versionId === version.id) {
            item.classList.add('active');
        }
    });
    
    // 미리보기 렌더링
    renderPreview(version);
    
    console.log('버전 선택됨:', version.title);
}

/**
 * 미리보기 렌더링
 */
function renderPreview(version) {
    const previewContent = document.getElementById('previewContent');
    const previewActions = document.getElementById('previewActions');
    const previewHeaderText = document.getElementById('previewHeaderText');
    
    // 헤더 텍스트 업데이트
    previewHeaderText.textContent = `${version.title} - ${version.slides.length}개 슬라이드`;
    
    // 액션 버튼 표시
    previewActions.style.display = 'flex';
    
    // 현재 버전이면 적용 버튼 비활성화
    const applyBtn = document.getElementById('applyBtn');
    if (version.isCurrent) {
        applyBtn.disabled = true;
        applyBtn.innerHTML = '<i class="fas fa-check-circle"></i> 현재 적용 중';
        applyBtn.style.opacity = '0.6';
        applyBtn.style.cursor = 'not-allowed';
    } else {
        applyBtn.disabled = false;
        applyBtn.innerHTML = '<i class="fas fa-check-circle"></i> 이 버전 적용하기';
        applyBtn.style.opacity = '1';
        applyBtn.style.cursor = 'pointer';
    }
    
    // 슬라이드 미리보기 생성
    previewContent.innerHTML = '';
    
    version.slides.forEach((slide, index) => {
        const slidePreview = document.createElement('div');
        slidePreview.className = 'slide-preview';
        
        slidePreview.innerHTML = `
            <div class="slide-preview-header">
                <i class="fas fa-image"></i>
                슬라이드 ${index + 1}
            </div>
            <div class="slide-preview-body">
                ${slide.image ? 
                    `<div class="slide-preview-image"><img src="${slide.image}" alt="${slide.title}"></div>` :
                    `<div class="slide-preview-image"><i class="fas fa-image" style="font-size: 3rem;"></i></div>`
                }
                <div class="slide-preview-title">${slide.title}</div>
                <div class="slide-preview-description">${slide.description}</div>
                <a href="#" class="slide-preview-button">${slide.buttonText}</a>
            </div>
        `;
        
        previewContent.appendChild(slidePreview);
    });
}

/**
 * 이벤트 리스너 초기화
 */
function initEventListeners() {
    // 검색 입력
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // 적용 버튼
    const applyBtn = document.getElementById('applyBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyVersion);
    }
    
    // 수정 버튼
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.addEventListener('click', editVersion);
    }
    
    // 삭제 버튼
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteVersion);
    }
}

/**
 * 검색 처리
 */
function handleSearch(event) {
    const keyword = event.target.value.trim().toLowerCase();
    
    try {
        const historyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{"versions": []}');
        
        if (!keyword) {
            // 검색어가 없으면 전체 목록 표시
            renderHistoryList(historyData.versions);
            return;
        }
        
        // 검색어로 필터링
        const filtered = historyData.versions.filter(version => {
            const titleMatch = version.title.toLowerCase().includes(keyword);
            const descMatch = version.description?.toLowerCase().includes(keyword);
            const authorMatch = version.authorName.toLowerCase().includes(keyword);
            
            return titleMatch || descMatch || authorMatch;
        });
        
        if (filtered.length === 0) {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-search"></i>
                    <p>검색 결과가 없습니다.</p>
                    <small>"${keyword}"와 일치하는 버전이 없습니다.</small>
                </div>
            `;
        } else {
            renderHistoryList(filtered);
        }
        
        console.log('검색 완료:', filtered.length + '개 결과');
        
    } catch (error) {
        console.error('검색 오류:', error);
    }
}

/**
 * 버전 적용
 */
function applyVersion() {
    if (!selectedVersion) return;
    
    if (selectedVersion.isCurrent) {
        alert('이미 적용된 버전입니다.');
        return;
    }
    
    const confirmMsg = `"${selectedVersion.title}" 버전을 메인페이지에 적용하시겠습니까?\n\n현재 메인페이지가 이 버전으로 즉시 변경됩니다.`;
    
    if (!confirm(confirmMsg)) return;
    
    // 적용 버튼 로딩 상태
    const applyBtn = document.getElementById('applyBtn');
    const originalHtml = applyBtn.innerHTML;
    applyBtn.innerHTML = '<div class="spinner"></div> 적용 중...';
    applyBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // 1. 히스토리 데이터 로드
            const historyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{"versions": []}');
            
            // 2. 모든 버전의 isCurrent를 false로 변경
            historyData.versions.forEach(v => v.isCurrent = false);
            
            // 3. 선택된 버전을 current로 설정
            const targetVersion = historyData.versions.find(v => v.id === selectedVersion.id);
            if (targetVersion) {
                targetVersion.isCurrent = true;
                
                // 4. 슬라이드 데이터 업데이트
                localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(targetVersion.slides));
                
                // 5. 히스토리 저장
                localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyData));
                
                // 6. 성공 메시지
                alert('✅ 버전 적용 완료!\n\n메인페이지가 즉시 업데이트되었습니다.');
                
                // 7. 페이지 새로고침
                window.location.reload();
                
                console.log('버전 적용 완료:', selectedVersion.title);
            }
            
        } catch (error) {
            console.error('버전 적용 오류:', error);
            alert('버전 적용 중 오류가 발생했습니다.');
            applyBtn.innerHTML = originalHtml;
            applyBtn.disabled = false;
        }
    }, 800);
}

/**
 * 버전 수정
 */
function editVersion() {
    if (!selectedVersion) return;
    
    // 포스팅툴로 이동하면서 해당 버전 데이터를 로드
    // (포스팅툴에서 자동으로 현재 슬라이드를 로드하므로, 먼저 적용 후 이동)
    
    if (!selectedVersion.isCurrent) {
        const confirmMsg = `수정하려면 먼저 이 버전을 적용해야 합니다.\n\n"${selectedVersion.title}" 버전을 적용하고 포스팅툴로 이동하시겠습니까?`;
        
        if (confirm(confirmMsg)) {
            // 버전 적용
            const historyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{"versions": []}');
            historyData.versions.forEach(v => v.isCurrent = false);
            
            const targetVersion = historyData.versions.find(v => v.id === selectedVersion.id);
            if (targetVersion) {
                targetVersion.isCurrent = true;
                localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(targetVersion.slides));
                localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyData));
            }
        } else {
            return;
        }
    }
    
    // 포스팅툴로 이동
    window.location.href = 'posting-tool.html';
}

/**
 * 버전 삭제
 */
function deleteVersion() {
    if (!selectedVersion) return;
    
    if (selectedVersion.isCurrent) {
        alert('현재 적용 중인 버전은 삭제할 수 없습니다.\n\n다른 버전을 적용한 후 삭제해주세요.');
        return;
    }
    
    const confirmMsg = `정말로 "${selectedVersion.title}" 버전을 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`;
    
    if (!confirm(confirmMsg)) return;
    
    // 삭제 버튼 로딩 상태
    const deleteBtn = document.getElementById('deleteBtn');
    const originalHtml = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<div class="spinner"></div> 삭제 중...';
    deleteBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // 히스토리 데이터 로드
            const historyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{"versions": []}');
            
            // 선택된 버전 제거
            historyData.versions = historyData.versions.filter(v => v.id !== selectedVersion.id);
            
            // 히스토리 저장
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyData));
            
            // 성공 메시지
            alert('✅ 버전이 삭제되었습니다.');
            
            // 선택 초기화 및 페이지 새로고침
            selectedVersion = null;
            window.location.reload();
            
            console.log('버전 삭제 완료');
            
        } catch (error) {
            console.error('버전 삭제 오류:', error);
            alert('버전 삭제 중 오류가 발생했습니다.');
            deleteBtn.innerHTML = originalHtml;
            deleteBtn.disabled = false;
        }
    }, 600);
}

console.log('히스토리 관리 JavaScript 로드 완료!');
