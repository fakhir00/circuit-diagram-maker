// ============================================================
// Tools — Select, Wire, Place, Delete, Label tools
// ============================================================

import { snapToGrid } from './utils.js';
import { CircuitComponent, Wire, TextLabel } from './circuit.js';

export class ToolManager {
    constructor(app) {
        this.app = app;
        this.currentTool = 'select';
        this.tools = {
            select: new SelectTool(app),
            wire: new WireTool(app),
            place: new PlaceTool(app),
            delete: new DeleteTool(app),
            label: new LabelTool(app),
        };
    }

    setTool(name) {
        if (this.tools[this.currentTool]) {
            this.tools[this.currentTool].deactivate();
        }
        this.currentTool = name;
        if (this.tools[name]) {
            this.tools[name].activate();
        }
        this.updateCursor();
        this.updateToolButtons();
    }

    getTool() {
        return this.tools[this.currentTool];
    }

    onMouseDown(e, worldX, worldY, screenX, screenY) {
        const tool = this.getTool();
        if (tool) tool.onMouseDown(e, worldX, worldY, screenX, screenY);
    }

    onMouseMove(e, worldX, worldY, screenX, screenY) {
        const tool = this.getTool();
        if (tool) tool.onMouseMove(e, worldX, worldY, screenX, screenY);
    }

    onMouseUp(e, worldX, worldY, screenX, screenY) {
        const tool = this.getTool();
        if (tool) tool.onMouseUp(e, worldX, worldY, screenX, screenY);
    }

    updateCursor() {
        const container = this.app.canvasContainer;
        container.className = 'canvas-container';
        container.classList.add(`tool-${this.currentTool}`);
    }

    updateToolButtons() {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === this.currentTool);
        });
    }
}

// ── Base Tool ──
class BaseTool {
    constructor(app) {
        this.app = app;
    }
    get circuit() { return this.app.circuit; }
    get renderer() { return this.app.renderer; }
    get viewport() { return this.app.viewport; }
    get history() { return this.app.history; }
    activate() {}
    deactivate() {}
    onMouseDown() {}
    onMouseMove() {}
    onMouseUp() {}
}

// ── SELECT TOOL ──
class SelectTool extends BaseTool {
    constructor(app) {
        super(app);
        this.isDragging = false;
        this.dragTarget = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.isBoxSelecting = false;
        this.boxStartX = 0;
        this.boxStartY = 0;
        this.hasMoved = false;
    }

    deactivate() {
        this.isDragging = false;
        this.isBoxSelecting = false;
        this.renderer.selectionRect = null;
    }

    onMouseDown(e, wx, wy, sx, sy) {
        this.hasMoved = false;
        const terminal = this.circuit.findTerminalAt(wx, wy);
        const item = this.circuit.findItemAt(wx, wy);

        if (item) {
            const id = item.item.id;
            if (e.shiftKey) {
                // Toggle selection
                if (this.renderer.selection.has(id)) {
                    this.renderer.selection.delete(id);
                } else {
                    this.renderer.selection.add(id);
                }
            } else if (!this.renderer.selection.has(id)) {
                this.renderer.selection.clear();
                this.renderer.selection.add(id);
            }
            this.isDragging = true;
            this.dragTarget = item;
            this.dragOffsetX = wx - item.item.x;
            this.dragOffsetY = wy - item.item.y;
            this.app.updateProperties();
        } else {
            if (!e.shiftKey) {
                this.renderer.selection.clear();
                this.app.updateProperties();
            }
            // Start box selection
            this.isBoxSelecting = true;
            this.boxStartX = sx;
            this.boxStartY = sy;
        }
    }

    onMouseMove(e, wx, wy, sx, sy) {
        if (this.isDragging && this.dragTarget) {
            this.hasMoved = true;
            const snappedX = snapToGrid(wx - this.dragOffsetX);
            const snappedY = snapToGrid(wy - this.dragOffsetY);
            const dx = snappedX - this.dragTarget.item.x;
            const dy = snappedY - this.dragTarget.item.y;

            // Move all selected items
            for (const id of this.renderer.selection) {
                const comp = this.circuit.components.find(c => c.id === id);
                if (comp) { comp.x += dx; comp.y += dy; }
                const wire = this.circuit.wires.find(w => w.id === id);
                if (wire) {
                    wire.points.forEach(p => { p.x += dx; p.y += dy; });
                }
                const label = this.circuit.labels.find(l => l.id === id);
                if (label) { label.x += dx; label.y += dy; }
            }
        } else if (this.isBoxSelecting) {
            this.renderer.selectionRect = {
                x1: this.boxStartX, y1: this.boxStartY,
                x2: sx, y2: sy
            };
        } else {
            // Hover detection
            const item = this.circuit.findItemAt(wx, wy);
            this.renderer.hoveredItem = item ? item.item : null;
        }
    }

    onMouseUp(e, wx, wy) {
        if (this.isDragging && this.hasMoved) {
            this.history.saveState();
        }

        if (this.isBoxSelecting && this.renderer.selectionRect) {
            const r = this.renderer.selectionRect;
            const vp = this.viewport;
            const x1w = Math.min(r.x1, r.x2), y1w = Math.min(r.y1, r.y2);
            const x2w = Math.max(r.x1, r.x2), y2w = Math.max(r.y1, r.y2);
            // Convert screen rect to world
            const tl = vp.screenToWorld(x1w, y1w);
            const br = vp.screenToWorld(x2w, y2w);

            for (const comp of this.circuit.components) {
                const b = comp.getBounds();
                if (b.x >= tl.x && b.y >= tl.y && b.x + b.w <= br.x && b.y + b.h <= br.y) {
                    this.renderer.selection.add(comp.id);
                }
            }
            this.renderer.selectionRect = null;
            this.app.updateProperties();
        }

        this.isDragging = false;
        this.isBoxSelecting = false;
        this.dragTarget = null;
    }
}

// ── WIRE TOOL ──
class WireTool extends BaseTool {
    constructor(app) {
        super(app);
        this.isDrawing = false;
        this.wirePoints = [];
        this.startTerminalInfo = null;
    }

    deactivate() {
        this.isDrawing = false;
        this.wirePoints = [];
        this.renderer.wirePreview = null;
        this.startTerminalInfo = null;
    }

    onMouseDown(e, wx, wy) {
        const sx = snapToGrid(wx);
        const sy = snapToGrid(wy);
        const terminal = this.circuit.findTerminalAt(wx, wy, 15);

        if (!this.isDrawing) {
            // Start wire
            this.isDrawing = true;
            if (terminal) {
                this.wirePoints = [{ x: terminal.x, y: terminal.y }];
                this.startTerminalInfo = { componentId: terminal.componentId, terminalName: terminal.terminalName };
            } else {
                this.wirePoints = [{ x: sx, y: sy }];
                this.startTerminalInfo = null;
            }
        } else {
            // Add point or finish wire
            if (terminal) {
                // Finish at terminal
                this.addManhattanPoints(terminal.x, terminal.y);
                this.finishWire({ componentId: terminal.componentId, terminalName: terminal.terminalName });
            } else {
                // Add intermediate point
                this.addManhattanPoints(sx, sy);
            }
        }
    }

    onMouseMove(e, wx, wy) {
        if (!this.isDrawing) {
            // Show terminal hover
            const terminal = this.circuit.findTerminalAt(wx, wy, 15);
            this.renderer.hoveredItem = terminal ? { id: '__terminal__' } : null;
            return;
        }

        const sx = snapToGrid(wx);
        const sy = snapToGrid(wy);
        const terminal = this.circuit.findTerminalAt(wx, wy, 15);
        const targetX = terminal ? terminal.x : sx;
        const targetY = terminal ? terminal.y : sy;

        // Manhattan preview
        const last = this.wirePoints[this.wirePoints.length - 1];
        const midPoints = this.getManhattanMid(last.x, last.y, targetX, targetY);
        this.renderer.wirePreview = {
            points: [...this.wirePoints, ...midPoints, { x: targetX, y: targetY }]
        };
    }

    onMouseUp() {}

    addManhattanPoints(tx, ty) {
        const last = this.wirePoints[this.wirePoints.length - 1];
        const midPoints = this.getManhattanMid(last.x, last.y, tx, ty);
        this.wirePoints.push(...midPoints, { x: tx, y: ty });
    }

    getManhattanMid(x1, y1, x2, y2) {
        if (x1 === x2 || y1 === y2) return [];
        // Route horizontally first, then vertically
        return [{ x: x2, y: y1 }];
    }

    finishWire(endTerminalInfo) {
        if (this.wirePoints.length >= 2) {
            const wire = new Wire(this.wirePoints);
            wire.startTerminal = this.startTerminalInfo;
            wire.endTerminal = endTerminalInfo || null;
            this.circuit.addWire(wire);
            this.history.saveState();
            this.app.updateStatus('Wire placed');
        }
        this.isDrawing = false;
        this.wirePoints = [];
        this.renderer.wirePreview = null;
        this.startTerminalInfo = null;
        this.app.updateStats();
    }

    cancel() {
        this.isDrawing = false;
        this.wirePoints = [];
        this.renderer.wirePreview = null;
        this.startTerminalInfo = null;
    }
}

// ── PLACE TOOL ──
class PlaceTool extends BaseTool {
    constructor(app) {
        super(app);
        this.componentType = null;
        this.rotation = 0;
    }

    activate() {
        this.rotation = 0;
    }

    deactivate() {
        this.componentType = null;
        this.renderer.placementPreview = null;
    }

    setComponentType(type) {
        this.componentType = type;
        this.rotation = 0;
    }

    onMouseDown(e, wx, wy) {
        if (!this.componentType) return;
        const sx = snapToGrid(wx);
        const sy = snapToGrid(wy);
        const comp = new CircuitComponent(this.componentType, sx, sy, this.rotation);
        this.circuit.addComponent(comp);
        this.renderer.selection.clear();
        this.renderer.selection.add(comp.id);
        this.history.saveState();
        this.app.updateStats();
        this.app.updateProperties();
        this.app.updateStatus(`Placed ${comp.getDef()?.name || comp.type}`);
    }

    onMouseMove(e, wx, wy) {
        if (!this.componentType) return;
        const sx = snapToGrid(wx);
        const sy = snapToGrid(wy);
        this.renderer.placementPreview = {
            type: this.componentType,
            x: sx, y: sy,
            rotation: this.rotation
        };
    }

    rotate() {
        this.rotation = (this.rotation + 90) % 360;
        if (this.renderer.placementPreview) {
            this.renderer.placementPreview.rotation = this.rotation;
        }
    }
}

// ── DELETE TOOL ──
class DeleteTool extends BaseTool {
    onMouseDown(e, wx, wy) {
        const item = this.circuit.findItemAt(wx, wy);
        if (item) {
            if (item.type === 'component') this.circuit.removeComponent(item.item.id);
            else if (item.type === 'wire') this.circuit.removeWire(item.item.id);
            else if (item.type === 'label') this.circuit.removeLabel(item.item.id);
            this.renderer.selection.delete(item.item.id);
            this.history.saveState();
            this.app.updateStats();
            this.app.updateStatus('Deleted');
        }
    }

    onMouseMove(e, wx, wy) {
        const item = this.circuit.findItemAt(wx, wy);
        this.renderer.hoveredItem = item ? item.item : null;
    }
}

// ── LABEL TOOL ──
class LabelTool extends BaseTool {
    onMouseDown(e, wx, wy) {
        const sx = snapToGrid(wx);
        const sy = snapToGrid(wy);
        const text = prompt('Enter label text:', 'Label');
        if (text) {
            const label = new TextLabel(sx, sy, text);
            this.circuit.addLabel(label);
            this.history.saveState();
            this.app.updateStatus('Label added');
        }
    }
}
