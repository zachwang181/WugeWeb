// 全局状态管理
const state = {
    defects: [],
    tags: {
        craft: ['砌筑工艺', '抹灰工艺', '防水工艺', '木作工艺', '油漆工艺'],
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

    renderTags();
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
    const tagSection = tag.closest('.tag-section');
    const tagType = tagSection.querySelector('h3').textContent.toLowerCase(); // 工艺/位置/部位
    const tagText = tag.textContent.trim().replace(' ×', '');
    
    if (!state.filters[tagType]) {
        state.filters[tagType] = [];
    }
    
    // 更新过滤状态
    if (state.filters[tagType].includes(tagText)) {
        // 如果已经选中，则取消选中
        state.filters[tagType] = state.filters[tagType].filter(t => t !== tagText);
        tag.classList.remove('selected');
    } else {
        // 如果未选中，则添加选中
        state.filters[tagType].push(tagText);
        tag.classList.add('selected');
    }
    
    debug(`更新${tagType}过滤器: ${state.filters[tagType].join(', ')}`, 'info');
    filterDefectsByTags();
}

// 处理添���标签
function handleAddTag(e) {
    const section = e.target.closest('.tag-section');
    const tagType = section.id.replace('Tags', '');
    
    const tagName = prompt(`请输入新的${tagType === 'craft' ? '工艺' : 
                                    tagType === 'location' ? '位置' : '部位'}标签：`);
    
    if (tagName && tagName.trim()) {
        const normalizedTag = tagType === 'craft' ? `${tagName.trim()}工艺` : tagName.trim();
        
        if (state.tags[tagType].includes(normalizedTag)) {
            showToast('标签已存在', 'error');
            return;
        }
        
        state.tags[tagType].push(normalizedTag);
        debug(`添加${tagType}标签: ${normalizedTag}`, 'success');
        showToast('标签添加成功', 'success');
        
        // 更新本地存储
        localStorage.setItem('tags', JSON.stringify(state.tags));
        renderTags();
    }
}

// 添加删除标签功能
function handleTagDelete(tagType, tagText) {
    if (confirm(`确定要删除"${tagText}"标签吗？`)) {
        state.tags[tagType] = state.tags[tagType].filter(t => t !== tagText);
        state.filters[tagType] = state.filters[tagType].filter(t => t !== tagText);
        
        debug(`删除${tagType}标签: ${tagText}`, 'success');
        showToast('标签删除成功', 'success');
        
        // 更新本地存储
        localStorage.setItem('tags', JSON.stringify(state.tags));
        renderTags();
        filterDefectsByTags(); // 重新过滤显示
    }
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
    debug(`打开${type}模态框 ${defect ? `- ID: ${defect.id}` : ''}`, 'info');
    
    // 1. 首先定义所有需要的变量
    const modal = document.getElementById('defectModal');
    const isView = type === 'view';
    const isEdit = type === 'edit';
    const isAdd = type === 'add';

    // 2. 准备选项数据
    const craftOptions = state.tags.craft.map(tag => `
        <option value="${tag}" ${defect?.tags.craft === tag ? 'selected' : ''}>
            ${tag}
        </option>
    `).join('');

    const locationOptions = state.tags.location.map(tag => `
        <option value="${tag}" ${defect?.tags.location === tag ? 'selected' : ''}>
            ${tag}
        </option>
    `).join('');

    const positionOptions = state.tags.position.map(tag => `
        <option value="${tag}" ${defect?.tags.position === tag ? 'selected' : ''}>
            ${tag}
        </option>
    `).join('');

    // 3. 构建模态框内容
    modal.innerHTML = `
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
                            ${craftOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>位置</label>
                        <select class="form-control" id="defectLocation" ${isView ? 'disabled' : ''}>
                            ${locationOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>部位</label>
                        <select class="form-control" id="defectPosition" ${isView ? 'disabled' : ''}>
                            ${positionOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>风险等级</label>
                        <select class="form-control" id="defectRisk" ${isView ? 'disabled' : ''}>
                            <option value="低风险" ${defect?.tags.risk === '低风险' ? 'selected' : ''}>低风���</option>
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
                    <button class="btn-text" onclick="resetForm()">
                        <i class="fas fa-undo"></i> 重置
                    </button>
                    <button class="btn-primary" onclick="${isAdd ? 'addDefect()' : `saveDefect('${defect?.id}')`}">
                        <i class="fas fa-save"></i> ${isAdd ? '创建' : '保存'}
                    </button>
                ` : `
                    <button class="btn-primary" onclick="editDefect('${defect.id}')">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                `}
            </div>
        </div>
    `;

    // 4. 显示模态框
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

// 修改 addDefect 函数
function addDefect() {
    debug('添加新缺陷', 'info');
    try {
        // 自动生成新编��
        const newId = generateNewId();
        
        const defect = {
            id: newId,
            title: document.getElementById('defectTitle').value.trim(),
            tags: {
                craft: document.getElementById('defectCraft').value,
                location: document.getElementById('defectLocation').value,
                position: document.getElementById('defectPosition').value,
                risk: document.getElementById('defectRisk').value
            },
            description: document.getElementById('defectDescription').value.trim(),
            image: document.querySelector('#imagePreview img')?.src || '',
            date: new Date().toISOString().split('T')[0]
        };

        // 表单验证
        const validationErrors = validateForm(defect);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join('\n'));
        }

        state.defects.push(defect);
        debug(`新缺陷添加成功 - ID: ${newId}`, 'success');
        showToast('添加成功', 'success');
        
        // 保存到本地存储
        saveToLocalStorage();
        renderDefects();
        closeModal();
    } catch (error) {
        debug(`添加缺陷失败: ${error.message}`, 'error');
        showToast(error.message, 'error');
    }
}

// 添加生成��ID的函数
function generateNewId() {
    const maxId = Math.max(...state.defects.map(d => parseInt(d.id)), 0);
    return String(maxId + 1).padStart(3, '0');
}

// ���滤缺陷列表
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

// 添加调试信息功能
function debug(message, type = 'info') {
    const types = {
        info: 'color: #4f46e5',
        success: 'color: #10b981',
        warning: 'color: #f59e0b',
        error: 'color: #ef4444'
    };
    
    console.log(`%c[Debug ${new Date().toLocaleTimeString()}] ${message}`, types[type]);
}

// 添加表单重置功能
function resetForm() {
    debug('重置表单', 'info');
    const form = document.querySelector('.modal-content');
    const inputs = form.querySelectorAll('input:not([readonly]), select:not([disabled]), textarea:not([readonly])');
    inputs.forEach(input => {
        if (input.type === 'file') {
            input.value = '';
            document.getElementById('imagePreview').innerHTML = '';
        } else {
            input.value = '';
        }
    });
}

// 优化图片上传预览
function handleImageUpload(input) {
    debug('开始上传图片', 'info');
    const file = input.files[0];
    if (file) {
        // 验证文件类型和大小
        if (!file.type.startsWith('image/')) {
            debug('上传失败：文件类型不是图片', 'error');
            alert('请上传图片文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            debug('上传失败：图片大小超过5MB', 'error');
            alert('图片大小不能超过5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `
                <div class="image-preview-container">
                    <img src="${e.target.result}" alt="预览图片">
                    <button class="btn-text danger" onclick="removeImage()" title="删除图片">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            debug('图片上传成功', 'success');
        };
        reader.onerror = function() {
            debug('图片读取失败', 'error');
            alert('图片读取失败，请重试');
        };
        reader.readAsDataURL(file);
    }
}

// 添加删除图片功能
function removeImage() {
    debug('删除图片', 'info');
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageUpload').value = '';
}

// 优化保存功能
function saveDefect(id) {
    debug(`准备保存缺陷 - ID: ${id}`, 'info');
    try {
        // 获取表单数据
        const formData = {
            id: document.getElementById('defectId').value,
            title: document.getElementById('defectTitle').value.trim(),
            tags: {
                craft: document.getElementById('defectCraft').value,
                location: document.getElementById('defectLocation').value,
                position: document.getElementById('defectPosition').value,
                risk: document.getElementById('defectRisk').value
            },
            description: document.getElementById('defectDescription').value.trim(),
            image: document.querySelector('#imagePreview img')?.src || '',
            date: new Date().toISOString().split('T')[0]
        };

        // 表单验证
        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join('\n'));
        }

        // 保存数据
        const index = state.defects.findIndex(d => d.id === id);
        if (index !== -1) {
            state.defects[index] = formData;
            debug(`缺陷更新成功 - ID: ${id}`, 'success');
            showToast('保存成功', 'success');
        }

        // 保存到本地存储
        saveToLocalStorage();
        renderDefects();
        closeModal();
    } catch (error) {
        debug(`保存缺陷失败: ${error.message}`, 'error');
        showToast(error.message, 'error');
    }
}

// 添加表单验证函数
function validateForm(data) {
    const errors = [];
    
    if (!data.title) {
        errors.push('缺陷名称不能为空');
    }
    
    if (!data.description) {
        errors.push('缺陷描述不能为空');
    }
    
    if (!data.image) {
        errors.push('请上传缺陷照片');
    }

    return errors;
}

// 添加提示消息功能
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'exclamation-circle' : 
                          'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // 自动消失
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 添加数据持久化相关的调试信息
function saveToLocalStorage() {
    try {
        localStorage.setItem('defects', JSON.stringify(state.defects));
        debug('数据保存到本地存储成功', 'success');
    } catch (error) {
        debug(`数据保存失败: ${error.message}`, 'error');
    }
}

function loadFromLocalStorage() {
    try {
        const savedDefects = localStorage.getItem('defects');
        if (savedDefects) {
            state.defects = JSON.parse(savedDefects);
            debug(`从本地存储加载了 ${state.defects.length} 条缺陷记录`, 'success');
        }
    } catch (error) {
        debug(`加载本地数据失败: ${error.message}`, 'error');
    }
}

// 修改渲染标签的函数
function renderTags() {
    // 渲染工艺标签
    document.getElementById('craftTags').innerHTML = `
        ${state.tags.craft.map(tag => `
            <span class="tag craft-tag ${state.filters.craft.includes(tag) ? 'selected' : ''}" 
                  onclick="handleTagClick(event)">
                ${tag} 
                <i class="fas fa-times" onclick="event.stopPropagation(); handleTagDelete('craft', '${tag}')"></i>
            </span>
        `).join('')}
        <div class="tag-input-container">
            <input type="text" class="tag-input craft-input" placeholder="输入新标签" style="display: none;">
            <button class="add-tag-btn" onclick="showTagInput(this, 'craft')"><i class="fas fa-plus"></i> 新增</button>
        </div>
    `;

    // 渲染位置标签
    document.getElementById('locationTags').innerHTML = `
        ${state.tags.location.map(tag => `
            <span class="tag location-tag ${state.filters.location.includes(tag) ? 'selected' : ''}"
                  onclick="handleTagClick(event)">
                ${tag} 
                <i class="fas fa-times" onclick="event.stopPropagation(); handleTagDelete('location', '${tag}')"></i>
            </span>
        `).join('')}
        <div class="tag-input-container">
            <input type="text" class="tag-input location-input" placeholder="输入新标签" style="display: none;">
            <button class="add-tag-btn" onclick="showTagInput(this, 'location')"><i class="fas fa-plus"></i> 新增</button>
        </div>
    `;

    // 渲染部位标签
    document.getElementById('positionTags').innerHTML = `
        ${state.tags.position.map(tag => `
            <span class="tag position-tag ${state.filters.position.includes(tag) ? 'selected' : ''}"
                  onclick="handleTagClick(event)">
                ${tag} 
                <i class="fas fa-times" onclick="event.stopPropagation(); handleTagDelete('position', '${tag}')"></i>
            </span>
        `).join('')}
        <div class="tag-input-container">
            <input type="text" class="tag-input position-input" placeholder="输入新标签" style="display: none;">
            <button class="add-tag-btn" onclick="showTagInput(this, 'position')"><i class="fas fa-plus"></i> 新增</button>
        </div>
    `;

    // 添加输入框事件监听
    document.querySelectorAll('.tag-input').forEach(input => {
        input.addEventListener('keypress', handleTagInput);
        input.addEventListener('blur', hideTagInput);
    });
}

// 显示标签输入框
function showTagInput(btn, type) {
    const container = btn.parentElement;
    const input = container.querySelector('.tag-input');
    btn.style.display = 'none';
    input.style.display = 'inline-block';
    input.dataset.type = type;
    input.focus();
}

// 隐藏标签输入框
function hideTagInput(e) {
    const input = e.target;
    const container = input.parentElement;
    const btn = container.querySelector('.add-tag-btn');
    input.style.display = 'none';
    btn.style.display = 'inline-block';
    input.value = '';
}

// 处理标签输入
function handleTagInput(e) {
    if (e.key === 'Enter') {
        const input = e.target;
        const tagType = input.dataset.type;
        const tagName = input.value.trim();
        
        if (tagName) {
            const normalizedTag = tagType === 'craft' ? `${tagName}工艺` : tagName;
            
            if (state.tags[tagType].includes(normalizedTag)) {
                showToast('标签已存在', 'error');
                return;
            }
            
            state.tags[tagType].push(normalizedTag);
            debug(`添加${tagType}标签: ${normalizedTag}`, 'success');
            showToast('标签添加成功', 'success');
            
            // 更新本地存储
            localStorage.setItem('tags', JSON.stringify(state.tags));
            renderTags();
        }
        
        hideTagInput(e);
    }
}

// 在初始化时调用渲染标签函数
document.addEventListener('DOMContentLoaded', () => {
    // ... 其他初始化代码 ...
    renderTags();
});

// 添加基于标签的过滤函数
function filterDefectsByTags() {
    let filteredDefects = [...state.defects];
    
    // 对每种类型的标签进行过滤
    ['craft', 'location', 'position'].forEach(type => {
        if (state.filters[type].length > 0) {
            filteredDefects = filteredDefects.filter(defect => 
                state.filters[type].includes(defect.tags[type])
            );
        }
    });
    
    renderDefects(filteredDefects);
} 