/**
 * 한국ESG학회 - 파트너사 로고 슬라이더
 * 무한 스크롤 애니메이션
 */

// 파트너사 로고 슬라이더 초기화
async function initPartnersSlider() {
    const container = document.getElementById('partnersList');
    if (!container) {
        console.warn('⚠️ 파트너사 슬라이더 컨테이너를 찾을 수 없습니다');
        return;
    }

    try {
        // API에서 파트너사 데이터 가져오기
        const response = await fetch('tables/partners?sort=display_order&limit=100');
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            console.warn('⚠️ 파트너사 데이터가 없습니다');
            container.innerHTML = '<p style="text-align: center; color: #999;">등록된 협력기관이 없습니다.</p>';
            return;
        }

        const partners = data.data;
        console.log(`✅ 파트너사 ${partners.length}개 로드됨`);

        // 파트너사 HTML 생성
        const partnersHTML = partners.map(partner => `
            <a href="${partner.url || '#'}" 
               class="partner-item" 
               target="_blank" 
               rel="noopener noreferrer"
               title="${partner.name}">
                <img src="${partner.logo}" 
                     alt="${partner.name}" 
                     class="partner-logo"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2250%22%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3E${partner.name}%3C/text%3E%3C/svg%3E'">
            </a>
        `).join('');

        // 무한 스크롤을 위해 같은 내용을 2번 반복
        container.innerHTML = partnersHTML + partnersHTML;

        console.log('🎉 파트너사 슬라이더 초기화 완료!');

    } catch (error) {
        console.error('❌ 파트너사 로드 실패:', error);
        container.innerHTML = '<p style="text-align: center; color: #ff6b6b;">협력기관을 불러오는데 실패했습니다.</p>';
    }
}

// DOM 로드 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPartnersSlider);
} else {
    initPartnersSlider();
}
