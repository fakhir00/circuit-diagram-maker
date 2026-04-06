// ============================================================
// Renderer — Canvas rendering for grid, components, wires
// ============================================================

import { componentMap } from './components.js';

export class Renderer {
    constructor(canvas, viewport, circuit) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.viewport = viewport;
        this.circuit = circuit;
        this.selection = new Set();
        this.hoveredItem = null;
        this.wirePreview = null; // {points: [{x,y},...]}
        this.placementPreview = null; // {type, x, y, rotation}
        this.selectionRect = null; // {x1,y1,x2,y2}
        this.animFrame = null;

        // Colors
        this.colors = {
            bg: '#0d1117',
            gridMinor: '#151e2b',
            gridMajor: '#1d2940',
            component: '#c9d1d9',
            componentHover: '#58a6ff',
            componentSelected: '#3b82f6',
            wire: '#8b949e',
            wireSelected: '#3b82f6',
            terminal: '#06b6d4',
            terminalHover: '#22d3ee',
            labelText: '#8b949e',
            selectionFill: 'rgba(59,130,246,0.08)',
            selectionStroke: 'rgba(59,130,246,0.4)',
            previewValid: 'rgba(34,197,94,0.6)',
            previewInvalid: 'rgba(239,68,68,0.4)',
        };
    }

    start() {
        const loop = () => {
            this.draw();
            this.animFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    stop() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(dpr, dpr);
        // Store logical size
        this.canvas._logicalWidth = rect.width;
        this.canvas._logicalHeight = rect.height;
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas._logicalWidth || this.canvas.width;
        const h = this.canvas._logicalHeight || this.canvas.height;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const dpr = window.devicePixelRatio || 1;
        ctx.scale(dpr, dpr);

        // Clear
        ctx.fillStyle = this.colors.bg;
        ctx.fillRect(0, 0, w, h);

        // Draw grid
        this.drawGrid(ctx, w, h);

        // Apply viewport transform
        ctx.save();
        ctx.translate(this.viewport.offsetX, this.viewport.offsetY);
        ctx.scale(this.viewport.zoom, this.viewport.zoom);

        // Draw wires
        for (const wire of this.circuit.wires) {
            this.drawWire(ctx, wire);
        }

        // Draw components
        for (const comp of this.circuit.components) {
            this.drawComponent(ctx, comp);
        }

        // Draw labels
        for (const label of this.circuit.labels) {
            this.drawLabel(ctx, label);
        }

        // Wire preview
        if (this.wirePreview && this.wirePreview.points.length > 0) {
            this.drawWirePreview(ctx);
        }

        // Placement preview
        if (this.placementPreview) {
            this.drawPlacementPreview(ctx);
        }

        ctx.restore();

        // Selection rectangle (in screen space)
        if (this.selectionRect) {
            this.drawSelectionRect(ctx);
        }

        ctx.restore();
    }

    drawGrid(ctx, w, h) {
        const vp = this.viewport;
        const gridSize = vp.gridSize;
        const zoom = vp.zoom;
        const gs = gridSize * zoom;

        if (gs < 4) return; // Too zoomed out

        const startX = vp.offsetX % gs;
        const startY = vp.offsetY % gs;
        const majorEvery = 5;
        const majorGs = gs * majorEvery;
        const majorStartX = vp.offsetX % majorGs;
        const majorStartY = vp.offsetY % majorGs;

        // Minor grid
        ctx.strokeStyle = this.colors.gridMinor;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        if (gs >= 8) {
            for (let x = startX; x < w; x += gs) {
                ctx.moveTo(Math.round(x) + 0.5, 0);
                ctx.lineTo(Math.round(x) + 0.5, h);
            }
            for (let y = startY; y < h; y += gs) {
                ctx.moveTo(0, Math.round(y) + 0.5);
                ctx.lineTo(w, Math.round(y) + 0.5);
            }
        }
        ctx.stroke();

        // Major grid
        ctx.strokeStyle = this.colors.gridMajor;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let x = majorStartX; x < w; x += majorGs) {
            ctx.moveTo(Math.round(x) + 0.5, 0);
            ctx.lineTo(Math.round(x) + 0.5, h);
        }
        for (let y = majorStartY; y < h; y += majorGs) {
            ctx.moveTo(0, Math.round(y) + 0.5);
            ctx.lineTo(w, Math.round(y) + 0.5);
        }
        ctx.stroke();

        // Origin crosshair
        const ox = vp.offsetX, oy = vp.offsetY;
        if (ox >= 0 && ox <= w && oy >= 0 && oy <= h) {
            ctx.strokeStyle = 'rgba(59,130,246,0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ox, 0); ctx.lineTo(ox, h);
            ctx.moveTo(0, oy); ctx.lineTo(w, oy);
            ctx.stroke();
        }
    }

    drawComponent(ctx, comp) {
        const def = comp.getDef();
        if (!def) return;

        const isSelected = this.selection.has(comp.id);
        const isHovered = this.hoveredItem && this.hoveredItem.id === comp.id;

        ctx.save();
        ctx.translate(comp.x, comp.y);
        ctx.rotate(comp.rotation * Math.PI / 180);
        if (comp.flipH) ctx.scale(-1, 1);
        if (comp.flipV) ctx.scale(1, -1);

        // Component stroke
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isSelected) {
            ctx.strokeStyle = this.colors.componentSelected;
            ctx.fillStyle = this.colors.componentSelected;
            // Selection glow
            ctx.shadowColor = 'rgba(59,130,246,0.3)';
            ctx.shadowBlur = 8;
        } else if (isHovered) {
            ctx.strokeStyle = this.colors.componentHover;
            ctx.fillStyle = this.colors.componentHover;
        } else {
            ctx.strokeStyle = this.colors.component;
            ctx.fillStyle = this.colors.component;
        }

        def.draw(ctx);
        ctx.shadowBlur = 0;
        ctx.restore();

        // Draw terminals
        const terminals = comp.getTerminals();
        for (const t of terminals) {
            ctx.beginPath();
            ctx.arc(t.x, t.y, isHovered ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fillStyle = isHovered ? this.colors.terminalHover : this.colors.terminal;
            ctx.fill();
        }

        // Draw value label below component
        const valueText = comp.properties.value || comp.label || '';
        if (valueText) {
            ctx.save();
            ctx.font = '11px Inter';
            ctx.fillStyle = this.colors.labelText;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            const bounds = comp.getBounds();
            ctx.fillText(valueText, comp.x, bounds.y + bounds.h + 2);
            ctx.restore();
        }

        // Selection handles
        if (isSelected) {
            const b = comp.getBounds();
            ctx.strokeStyle = this.colors.selectionStroke;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.strokeRect(b.x, b.y, b.w, b.h);
            ctx.setLineDash([]);
        }
    }

    drawWire(ctx, wire) {
        if (wire.points.length < 2) return;
        const isSelected = this.selection.has(wire.id);
        const isHovered = this.hoveredItem && this.hoveredItem.id === wire.id;

        ctx.beginPath();
        ctx.moveTo(wire.points[0].x, wire.points[0].y);
        for (let i = 1; i < wire.points.length; i++) {
            ctx.lineTo(wire.points[i].x, wire.points[i].y);
        }

        ctx.strokeStyle = isSelected ? this.colors.wireSelected :
                          isHovered ? this.colors.componentHover :
                          this.colors.wire;
        ctx.lineWidth = isSelected ? 2.5 : 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw endpoints
        if (wire.points.length >= 2) {
            const first = wire.points[0];
            const last = wire.points[wire.points.length - 1];
            for (const p of [first, last]) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.colors.terminal;
                ctx.fill();
            }
        }

        if (isSelected) {
            for (const p of wire.points) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = this.colors.componentSelected;
                ctx.fill();
            }
        }
    }

    drawLabel(ctx, label) {
        const isSelected = this.selection.has(label.id);
        ctx.save();
        ctx.font = `${label.fontSize}px Inter`;
        ctx.fillStyle = isSelected ? this.colors.componentSelected : this.colors.labelText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label.text, label.x, label.y);

        if (isSelected) {
            const b = label.getBounds();
            ctx.strokeStyle = this.colors.selectionStroke;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.strokeRect(b.x, b.y, b.w, b.h);
            ctx.setLineDash([]);
        }
        ctx.restore();
    }

    drawWirePreview(ctx) {
        const pts = this.wirePreview.points;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = this.colors.componentSelected;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // End point indicator
        const last = pts[pts.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
        ctx.strokeStyle = this.colors.terminalHover;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    drawPlacementPreview(ctx) {
        const p = this.placementPreview;
        const def = componentMap.get(p.type);
        if (!def) return;

        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation || 0) * Math.PI / 180);
        ctx.strokeStyle = this.colors.previewValid;
        ctx.fillStyle = this.colors.previewValid;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        def.draw(ctx);
        ctx.restore();
    }

    drawSelectionRect(ctx) {
        const r = this.selectionRect;
        const x = Math.min(r.x1, r.x2);
        const y = Math.min(r.y1, r.y2);
        const w = Math.abs(r.x2 - r.x1);
        const h = Math.abs(r.y2 - r.y1);
        ctx.fillStyle = this.colors.selectionFill;
        ctx.strokeStyle = this.colors.selectionStroke;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);
    }

    getCircuitBounds() {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const comp of this.circuit.components) {
            const b = comp.getBounds();
            minX = Math.min(minX, b.x);
            minY = Math.min(minY, b.y);
            maxX = Math.max(maxX, b.x + b.w);
            maxY = Math.max(maxY, b.y + b.h);
        }
        for (const wire of this.circuit.wires) {
            const b = wire.getBounds();
            minX = Math.min(minX, b.x);
            minY = Math.min(minY, b.y);
            maxX = Math.max(maxX, b.x + b.w);
            maxY = Math.max(maxY, b.y + b.h);
        }
        if (minX === Infinity) return null;
        return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    }
}
