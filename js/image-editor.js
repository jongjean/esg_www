/**
 * 한국ESG학회 - 이미지 편집기
 * image-editor.js
 */

// 편집 상태
let editorState = {
    slideId: null,
    originalImage: null,
    zoom: 100,
    positionX: 0,
    positionY: 0,
    maskOpacity: 40, // 마스크 투명도 (0-100)
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0
};

/**
 * 이미지 편집기 열기
 */
function openImageEditor(slideId, imageUrl) {
    editorState.slideId = slideId;
    editorState.originalImage = imageUrl;
    
    // 🔥 기존 저장된 값 불러오기 (포스팅툴에서 저장한 값)
    const slide = SlideStorage.getById(slideId);
    
    if (slide && slide.imageTransform) {
        // 퍼센트 → 픽셀 변환
        const editorWidth = FRAME_CONFIG.EDITOR_WIDTH;
        const editorHeight = FRAME_CONFIG.getEditorHeight();
        
        editorState.zoom = slide.imageTransform.zoom || 100;
        editorState.positionX = (slide.imageTransform.positionX / 100) * editorWidth;
        editorState.positionY = (slide.imageTransform.positionY / 100) * editorHeight;
        
        console.log('✅ 기존 imageTransform 불러옴:', {
            zoom: editorState.zoom,
            positionX: editorState.positionX,
            positionY: editorState.positionY
        });
    } else {
        // 기본값
        editorState.zoom = 100;
        editorState.positionX = 0;
        editorState.positionY = 0;
        console.log('ℹ️ 기본값 사용 (imageTransform 없음)');
    }
    
    editorState.maskOpacity = slide?.maskOpacity || 40;
    
    const modal = document.getElementById('imageEditorModal');
    const editorCanvas = document.getElementById('editorCanvas');
    const editorImage = document.getElementById('editorImage');
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomValue = document.getElementById('zoomValue');
    const maskSlider = document.getElementById('maskSlider');
    const maskValue = document.getElementById('maskValue');
    
    // 🔥 편집 모달 프레임 크기를 포스팅 카드와 동일하게
    const editorWidth = FRAME_CONFIG.EDITOR_WIDTH;
    const editorHeight = FRAME_CONFIG.getEditorHeight();
    editorCanvas.style.width = editorWidth + 'px';
    editorCanvas.style.height = editorHeight + 'px';
    console.log(`📐 편집 모달 크기: ${editorWidth}px × ${editorHeight}px`);
    
    // 이미지 로드
    editorImage.style.backgroundImage = `url('${imageUrl}')`;
    editorImage.style.backgroundSize = 'cover';
    editorImage.style.backgroundPosition = 'center';
    editorImage.style.backgroundRepeat = 'no-repeat';
    updateImageTransform();
    
    // 줌 슬라이더 초기화 (불러온 값으로)
    zoomSlider.value = editorState.zoom;
    zoomValue.textContent = editorState.zoom + '%';
    
    // 마스크 슬라이더 초기화
    maskSlider.value = editorState.maskOpacity;
    maskValue.textContent = editorState.maskOpacity + '%';
    updateMaskOpacity();
    
    // 모달 표시
    modal.style.display = 'flex';
    
    // 이벤트 리스너 등록
    initEditorEvents();
    
    console.log('🖼️ 이미지 편집기 열림:', slideId, {
        zoom: editorState.zoom,
        positionX: editorState.positionX,
        positionY: editorState.positionY,
        maskOpacity: editorState.maskOpacity
    });
}

/**
 * 이미지 편집기 닫기
 */
function closeImageEditor() {
    const modal = document.getElementById('imageEditorModal');
    modal.style.display = 'none';
    
    // 이벤트 리스너 제거
    removeEditorEvents();
    
    console.log('이미지 편집기 닫힘');
}

/**
 * 이벤트 리스너 초기화
 */
function initEditorEvents() {
    const editorImage = document.getElementById('editorImage');
    const editorCanvas = document.getElementById('editorCanvas');
    const zoomSlider = document.getElementById('zoomSlider');
    const maskSlider = document.getElementById('maskSlider');
    
    // 줌 슬라이더
    zoomSlider.addEventListener('input', handleZoomChange);
    
    // 마스크 슬라이더
    maskSlider.addEventListener('input', handleMaskChange);
    
    // 마우스 드래그
    editorCanvas.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    // 터치 드래그 (모바일)
    editorCanvas.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // 마우스 휠 줌
    editorCanvas.addEventListener('wheel', handleWheelZoom);
    
    // 키보드 화살표
    document.addEventListener('keydown', handleKeyboard);
}

/**
 * 이벤트 리스너 제거
 */
function removeEditorEvents() {
    const editorCanvas = document.getElementById('editorCanvas');
    const zoomSlider = document.getElementById('zoomSlider');
    const maskSlider = document.getElementById('maskSlider');
    
    zoomSlider.removeEventListener('input', handleZoomChange);
    maskSlider.removeEventListener('input', handleMaskChange);
    editorCanvas.removeEventListener('mousedown', handleDragStart);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    editorCanvas.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    editorCanvas.removeEventListener('wheel', handleWheelZoom);
    document.removeEventListener('keydown', handleKeyboard);
}

/**
 * 줌 변경 핸들러
 */
function handleZoomChange(e) {
    editorState.zoom = parseInt(e.target.value);
    document.getElementById('zoomValue').textContent = editorState.zoom + '%';
    updateImageTransform();
}

/**
 * 마스크 투명도 변경 핸들러
 */
function handleMaskChange(e) {
    editorState.maskOpacity = parseInt(e.target.value);
    document.getElementById('maskValue').textContent = editorState.maskOpacity + '%';
    updateMaskOpacity();
}

/**
 * 마스크 투명도 업데이트
 */
function updateMaskOpacity() {
    const maskLayer = document.getElementById('maskLayer');
    const opacity = editorState.maskOpacity / 100;
    
    // 🔥 마스크 레이어에 투명도 적용
    maskLayer.style.background = `rgba(0, 0, 0, ${opacity})`;
    
    console.log(`🎨 마스크 투명도: ${editorState.maskOpacity}% (opacity: ${opacity})`);
}

/**
 * 드래그 시작
 */
function handleDragStart(e) {
    editorState.isDragging = true;
    editorState.dragStartX = e.clientX;
    editorState.dragStartY = e.clientY;
    editorState.startPosX = editorState.positionX;  // 시작 시 이미지 위치 저장
    editorState.startPosY = editorState.positionY;
    e.preventDefault();
}

/**
 * 드래그 이동
 */
function handleDragMove(e) {
    if (!editorState.isDragging) return;
    
    const dx = e.clientX - editorState.dragStartX;
    const dy = e.clientY - editorState.dragStartY;
    
    // 드래그 방향 반전
    editorState.positionX = editorState.startPosX - dx;
    editorState.positionY = editorState.startPosY - dy;
    updateImageTransform();
    e.preventDefault();
}

/**
 * 드래그 종료
 */
function handleDragEnd(e) {
    editorState.isDragging = false;
}

/**
 * 터치 시작
 */
function handleTouchStart(e) {
    if (e.touches.length === 1) {
        editorState.isDragging = true;
        editorState.dragStartX = e.touches[0].clientX;
        editorState.dragStartY = e.touches[0].clientY;
        editorState.startPosX = editorState.positionX;
        editorState.startPosY = editorState.positionY;
        e.preventDefault();
    }
}

/**
 * 터치 이동
 */
function handleTouchMove(e) {
    if (!editorState.isDragging || e.touches.length !== 1) return;
    
    const dx = e.touches[0].clientX - editorState.dragStartX;
    const dy = e.touches[0].clientY - editorState.dragStartY;
    
    editorState.positionX = editorState.startPosX - dx;
    editorState.positionY = editorState.startPosY - dy;
    updateImageTransform();
    e.preventDefault();
}

/**
 * 터치 종료
 */
function handleTouchEnd(e) {
    editorState.isDragging = false;
}

/**
 * 마우스 휠 줌
 */
function handleWheelZoom(e) {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -5 : 5;
    editorState.zoom = Math.max(50, Math.min(200, editorState.zoom + delta));
    
    document.getElementById('zoomSlider').value = editorState.zoom;
    document.getElementById('zoomValue').textContent = editorState.zoom + '%';
    updateImageTransform();
}

/**
 * 키보드 화살표
 */
function handleKeyboard(e) {
    const modal = document.getElementById('imageEditorModal');
    if (modal.style.display === 'none') return;
    
    const step = 10;
    
    switch(e.key) {
        case 'ArrowUp':
            editorState.positionY -= step;
            updateImageTransform();
            e.preventDefault();
            break;
        case 'ArrowDown':
            editorState.positionY += step;
            updateImageTransform();
            e.preventDefault();
            break;
        case 'ArrowLeft':
            editorState.positionX -= step;
            updateImageTransform();
            e.preventDefault();
            break;
        case 'ArrowRight':
            editorState.positionX += step;
            updateImageTransform();
            e.preventDefault();
            break;
    }
}

/**
 * 이미지 이동
 */
function moveImage(direction) {
    const step = 20;
    
    switch(direction) {
        case 'up':
            editorState.positionY -= step;
            break;
        case 'down':
            editorState.positionY += step;
            break;
        case 'left':
            editorState.positionX -= step;
            break;
        case 'right':
            editorState.positionX += step;
            break;
    }
    
    updateImageTransform();
}

/**
 * 이미지 위치 초기화
 */
function resetImagePosition() {
    editorState.zoom = 100;
    editorState.positionX = 0;
    editorState.positionY = 0;
    
    document.getElementById('zoomSlider').value = 100;
    document.getElementById('zoomValue').textContent = '100%';
    updateImageTransform();
}

/**
 * 이미지 변형 업데이트
 */
function updateImageTransform() {
    const editorImage = document.getElementById('editorImage');
    
    const zoom = editorState.zoom;
    
    // 픽셀 → 퍼센트 변환
    const posXPercent = (editorState.positionX / FRAME_CONFIG.EDITOR_WIDTH) * 100;
    const posYPercent = (editorState.positionY / FRAME_CONFIG.EDITOR_HEIGHT) * 100;
    
    const posX = 50 + posXPercent;
    const posY = 50 + posYPercent;
    
    editorImage.style.backgroundSize = `${zoom}%`;
    editorImage.style.backgroundPosition = `${posX}% ${posY}%`;
    editorImage.style.backgroundRepeat = 'no-repeat';
}

/**
 * 편집 저장 (slide-utils.js 사용)
 */
function saveImageEdits() {
    const slideId = editorState.slideId;
    
    console.log('🔄 이미지 편집 저장 시작:', slideId);
    console.log('  - 픽셀 이동:', editorState.positionX, editorState.positionY);
    console.log('  - Zoom:', editorState.zoom);
    console.log('  - 마스크:', editorState.maskOpacity);
    
    // 1. 픽셀 → 퍼센트 변환 (slide-utils.js)
    const imageTransform = ImageTransformUtils.editorToStorage(editorState);
    const maskOpacity = editorState.maskOpacity;
    
    console.log('  - 퍼센트 변환:', imageTransform);
    
    // 2. 검증 (slide-utils.js)
    if (!Validator.validateImageTransform(imageTransform)) {
        showCustomAlert('❌ 유효성 검사 실패', '이미지 변형 값이 유효하지 않습니다.');
        return;
    }
    
    if (!Validator.validateMaskOpacity(maskOpacity)) {
        showCustomAlert('❌ 유효성 검사 실패', '마스크 투명도 값이 유효하지 않습니다.');
        return;
    }
    
    // 3. 원자적 업데이트 (slide-utils.js)
    const success = SlideStorage.updateImageTransform(
        slideId,
        imageTransform,
        maskOpacity
    );
    
    if (!success) {
        showCustomAlert('❌ 저장 실패', '이미지 편집을 저장하지 못했습니다.');
        return;
    }
    
    // 4. 포스팅툴 UI 업데이트
    if (typeof renderSlides === 'function') {
        renderSlides();
    }
    
    // 5. 이벤트 발생 (다른 화면 동기화)
    SlideEvents.emitUpdate(slideId);
    
    // 6. 성공 알림 (커스텀 모달)
    console.log('✅ 이미지 편집 저장 완료');
    showSaveConfirmModal();
    
    // 7. 모달 닫기
    closeImageEditor();
}

/**
 * 저장 확인 모달 표시
 */
function showSaveConfirmModal() {
    const modal = document.getElementById('saveConfirmModal');
    modal.style.display = 'flex';
    
    // 1.5초 후 자동 닫힘
    setTimeout(() => {
        modal.style.display = 'none';
    }, 1500);
}

/**
 * 드래그 앤 드롭 처리
 */
function initDragAndDrop(slideId) {
    const dropZone = document.querySelector(`[data-slide-id="${slideId}"] .image-preview`);
    
    if (!dropZone) return;
    
    // 드래그 오버
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.border = '3px dashed #27ae60';
        dropZone.style.background = 'rgba(39, 174, 96, 0.1)';
    });
    
    // 드래그 떠남
    dropZone.addEventListener('dragleave', (e) => {
        dropZone.style.border = '';
        dropZone.style.background = '';
    });
    
    // 드롭
    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.style.border = '';
        dropZone.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleImageFile(files[0], slideId);
        }
    });
    
    // 붙여넣기
    document.addEventListener('paste', async (e) => {
        const items = e.clipboardData.items;
        
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                await handleImageFile(file, slideId);
                break;
            }
        }
    });
}

/**
 * 이미지 파일 처리
 */
async function handleImageFile(file, slideId) {
    if (!file.type.startsWith('image/')) {
        showCustomAlert('⚠️ 파일 형식 오류', '이미지 파일만 업로드 가능합니다.');
        return;
    }
    
    // 파일을 Data URL로 변환
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        updateSlide(slideId, 'image', imageUrl);
        
        // UI 업데이트
        const preview = document.querySelector(`[data-slide-id="${slideId}"] .image-preview img`);
        if (preview) {
            preview.src = imageUrl;
        }
        
        console.log('이미지 업로드 완료:', slideId);
        showCustomAlert('✅ 업로드 성공', '이미지가 업로드되었습니다!');
    };
    
    reader.readAsDataURL(file);
}

console.log('이미지 편집기 로드 완료');
