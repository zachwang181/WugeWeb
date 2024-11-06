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
        debug('开始从本地存储加载数据...', 'info');
        
        const savedDefects = localStorage.getItem('defects');
        const savedTags = localStorage.getItem('tags');
        
        if (savedDefects) {
            state.defects = JSON.parse(savedDefects);
            debug(`从本地存储加载缺陷记录成功: ${state.defects.length} 条`, 'success');
        } else {
            debug('本地存储中未找到缺陷记录', 'warning');
        }
        
        if (savedTags) {
            state.tags = JSON.parse(savedTags);
            debug('从本地存储加载标签配置成功', 'success');
        } else {
            debug('使用默认标签配置', 'info');
        }
        
        return true;
    } catch (error) {
        debug(`加载本地数据失败: ${error.message}`, 'error');
        return false;
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

// 添加清除数据的函数
function clearAllData() {
    try {
        localStorage.removeItem('defects');
        localStorage.removeItem('tags');
        localStorage.removeItem('preferred-view');
        state.defects = [];
        state.filters = {
            craft: [],
            location: [],
            position: []
        };
        // 重置为默认标签
        state.tags = {
            craft: ['砌筑', '抹灰', '防水', '木作', '油漆'],
            location: ['主卧', '客厅', '厨房', '卫生间', '阳台'],
            position: ['墙面', '地面', '天花', '门窗', '踢脚线']
        };
        debug('所有数据已除', 'success');
        return true;
    } catch (error) {
        debug(`清除数据失败: ${error.message}`, 'error');
        return false;
    }
}

// 添加首次加载检查函数
async function loadInitialData() {
    try {
        debug('检查是否为首次加载...', 'info');
        
        // 检查是否首次加载
        const isFirstLoad = !localStorage.getItem('hasInitialized');
        
        if (isFirstLoad) {
            debug('检测到首次加载，准备加载初始配置...', 'info');
            
            // 加载 initial.json
            const response = await fetch('initial.json');
            if (!response.ok) {
                throw new Error('无法加载初始配置文件');
            }
            
            const initialData = await response.json();
            
            // 更新状态
            state.defects = initialData.defects || [];
            if (initialData.tags) {
                state.tags = initialData.tags;
            }
            
            // 保存到本地存储
            saveToLocalStorage();
            
            // 标记已初始化
            localStorage.setItem('hasInitialized', 'true');
            
            debug('初始配置加载完成', 'success');
            return true;
        } else {
            debug('检测到已初始化，使用本地存储数据', 'info');
            return false;
        }
    } catch (error) {
        debug(`加载初始配置失败: ${error.message}`, 'error');
        return false;
    }
}

// 修改 DOM 加载完成后的初始化函数
document.addEventListener('DOMContentLoaded', async () => {
    debug('系统初始化开始...', 'info');
    
    // 清除可能存在的示例卡片
    const defectGrid = document.getElementById('defectGrid');
    if (defectGrid) {
        defectGrid.innerHTML = '';
        debug('清除示例卡片', 'info');
    }
    
    // 检查是否首次加载
    const isFirstLoad = await loadInitialData();
    
    if (!isFirstLoad) {
        // 如果不是首次加载，从本地存储加载数据
        loadFromLocalStorage();
    }

    // 数据迁移
    debug('开始数据迁移检查...', 'info');
    migrateImageData();
    
    // 保存初始数据
    debug('保存数据到本地存储...', 'info');
    saveToLocalStorage();
    
    // 初始化事件监听器
    debug('初始化事件监听器...', 'info');
    initializeEventListeners();
    
    // 渲染界面
    debug('开始渲染界面...', 'info');
    renderDefects();
    renderTags();
    
    // 恢复视图偏好，如果没有保存过偏好，则默认使用列表视图
    const preferredView = localStorage.getItem('preferred-view') || 'compact';
    debug(`设置视图模式: ${preferredView}`, 'info');
    const button = document.querySelector(`[data-size="${preferredView}"]`);
    if (button) {
        button.click();
    }
    
    debug('系统初始化完成', 'success');
});

// 加载模拟数据
function loadMockData() {
    debug('开始加载示例数据...', 'info');
    state.defects = [
        {
            id: '001',
            title: '墙面裂缝',
            image: [], 
            tags: {
                craft: '砌筑工艺',
                location: '客厅',
                position: '墙面',
                risk: '高风险'
            },
            date: '2024-03-20',
            description: '墙面裂，裂缝宽约0.3mm，位于户角部位置，呈45度角延伸。',
            example: '正确的墙面施工应确保砂浆配比合理，砌筑时应注意砂浆饱满度，避免空鼓。',
            exampleImages: [],
            standard: '根据《建筑工程施工质量验收统一标准》GB50300-2013第5.3.2条规定...',
            standardImages: []
        }
    ];
    debug(`示例数据加载完成: ${state.defects.length} 条记录`, 'success');
}

// 处理标签点击
function handleTagClick(event) {
    event.stopPropagation(); // 阻止事件冒泡
    const tag = event.currentTarget;
    const tagType = tag.dataset.type;
    const tagText = tag.dataset.tag;
    
    if (!state.filters[tagType]) {
        state.filters[tagType] = [];
    }
    
    // 更新过滤状
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
function handleAddTag(tagType) {
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
        saveToLocalStorage();
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
                  onclick="handleTagClick(event)"
                  ondblclick="handleTagEdit(event)"
                  draggable="true"
                  ondragstart="handleDragStart(event)"
                  ondragover="handleDragOver(event)"
                  ondrop="handleDrop(event)"
                  data-type="craft" 
                  data-tag="${tag}">
                ${tag} 
                <i class="fas fa-times" onclick="handleTagDelete('craft', '${tag}')" 
                   style="display: ${isTagInUse('craft', tag) ? 'none' : 'inline'}"></i>
            </span>
        `).join('')}
        <div class="tag-input-container">
            <button class="add-tag-btn" onclick="showTagInput(this, 'craft')">
                <i class="fas fa-plus"></i> 新增
            </button>
            <input type="text" class="tag-input craft-input" 
                   style="display: none"
                   onkeydown="handleTagInput(event)"
                   onblur="hideTagInput(event)"
                   data-type="craft"
                   placeholder="输入工艺名称">
        </div>
    `;

    // 渲染位置标签
    document.getElementById('locationTags').innerHTML = `
        ${state.tags.location.map(tag => `
            <span class="tag location-tag ${state.filters.location?.includes(tag) ? 'selected' : ''}"
                  onclick="handleTagClick(event)"
                  ondblclick="handleTagEdit(event)"
                  draggable="true"
                  ondragstart="handleDragStart(event)"
                  ondragover="handleDragOver(event)"
                  ondrop="handleDrop(event)"
                  data-type="location"
                  data-tag="${tag}">
                ${tag} 
                <i class="fas fa-times" onclick="handleTagDelete('location', '${tag}')" 
                   style="display: ${isTagInUse('location', tag) ? 'none' : 'inline'}"></i>
            </span>
        `).join('')}
        <div class="tag-input-container">
            <button class="add-tag-btn" onclick="showTagInput(this, 'location')">
                <i class="fas fa-plus"></i> 新增
            </button>
            <input type="text" class="tag-input location-input" 
                   style="display: none"
                   onkeydown="handleTagInput(event)"
                   onblur="hideTagInput(event)"
                   data-type="location"
                   placeholder="输入位置名称">
        </div>
    `;

    // 渲染部位标签
    document.getElementById('positionTags').innerHTML = `
        ${state.tags.position.map(tag => `
            <span class="tag position-tag ${state.filters.position?.includes(tag) ? 'selected' : ''}"
                  onclick="handleTagClick(event)"
                  ondblclick="handleTagEdit(event)"
                  draggable="true"
                  ondragstart="handleDragStart(event)"
                  ondragover="handleDragOver(event)"
                  ondrop="handleDrop(event)"
                  data-type="position"
                  data-tag="${tag}">
                ${tag} 
                <i class="fas fa-times" onclick="handleTagDelete('position', '${tag}')" 
                   style="display: ${isTagInUse('position', tag) ? 'none' : 'inline'}"></i>
            </span>
        `).join('')}
        <div class="tag-input-container">
            <button class="add-tag-btn" onclick="showTagInput(this, 'position')">
                <i class="fas fa-plus"></i> 新增
            </button>
            <input type="text" class="tag-input position-input" 
                   style="display: none"
                   onkeydown="handleTagInput(event)"
                   onblur="hideTagInput(event)"
                   data-type="position"
                   placeholder="输入部位名称">
        </div>
    `;
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
    // 检查标签是否在使用中
    if (isTagInUse(tagType, tagText)) {
        showToast('该标签正在使用中，无法删除', 'error');
        return;
    }
    
    if (confirm(`确定要删除"${tagText}"标签吗？`)) {
        state.tags[tagType] = state.tags[tagType].filter(t => t !== tagText);
        state.filters[tagType] = state.filters[tagType].filter(t => t !== tagText);
        
        debug(`删除${tagType}标签: ${tagText}`, 'success');
        showToast('标签删除成功', 'success');
        
        saveToLocalStorage();
        renderTags();
        renderDefects();
    }
}

// 修改显示标签输入框函数
function showTagInput(btn, type) {
    const container = btn.closest('.tag-input-container');
    const input = container.querySelector('.tag-input');
    btn.style.display = 'none';
    input.style.display = 'inline-block';
    input.focus();
}

// 修改隐藏标签输入框函数
function hideTagInput(event) {
    const input = event.target;
    const container = input.closest('.tag-input-container');
    const btn = container.querySelector('.add-tag-btn');
    
    // 如果输入框有值，则添加标签
    if (input.value.trim()) {
        handleTagInput({
            key: 'Enter',
            target: input
        });
    }
    
    // 延迟隐藏输入框，以确保标签添加完成
    setTimeout(() => {
        input.style.display = 'none';
        btn.style.display = 'inline-block';
        input.value = '';
    }, 100);
}

// 修改处理标签输入函数，添加同名检查
function handleTagInput(event) {
    if (event.key === 'Enter') {
        const input = event.target;
        const tagType = input.dataset.type;
        const tagName = input.value.trim();
        
        if (tagName) {
            // 检查是否存在同名标签
            if (state.tags[tagType].includes(tagName)) {
                debug(`标签"${tagName}"已存在`, 'warning');
                input.value = ''; // 清输入
                return;
            }
            
            // 添加新标签
            state.tags[tagType].push(tagName);
            debug(`添加${tagType}标签: ${tagName}`, 'success');
            
            // 更新本地存储
            saveToLocalStorage();
            renderTags();
            
            // 清空并隐藏输入框
            input.value = '';
            const container = input.closest('.tag-input-container');
            const btn = container.querySelector('.add-tag-btn');
            input.style.display = 'none';
            btn.style.display = 'inline-block';
        }
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
                    ${defect.image?.length ? `
                        <img src="${defect.image[0]}" alt="${defect.title}">
                        ${defect.image.length > 1 ? `
                            <div class="image-count">+${defect.image.length - 1}</div>
                        ` : ''}
                    ` : `
                        <div class="no-image-placeholder">
                            <i class="fas fa-image"></i>
                            <p>暂无图片</p>
                        </div>
                    `}
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
                                        title="击查看大图">
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
                    <i class="fas fa-arrow-left"></i> 回列表
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

// 删除陷
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

// 添加检查标签是否在使用的函数
function isTagInUse(tagType, tagValue) {
    return state.defects.some(defect => defect.tags[tagType] === tagValue);
}

// 添加标签编辑处理数
function handleTagEdit(event) {
    event.stopPropagation();
    const tag = event.currentTarget;
    const tagType = tag.dataset.type;
    const oldValue = tag.dataset.tag;
    
    // 创建一个临时输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;
    input.className = `tag-input ${tagType}-input`;
    input.style.width = (tag.offsetWidth - 20) + 'px'; // 减去padding
    
    // 处理输入框的按键事件
    input.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const newValue = input.value.trim();
            if (newValue && newValue !== oldValue) {
                updateTag(tagType, oldValue, newValue);
            }
            tag.innerHTML = `${oldValue} <i class="fas fa-times" onclick="handleTagDelete('${tagType}', '${oldValue}')"></i>`;
            input.remove();
        } else if (e.key === 'Escape') {
            tag.innerHTML = `${oldValue} <i class="fas fa-times" onclick="handleTagDelete('${tagType}', '${oldValue}')"></i>`;
            input.remove();
        }
    };
    
    // 处理失去焦点事件
    input.onblur = () => {
        const newValue = input.value.trim();
        if (newValue && newValue !== oldValue) {
            updateTag(tagType, oldValue, newValue);
        }
        tag.innerHTML = `${oldValue} <i class="fas fa-times" onclick="handleTagDelete('${tagType}', '${oldValue}')"></i>`;
        input.remove();
    };
    
    // 替换标签内容为输入框
    tag.innerHTML = '';
    tag.appendChild(input);
    input.focus();
    input.select();
}

// 修改更新标签函数，添加同名检查
function updateTag(tagType, oldValue, newValue) {
    // 如果新值和旧值相同，不做任何操作
    if (oldValue === newValue) return;
    
    // 检查是否存在同名标签（排除自身）
    if (state.tags[tagType].some(tag => tag !== oldValue && tag === newValue)) {
        debug(`标签"${newValue}"已存在`, 'warning');
        showToast('标签名称已存在', 'warning');
        return;
    }
    
    // 更新标签数组
    const index = state.tags[tagType].indexOf(oldValue);
    if (index !== -1) {
        state.tags[tagType][index] = newValue;
    }
    
    // 更新所有使用该标签的缺陷记录
    state.defects.forEach(defect => {
        if (defect.tags[tagType] === oldValue) {
            defect.tags[tagType] = newValue;
        }
    });
    
    // 更新过滤器
    if (state.filters[tagType].includes(oldValue)) {
        const filterIndex = state.filters[tagType].indexOf(oldValue);
        state.filters[tagType][filterIndex] = newValue;
    }
    
    // 保存更改并重新渲染
    saveToLocalStorage();
    renderTags();
    renderDefects();
    
    debug(`标签已更新: ${tagType} ${oldValue} -> ${newValue}`, 'success');
    showToast('标签更新成功', 'success');
}

// 添加拖拽相关函数
function handleDragStart(event) {
    const tag = event.currentTarget;
    tag.classList.add('dragging');
    event.dataTransfer.setData('text/plain', JSON.stringify({
        type: tag.dataset.type,
        tag: tag.dataset.tag,
        index: Array.from(tag.parentNode.children).indexOf(tag)
    }));
}

function handleDragOver(event) {
    event.preventDefault();
    const tag = event.currentTarget;
    if (tag.classList.contains('tag')) {
        const draggedTag = document.querySelector('.dragging');
        if (draggedTag && draggedTag.dataset.type === tag.dataset.type) {
            const rect = tag.getBoundingClientRect();
            const midPoint = (rect.left + rect.right) / 2;
            
            if (event.clientX < midPoint) {
                tag.classList.add('drag-before');
                tag.classList.remove('drag-after');
            } else {
                tag.classList.add('drag-after');
                tag.classList.remove('drag-before');
            }
        }
    }
}

function handleDrop(event) {
    event.preventDefault();
    const targetTag = event.currentTarget;
    const dragData = JSON.parse(event.dataTransfer.getData('text/plain'));
    
    // 确保是同类型标签之间的拖拽
    if (targetTag.dataset.type === dragData.type) {
        const tags = state.tags[dragData.type];
        const draggedTag = tags[dragData.index];
        const targetIndex = Array.from(targetTag.parentNode.children).indexOf(targetTag);
        
        // 从数组中移除拖拽的标签
        tags.splice(dragData.index, 1);
        
        // 在新位置插入标签
        const newIndex = targetTag.classList.contains('drag-after') ? 
            targetIndex + 1 : targetIndex;
        tags.splice(newIndex, 0, draggedTag);
        
        // 保存更改并重新渲染
        saveToLocalStorage();
        renderTags();
        
        debug(`标签排序已更新: ${dragData.type}`, 'success');
    }
    
    // 清除拖拽相关的样式
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('dragging', 'drag-before', 'drag-after');
    });
}

function handleDragEnd(event) {
    // 清除所有拖拽相关的样式
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('dragging', 'drag-before', 'drag-after');
    });
}

// 修改导出功能，添加图片处理
async function exportSystem() {
    try {
        debug('开始准备导出数据...', 'info');
        
        // 深拷贝数据以避免修改原始数据
        const exportData = {
            defects: JSON.parse(JSON.stringify(state.defects)),
            tags: state.tags,
            version: '1.0',
            exportDate: new Date().toISOString()
        };
        
        // 处理所有缺陷记录中的图片
        for (let defect of exportData.defects) {
            // 处理主图片
            if (defect.image && defect.image.length) {
                defect.image = await Promise.all(defect.image.map(async (imgUrl) => {
                    return await fetchAndConvertToBase64(imgUrl);
                }));
            }
            
            // 处理示范图片
            if (defect.exampleImages && defect.exampleImages.length) {
                defect.exampleImages = await Promise.all(defect.exampleImages.map(async (imgUrl) => {
                    return await fetchAndConvertToBase64(imgUrl);
                }));
            }
            
            // 处理规范图片
            if (defect.standardImages && defect.standardImages.length) {
                defect.standardImages = await Promise.all(defect.standardImages.map(async (imgUrl) => {
                    return await fetchAndConvertToBase64(imgUrl);
                }));
            }
        }
        
        debug('图片数据处理完成', 'success');
        
        // 转换为JSON字符串
        const jsonStr = JSON.stringify(exportData);
        
        // 创建Blob对象
        const blob = new Blob([jsonStr], { type: 'application/json' });
        
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `house-inspection-system-${new Date().toISOString().split('T')[0]}.json`;
        
        // 触发下载
        document.body.appendChild(a);
        a.click();
        
        // 清理
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        debug('系统数据导出成功', 'success');
        showToast('导出成功', 'success');
    } catch (error) {
        debug(`导出失败: ${error.message}`, 'error');
        showToast('导出失败', 'error');
    }
}

// 添加图片转换辅助函数
async function fetchAndConvertToBase64(url) {
    try {
        // 如果已经是Base64格式，直接返回
        if (url.startsWith('data:image')) {
            return url;
        }
        
        // 获取图片数据
        const response = await fetch(url);
        const blob = await response.blob();
        
        // 转换为Base64
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        debug(`图片转换失败: ${url}`, 'error');
        return null;
    }
}

// 修改导入功能，添加图片处理
function importSystem(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // 验证导入数据的格式
            if (!importData.defects || !importData.tags) {
                throw new Error('导入文件格式不正确');
            }
            
            // 确认导入
            if (confirm('导入将覆盖当前的所有数据，是否继续？')) {
                // 更新状态
                state.defects = importData.defects;
                state.tags = importData.tags;
                
                debug('开始处理导入的图片数据...', 'info');
                
                // 保存到本地存储
                saveToLocalStorage();
                
                // 重新渲染界面
                renderDefects();
                renderTags();
                
                debug('系统数据导入成功', 'success');
                showToast('导入成功', 'success');
            }
        } catch (error) {
            debug(`导入失败: ${error.message}`, 'error');
            showToast('导入失败：文件格式不正确', 'error');
        }
    };
    
    reader.onerror = function() {
        debug('文件读取失败', 'error');
        showToast('文件读取失败', 'error');
    };
    
    reader.readAsText(file);
}

// 修改导航栏，添加导入导出按钮
function addImportExportButtons() {
    const navRight = document.querySelector('.nav-right');
    
    // 在新增按钮之前插入导入导出按钮
    const importExportButtons = document.createElement('div');
    importExportButtons.className = 'import-export-buttons';
    importExportButtons.innerHTML = `
        <input type="file" id="importFile" accept=".json" style="display: none" 
               onchange="importSystem(this.files[0])">
        <button class="btn-text" onclick="document.getElementById('importFile').click()">
            <i class="fas fa-file-import"></i>
        </button>
        <button class="btn-text" onclick="exportSystem()">
            <i class="fas fa-file-export"></i>
        </button>
    `;
    
    const addDefectBtn = document.getElementById('addDefectBtn');
    navRight.insertBefore(importExportButtons, addDefectBtn);
}

// 在初始化时添加导入导出按钮
document.addEventListener('DOMContentLoaded', () => {
    // ... 其他初始化代码 ...
    
    // 添加导入导出按钮
    addImportExportButtons();
    
    // ... 其他初始化代码 ...
});
