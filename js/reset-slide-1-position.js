/**
 * 1번 슬라이드 위치 완전 초기화
 */
(function() {
    const FLAG_KEY = 'slide_1_reset_final_1200';
    
    // 이미 실행했으면 종료
    if (sessionStorage.getItem(FLAG_KEY)) {
        console.log('✅ 초기화 완료 (스킵)');
        return;
    }
    
    console.log('🔄 1번 슬라이드 완전 초기화...');
    
    try {
        const slides = JSON.parse(localStorage.getItem('esg_hero_slides') || '[]');
        
        const slide1 = slides.find(s => s.id === 'slide_001');
        
        if (slide1) {
            console.log('📌 수정 전:', slide1.imageTransform);
            
            // 완전 제거
            delete slide1.imageTransform;
            
            if (!slide1.maskOpacity) {
                slide1.maskOpacity = 40;
            }
            
            localStorage.setItem('esg_hero_slides', JSON.stringify(slides));
            
            console.log('✅ 초기화 완료 (중앙 정렬)');
            
            sessionStorage.setItem(FLAG_KEY, 'true');
            
            setTimeout(() => location.reload(), 2000);
        }
        
    } catch (error) {
        console.error('❌ 오류:', error);
    }
})();
