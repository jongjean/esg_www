/**
 * 한국ESG학회 - 협력기관 관리 JavaScript
 * CRUD 기능
 */

let currentEditId = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    checkAdminPermission();
    loadPartners();
});

// 관리자 권한 확인
function checkAdminPermission() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    if (!user) {
        showCustomAlert('로그인이 필요합니다', () => {
            window.location.href = '../../index.html';
        });
        return;
    }
    console.log(`✅ 관리자: ${user.name}`);
}

// 협력기관 목록 로드
async function loadPartners() {
    const container = document.getElementById('partnersList');
    
    try {
        const response = await fetch('../../tables/partners?sort=display_order&limit=100');
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-handshake"></i>
                    <p>등록된 협력기관이 없습니다</p>
                </div>
            `;
            return;
        }
        
        const partners = data.data;
        console.log(`✅ 협력기관 ${partners.length}개 로드됨`);
        
        container.innerHTML = partners.map(partner => `
            <div class="partner-card">
                <img src="${partner.logo}" 
                     alt="${partner.name}" 
                     class="partner-logo-preview"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%2260%22%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3E${partner.name}%3C/text%3E%3C/svg%3E'">
                <div class="partner-info">
                    <h3>${partner.name}</h3>
                    <p>순서: ${partner.display_order} | 
                       <a href="${partner.url || '#'}" target="_blank">${partner.url || '링크 없음'}</a>
                    </p>
                </div>
                <div class="partner-actions">
                    <button class="btn btn-small btn-edit" onclick="editPartner('${partner.id}')">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deletePartner('${partner.id}', '${partner.name}')">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ 협력기관 로드 실패:', error);
        showCustomAlert('협력기관을 불러오는데 실패했습니다');
    }
}

// 추가 모달 열기
function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = '새 협력기관 추가';
    document.getElementById('partnerForm').reset();
    document.getElementById('partnerId').value = '';
    document.getElementById('partnerLogo').value = '';
    document.getElementById('fileName').textContent = '';
    document.getElementById('logoPreview').innerHTML = '';
    document.getElementById('partnerLogoFile').value = '';
    document.getElementById('partnerModal').classList.add('active');
}

// 수정 모달 열기
async function editPartner(id) {
    try {
        const response = await fetch(`../../tables/partners/${id}`);
        const partner = await response.json();
        
        currentEditId = id;
        document.getElementById('modalTitle').textContent = '협력기관 수정';
        document.getElementById('partnerId').value = id;
        document.getElementById('partnerName').value = partner.name;
        document.getElementById('partnerLogo').value = partner.logo;
        document.getElementById('partnerUrl').value = partner.url || '';
        document.getElementById('partnerOrder').value = partner.display_order;
        document.getElementById('partnerModal').classList.add('active');
        
    } catch (error) {
        console.error('❌ 협력기관 로드 실패:', error);
        showCustomAlert('협력기관 정보를 불러오는데 실패했습니다');
    }
}

// 모달 닫기
function closeModal() {
    document.getElementById('partnerModal').classList.remove('active');
    document.getElementById('partnerForm').reset();
    document.getElementById('partnerLogo').value = '';
    document.getElementById('fileName').textContent = '';
    document.getElementById('logoPreview').innerHTML = '';
    document.getElementById('partnerLogoFile').value = '';
    currentEditId = null;
}

// 폼 제출
document.getElementById('partnerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('partnerName').value.trim();
    const logo = document.getElementById('partnerLogo').value.trim();
    const url = document.getElementById('partnerUrl').value.trim();
    const display_order = parseInt(document.getElementById('partnerOrder').value);
    
    if (!name || !logo) {
        showCustomAlert('필수 항목을 모두 입력해주세요');
        return;
    }
    
    const partnerData = {
        name,
        logo,
        url: url || '#',
        display_order
    };
    
    try {
        let response;
        
        if (currentEditId) {
            // 수정
            response = await fetch(`../../tables/partners/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partnerData)
            });
        } else {
            // 추가
            partnerData.id = 'partner_' + Date.now();
            response = await fetch('../../tables/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(partnerData)
            });
        }
        
        if (response.ok) {
            showCustomAlert(
                currentEditId ? '협력기관이 수정되었습니다' : '협력기관이 추가되었습니다',
                () => {
                    closeModal();
                    loadPartners();
                }
            );
        } else {
            throw new Error('저장 실패');
        }
        
    } catch (error) {
        console.error('❌ 저장 실패:', error);
        showCustomAlert('저장에 실패했습니다');
    }
});

// 삭제
async function deletePartner(id, name) {
    if (!confirm(`"${name}"을(를) 삭제하시겠습니까?`)) {
        return;
    }
    
    try {
        const response = await fetch(`../../tables/partners/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showCustomAlert('협력기관이 삭제되었습니다', () => {
                loadPartners();
            });
        } else {
            throw new Error('삭제 실패');
        }
        
    } catch (error) {
        console.error('❌ 삭제 실패:', error);
        showCustomAlert('삭제에 실패했습니다');
    }
}

// 모달 외부 클릭 시 닫기
document.getElementById('partnerModal').addEventListener('click', (e) => {
    if (e.target.id === 'partnerModal') {
        closeModal();
    }
});
