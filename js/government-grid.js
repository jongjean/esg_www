/**
 * 한국ESG학회 - 정부기관 로고 그리드
 */

// 정부기관 로고 그리드 초기화
async function initGovernmentGrid() {
    const container = document.getElementById('governmentGrid');
    if (!container) {
        console.warn('⚠️ 정부기관 그리드 컨테이너를 찾을 수 없습니다');
        return;
    }

    try {
        // API에서 정부기관 데이터 가져오기
        const response = await fetch('tables/government?sort=display_order&limit=100');
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            console.warn('⚠️ 유관기관 데이터가 없습니다');
            container.innerHTML = '<p style="text-align: center; color: #999;">등록된 유관기관이 없습니다.</p>';
            return;
        }

        const governments = data.data;
        console.log(`✅ 유관기관 ${governments.length}개 로드됨`);

        // 정부기관 HTML 생성 - CI 이미지 표시
        container.innerHTML = governments.map((gov, index) => {
            return `
            <a href="${gov.url || '#'}" 
               class="government-item" 
               target="_blank" 
               rel="noopener noreferrer"
               title="${gov.name}">
                <img src="${gov.logo}" 
                     alt="${gov.name}" 
                     class="government-logo"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;background: #999; color: white; width: 65px; height: 65px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; border-radius: 8px;&quot;>${gov.name.substring(0, 3)}</div>';">
            </a>
        `}).join('');

        console.log('🎉 유관기관 그리드 초기화 완료!');

    } catch (error) {
        console.error('❌ 유관기관 로드 실패:', error);
        container.innerHTML = '<p style="text-align: center; color: #ff6b6b;">유관기관을 불러오는데 실패했습니다.</p>';
    }
}

// DOM 로드 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGovernmentGrid);
} else {
    initGovernmentGrid();
}
