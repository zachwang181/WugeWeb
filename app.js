function showDefectModal(mode, defect = null) {
    const modal = document.getElementById('defectModal');
    
    modal.innerHTML = `
        <div class="modal-content detail-view">
            <div class="modal-header">
                <h2>${mode === 'add' ? '新增缺陷' : '编辑缺陷'}</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="defectForm" onsubmit="handleDefectSubmit(event, '${mode}', '${defect?.id || ''}')">
                    <div class="detail-section basic-info">
                        <div class="section-title">
                            <i class="fas fa-info-circle"></i>基础信息
                        </div>
                        <div class="section-content">
                            <div class="form-grid">
                                <div class="form-item">
                                    <label class="required-field">编号</label>
                                    <input type="text" id="defectId" required 
                                        value="${defect?.id || ''}" 
                                        placeholder="请输入缺陷编号">
                                </div>
                                <div class="form-item">
                                    <label class="required-field">缺陷名称</label>
                                    <input type="text" id="defectTitle" required 
                                        value="${defect?.title || ''}" 
                                        placeholder="请输入缺陷名称">
                                </div>
                                <div class="form-item">
                                    <label class="required-field">工艺类型</label>
                                    <select id="defectCraft" required>
                                        <option value="">请选择工艺类型</option>
                                        ${state.tags.craft.map(tag => `
                                            <option value="${tag}" ${defect?.tags.craft === tag ? 'selected' : ''}>
                                                ${tag}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-item">
                                    <label class="required-field">位置</label>
                                    <select id="defectLocation" required>
                                        <option value="">请选择位置</option>
                                        ${state.tags.location.map(tag => `
                                            <option value="${tag}" ${defect?.tags.location === tag ? 'selected' : ''}>
                                                ${tag}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-item">
                                    <label class="required-field">部位</label>
                                    <select id="defectPosition" required>
                                        <option value="">请选择部位</option>
                                        ${state.tags.position.map(tag => `
                                            <option value="${tag}" ${defect?.tags.position === tag ? 'selected' : ''}>
                                                ${tag}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="form-item">
                                    <label class="required-field">风险程度</label>
                                    <select id="defectRisk" required>
                                        <option value="">请选择风险等级</option>
                                        <option value="低风险" ${defect?.tags.risk === '低风险' ? 'selected' : ''}>低风险</option>
                                        <option value="中风险" ${defect?.tags.risk === '中风险' ? 'selected' : ''}>中风险</option>
                                        <option value="高风险" ${defect?.tags.risk === '高风险' ? 'selected' : ''}>高风险</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section defect-info">
                        <div class="section-title">缺陷信息</div>
                        <div class="section-content">
                            <div class="form-item">
                                <label>缺陷描述</label>
                                <textarea id="defectDescription" rows="3" 
                                    placeholder="详细描述缺陷情况">${defect?.description || ''}</textarea>
                            </div>
                            <div class="form-item">
                                <label>缺陷照片</label>
                                <div class="image-upload-area" onclick="document.getElementById('defectImage').click()">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>点击或拖拽上传图片</p>
                                </div>
                                <input type="file" id="defectImage" hidden accept="image/*" multiple 
                                    onchange="handleMultipleImageUpload(this, 'defectImagePreview')">
                                <div id="defectImagePreview" class="image-preview">
                                    ${defect?.image?.map(img => `
                                        <div class="image-preview-container">
                                            <img src="${img}" alt="缺陷照片" 
                                                onclick="showFullImage('${img}')"
                                                title="点击查看大图">
                                            <button type="button" class="btn-text danger" onclick="removePreviewImage(this)">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    `).join('') || ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section example-info">
                        <div class="section-title">示范信息</div>
                        <div class="section-content">
                            <div class="form-item">
                                <label>示范说明</label>
                                <textarea id="defectExample" rows="3" 
                                    placeholder="描述正确的施工方法">${defect?.example || ''}</textarea>
                            </div>
                            <div class="form-item">
                                <label>示范照片</label>
                                <div class="image-upload-area" onclick="document.getElementById('exampleImages').click()">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>点击或拖拽上传图片</p>
                                </div>
                                <input type="file" id="exampleImages" hidden accept="image/*" multiple 
                                    onchange="handleMultipleImageUpload(this, 'examplePreview')">
                                <div id="examplePreview" class="image-preview">
                                    ${defect?.exampleImages?.map(img => `
                                        <div class="image-preview-container">
                                            <img src="${img}" alt="示范照片" 
                                                onclick="showFullImage('${img}')"
                                                title="点击查看大图">
                                            <button type="button" class="btn-text danger" onclick="removePreviewImage(this)">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    `).join('') || ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="detail-section standard-info">
                        <div class="section-title">规范信息</div>
                        <div class="section-content">
                            <div class="form-item">
                                <label>规范要求</label>
                                <textarea id="defectStandard" rows="3" 
                                    placeholder="引用相关规范要求">${defect?.standard || ''}</textarea>
                            </div>
                            <div class="form-item">
                                <label>规范图示</label>
                                <div class="image-upload-area" onclick="document.getElementById('standardImages').click()">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>点击或拖拽上传图片</p>
                                </div>
                                <input type="file" id="standardImages" hidden accept="image/*" multiple 
                                    onchange="handleMultipleImageUpload(this, 'standardPreview')">
                                <div id="standardPreview" class="image-preview">
                                    ${defect?.standardImages?.map(img => `
                                        <div class="image-preview-container">
                                            <img src="${img}" alt="规范图示" 
                                                onclick="showFullImage('${img}')"
                                                title="点击查看大图">
                                            <button type="button" class="btn-text danger" onclick="removePreviewImage(this)">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    `).join('') || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-text" onclick="closeModal()">取消</button>
                <button type="submit" form="defectForm" class="btn-primary">保存</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

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

// 添加数据持久化相关函数
function saveToLocalStorage() {
    try {
        localStorage.setItem('defects', JSON.stringify(state.defects));
        localStorage.setItem('tags', JSON.stringify(state.tags));
        debug('数据保存到本地存储成功', 'success');
    } catch (error) {
        debug(`数据保存失败: ${error.message}`, 'error');
    }
}

function loadFromLocalStorage() {
    try {
        const savedDefects = localStorage.getItem('defects');
        const savedTags = localStorage.getItem('tags');
        
        if (savedDefects) {
            state.defects = JSON.parse(savedDefects);
            debug(`从本地存储加载了 ${state.defects.length} 条缺陷记录`, 'success');
        }
        
        if (savedTags) {
            state.tags = JSON.parse(savedTags);
            debug('从本地存储加载了标签配置', 'success');
        }
    } catch (error) {
        debug(`加载本地数据失败: ${error.message}`, 'error');
    }
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

    // 确保过滤器状态正确初始化
    state.filters = {
        craft: [],
        location: [],
        position: []
    };
    
    // 渲染标签
    renderTags();
}

// 数据迁移函数
function migrateImageData() {
    if (!state || !state.defects) return;
    
    state.defects = state.defects.map(defect => {
        // 处理主图片
        if (typeof defect.image === 'string' && defect.image) {
            defect.image = [defect.image];
        } else if (!Array.isArray(defect.image)) {
            defect.image = [];
        }
        
        // 处理示范图
        if (!Array.isArray(defect.exampleImages)) {
            defect.exampleImages = [];
        }
        
        // 理规范图片
        if (!Array.isArray(defect.standardImages)) {
            defect.standardImages = [];
        }
        
        return defect;
    });
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 先尝试从本地存储加载数据
    loadFromLocalStorage();
    
    // 如果没有数据，才加载模拟数据
    if (state.defects.length === 0) {
        loadMockData();
    }

    // 数据迁移
    migrateImageData();
    
    // 保存初数据
    saveToLocalStorage();
    
    // 初始化事件监听器
    initializeEventListeners();
    
    // 渲染界面
    renderDefects();
    renderTags();
    
    // 恢复保存的视图偏好
    const preferredView = localStorage.getItem('preferred-view');
    if (preferredView) {
        const button = document.querySelector(`[data-size="${preferredView}"]`);
        if (button) {
            button.click();
        }
    }
    
    // ... 其他初始化代码 ...
});

// 加载模拟数据
function loadMockData() {
    state.defects = [
        {
            id: '001',
            title: '墙面裂缝',
            image: [], // 改为空数组
            tags: {
                craft: '砌筑工艺',
                location: '客厅',
                position: '墙面',
                risk: '高风险'
            },
            date: '2024-03-20',
            description: '墙面裂，裂缝宽约0.3mm，位于户角部位置，呈45度角延伸。',
            example: '正确的墙面施工应确保砂浆配比合理，砌筑时应注意砂浆饱满度，避免空鼓。',
            exampleImages: [], // 初始化为空数组
            standard: '根据《建筑工程施工质量验收统一标准》GB50300-2013第5.3.2条规定...',
            standardImages: [] // 初始化为空数组
        }
    ];
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
    renderDefects(); // 直接调用 renderDefects，它会内部调用 filterDefectsByTags
}

// 处理添加标签
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

// 基于标签的过滤函数
function filterDefectsByTags() {
    let filteredDefects = [...state.defects];
    
    // 对每种类型的标签进行过滤
    ['craft', 'location', 'position'].forEach(type => {
        if (state.filters[type]?.length > 0) {
            const beforeCount = filteredDefects.length;
            filteredDefects = filteredDefects.filter(defect => {
                return state.filters[type].includes(defect.tags[type]);
            });
            debug(`${type}过滤: ${beforeCount} -> ${filteredDefects.length}`, 'info');
        }
    });
    
    return filteredDefects;
}

// 渲染标签
function renderTags() {
    // 渲染工艺标签
    document.getElementById('craftTags').innerHTML = `
        ${state.tags.craft.map(tag => `
            <span class="tag craft-tag ${state.filters.craft?.includes(tag) ? 'selected' : ''}" 
                  data-type="craft" 
                  data-tag="${tag}">
                ${tag} 
                <i class="fas fa-times" data-action="delete"></i>
            </span>
        `).join('')}
        <button class="add-tag-btn" data-type="craft">
            <i class="fas fa-plus"></i> 新增
        </button>
    `;

    // 渲染位置标签
    document.getElementById('locationTags').innerHTML = `
        ${state.tags.location.map(tag => `
            <span class="tag location-tag ${state.filters.location?.includes(tag) ? 'selected' : ''}"
                  data-type="location"
                  data-tag="${tag}">
                ${tag} 
                <i class="fas fa-times" data-action="delete"></i>
            </span>
        `).join('')}
        <button class="add-tag-btn" data-type="location">
            <i class="fas fa-plus"></i> 新增
        </button>
    `;

    // 渲染部位标签
    document.getElementById('positionTags').innerHTML = `
        ${state.tags.position.map(tag => `
            <span class="tag position-tag ${state.filters.position?.includes(tag) ? 'selected' : ''}"
                  data-type="position"
                  data-tag="${tag}">
                ${tag} 
                <i class="fas fa-times" data-action="delete"></i>
            </span>
        `).join('')}
        <button class="add-tag-btn" data-type="position">
            <i class="fas fa-plus"></i> 新增
        </button>
    `;

    // 添加事件委托
    addTagEventListeners();
}

// 添加事件委托函数
function addTagEventListeners() {
    // 移除所有现有的事件监听器
    ['craftTags', 'locationTags', 'positionTags'].forEach(containerId => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // 移除现有的事件监听器
        const clone = container.cloneNode(true);
        container.parentNode.replaceChild(clone, container);
        
        // 添加新的事件监听器
        clone.addEventListener('click', (e) => {
            const target = e.target;
            
            // 处理删除按钮点击
            if (target.matches('[data-action="delete"]')) {
                e.stopPropagation();
                const tag = target.closest('.tag');
                if (tag) {
                    const type = tag.dataset.type;
                    const tagText = tag.dataset.tag;
                    handleTagDelete(type, tagText);
                }
                return;
            }

            // 处理标签点击
            const tag = target.closest('.tag');
            if (tag) {
                const type = tag.dataset.type;
                const tagText = tag.dataset.tag;
                
                if (!state.filters[type]) {
                    state.filters[type] = [];
                }
                
                if (state.filters[type].includes(tagText)) {
                    state.filters[type] = state.filters[type].filter(t => t !== tagText);
                    tag.classList.remove('selected');
                } else {
                    state.filters[type].push(tagText);
                    tag.classList.add('selected');
                }
                
                debug(`更新${type}过滤器: ${state.filters[type].join(', ')}`, 'info');
                renderDefects();
            }
        });
    });
}

// 处理标签删除
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

// 修改视图切换处理函数
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
    grid.classList.remove('view-compact', 'view-normal');
    grid.classList.add(`view-${size}`);
    
    // 保存用户偏好
    localStorage.setItem('preferred-view', size);
    
    debug(`视图切换为: ${size}`, 'info');
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

// 修改渲染缺陷列表函数
function renderDefects() {
    const grid = document.getElementById('defectGrid');
    const currentView = grid.classList.contains('view-compact') ? 'compact' : 'normal';
    
    // 应用过滤器
    let filteredDefects = filterDefectsByTags();
    debug(`过滤后显示 ${filteredDefects.length} 个缺陷`, 'info');
    
    if (filteredDefects.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>没有找到匹配的缺陷记录</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredDefects.map(defect => `
        <div class="defect-card" data-id="${defect.id}">
            <div class="card-header">
                <span class="defect-id">${defect.id}</span>
                <h3>${defect.title}</h3>
            </div>
            ${currentView === 'normal' ? `
                <div class="card-image" onclick="viewDefect('${defect.id}')">
                    <img src="${defect.image?.[0] || ''}" alt="${defect.title}">
                    ${defect.image?.length > 1 ? `
                        <div class="image-count">+${defect.image.length - 1}</div>
                    ` : ''}
                </div>
            ` : ''}
            <div class="card-tags">
                <span class="tag craft-tag">${defect.tags.craft}</span>
                <span class="tag location-tag">${defect.tags.location}</span>
                <span class="tag position-tag">${defect.tags.position}</span>
                <span class="tag risk-tag">${defect.tags.risk}</span>
                <span class="tag date-tag">${defect.date}</span>
            </div>
            <div class="card-actions">
                <button class="btn-text" onclick="viewDefect('${defect.id}')">
                    <i class="fas fa-eye"></i> ${currentView === 'normal' ? '查看' : ''}
                </button>
                <button class="btn-text" onclick="editDefect('${defect.id}')">
                    <i class="fas fa-edit"></i> ${currentView === 'normal' ? '编辑' : ''}
                </button>
                <button class="btn-text danger" onclick="deleteDefect('${defect.id}')">
                    <i class="fas fa-trash"></i> ${currentView === 'normal' ? '删除' : ''}
                </button>
            </div>
        </div>
    `).join('');
}

// 添加搜索过滤功能
function filterDefects(keyword) {
    const filtered = state.defects.filter(defect => 
        defect.title.toLowerCase().includes(keyword.toLowerCase()) ||
        defect.description?.toLowerCase().includes(keyword.toLowerCase()) ||
        defect.tags.craft.toLowerCase().includes(keyword.toLowerCase()) ||
        defect.tags.location.toLowerCase().includes(keyword.toLowerCase()) ||
        defect.tags.position.toLowerCase().includes(keyword.toLowerCase())
    );
    renderDefects(filtered);
}

// 添加查看缺陷详情功能
function viewDefect(id) {
    const defect = state.defects.find(d => d.id === id);
    const modal = document.getElementById('defectModal');
    
    modal.innerHTML = `
        <div class="modal-content detail-view">
            <div class="modal-header">
                <h2>缺陷详情</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="detail-section basic-info">
                    <div class="section-title">
                        <i class="fas fa-info-circle"></i>基础信息
                    </div>
                    <div class="section-content">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>编号：</label>
                                <span>${defect.id}</span>
                            </div>
                            <div class="detail-item">
                                <label>缺陷名称：</label>
                                <span>${defect.title}</span>
                            </div>
                            <div class="detail-item">
                                <label>工艺：</label>
                                <span>${defect.tags.craft}</span>
                            </div>
                            <div class="detail-item">
                                <label>位置：</label>
                                <span>${defect.tags.location}</span>
                            </div>
                            <div class="detail-item">
                                <label>部位：</label>
                                <span>${defect.tags.position}</span>
                            </div>
                            <div class="detail-item">
                                <label>风险程度：</label>
                                <span class="risk-level ${defect.tags.risk}">${defect.tags.risk}</span>
                            </div>
                            <div class="detail-item">
                                <label>更新时间：</label>
                                <span>${defect.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section defect-info">
                    <div class="section-title">
                        <i class="fas fa-exclamation-triangle"></i>缺陷信息
                    </div>
                    <div class="section-content">
                        <p>${defect.description}</p>
                        <div class="detail-images">
                            ${defect.image?.length ? 
                                defect.image.map(img => `
                                    <img src="${img}" alt="缺陷照片" 
                                        onclick="showFullImage('${img}')" 
                                        title="点击查看大图">
                                `).join('') : 
                                '<div class="no-image-placeholder"><i class="fas fa-image"></i><p>暂无图片</p></div>'
                            }
                        </div>
                    </div>
                </div>

                <div class="detail-section example-info">
                    <div class="section-title">
                        <i class="fas fa-check-circle"></i>示范信息
                    </div>
                    <div class="section-content">
                        <p>${defect.example || ''}</p>
                        <div class="detail-images">
                            ${defect.exampleImages?.length ? 
                                defect.exampleImages.map(img => `
                                    <img src="${img}" alt="示范照片" 
                                        onclick="showFullImage('${img}')" 
                                        title="点击查看大图">
                                `).join('') : 
                                '<div class="no-image-placeholder"><i class="fas fa-image"></i><p>暂无图片</p></div>'
                            }
                        </div>
                    </div>
                </div>

                <div class="detail-section standard-info">
                    <div class="section-title">
                        <i class="fas fa-book"></i>规范信息
                    </div>
                    <div class="section-content">
                        <p>${defect.standard || ''}</p>
                        <div class="detail-images">
                            ${defect.standardImages?.length ? 
                                defect.standardImages.map(img => `
                                    <img src="${img}" alt="规范图示" 
                                        onclick="showFullImage('${img}')" 
                                        title="点击查看大图">
                                `).join('') : 
                                '<div class="no-image-placeholder"><i class="fas fa-image"></i><p>暂无图片</p></div>'
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-text" onclick="closeModal()">
                    <i class="fas fa-arrow-left"></i> ��回列表
                </button>
                <button class="btn-text" onclick="editDefect('${defect.id}')">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="btn-text danger" onclick="deleteDefect('${defect.id}')">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// 编辑缺陷
function editDefect(id) {
    const defect = state.defects.find(d => d.id === id);
    showDefectModal('edit', defect);
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('defectModal');
    modal.style.display = 'none';
}

// 删除缺陷
function deleteDefect(id) {
    if (confirm('确定要删除这条缺陷记录吗？')) {
        const index = state.defects.findIndex(d => d.id === id);
        if (index !== -1) {
            state.defects.splice(index, 1);
            saveToLocalStorage(); // 保存更改
            renderDefects();
            closeModal(); // 如果在查看详情时删除，需要关闭模态框
            showToast('删除成功', 'success');
        }
    }
}

// 处理表单提交
function handleDefectSubmit(event, mode, defectId) {
    event.preventDefault();
    
    try {
        const formData = {
            id: mode === 'add' ? generateNewId() : defectId,
            title: document.getElementById('defectTitle').value.trim(),
            tags: {
                craft: document.getElementById('defectCraft').value,
                location: document.getElementById('defectLocation').value,
                position: document.getElementById('defectPosition').value,
                risk: document.getElementById('defectRisk').value
            },
            description: document.getElementById('defectDescription').value.trim(),
            image: Array.from(document.querySelectorAll('#defectImagePreview img')).map(img => img.src),
            example: document.getElementById('defectExample')?.value?.trim() || '',
            exampleImages: Array.from(document.querySelectorAll('#examplePreview img')).map(img => img.src),
            standard: document.getElementById('defectStandard')?.value?.trim() || '',
            standardImages: Array.from(document.querySelectorAll('#standardPreview img')).map(img => img.src),
            date: new Date().toISOString().split('T')[0]
        };

        // 表单验证
        const validationErrors = validateForm(formData);
        if (validationErrors.length > 0) {
            throw new Error(validationErrors.join('\n'));
        }

        if (mode === 'add') {
            state.defects.push(formData);
            debug('新增缺陷成功', 'success');
        } else {
            const index = state.defects.findIndex(d => d.id === defectId);
            if (index !== -1) {
                state.defects[index] = formData;
                debug('更新缺陷成功', 'success');
            }
        }

        saveToLocalStorage();
        renderDefects();
        closeModal();
        showToast(mode === 'add' ? '添加成功' : '更新成功', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// 表单验证
function validateForm(data) {
    const errors = [];
    
    if (!data.title) {
        errors.push('缺陷名称不能为空');
    }
    
    if (!data.tags.craft || !data.tags.location || !data.tags.position || !data.tags.risk) {
        errors.push('请完整填写标签信息');
    }

    return errors;
}

// 生成新ID
function generateNewId() {
    const maxId = Math.max(...state.defects.map(d => parseInt(d.id)), 0);
    return String(maxId + 1).padStart(3, '0');
}

// 显示全屏图片
function showFullImage(src) {
    debug(`正在打开图片预览: ${src}`, 'info');
    
    // 先移除可能存在的旧预览模态框
    const existingModal = document.querySelector('.fullscreen-image');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal fullscreen-image';
    modal.style.display = 'block'; // 确保模态框显示
    modal.innerHTML = `
        <div class="modal-content image-preview-modal">
            <div class="preview-header">
                <button class="close-btn" onclick="closeImagePreview(this)">&times;</button>
            </div>
            <div class="preview-body">
                <button class="nav-btn prev" onclick="navigateImage(-1)" style="display: none;">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <img src="${src}" alt="预览图片">
                <button class="nav-btn next" onclick="navigateImage(1)" style="display: none;">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="preview-footer">
                <div class="image-counter"></div>
                <div class="preview-controls">
                    <button class="btn-text" onclick="rotateImage(-90)">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="btn-text" onclick="rotateImage(90)">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="btn-text" onclick="zoomImage(0.1)">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button class="btn-text" onclick="zoomImage(-0.1)">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button class="btn-text" onclick="resetImage()">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 初始化图片预览状态
    window.imagePreviewState = {
        rotation: 0,
        scale: 1,
        images: [],
        currentIndex: 0
    };
    
    // 获取同组的所有图片
    const container = document.querySelector(`img[src="${src}"]`)?.closest('.detail-images, .image-preview');
    if (container) {
        const images = Array.from(container.querySelectorAll('img')).map(img => img.src);
        debug(`找到同组图片: ${images.length}张`, 'info');
        window.imagePreviewState.images = images;
        window.imagePreviewState.currentIndex = images.indexOf(src);
        
        // 如果有多张图片，显示导航按钮
        if (images.length > 1) {
            debug('启用图片导航按钮', 'info');
            modal.querySelector('.nav-btn.prev').style.display = 'flex';
            modal.querySelector('.nav-btn.next').style.display = 'flex';
            updateImageCounter();
        }
    } else {
        debug('未找到同组图片容器', 'warning');
    }
    
    // 添加键盘事件监听
    document.addEventListener('keydown', handleImagePreviewKeydown);
    
    debug('图片预览模态框已创建', 'success');
}

// 关闭图片预览
function closeImagePreview(btn) {
    const modal = btn.closest('.modal');
    modal.remove();
    document.removeEventListener('keydown', handleImagePreviewKeydown);
    window.imagePreviewState = null;
}

// 处理键盘事件
function handleImagePreviewKeydown(e) {
    switch(e.key) {
        case 'Escape':
            document.querySelector('.fullscreen-image .close-btn').click();
            break;
        case 'ArrowLeft':
            navigateImage(-1);
            break;
        case 'ArrowRight':
            navigateImage(1);
            break;
    }
}

// 图片导航
function navigateImage(direction) {
    const state = window.imagePreviewState;
    if (!state || !state.images.length) return;
    
    state.currentIndex = (state.currentIndex + direction + state.images.length) % state.images.length;
    const modal = document.querySelector('.fullscreen-image');
    const img = modal.querySelector('img');
    img.src = state.images[state.currentIndex];
    
    // 重置图片状态
    resetImage();
    updateImageCounter();
}

// 更新图片计数器
function updateImageCounter() {
    const state = window.imagePreviewState;
    if (!state || !state.images.length) return;
    
    const counter = document.querySelector('.image-counter');
    counter.textContent = `${state.currentIndex + 1} / ${state.images.length}`;
}

// 旋转图片
function rotateImage(degree) {
    const state = window.imagePreviewState;
    if (!state) return;
    
    state.rotation = (state.rotation + degree) % 360;
    const img = document.querySelector('.fullscreen-image img');
    img.style.transform = `rotate(${state.rotation}deg) scale(${state.scale})`;
}

// 缩放图片
function zoomImage(delta) {
    const state = window.imagePreviewState;
    if (!state) return;
    
    state.scale = Math.max(0.1, Math.min(3, state.scale + delta));
    const img = document.querySelector('.fullscreen-image img');
    img.style.transform = `rotate(${state.rotation}deg) scale(${state.scale})`;
}

// 重置图片状态
function resetImage() {
    const state = window.imagePreviewState;
    if (!state) return;
    
    state.rotation = 0;
    state.scale = 1;
    const img = document.querySelector('.fullscreen-image img');
    img.style.transform = '';
}

// 处理多图片上传
function handleMultipleImageUpload(input, previewId) {
    const files = Array.from(input.files);
    const preview = document.getElementById(previewId);
    
    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showToast('请上传图片文件', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('图片大小不能超过5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const container = document.createElement('div');
            container.className = 'image-preview-container';
            container.innerHTML = `
                <img src="${e.target.result}" 
                     alt="预览图片" 
                     onclick="showFullImage('${e.target.result}')"
                     title="点击查看大图">
                <button class="btn-text danger" onclick="removePreviewImage(this)" title="删除图片">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(container);
            debug(`图片上传成功: ${file.name}`, 'success');
        };
        reader.onerror = function() {
            debug(`图片读取失败: ${file.name}`, 'error');
            showToast('图片读取失败，请重试', 'error');
        };
        reader.readAsDataURL(file);
    });
}

// 删除预览图片
function removePreviewImage(button) {
    button.closest('.image-preview-container').remove();
}

// 显示提示消息
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
