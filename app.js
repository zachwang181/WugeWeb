// 全局状态管理
const state = {
    defects: [],
    tags: {
        craft: ['砌筑', '抹灰', '防水', '木作', '油漆'],
        location: ['主卧', '客厅', '厨房', '卫生间', '阳台'],
        position: ['墙面', '地面', '天花', '门窗', '踢脚线']
    },
    filters: {
        craft: [],
        location: [],
        position: []
    }
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadMockData();
    renderDefects();
    const preferredView = localStorage.getItem('preferred-view');
    if (preferredView) {
        const button = document.querySelector(`[data-size="${preferredView}"]`);
        if (button) {
            button.click();
        }
    }

    // 恢复保存的宽度
    const savedWidth = localStorage.getItem('filter-panel-width');
    if (savedWidth) {
        const filterPanel = document.querySelector('.filter-panel');
        const contentArea = document.querySelector('.content-area');
        filterPanel.style.width = savedWidth;
        contentArea.style.marginLeft = savedWidth;
    }
});

// 初始化事件监听器
function initializeEventListeners() {
    // 搜索框事件
    document.querySelector('.search-box input').addEventListener('input', (e) => {
        filterDefects(e.target.value);
    });

    // 新增缺陷按钮事件
    document.getElementById('addDefectBtn').addEventListener('click', () => {
        showDefectModal('add');
    });

    // 标签点击事件
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', handleTagClick);
    });

    // 新增标签按钮事件
    document.querySelectorAll('.add-tag-btn').forEach(btn => {
        btn.addEventListener('click', handleAddTag);
    });

    // 添加视图控制器事件
    document.querySelectorAll('.view-control').forEach(button => {
        button.addEventListener('click', handleViewChange);
    });

    // 添加宽度调整功能
    initializeResizeHandle();
}

// 加载模拟数据
function loadMockData() {
    state.defects = [
        {
            id: '001',
            title: '墙面裂缝',
            image: 'https://via.placeholder.com/300x200',
            tags: {
                craft: '砌筑工艺',
                location: '客厅',
                position: '墙面',
                risk: '高风险'
            },
            date: '2024-03-20',
            description: '墙面开裂，裂缝宽度约0.3mm...'
        }
        // 可以添加更多模拟数据
    ];
}

// 渲染缺陷列表
function renderDefects(defects = state.defects) {
    const grid = document.getElementById('defectGrid');
    grid.innerHTML = defects.map(defect => `
        <div class="defect-card" data-id="${defect.id}">
            <div class="card-header">
                <span class="defect-id">${defect.id}</span>
                <h3>${defect.title}</h3>
            </div>
            <div class="card-image" onclick="viewDefect('${defect.id}')">
                <img src="${defect.image}" alt="${defect.title}">
            </div>
            <div class="card-tags">
                <span class="tag craft-tag">${defect.tags.craft}</span>
                <span class="tag location-tag">${defect.tags.location}</span>
                <span class="tag position-tag">${defect.tags.position}</span>
                <span class="tag risk-tag">${defect.tags.risk}</span>
                <span class="tag date-tag">${defect.date}</span>
            </div>
            <div class="card-actions">
                <button class="btn-text" onclick="viewDefect('${defect.id}')">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="btn-text" onclick="editDefect('${defect.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn-text danger" onclick="deleteDefect('${defect.id}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `).join('');
}

// 处理标签点击
function handleTagClick(e) {
    const tag = e.currentTarget;
    // 实现标签过滤逻辑
}

// 处理添加标签
function handleAddTag(e) {
    const section = e.target.closest('.tag-section');
    // 实现添加标签逻辑
}

// 查看缺陷详情
function viewDefect(id) {
    const defect = state.defects.find(d => d.id === id);
    showDefectModal('view', defect);
}

// 编辑缺陷
function editDefect(id) {
    const defect = state.defects.find(d => d.id === id);
    showDefectModal('edit', defect);
}

// 删除缺陷
function deleteDefect(id) {
    if (confirm('确定要删除这个缺陷记录吗？')) {
        state.defects = state.defects.filter(d => d.id !== id);
        renderDefects();
    }
}

// 显示缺陷模态框
function showDefectModal(type, defect = null) {
    const modal = document.getElementById('defectModal');
    const isView = type === 'view';
    const isEdit = type === 'edit';
    const isAdd = type === 'add';

    const modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isAdd ? '新增缺陷' : isEdit ? '编辑缺陷' : '缺陷详情'}</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h3>基础信息</h3>
                    <div class="form-group">
                        <label>缺陷编号</label>
                        <input type="text" class="form-control" id="defectId" 
                            value="${defect?.id || ''}" ${isView ? 'readonly' : isAdd ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label>缺陷名称</label>
                        <input type="text" class="form-control" id="defectTitle" 
                            value="${defect?.title || ''}" ${isView ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label>工艺</label>
                        <select class="form-control" id="defectCraft" ${isView ? 'disabled' : ''}>
                            ${state.tags.craft.map(tag => `
                                <option value="${tag}" ${defect?.tags.craft === tag ? 'selected' : ''}>
                                    ${tag}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>位置</label>
                        <select class="form-control" id="defectLocation" ${isView ? 'disabled' : ''}>
                            ${state.tags.location.map(tag => `
                                <option value="${tag}" ${defect?.tags.location === tag ? 'selected' : ''}>
                                    ${tag}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>部位</label>
                        <select class="form-control" id="defectPosition" ${isView ? 'disabled' : ''}>
                            ${state.tags.position.map(tag => `
                                <option value="${tag}" ${defect?.tags.position === tag ? 'selected' : ''}>
                                    ${tag}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>风险等级</label>
                        <select class="form-control" id="defectRisk" ${isView ? 'disabled' : ''}>
                            <option value="低风险" ${defect?.tags.risk === '低风险' ? 'selected' : ''}>低风险</option>
                            <option value="中风险" ${defect?.tags.risk === '中风险' ? 'selected' : ''}>中风险</option>
                            <option value="高风险" ${defect?.tags.risk === '高风险' ? 'selected' : ''}>高风险</option>
                        </select>
                    </div>
                </div>
                <div class="modal-section">
                    <h3>缺陷描述</h3>
                    <div class="form-group">
                        <textarea class="form-control" id="defectDescription" rows="4" 
                            ${isView ? 'readonly' : ''}>${defect?.description || ''}</textarea>
                    </div>
                </div>
                <div class="modal-section">
                    <h3>缺陷照片</h3>
                    ${isView ? `
                        <div class="image-preview">
                            <img src="${defect?.image || ''}" alt="缺陷照片">
                        </div>
                    ` : `
                        <div class="image-upload-area" onclick="document.getElementById('imageUpload').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>点击或拖拽上传图片</p>
                            <input type="file" id="imageUpload" hidden accept="image/*" onchange="handleImageUpload(this)">
                        </div>
                        <div class="image-preview" id="imagePreview">
                            ${defect?.image ? `<img src="${defect.image}" alt="缺陷照片">` : ''}
                        </div>
                    `}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-text" onclick="closeModal()">取消</button>
                ${!isView ? `
                    <button class="btn-primary" onclick="${isAdd ? 'addDefect()' : `saveDefect('${defect?.id}')`}">
                        保存
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;
    modal.style.display = 'block';
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('defectModal');
    modal.style.display = 'none';
}

// 处理图片上传
function handleImageUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = `
                <img src="${e.target.result}" alt="预览图片">
            `;
        };
        reader.readAsDataURL(file);
    }
}

// 保存缺陷
function saveDefect(id) {
    const defect = {
        id: document.getElementById('defectId').value,
        title: document.getElementById('defectTitle').value,
        tags: {
            craft: document.getElementById('defectCraft').value,
            location: document.getElementById('defectLocation').value,
            position: document.getElementById('defectPosition').value,
            risk: document.getElementById('defectRisk').value
        },
        description: document.getElementById('defectDescription').value,
        image: document.querySelector('#imagePreview img')?.src || '',
        date: new Date().toISOString().split('T')[0]
    };

    const index = state.defects.findIndex(d => d.id === id);
    if (index !== -1) {
        state.defects[index] = defect;
    }

    renderDefects();
    closeModal();
}

// 添加新缺陷
function addDefect() {
    const newId = String(state.defects.length + 1).padStart(3, '0');
    const defect = {
        id: newId,
        title: document.getElementById('defectTitle').value,
        tags: {
            craft: document.getElementById('defectCraft').value,
            location: document.getElementById('defectLocation').value,
            position: document.getElementById('defectPosition').value,
            risk: document.getElementById('defectRisk').value
        },
        description: document.getElementById('defectDescription').value,
        image: document.querySelector('#imagePreview img')?.src || '',
        date: new Date().toISOString().split('T')[0]
    };

    state.defects.push(defect);
    renderDefects();
    closeModal();
}

// 过滤缺陷列表
function filterDefects(keyword) {
    const filtered = state.defects.filter(defect => 
        defect.title.includes(keyword) ||
        defect.description.includes(keyword)
    );
    renderDefects(filtered);
}

// 添加视图切换处理函数
function handleViewChange(e) {
    const button = e.currentTarget;
    const size = button.dataset.size;
    const grid = document.getElementById('defectGrid');
    
    // 更新按钮状态
    document.querySelectorAll('.view-control').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // 更新网格视图
    grid.classList.remove('view-compact', 'view-normal', 'view-comfortable');
    grid.classList.add(`view-${size}`);
    
    // 保存用户偏好
    localStorage.setItem('preferred-view', size);
}

// 添加宽度调整功能
function initializeResizeHandle() {
    const handle = document.querySelector('.resize-handle');
    const filterPanel = document.querySelector('.filter-panel');
    const contentArea = document.querySelector('.content-area');
    let isResizing = false;

    // 从localStorage获取保存的宽度
    const savedWidth = localStorage.getItem('filter-panel-width');
    if (savedWidth) {
        filterPanel.style.width = savedWidth;
        contentArea.style.marginLeft = savedWidth;
    }

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const newWidth = Math.max(180, Math.min(400, e.clientX));
        filterPanel.style.width = newWidth + 'px';
        contentArea.style.marginLeft = newWidth + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.classList.remove('resizing');
            // 保存当前宽度到localStorage
            localStorage.setItem('filter-panel-width', filterPanel.style.width);
        }
    });
} 