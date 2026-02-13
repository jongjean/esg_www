/**
 * 🔧 모든 슬라이드 위치 초기화
 * 
 * 용도: 모든 슬라이드의 imageTransform을 제거하여 중앙 정렬
 * 실행: 페이지 로드 시 1회 자동 실행
 */

(function resetAllSlidesPosition() {
    console.log('🔄 모든 슬라이드 위치 초기화 시작...');
    
    // 이미 초기화했는지 체크
    const resetFlag = sessionStorage.getItem('all_slides_reset_done');
    if (resetFlag) {
        console.log('✅ 모든 슬라이드 이미 초기화됨 (스킵)');
        return;
    }
    
    try {
        // 현재 슬라이드 데이터 로드
        const slidesData = localStorage.getItem('esg_hero_slides');
        if (!slidesData) {
            console.log('⚠️ 슬라이드 데이터 없음');
            return;
        }
        
        const slides = JSON.parse(slidesData);
        console.log('📊 현재 슬라이드 개수:', slides.length);
        
        let modified = false;
        
        // 모든 슬라이드 확인
        slides.forEach((slide, index) => {
            console.log(`\n📋 슬라이드 ${index + 1} (${slide.id}):`);
            
            if (slide.imageTransform) {
                console.log('  - 수정 전 imageTransform:', slide.imageTransform);
                
                // imageTransform 제거
                delete slide.imageTransform;
                modified = true;
                
                console.log('  - 수정 후: imageTransform 제거됨 ✅');
            } else {
                console.log('  - imageTransform 없음 (이미 중앙 정렬)');
            }
            
            // maskOpacity 확인 및 기본값 설정
            if (!slide.maskOpacity) {
                slide.maskOpacity = 40;
                console.log('  - maskOpacity 기본값 설정: 40');
            } else {
                console.log('  - maskOpacity:', slide.maskOpacity);
            }
        });
        
        if (modified) {
            // 저장
            localStorage.setItem('esg_hero_slides', JSON.stringify(slides));
            console.log('\n✅ 모든 슬라이드 위치 초기화 완료!');
            
            // 플래그 설정
            sessionStorage.setItem('all_slides_reset_done', 'true');
            
            // 페이지 새로고침
            console.log('🔄 3초 후 페이지 새로고침...');
            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            console.log('\n✅ 수정할 내용 없음 - 모든 슬라이드 정상');
            sessionStorage.setItem('all_slides_reset_done', 'true');
        }
        
    } catch (error) {
        console.error('❌ 슬라이드 초기화 오류:', error);
    }
})();
