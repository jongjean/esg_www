/**
 * 한국ESG학회 - 슬라이드 유틸리티
 * 프레임 표준화, 변환, 저장소, 렌더링 통합
 */

// ========================================
// 1. 프레임 설정 (메인 기준)
// ========================================
const FRAME_CONFIG = {
    // 메인 슬라이드 높이 (고정)
    MAIN_HEIGHT_MOBILE: 500,   // < 1920px
    MAIN_HEIGHT_FHD: 600,      // ≥ 1920px
    
    // 편집 모달 크기 (포스팅 툴 컨테이너와 동일)
    EDITOR_WIDTH: 1200,   // 포스팅 컨테이너 max-width와 동일
    EDITOR_HEIGHT: 300,   // 포스팅 카드 이미지 높이와 동일
    
    /**
     * 현재 화면의 메인 슬라이드 높이
     */
    getMainHeight() {
        return window.innerWidth >= 1920 
            ? this.MAIN_HEIGHT_FHD 
            : this.MAIN_HEIGHT_MOBILE;
    },
    
    /**
     * 편집 모달 높이 (포스팅 툴 카드와 동일)
     */
    getEditorHeight() {
        return this.EDITOR_HEIGHT;  // 고정 300px
    },
    
    /**
     * 현재 화면 비율
     */
    getCurrentRatio() {
        const screenWidth = window.innerWidth;
        const mainHeight = this.getMainHeight();
        return screenWidth / mainHeight;
    }
};

// ========================================
// 2. 이미지 변환 유틸리티
// ========================================
const ImageTransformUtils = {
    /**
     * 픽셀 → 퍼센트 변환
     */
    pixelToPercent(pixelValue, frameSize) {
        return (pixelValue / frameSize) * 100;
    },
    
    /**
     * 편집 모달 픽셀 → localStorage 퍼센트
     */
    editorToStorage(editorState) {
        const editorWidth = FRAME_CONFIG.EDITOR_WIDTH;
        const editorHeight = FRAME_CONFIG.getEditorHeight();
        
        return {
            zoom: editorState.zoom,
            positionX: this.pixelToPercent(editorState.positionX, editorWidth),
            positionY: this.pixelToPercent(editorState.positionY, editorHeight)
        };
    },
    
    /**
     * localStorage 퍼센트 → CSS 값
     */
    storageToCSS(imageTransform, maskOpacity) {
        if (!imageTransform) {
            return {
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                maskOpacity: maskOpacity !== undefined ? maskOpacity / 100 : 0.4
            };
        }
        
        // 중앙(50%) 기준 계산 (원래대로)
        const posX = 50 + imageTransform.positionX;
        const posY = 50 + imageTransform.positionY;
        
        return {
            backgroundSize: `${imageTransform.zoom}%`,
            backgroundPosition: `${posX}% ${posY}%`,
            maskOpacity: maskOpacity !== undefined ? maskOpacity / 100 : 0.4
        };
    },
    
    /**
     * CSS 적용 (DOM 조작)
     */
    applyToElement(element, imageUrl, imageTransform, maskOpacity) {
        if (!element || !imageUrl) {
            console.error('❌ applyToElement: 요소 또는 이미지 URL 없음');
            return;
        }
        
        const css = this.storageToCSS(imageTransform, maskOpacity);
        
        // 마스크 + 이미지
        element.style.backgroundImage = 
            `linear-gradient(rgba(0, 0, 0, ${css.maskOpacity}), rgba(0, 0, 0, ${css.maskOpacity})), url('${imageUrl}')`;
        
        element.style.backgroundSize = css.backgroundSize;
        element.style.backgroundPosition = css.backgroundPosition;
        element.style.backgroundRepeat = 'no-repeat';
        
        console.log(`✅ CSS 적용: size=${css.backgroundSize}, pos=${css.backgroundPosition}, mask=${Math.round(css.maskOpacity * 100)}%`);
    }
};

// ========================================
// 3. 검증 시스템
// ========================================
const Validator = {
    /**
     * imageTransform 검증
     */
    validateImageTransform(transform) {
        if (!transform) return true;  // null 허용
        
        const errors = [];
        
        if (typeof transform.zoom !== 'number' || transform.zoom < 10 || transform.zoom > 500) {
            errors.push('zoom은 10~500 사이여야 함');
        }
        
        if (typeof transform.positionX !== 'number' || Math.abs(transform.positionX) > 100) {
            errors.push('positionX는 -100~100 사이여야 함');
        }
        
        if (typeof transform.positionY !== 'number' || Math.abs(transform.positionY) > 100) {
            errors.push('positionY는 -100~100 사이여야 함');
        }
        
        if (errors.length > 0) {
            console.error('❌ imageTransform 검증 실패:', errors);
            return false;
        }
        
        return true;
    },
    
    /**
     * maskOpacity 검증
     */
    validateMaskOpacity(opacity) {
        if (opacity === undefined || opacity === null) return true;
        
        if (typeof opacity !== 'number' || opacity < 0 || opacity > 100) {
            console.error('❌ maskOpacity는 0~100 사이여야 함');
            return false;
        }
        
        return true;
    }
};

// ========================================
// 4. 슬라이드 데이터 클래스
// ========================================
class SlideData {
    constructor(data) {
        this.id = data.id;
        this.order = data.order;
        this.image = data.image;
        this.title = data.title || '';
        this.description = data.description || '';
        this.buttonText = data.buttonText || '자세히 보기';
        this.buttonLink = data.buttonLink || '#';
        this.imageTransform = data.imageTransform || null;
        this.maskOpacity = data.maskOpacity !== undefined ? data.maskOpacity : 40;
    }
    
    isValid() {
        // 🔥 ID만 있으면 유효 (이미지는 선택사항)
        return !!this.id;
    }
    
    toJSON() {
        return {
            id: this.id,
            order: this.order,
            image: this.image,
            title: this.title,
            description: this.description,
            buttonText: this.buttonText,
            buttonLink: this.buttonLink,
            imageTransform: this.imageTransform,
            maskOpacity: this.maskOpacity
        };
    }
}

// ========================================
// 5. localStorage 저장소
// ========================================
const SlideStorage = {
    STORAGE_KEY: 'esg_hero_slides',
    
    /**
     * 모든 슬라이드 읽기
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return [];
            
            const parsed = JSON.parse(data);
            return parsed.map(item => new SlideData(item));
        } catch (error) {
            console.error('❌ 슬라이드 읽기 오류:', error);
            return [];
        }
    },
    
    /**
     * 특정 슬라이드 읽기
     */
    getById(slideId) {
        const slides = this.getAll();
        return slides.find(s => s.id === slideId) || null;
    },
    
    /**
     * 슬라이드 업데이트
     */
    update(slideId, updates) {
        const slides = this.getAll();
        const index = slides.findIndex(s => s.id === slideId);
        
        if (index === -1) {
            console.error('❌ 슬라이드를 찾을 수 없음:', slideId);
            return false;
        }
        
        // 업데이트 적용
        Object.assign(slides[index], updates);
        
        // 저장
        return this.saveAll(slides);
    },
    
    /**
     * 모든 슬라이드 저장
     */
    saveAll(slides) {
        try {
            const validSlides = slides.filter(s => s.isValid());
            
            if (validSlides.length !== slides.length) {
                console.warn('⚠️ 일부 슬라이드가 유효하지 않아 제외됨');
            }
            
            validSlides.sort((a, b) => a.order - b.order);
            
            const json = JSON.stringify(validSlides.map(s => s.toJSON()));
            localStorage.setItem(this.STORAGE_KEY, json);
            
            console.log('✅ localStorage 저장 완료:', validSlides.length, '개');
            return true;
        } catch (error) {
            console.error('❌ localStorage 저장 오류:', error);
            return false;
        }
    },
    
    /**
     * 이미지 변형 업데이트 (전용 메서드)
     */
    updateImageTransform(slideId, imageTransform, maskOpacity) {
        // 검증
        if (!Validator.validateImageTransform(imageTransform)) {
            return false;
        }
        
        if (!Validator.validateMaskOpacity(maskOpacity)) {
            return false;
        }
        
        // 업데이트
        return this.update(slideId, {
            imageTransform: imageTransform,
            maskOpacity: maskOpacity
        });
    }
};

// ========================================
// 6. 슬라이드 렌더러
// ========================================
const SlideRenderer = {
    /**
     * 이미지 프리뷰 렌더링 (공통)
     */
    renderImagePreview(element, slide) {
        if (!element || !slide || !slide.image) {
            console.error('❌ 렌더링 실패: 요소 또는 이미지 없음');
            return;
        }
        
        ImageTransformUtils.applyToElement(
            element,
            slide.image,
            slide.imageTransform,
            slide.maskOpacity
        );
        
        console.log(`✅ 슬라이드 렌더링: ${slide.id} (${slide.title})`);
    },
    
    /**
     * 메인 슬라이드 렌더링
     */
    renderMainSlide(container, slide, isActive = false) {
        const slideElement = document.createElement('div');
        slideElement.className = 'slide' + (isActive ? ' active' : '');
        
        // 이미지 적용
        this.renderImagePreview(slideElement, slide);
        
        // 콘텐츠 추가
        slideElement.innerHTML = `
            <div class="slide-content">
                <h1 class="slide-title">${slide.title}</h1>
                <p class="slide-text">${slide.description}</p>
            </div>
            <a href="${slide.buttonLink}" class="slide-btn">${slide.buttonText}</a>
        `;
        
        container.appendChild(slideElement);
    }
};

// ========================================
// 7. 이벤트 시스템
// ========================================
const SlideEvents = {
    /**
     * 슬라이드 업데이트 이벤트 발생
     */
    emitUpdate(slideId) {
        const event = new CustomEvent('slide:updated', {
            detail: { slideId }
        });
        window.dispatchEvent(event);
        console.log('📢 이벤트 발생: slide:updated', slideId);
    },
    
    /**
     * 슬라이드 업데이트 리스너 등록
     */
    onUpdate(callback) {
        window.addEventListener('slide:updated', (e) => {
            callback(e.detail.slideId);
        });
    }
};

console.log('✅ slide-utils.js 로드 완료');
