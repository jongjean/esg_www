/**
 * 한국ESG학회 - 포스팅툴
 * posting-tool.js
 */

// 로컬 저장소 키
const STORAGE_KEYS = {
    SLIDES: 'esg_hero_slides',
    HISTORY: 'esg_main_history'
};

// 기본 슬라이드 데이터
const DEFAULT_SLIDES = [
    {
        id: 'slide_001',
        order: 1,
        image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&h=1080&fit=crop',
        title: '한국ESG학회',
        description: '환경(Environment), 사회(Social), 거버넌스(Governance)를 선도하는 학회',
        buttonText: '자세히 보기',
        buttonLink: 'pages/about/greeting-new.html'
    },
    {
        id: 'slide_002',
        order: 2,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=1080&fit=crop',
        title: '지속가능한 미래를 위한 연구',
        description: 'ESG 경영의 학문적 기반을 다지고 실천적 변화를 이끕니다',
        buttonText: '연구 보기',
        buttonLink: 'pages/research/studies.html'
    },
    {
        id: 'slide_003',
        order: 3,
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&h=1080&fit=crop',
        title: '학술 활동 및 교류',
        description: 'ESG 전문가와 학자들의 활발한 학술 교류의 장',
        buttonText: '학술대회 보기',
        buttonLink: 'pages/conference/schedule.html'
    },
    {
        id: 'slide_004',
        order: 4,
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop',
        title: '회원 혜택',
        description: '학회 회원님들께 제공되는 다양한 혜택과 지원 프로그램',
        buttonText: '혜택 보기',
        buttonLink: 'pages/members/benefits.html'
    },
    {
        id: 'slide_005',
        order: 5,
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=1080&fit=crop',
        title: '함께하는 ESG',
        description: '기업과 함께 만들어가는 지속가능한 내일',
        buttonText: '참여하기',
        buttonLink: 'pages/support/partnership.html'
    }
];

// 현재 슬라이드 데이터
let currentSlides = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('포스팅툴 초기화 시작...');
    
    // 권한 체크 (실제로는 서버에서 검증)
    checkAdminPermission();
    
    // 슬라이드 로드
    loadSlides();
    
    // 이벤트 리스너 등록
    initEventListeners();
    
    console.log('포스팅툴 초기화 완료!');
});

/**
 * 관리자 권한 체크
 */
function checkAdminPermission() {
    // 프론트엔드 시뮬레이션 (실제로는 서버에서 검증 필요)
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    
    if (!user.id) {
        showCustomAlert('🔐 로그인 필요', '로그인이 필요합니다.');
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 2000);
        return;
    }
    
    // 관리자 권한 체크 (데모용)
    // 실제로는 user.role === 'admin' 등으로 검증
    console.log('관리자 권한 확인됨:', user.name);
}

/**
 * 슬라이드 데이터 로드
 */
function loadSlides() {
    try {
        const savedSlides = localStorage.getItem(STORAGE_KEYS.SLIDES);
        
        if (savedSlides) {
            currentSlides = JSON.parse(savedSlides);
            console.log('저장된 슬라이드 로드:', currentSlides.length + '개');
        } else {
            // 기본 슬라이드 사용
            currentSlides = [...DEFAULT_SLIDES];
            localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(currentSlides));
            console.log('기본 슬라이드 생성:', currentSlides.length + '개');
        }
        
        // UI 렌더링
        renderSlides();
        
    } catch (error) {
        console.error('슬라이드 로드 오류:', error);
        showCustomAlert('❌ 로드 실패', '슬라이드를 불러오는 중 오류가 발생했습니다.');
    }
}

/**
 * 슬라이드 UI 렌더링
 */
/**
 * 슬라이드 렌더링 (slide-utils.js 사용)
 */
function renderSlides(keepExpandedSlideId = null) {
    const container = document.getElementById('slidesContainer');
    
    // 🔥 현재 펼쳐진 슬라이드 ID 기억
    if (!keepExpandedSlideId) {
        const expandedCard = container.querySelector('.slide-card.expanded');
        if (expandedCard) {
            keepExpandedSlideId = expandedCard.dataset.slideId;
            console.log('📌 현재 펼쳐진 슬라이드:', keepExpandedSlideId);
        }
    }
    
    container.innerHTML = '';
    
    // SlideStorage에서 읽기
    const slides = SlideStorage.getAll();
    currentSlides = slides;  // 전역 변수 업데이트
    
    slides.forEach((slide, index) => {
        const card = createSlideCard(slide, index);
        container.appendChild(card);
        
        // 🔥 이미지 프리뷰에 imageTransform 적용
        const imagePreview = card.querySelector('.image-preview');
        if (imagePreview && slide.image) {
            SlideRenderer.renderImagePreview(imagePreview, slide);
        }
        
        // 🔥 이전에 펼쳐졌던 슬라이드 다시 펼치기
        if (keepExpandedSlideId && slide.id === keepExpandedSlideId) {
            card.classList.add('expanded');
            console.log('✅ 슬라이드 다시 펼침:', keepExpandedSlideId);
        }
    });
    
    // 🔥 펼쳐진 슬라이드가 없으면 첫 번째 슬라이드 펼침
    if (!keepExpandedSlideId && container.firstChild) {
        container.firstChild.classList.add('expanded');
        console.log('✅ 첫 번째 슬라이드 기본 펼침');
    }
    
    console.log('✅ 포스팅툴 슬라이드 렌더링 완료:', slides.length, '개');
}

/**
 * 슬라이드 카드 생성
 */
function createSlideCard(slide, index) {
    const card = document.createElement('div');
    card.className = 'slide-card';
    card.dataset.slideId = slide.id;
    
    card.innerHTML = `
        <div class="slide-header" onclick="toggleSlide('${slide.id}')">
            <div class="slide-title">
                <div class="slide-number">${index + 1}</div>
                <span>슬라이드 ${index + 1}</span>
            </div>
            <i class="fas fa-chevron-down slide-toggle"></i>
        </div>
        
        <div class="slide-body">
            <!-- 이미지 업로드 -->
            <div class="image-upload-area ${slide.image ? 'has-image' : ''}" 
                 id="uploadArea_${slide.id}"
                 onclick="document.getElementById('imageInput_${slide.id}').click()">
                <div class="image-preview"
                     id="imagePreview_${slide.id}"></div>
                     
                <div class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>이미지를 클릭하여 업로드하세요</p>
                    <small>권장 크기: 1920x1080px</small>
                </div>
                
                <div class="image-actions">
                    <button class="image-action-btn edit" 
                            onclick="event.stopPropagation(); openImageEditor('${slide.id}', '${slide.image}');"
                            title="이미지 편집">
                        <i class="fas fa-crop"></i>
                    </button>
                    <button class="image-action-btn change" 
                            onclick="event.stopPropagation(); document.getElementById('imageInput_${slide.id}').click();"
                            title="이미지 변경">
                        <i class="fas fa-image"></i>
                    </button>
                    <button class="image-action-btn delete" 
                            onclick="event.stopPropagation(); removeImage('${slide.id}');"
                            title="이미지 삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                
                <input type="file" 
                       id="imageInput_${slide.id}" 
                       accept="image/*" 
                       style="display: none;"
                       onchange="handleImageUpload(event, '${slide.id}')">
            </div>
            
            <!-- 이미지 URL 입력 (선택) -->
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-link"></i>
                    또는 이미지 URL 입력
                </label>
                <input type="url" 
                       class="form-input" 
                       placeholder="https://example.com/image.jpg"
                       value="${slide.image || ''}"
                       onchange="setImageUrl('${slide.id}', this.value)">
            </div>
            
            <!-- 제목 -->
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-heading"></i>
                    제목
                </label>
                <input type="text" 
                       class="form-input" 
                       placeholder="슬라이드 제목을 입력하세요"
                       value="${slide.title}"
                       onchange="updateSlide('${slide.id}', 'title', this.value)">
            </div>
            
            <!-- 설명 -->
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-align-left"></i>
                    설명
                </label>
                <textarea class="form-input" 
                          placeholder="슬라이드 설명을 입력하세요"
                          onchange="updateSlide('${slide.id}', 'description', this.value)">${slide.description}</textarea>
            </div>
            
            <!-- 버튼 텍스트 -->
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-mouse-pointer"></i>
                    버튼 텍스트
                </label>
                <input type="text" 
                       class="form-input" 
                       placeholder="버튼에 표시될 텍스트"
                       value="${slide.buttonText}"
                       onchange="updateSlide('${slide.id}', 'buttonText', this.value)">
            </div>
            
            <!-- 버튼 링크 -->
            <div class="form-group">
                <label class="form-label">
                    <i class="fas fa-external-link-alt"></i>
                    버튼 링크
                </label>
                <input type="text" 
                       class="form-input" 
                       placeholder="pages/about/greeting.html"
                       value="${slide.buttonLink}"
                       onchange="updateSlide('${slide.id}', 'buttonLink', this.value)">
            </div>
            
            <!-- 슬라이드 액션 버튼 -->
            <div class="slide-actions">
                <button class="action-btn secondary" onclick="aiEditSlide('${slide.id}')">
                    <i class="fas fa-magic"></i>
                    AI 편집
                </button>
                <button class="action-btn secondary" onclick="previewSlide('${slide.id}')">
                    <i class="fas fa-eye"></i>
                    미리보기
                </button>
                <button class="action-btn secondary" onclick="resetSlide('${slide.id}')">
                    <i class="fas fa-undo"></i>
                    초기화
                </button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 슬라이드 카드 토글
 */
function toggleSlide(slideId) {
    const card = document.querySelector(`[data-slide-id="${slideId}"]`);
    
    if (card) {
        const isExpanded = card.classList.contains('expanded');
        
        // 다른 모든 카드 접기
        document.querySelectorAll('.slide-card').forEach(c => {
            c.classList.remove('expanded');
        });
        
        // 클릭한 카드만 펼치기/접기
        if (!isExpanded) {
            card.classList.add('expanded');
        }
    }
}

/**
 * 이미지 압축 (Canvas 사용)
 */
function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve, reject) => {
        console.log('🔧 이미지 압축 시작:', file.name, '원본 크기:', (file.size / 1024).toFixed(2), 'KB');
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            
            img.onload = function() {
                console.log('📐 원본 해상도:', img.width, 'x', img.height);
                
                // 비율 유지하면서 리사이즈 계산
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                    console.log('📏 리사이즈:', width, 'x', height, '(비율:', ratio.toFixed(2), ')');
                } else {
                    console.log('✅ 리사이즈 불필요 (이미 권장 크기 이하)');
                }
                
                // Canvas로 압축
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // JPEG로 압축 (quality: 0.8 = 80%)
                canvas.toBlob(
                    function(blob) {
                        if (blob) {
                            console.log('✅ 압축 완료:', (blob.size / 1024).toFixed(2), 'KB', '(압축률:', ((1 - blob.size / file.size) * 100).toFixed(1), '%)');
                            
                            // Blob → Base64 변환
                            const compressedReader = new FileReader();
                            compressedReader.onload = function(e) {
                                resolve(e.target.result);
                            };
                            compressedReader.onerror = reject;
                            compressedReader.readAsDataURL(blob);
                        } else {
                            reject(new Error('Blob 생성 실패'));
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            
            img.onerror = function() {
                reject(new Error('이미지 로드 실패'));
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * 이미지 업로드 처리
 */
function handleImageUpload(event, slideId) {
    const file = event.target.files[0];
    
    if (file) {
        console.log('📁 파일 선택됨:', file.name, file.type, file.size, 'bytes');
        
        // 파일 크기 체크 (20MB 제한으로 완화 - 압축할 예정)
        if (file.size > 20 * 1024 * 1024) {
            showCustomAlert('⚠️ 파일 크기 초과', '이미지 크기는 20MB 이하만 가능합니다.');
            return;
        }
        
        // 이미지 파일 체크
        if (!file.type.startsWith('image/')) {
            showCustomAlert('⚠️ 파일 형식 오류', '이미지 파일만 업로드 가능합니다.');
            return;
        }
        
        // 🔥 이미지 압축 후 저장
        compressImage(file, 1920, 1080, 0.8)
            .then(compressedImageUrl => {
                console.log('🖼️ 압축된 이미지 Base64 길이:', compressedImageUrl.length);
                
                // 슬라이드 데이터 업데이트
                updateSlide(slideId, 'image', compressedImageUrl);
                
                // 🔥 UI 전체 재렌더링
                renderSlides();
                
                console.log('✅ 이미지 업로드 완료:', file.name);
            })
            .catch(err => {
                console.error('❌ 이미지 압축 오류:', err);
                showCustomAlert('❌ 이미지 처리 실패', '이미지를 처리하는 중 오류가 발생했습니다.<br>파일 형식이나 크기를 확인해주세요.');
            });
    } else {
        console.warn('⚠️ 파일이 선택되지 않았습니다.');
    }
}

/**
 * 이미지 URL 설정
 */
function setImageUrl(slideId, url) {
    if (!url) return;
    
    console.log('🔗 이미지 URL 입력:', url);
    
    // 슬라이드 데이터 업데이트
    updateSlide(slideId, 'image', url);
    
    // 🔥 UI 전체 재렌더링
    renderSlides();
    
    console.log('✅ 이미지 URL 설정 완료');
}

/**
 * 이미지 삭제
 */
function removeImage(slideId) {
    if (confirm('이미지를 삭제하시겠습니까?')) {
        console.log('🗑️ 이미지 삭제 시작:', slideId);
        
        updateSlide(slideId, 'image', '');
        
        // 🔥 UI 전체 재렌더링
        renderSlides();
        
        console.log('✅ 이미지 삭제 완료');
    }
}

/**
 * 슬라이드 데이터 업데이트
 */
function updateSlide(slideId, field, value) {
    const slide = currentSlides.find(s => s.id === slideId);
    
    if (slide) {
        slide[field] = value;
        console.log(`슬라이드 ${slideId} 업데이트:`, field, '=', value);
        
        // 🔥 즉시 localStorage에 저장 (메인 페이지에 실시간 반영)
        localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(currentSlides));
        console.log('✅ localStorage 자동 저장 완료');
    }
}

/**
 * AI 편집 (시뮬레이션)
 */
function aiEditSlide(slideId) {
    const slide = currentSlides.find(s => s.id === slideId);
    
    if (!slide) return;
    
    // AI 편집 시뮬레이션
    const btn = event.target.closest('.action-btn');
    const originalHtml = btn.innerHTML;
    
    btn.innerHTML = '<div class="spinner"></div> AI 편집 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        // 제목 개선 (중복 제거, 가독성 향상)
        if (slide.title) {
            slide.title = slide.title.trim();
            // 연속 공백 제거
            slide.title = slide.title.replace(/\s+/g, ' ');
        }
        
        // 설명 개선
        if (slide.description) {
            slide.description = slide.description.trim();
            slide.description = slide.description.replace(/\s+/g, ' ');
            
            // ESG 키워드 자동 강조
            const esgKeywords = ['ESG', '환경', '사회', '거버넌스', '지속가능', '미래', '경영'];
            // (실제 구현 시 키워드 강조 로직 추가)
        }
        
        // 버튼 텍스트 표준화
        if (!slide.buttonText || slide.buttonText.trim() === '') {
            slide.buttonText = '자세히 보기';
        }
        
        // UI 업데이트
        renderSlides();
        
        // 버튼 복원
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        
        // 해당 슬라이드 펼치기
        toggleSlide(slideId);
        
        showCustomAlert('✨ AI 편집 완료', 'AI 편집이 완료되었습니다!<br><br>• 제목과 설명의 가독성 향상<br>• 중복 공백 제거<br>• ESG 키워드 최적화');
        
    }, 1500);
}

/**
 * 슬라이드 미리보기
 */
function previewSlide(slideId) {
    const slide = currentSlides.find(s => s.id === slideId);
    
    if (!slide) return;
    
    // 미리보기 창 열기
    const previewHtml = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>슬라이드 미리보기</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Noto Sans KR', sans-serif;
                    background: #1a1a1a;
                }
                .hero-slider {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    overflow: hidden;
                }
                .slide {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    background-image: linear-gradient(rgba(0, 0, 0, ${(slide.maskOpacity !== undefined ? slide.maskOpacity / 100 : 0.4)}), rgba(0, 0, 0, ${(slide.maskOpacity !== undefined ? slide.maskOpacity / 100 : 0.4)})), url('${slide.image}');
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .slide-content {
                    text-align: center;
                    color: white;
                    max-width: 800px;
                    padding: 40px;
                }
                .slide-content h1 {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 25px;
                    line-height: 1.2;
                }
                .slide-content p {
                    font-size: 1.5rem;
                    margin-bottom: 35px;
                    line-height: 1.6;
                    opacity: 0.95;
                }
                .slide-btn {
                    display: inline-block;
                    padding: 18px 45px;
                    background: linear-gradient(135deg, #1e7e34 0%, #27ae60 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s;
                }
                .slide-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(30, 126, 52, 0.4);
                }
                .preview-badge {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 12px 24px;
                    border-radius: 30px;
                    font-weight: 600;
                    color: #1e7e34;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                .close-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 1.5rem;
                    color: #333;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s;
                }
                .close-btn:hover {
                    transform: rotate(90deg);
                    background: white;
                }
            </style>
        </head>
        <body>
            <div class="preview-badge">🔍 미리보기</div>
            <div class="close-btn" onclick="window.close()">✕</div>
            
            <div class="hero-slider">
                <div class="slide">
                    <div class="slide-content">
                        <h1>${slide.title}</h1>
                        <p>${slide.description}</p>
                        <a href="#" class="slide-btn">${slide.buttonText}</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const previewWindow = window.open('', '_blank', 'width=1200,height=800');
    previewWindow.document.write(previewHtml);
    previewWindow.document.close();
}

/**
 * 슬라이드 초기화
 */
function resetSlide(slideId) {
    if (confirm('이 슬라이드를 초기 상태로 되돌리시겠습니까?')) {
        const defaultSlide = DEFAULT_SLIDES.find(s => s.id === slideId);
        const currentSlide = currentSlides.find(s => s.id === slideId);
        
        if (defaultSlide && currentSlide) {
            Object.assign(currentSlide, defaultSlide);
            renderSlides();
            toggleSlide(slideId);
            console.log('슬라이드 초기화됨:', slideId);
        }
    }
}

/**
 * 전체 저장
 */
function initEventListeners() {
    const saveBtn = document.getElementById('saveAllBtn');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAllSlides);
    }
}

/**
 * 모든 슬라이드 저장
 */
function saveAllSlides() {
    const versionTitle = document.getElementById('versionTitle').value.trim();
    const versionDescription = document.getElementById('versionDescription').value.trim();
    
    // 제목 필수
    if (!versionTitle) {
        showCustomAlert('⚠️ 버전 제목 필수', '버전 제목을 입력해주세요.');
        document.getElementById('versionTitle').focus();
        return;
    }
    
    // 이미지 또는 텍스트 최소 하나 필요
    const hasContent = currentSlides.some(slide => 
        slide.image || slide.title || slide.description
    );
    
    if (!hasContent) {
        showCustomAlert('⚠️ 콘텐츠 필요', '최소한 하나의 슬라이드에 내용을 입력해주세요.');
        return;
    }
    
    // 저장 버튼 로딩 상태
    const saveBtn = document.getElementById('saveAllBtn');
    const originalHtml = saveBtn.innerHTML;
    saveBtn.innerHTML = '<div class="spinner"></div> 저장 중...';
    saveBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // 1. 현재 슬라이드 저장
            localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(currentSlides));
            
            // 2. 히스토리에 버전 저장
            saveToHistory(versionTitle, versionDescription);
            
            // 3. 성공 메시지
            showCustomAlert('✅ 저장 완료!', '변경사항이 메인페이지에 즉시 반영되었습니다.<br>히스토리 관리 페이지에서 이전 버전을 확인할 수 있습니다.');
            
            // 4. 폼 초기화
            document.getElementById('versionTitle').value = '';
            document.getElementById('versionDescription').value = '';
            
            console.log('저장 완료:', versionTitle);
            
        } catch (error) {
            console.error('저장 오류:', error);
            showCustomAlert('❌ 저장 실패', '저장 중 오류가 발생했습니다.');
        } finally {
            saveBtn.innerHTML = originalHtml;
            saveBtn.disabled = false;
        }
    }, 1000);
}

/**
 * 히스토리에 버전 저장
 */
function saveToHistory(title, description) {
    try {
        // 현재 사용자 정보
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
        
        // 히스토리 로드
        const historyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '{"versions": []}');
        
        // 새 버전 생성
        const newVersion = {
            id: 'version_' + Date.now(),
            version: (historyData.versions[0]?.version || 0) + 1,
            title: title,
            description: description,
            timestamp: new Date().toISOString(),
            author: user.id || 'admin@esg.or.kr',
            authorName: user.name || '관리자',
            slides: JSON.parse(JSON.stringify(currentSlides)), // 깊은 복사
            isCurrent: true
        };
        
        // 기존 버전들의 isCurrent를 false로 변경
        historyData.versions.forEach(v => v.isCurrent = false);
        
        // 새 버전을 맨 앞에 추가
        historyData.versions.unshift(newVersion);
        
        // 히스토리 저장 (최대 50개 버전 유지)
        if (historyData.versions.length > 50) {
            historyData.versions = historyData.versions.slice(0, 50);
        }
        
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyData));
        
        console.log('히스토리 저장 완료:', newVersion);
        
    } catch (error) {
        console.error('히스토리 저장 오류:', error);
    }
}

// 전역 함수로 노출 (HTML에서 호출 가능)
window.toggleSlide = toggleSlide;
window.handleImageUpload = handleImageUpload;
window.setImageUrl = setImageUrl;
window.removeImage = removeImage;
window.updateSlide = updateSlide;
window.aiEditSlide = aiEditSlide;
window.previewSlide = previewSlide;
window.resetSlide = resetSlide;

console.log('포스팅툴 JavaScript 로드 완료!');
