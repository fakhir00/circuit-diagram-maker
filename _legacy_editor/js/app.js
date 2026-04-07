// ============================================================
// App — Main entry point, event wiring, initialization
// ============================================================

import { Circuit, CircuitComponent } from './circuit.js';
import { Viewport } from './viewport.js';
import { Renderer } from './renderer.js';
import { ToolManager } from './tools.js';
import { History } from './history.js';
import { IO } from './io.js';
import { CATEGORIES, categoryMap } from './components.js';
import { snapToGrid, showToast } from './utils.js';

class App {
    constructor() {
        this.canvas = document.getElementById('circuit-canvas');
        this.canvasContainer = document.getElementById('canvas-container');
        this.circuit = new Circuit();
        this.viewport = new Viewport(this.canvas);
        this.renderer = new Renderer(this.canvas, this.viewport, this.circuit);
        this.toolManager = new ToolManager(this);
        this.io = new IO(this);
        this.spaceDown = false;
        this.viewMode = 'grid'; // 'grid' or 'list'

        this.history = new History(this.circuit);
        this.history.onChange = () => this.updateUndoRedoButtons();

        this.init();
    }

    init() {
        this.renderer.resize();
        this.viewport.reset();
        this.renderer.start();

        this.buildComponentLibrary();
        this.bindCanvasEvents();
        this.bindToolbarEvents();
        this.bindKeyboardEvents();
        this.bindResizeEvent();

        // Try loading autosaved circuit
        const raw = localStorage.getItem('circuitforge_autosave');
        if (raw) {
            try {
                const data = JSON.parse(raw);
                const restored = Circuit.deserialize(data);
                this.circuit.components = restored.components;
                this.circuit.wires = restored.wires;
                this.circuit.labels = restored.labels;
                this.circuit.name = restored.name;
                document.getElementById('circuit-name').value = this.circuit.name;
                this.history.clear();
                this.updateStats();
            } catch (e) { /* ignore */ }
        }

        // Auto-save every 30 seconds
        setInterval(() => {
            if (this.circuit.components.length > 0 || this.circuit.wires.length > 0) {
                localStorage.setItem('circuitforge_autosave', JSON.stringify(this.circuit.serialize()));
            }
        }, 30000);

        this.updateStatus(window.t('editor.app.ready_instruction'));
        console.log('%c⚡ CircuitForge loaded', 'color:#3b82f6;font-weight:bold;font-size:14px');
    }

    // ── Component Library Sidebar ──

    buildComponentLibrary() {
        const container = document.getElementById('component-library');
        container.innerHTML = '';

        const search = document.getElementById('component-search');
        search.addEventListener('input', () => this.filterComponents(search.value));

        for (const [catId, cat] of categoryMap) {
            const section = document.createElement('div');
            section.className = 'component-category';
            section.dataset.category = catId;

            const header = document.createElement('div');
            header.className = 'category-header';
            header.innerHTML = `
                <svg class="chevron" viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                <span>${window.t('category.' + catId, cat.name)}</span>
                <span style="margin-left:auto;font-size:10px;opacity:0.4">${cat.components.length}</span>
            `;
            header.addEventListener('click', () => {
                header.classList.toggle('collapsed');
                items.classList.toggle('collapsed');
            });

            const items = document.createElement('div');
            items.className = `category-items${this.viewMode === 'list' ? ' list-view' : ''}`;

            for (const comp of cat.components) {
                const item = document.createElement('div');
                item.className = `component-item${this.viewMode === 'list' ? ' list-view' : ''}`;
                item.dataset.type = comp.type;
                item.draggable = true;
                const translatedName = window.t('component.' + comp.type, comp.name);
                item.title = translatedName;

                // Draw preview
                const previewCanvas = document.createElement('canvas');
                previewCanvas.width = 80;
                previewCanvas.height = 56;
                const pctx = previewCanvas.getContext('2d');
                pctx.translate(40, 28);
                pctx.strokeStyle = '#94a3b8';
                pctx.fillStyle = '#94a3b8';
                pctx.lineWidth = 1.5;
                pctx.lineCap = 'round';
                pctx.lineJoin = 'round';
                comp.draw(pctx);

                const name = document.createElement('span');
                name.className = 'component-name';
                name.textContent = translatedName;

                item.appendChild(previewCanvas);
                item.appendChild(name);

                // Click to activate placement
                item.addEventListener('click', () => {
                    this.toolManager.setTool('place');
                    this.toolManager.tools.place.setComponentType(comp.type);
                    const msg = window.t('editor.app.placement', 'Click on canvas to place {name}. Press R to rotate.').replace('{name}', translatedName);
                    this.updateStatus(msg);
                    // Highlight active
                    document.querySelectorAll('.component-item').forEach(el => el.style.borderColor = '');
                    item.style.borderColor = 'rgba(59,130,246,0.5)';
                });

                // Drag
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('component-type', comp.type);
                    this.toolManager.setTool('place');
                    this.toolManager.tools.place.setComponentType(comp.type);
                });

                items.appendChild(item);
            }

            section.appendChild(header);
            section.appendChild(items);
            container.appendChild(section);
        }

        // View toggle
        document.getElementById('view-grid').addEventListener('click', () => this.setViewMode('grid'));
        document.getElementById('view-list').addEventListener('click', () => this.setViewMode('list'));
    }

    setViewMode(mode) {
        this.viewMode = mode;
        document.getElementById('view-grid').classList.toggle('active', mode === 'grid');
        document.getElementById('view-list').classList.toggle('active', mode === 'list');
        document.querySelectorAll('.category-items').forEach(el => {
            el.classList.toggle('list-view', mode === 'list');
        });
        document.querySelectorAll('.component-item').forEach(el => {
            el.classList.toggle('list-view', mode === 'list');
        });
    }

    filterComponents(query) {
        const q = query.toLowerCase().trim();
        document.querySelectorAll('.component-category').forEach(section => {
            let anyVisible = false;
            section.querySelectorAll('.component-item').forEach(item => {
                const name = item.querySelector('.component-name').textContent.toLowerCase();
                const match = !q || name.includes(q);
                item.style.display = match ? '' : 'none';
                if (match) anyVisible = true;
            });
            section.style.display = anyVisible ? '' : 'none';
        });
    }

    // ── Canvas Events ──

    bindCanvasEvents() {
        const c = this.canvas;

        c.addEventListener('mousedown', (e) => {
            if (e.button === 1 || (e.button === 0 && this.spaceDown)) {
                // Middle click or space+click → pan
                const rect = c.getBoundingClientRect();
                this.viewport.startPan(e.clientX - rect.left, e.clientY - rect.top);
                this.canvasContainer.classList.add('panning');
                return;
            }
            if (e.button === 2) return; // Right click handled by context menu

            const rect = c.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            const world = this.viewport.screenToWorld(sx, sy);
            this.toolManager.onMouseDown(e, world.x, world.y, sx, sy);
        });

        c.addEventListener('mousemove', (e) => {
            const rect = c.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;

            if (this.viewport.isPanning) {
                this.viewport.updatePan(sx, sy);
                return;
            }

            const world = this.viewport.screenToWorld(sx, sy);
            this.toolManager.onMouseMove(e, world.x, world.y, sx, sy);

            // Update coord display
            const gx = snapToGrid(world.x);
            const gy = snapToGrid(world.y);
            document.getElementById('coord-x').textContent = `X: ${gx}`;
            document.getElementById('coord-y').textContent = `Y: ${gy}`;
        });

        c.addEventListener('mouseup', (e) => {
            if (this.viewport.isPanning) {
                this.viewport.endPan();
                this.canvasContainer.classList.remove('panning');
                return;
            }
            const rect = c.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            const world = this.viewport.screenToWorld(sx, sy);
            this.toolManager.onMouseUp(e, world.x, world.y, sx, sy);
        });

        c.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = c.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            if (e.deltaY < 0) {
                this.viewport.zoomIn(sx, sy);
            } else {
                this.viewport.zoomOut(sx, sy);
            }
            document.getElementById('zoom-level').textContent = this.viewport.getZoomPercent() + '%';
        }, { passive: false });

        // Context menu
        c.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const rect = c.getBoundingClientRect();
            const world = this.viewport.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
            const item = this.circuit.findItemAt(world.x, world.y);
            if (item) {
                this.renderer.selection.clear();
                this.renderer.selection.add(item.item.id);
                this.updateProperties();
            }
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Drag drop from sidebar
        c.addEventListener('dragover', (e) => { e.preventDefault(); });
        c.addEventListener('drop', (e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('component-type');
            if (!type) return;
            const rect = c.getBoundingClientRect();
            const world = this.viewport.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);
            const comp = new CircuitComponent(type, snapToGrid(world.x), snapToGrid(world.y), 0);
            this.circuit.addComponent(comp);
            this.renderer.selection.clear();
            this.renderer.selection.add(comp.id);
            this.history.saveState();
            this.updateStats();
            this.updateProperties();
        });
    }

    // ── Toolbar Events ──

    bindToolbarEvents() {
        // Tools
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toolManager.setTool(btn.dataset.tool);
                this.renderer.placementPreview = null;
            });
        });

        // File ops
        document.getElementById('btn-new').addEventListener('click', () => this.newCircuit());
        document.getElementById('btn-open').addEventListener('click', () => this.io.openFile());
        document.getElementById('btn-save').addEventListener('click', () => this.io.saveToLocalStorage());
        document.getElementById('btn-undo').addEventListener('click', () => { this.history.undo(); this.updateStats(); });
        document.getElementById('btn-redo').addEventListener('click', () => { this.history.redo(); this.updateStats(); });

        // Export dropdown
        const exportDropdown = document.getElementById('export-dropdown');
        document.getElementById('btn-export').addEventListener('click', (e) => {
            e.stopPropagation();
            exportDropdown.classList.toggle('open');
        });
        document.addEventListener('click', () => exportDropdown.classList.remove('open'));

        document.getElementById('btn-export-svg').addEventListener('click', () => { this.io.exportSVG(); exportDropdown.classList.remove('open'); });
        document.getElementById('btn-export-png').addEventListener('click', () => { this.io.exportPNG(); exportDropdown.classList.remove('open'); });
        document.getElementById('btn-export-json').addEventListener('click', () => { this.io.downloadJSON(); exportDropdown.classList.remove('open'); });

        // Zoom
        document.getElementById('btn-zoom-in').addEventListener('click', () => {
            const w = this.canvas._logicalWidth / 2, h = this.canvas._logicalHeight / 2;
            this.viewport.zoomIn(w, h);
            document.getElementById('zoom-level').textContent = this.viewport.getZoomPercent() + '%';
        });
        document.getElementById('btn-zoom-out').addEventListener('click', () => {
            const w = this.canvas._logicalWidth / 2, h = this.canvas._logicalHeight / 2;
            this.viewport.zoomOut(w, h);
            document.getElementById('zoom-level').textContent = this.viewport.getZoomPercent() + '%';
        });
        document.getElementById('btn-zoom-fit').addEventListener('click', () => {
            const bounds = this.renderer.getCircuitBounds();
            this.viewport.zoomToFit(bounds);
            document.getElementById('zoom-level').textContent = this.viewport.getZoomPercent() + '%';
        });

        // Circuit name
        document.getElementById('circuit-name').addEventListener('change', (e) => {
            this.circuit.name = e.target.value || 'Untitled Circuit';
        });

        // Help modal
        document.getElementById('btn-help').addEventListener('click', () => this.showHelpModal());
        document.getElementById('modal-close').addEventListener('click', () => this.hideModal());
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideModal();
        });

        // Context menu actions
        document.querySelectorAll('.context-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleContextAction(item.dataset.action);
                this.hideContextMenu();
            });
        });
    }

    // ── Keyboard ──

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Don't handle keyboard if typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === ' ') { e.preventDefault(); this.spaceDown = true; this.canvasContainer.classList.add('panning'); }
            if (e.key === 'v' || e.key === 'V') this.toolManager.setTool('select');
            if (e.key === 'w' || e.key === 'W') this.toolManager.setTool('wire');
            if (e.key === 'd' || e.key === 'D') this.toolManager.setTool('delete');
            if (e.key === 'l' || e.key === 'L') this.toolManager.setTool('label');

            if (e.key === 'r' || e.key === 'R') {
                if (this.toolManager.currentTool === 'place') {
                    this.toolManager.tools.place.rotate();
                } else {
                    this.rotateSelected(e.shiftKey ? -90 : 90);
                }
            }

            if (e.key === 'h' || e.key === 'H') this.flipSelected('h');
            if (e.key === 'f' || e.key === 'F') this.flipSelected('v');

            if (e.key === 'Escape') {
                this.toolManager.setTool('select');
                this.renderer.selection.clear();
                this.renderer.placementPreview = null;
                if (this.toolManager.tools.wire) this.toolManager.tools.wire.cancel();
                this.hideContextMenu();
                this.updateProperties();
            }

            if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey) {
                this.deleteSelected();
            }

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') { e.preventDefault(); this.history.undo(); this.updateStats(); }
                if (e.key === 'y') { e.preventDefault(); this.history.redo(); this.updateStats(); }
                if (e.key === 'Z' && e.shiftKey) { e.preventDefault(); this.history.redo(); this.updateStats(); }
                if (e.key === 's') { e.preventDefault(); this.io.saveToLocalStorage(); }
                if (e.key === 'a') { e.preventDefault(); this.selectAll(); }
                if (e.key === '0') { e.preventDefault(); this.viewport.zoomToFit(this.renderer.getCircuitBounds()); document.getElementById('zoom-level').textContent = this.viewport.getZoomPercent() + '%'; }
                if (e.key === 'c') { e.preventDefault(); this.copySelected(); }
                if (e.key === 'v') { e.preventDefault(); this.pasteClipboard(); }
                if (e.key === 'd') { e.preventDefault(); this.duplicateSelected(); }
                if (e.key === 'n') { e.preventDefault(); this.newCircuit(); }
                if (e.key === 'o') { e.preventDefault(); this.io.openFile(); }
            }

            if (e.key === '=' || e.key === '+') {
                const w = this.canvas._logicalWidth / 2, h = this.canvas._logicalHeight / 2;
                this.viewport.zoomIn(w, h);
                document.getElementById('zoom-level').textContent = this.viewport.getZoomPercent() + '%';
            }
            if (e.key === '-') {
                const w = this.canvas._logicalWidth / 2, h = this.canvas._logicalHeight / 2;
                this.viewport.zoomOut(w, h);
                document.getElementById('zoom-level').textContent = this.viewport.getZoomPercent() + '%';
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === ' ') { this.spaceDown = false; this.canvasContainer.classList.remove('panning'); }
        });
    }

    bindResizeEvent() {
        window.addEventListener('resize', () => this.renderer.resize());
        new ResizeObserver(() => this.renderer.resize()).observe(this.canvasContainer);
    }

    // ── Actions ──

    newCircuit() {
        if (this.circuit.components.length > 0 || this.circuit.wires.length > 0) {
            if (!confirm(window.t('editor.app.confirm_new'))) return;
        }
        this.circuit.clear();
        this.circuit.name = window.t('editor.canvas.untitled');
        document.getElementById('circuit-name').value = this.circuit.name;
        this.renderer.selection.clear();
        this.history.clear();
        this.viewport.reset();
        this.updateStats();
        this.updateProperties();
        showToast(window.t('editor.status.ready'), 'info');
    }

    deleteSelected() {
        if (this.renderer.selection.size === 0) return;
        for (const id of this.renderer.selection) {
            this.circuit.removeComponent(id);
            this.circuit.removeWire(id);
            this.circuit.removeLabel(id);
        }
        this.renderer.selection.clear();
        this.history.saveState();
        this.updateStats();
        this.updateProperties();
    }

    rotateSelected(deg) {
        for (const id of this.renderer.selection) {
            const comp = this.circuit.components.find(c => c.id === id);
            if (comp) comp.rotation = (comp.rotation + deg + 360) % 360;
        }
        if (this.renderer.selection.size > 0) this.history.saveState();
    }

    flipSelected(axis) {
        for (const id of this.renderer.selection) {
            const comp = this.circuit.components.find(c => c.id === id);
            if (comp) {
                if (axis === 'h') comp.flipH = !comp.flipH;
                else comp.flipV = !comp.flipV;
            }
        }
        if (this.renderer.selection.size > 0) this.history.saveState();
    }

    selectAll() {
        this.circuit.components.forEach(c => this.renderer.selection.add(c.id));
        this.circuit.wires.forEach(w => this.renderer.selection.add(w.id));
        this.circuit.labels.forEach(l => this.renderer.selection.add(l.id));
    }

    _clipboard = null;

    copySelected() {
        const items = [];
        for (const id of this.renderer.selection) {
            const comp = this.circuit.components.find(c => c.id === id);
            if (comp) items.push({ type: 'component', data: comp.serialize() });
            const wire = this.circuit.wires.find(w => w.id === id);
            if (wire) items.push({ type: 'wire', data: wire.serialize() });
            const label = this.circuit.labels.find(l => l.id === id);
            if (label) items.push({ type: 'label', data: label.serialize() });
        }
        this._clipboard = JSON.stringify(items);
        if (items.length > 0) showToast(window.t('editor.status.copied', 'Copied {count} item(s)').replace('{count}', items.length), 'info');
    }

    pasteClipboard() {
        if (!this._clipboard) return;
        const items = JSON.parse(this._clipboard);
        this.renderer.selection.clear();
        const offset = 40;
        for (const item of items) {
            if (item.type === 'component') {
                item.data.x += offset; item.data.y += offset;
                const comp = CircuitComponent.deserialize(item.data);
                comp.id += '_copy';
                this.circuit.addComponent(comp);
                this.renderer.selection.add(comp.id);
            }
        }
        this.history.saveState();
        this.updateStats();
    }

    duplicateSelected() {
        this.copySelected();
        this.pasteClipboard();
    }

    // ── Context Menu ──

    showContextMenu(x, y) {
        const menu = document.getElementById('context-menu');
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.remove('hidden');
    }

    hideContextMenu() {
        document.getElementById('context-menu').classList.add('hidden');
    }

    handleContextAction(action) {
        switch (action) {
            case 'cut': this.copySelected(); this.deleteSelected(); break;
            case 'copy': this.copySelected(); break;
            case 'paste': this.pasteClipboard(); break;
            case 'rotate-cw': this.rotateSelected(90); break;
            case 'rotate-ccw': this.rotateSelected(-90); break;
            case 'flip-h': this.flipSelected('h'); break;
            case 'flip-v': this.flipSelected('v'); break;
            case 'duplicate': this.duplicateSelected(); break;
            case 'delete': this.deleteSelected(); break;
        }
    }

    // ── Properties Panel ──

    updateProperties() {
        const container = document.getElementById('properties-content');
        if (this.renderer.selection.size === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 48 48" width="40" height="40" opacity="0.3"><path d="M24 8l-2 8h-8l6 5-2 8 6-5 6 5-2-8 6-5h-8z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
                    <p>${window.t('editor.panel.properties.empty')}</p>
                </div>`;
            return;
        }

        if (this.renderer.selection.size > 1) {
            container.innerHTML = `<div class="empty-state"><p>${window.t('editor.status.items_selected', '{count} items selected').replace('{count}', this.renderer.selection.size)}</p></div>`;
            return;
        }

        const id = [...this.renderer.selection][0];
        const comp = this.circuit.components.find(c => c.id === id);
        if (!comp) {
            container.innerHTML = `<div class="empty-state"><p>${window.t('editor.status.wire_selected')}</p></div>`;
            return;
        }

        const def = comp.getDef();
        let html = `<div class="property-group">
            <div class="property-group-title">${window.t('component.' + comp.type, def ? def.name : comp.type)}</div>
            <div class="property-row">
                <span class="property-label">X</span>
                <input class="property-input" type="number" value="${comp.x}" data-prop="x" step="20">
            </div>
            <div class="property-row">
                <span class="property-label">Y</span>
                <input class="property-input" type="number" value="${comp.y}" data-prop="y" step="20">
            </div>
            <div class="property-row">
                <span class="property-label">Rotation</span>
                <input class="property-input" type="number" value="${comp.rotation}" data-prop="rotation" step="90" min="0" max="270">
            </div>`;

        if (def && def.properties) {
            for (const [key, prop] of Object.entries(def.properties)) {
                html += `<div class="property-row">
                    <span class="property-label">${window.t('property.' + key, prop.label || key)}</span>
                    <input class="property-input" type="text" value="${comp.properties[key] || ''}" data-custom-prop="${key}">
                </div>`;
            }
        }
        html += '</div>';
        container.innerHTML = html;

        // Bind events
        container.querySelectorAll('.property-input').forEach(input => {
            input.addEventListener('change', () => {
                const prop = input.dataset.prop;
                const customProp = input.dataset.customProp;
                if (prop === 'x') comp.x = parseFloat(input.value) || 0;
                else if (prop === 'y') comp.y = parseFloat(input.value) || 0;
                else if (prop === 'rotation') comp.rotation = (parseInt(input.value) || 0) % 360;
                else if (customProp) comp.properties[customProp] = input.value;
                this.history.saveState();
            });
        });
    }

    // ── UI Updates ──

    updateStats() {
        const stats = this.circuit.getStats();
        document.getElementById('component-count').textContent = `Components: ${stats.components}`;
        document.getElementById('wire-count').textContent = `Wires: ${stats.wires}`;
    }

    updateStatus(text) {
        document.getElementById('status-text').textContent = text;
    }

    updateUndoRedoButtons() {
        document.getElementById('btn-undo').disabled = !this.history.canUndo();
        document.getElementById('btn-redo').disabled = !this.history.canRedo();
    }

    // ── Modals ──

    showHelpModal() {
        document.getElementById('modal-title').textContent = 'Keyboard Shortcuts';
        document.getElementById('modal-body').innerHTML = `
            <div class="shortcuts-grid">
                <div class="shortcut-row"><kbd>V</kbd> ${window.t('editor.shortcut.select')}</div>
                <div class="shortcut-row"><kbd>W</kbd> ${window.t('editor.shortcut.wire')}</div>
                <div class="shortcut-row"><kbd>D</kbd> ${window.t('editor.shortcut.delete')}</div>
                <div class="shortcut-row"><kbd>L</kbd> ${window.t('editor.shortcut.label')}</div>
                <div class="shortcut-row"><kbd>R</kbd> ${window.t('editor.shortcut.rotate_cw')}</div>
                <div class="shortcut-row"><kbd>Shift+R</kbd> ${window.t('editor.shortcut.rotate_ccw')}</div>
                <div class="shortcut-row"><kbd>H</kbd> ${window.t('editor.shortcut.flip_h')}</div>
                <div class="shortcut-row"><kbd>F</kbd> ${window.t('editor.shortcut.flip_v')}</div>
                <div class="shortcut-row"><kbd>Del</kbd> ${window.t('editor.shortcut.delete_selected')}</div>
                <div class="shortcut-row"><kbd>Esc</kbd> ${window.t('editor.shortcut.cancel')}</div>
                <div class="shortcut-row"><kbd>Ctrl+Z</kbd> ${window.t('editor.shortcut.undo')}</div>
                <div class="shortcut-row"><kbd>Ctrl+Y</kbd> ${window.t('editor.shortcut.redo')}</div>
                <div class="shortcut-row"><kbd>Ctrl+S</kbd> ${window.t('editor.shortcut.save')}</div>
                <div class="shortcut-row"><kbd>Ctrl+C</kbd> ${window.t('editor.shortcut.copy')}</div>
                <div class="shortcut-row"><kbd>Ctrl+V</kbd> ${window.t('editor.shortcut.paste')}</div>
                <div class="shortcut-row"><kbd>Ctrl+D</kbd> ${window.t('editor.shortcut.duplicate')}</div>
                <div class="shortcut-row"><kbd>Ctrl+A</kbd> ${window.t('editor.shortcut.select_all', 'Select All')}</div>
                <div class="shortcut-row"><kbd>Ctrl+0</kbd> ${window.t('editor.shortcut.zoom_fit')}</div>
                <div class="shortcut-row"><kbd>Space</kbd> ${window.t('editor.shortcut.pan_hold')}</div>
                <div class="shortcut-row"><kbd>Scroll</kbd> ${window.t('editor.shortcut.zoom')}</div>
                <div class="shortcut-row"><kbd>+/-</kbd> ${window.t('editor.shortcut.zoom_in_out')}</div>
                <div class="shortcut-row"><kbd>Middle Click</kbd> ${window.t('editor.shortcut.middle_click')}</div>
            </div>`;
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
