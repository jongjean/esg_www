// ==========================================
// Sound Effects Manager
// ==========================================

class SoundEffects {
    constructor() {
        // 효과음 활성화 여부 (localStorage에 저장)
        this.enabled = localStorage.getItem('soundEffectsEnabled') !== 'false';
        
        // Web Audio API 컨텍스트
        this.audioContext = null;
        
        // 효과음 오디오 객체
        this.clickAudio = null;
        this.hoverAudio = null;
        
        // 효과음 버퍼 캐시
        this.sounds = {
            hover: null,
            click: null
        };
        
        // 초기화
        this.init();
    }
    
    // 초기화
    init() {
        // Web Audio API 지원 확인
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // MP3 클릭 효과음 로드
        this.loadClickSound();
        
        // 이벤트 리스너 등록
        this.attachEventListeners();
    }
    
    // MP3 효과음 로드
    loadClickSound() {
        // 현재 경로에 따라 상대 경로 결정
        const basePath = this.getBasePath();
        
        console.log('🔊 사운드 파일 로드 중... BasePath:', basePath);
        
        // 클릭 효과음
        this.clickAudio = new Audio(basePath + 'sounds/mouse_click.mp3');
        this.clickAudio.volume = 0.25; // 볼륨 25%
        this.clickAudio.preload = 'auto';
        console.log('✅ 클릭 효과음 로드:', basePath + 'sounds/mouse_click.mp3');
        
        // 호버 효과음
        this.hoverAudio = new Audio(basePath + 'sounds/hover_swish.mp3');
        this.hoverAudio.volume = 0.15; // 볼륨 15% (호버는 좀 더 조용하게)
        this.hoverAudio.preload = 'auto';
        console.log('✅ 호버 효과음 로드:', basePath + 'sounds/hover_swish.mp3');
    }
    
    // 베이스 경로 결정
    getBasePath() {
        const path = window.location.pathname.replace(/\\/g, '/');
        if (path.includes('/pages/')) {
            const afterPages = path.split('/pages/')[1] || '';
            const segments = afterPages.split('/').filter(Boolean);
            return '../'.repeat(segments.length);
        }
        return '';
    }
    

    

    
    // 호버 효과음 재생
    playHover() {
        if (!this.enabled) return;
        
        console.log('🖱️ 호버 효과음 재생 시도...');
        
        // MP3 파일 재생
        if (this.hoverAudio) {
            // 이미 재생 중이면 처음부터 다시 재생
            this.hoverAudio.currentTime = 0;
            this.hoverAudio.play()
                .then(() => console.log('✅ 호버 효과음 재생 성공'))
                .catch(err => {
                    console.error('❌ Hover sound play failed:', err);
                });
        } else {
            console.error('❌ hoverAudio 객체가 없습니다.');
        }
    }
    
    // 클릭 효과음 재생
    playClick() {
        if (!this.enabled) {
            console.log('⚠️ 효과음이 비활성화되어 있습니다.');
            return;
        }
        
        console.log('🖱️ 클릭 효과음 재생 시도...');
        
        // MP3 파일 재생
        if (this.clickAudio) {
            // 이미 재생 중이면 처음부터 다시 재생
            this.clickAudio.currentTime = 0;
            this.clickAudio.play()
                .then(() => console.log('✅ 클릭 효과음 재생 성공'))
                .catch(err => {
                    console.error('❌ Click sound play failed:', err);
                });
        } else {
            console.error('❌ clickAudio 객체가 없습니다.');
        }
    }
    
    // 효과음 활성화/비활성화 토글
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEffectsEnabled', this.enabled.toString());
        this.updateToggleButton();
        return this.enabled;
    }
    
    // 토글 버튼 생성
    createToggleButton() {
        // 이미 존재하는지 확인
        if (document.querySelector('.sound-toggle-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'sound-toggle-btn';
        button.setAttribute('aria-label', '효과음 토글');
        button.setAttribute('data-tooltip', this.enabled ? '효과음 켜짐' : '효과음 꺼짐');
        button.innerHTML = this.enabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        
        if (!this.enabled) {
            button.classList.add('disabled');
        }
        
        button.addEventListener('click', () => {
            this.toggle();
            // 토글 시에도 클릭 효과음 재생
            if (this.enabled) {
                this.playClick();
            }
        });
        
        document.body.appendChild(button);
    }
    
    // 토글 버튼 업데이트
    updateToggleButton() {
        const button = document.querySelector('.sound-toggle-btn');
        if (!button) return;
        
        button.setAttribute('data-tooltip', this.enabled ? '효과음 켜짐' : '효과음 꺼짐');
        button.innerHTML = this.enabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        
        if (this.enabled) {
            button.classList.remove('disabled');
        } else {
            button.classList.add('disabled');
        }
    }
    
    // 이벤트 리스너 등록
    attachEventListeners() {
        // 페이지 로드 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.registerSoundEvents();
            });
        } else {
            this.registerSoundEvents();
        }
    }
    
    // 사운드 이벤트 등록
    registerSoundEvents() {
        // 토글 버튼 추가
        this.createToggleButton();
        
        // 메뉴 버튼 호버 효과음
        const registerHoverSound = () => {
            const menuButtons = document.querySelectorAll('.nav-link, .nav-item.has-dropdown > .nav-link');
            console.log('🔊 호버 이벤트 등록 대상:', menuButtons.length, '개');
            menuButtons.forEach(btn => {
                // 이미 이벤트가 등록되어 있는지 확인
                if (!btn.hasAttribute('data-sound-hover')) {
                    btn.setAttribute('data-sound-hover', 'true');
                    btn.addEventListener('mouseenter', () => {
                        console.log('🖱️ 호버 이벤트 발생!');
                        this.playHover();
                    });
                }
            });
        };
        
        // 모든 버튼 클릭 효과음
        const registerClickSound = () => {
            const allButtons = document.querySelectorAll('button, .btn, .nav-link, a.card, .slider-btn, .scroll-to-top, .status-btn, .status-link, .dot');
            console.log('🔊 클릭 이벤트 등록 대상:', allButtons.length, '개');
            allButtons.forEach(btn => {
                // 이미 이벤트가 등록되어 있는지 확인
                if (!btn.hasAttribute('data-sound-click')) {
                    btn.setAttribute('data-sound-click', 'true');
                    btn.addEventListener('click', (e) => {
                        console.log('🖱️ 클릭 이벤트 발생!', e.target);
                        this.playClick();
                    });
                }
            });
        };
        
        // 초기 등록
        registerHoverSound();
        registerClickSound();
        
        // MutationObserver로 동적으로 추가되는 버튼 감지
        const observer = new MutationObserver(() => {
            registerHoverSound();
            registerClickSound();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 전역 인스턴스 생성
const soundEffects = new SoundEffects();

// 전역 접근을 위한 export
window.soundEffects = soundEffects;

// 효과음 토글 함수 (개발자 콘솔에서 사용 가능)
window.toggleSoundEffects = () => {
    const enabled = soundEffects.toggle();
    console.log(`🔊 효과음이 ${enabled ? '활성화' : '비활성화'}되었습니다.`);
    return enabled;
};

// 효과음 상태 확인 함수
window.getSoundEffectsStatus = () => {
    return soundEffects.enabled;
};

console.log('%c🔊 효과음 시스템 활성화됨', 'color: #1e7e34; font-weight: bold;');
console.log('%c효과음을 끄려면 콘솔에서 toggleSoundEffects() 함수를 실행하세요.', 'color: #666;');
