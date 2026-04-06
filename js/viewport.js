// ============================================================
// Viewport — Pan, zoom, coordinate transforms
// ============================================================

import { clamp } from './utils.js';

export class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 1;
        this.minZoom = 0.1;
        this.maxZoom = 5;
        this.gridSize = 20;
        this.isPanning = false;
        this.panStartX = 0;
        this.panStartY = 0;
        this.panStartOffsetX = 0;
        this.panStartOffsetY = 0;
    }

    // Screen coords → world coords
    screenToWorld(sx, sy) {
        return {
            x: (sx - this.offsetX) / this.zoom,
            y: (sy - this.offsetY) / this.zoom
        };
    }

    // World coords → screen coords
    worldToScreen(wx, wy) {
        return {
            x: wx * this.zoom + this.offsetX,
            y: wy * this.zoom + this.offsetY
        };
    }

    setZoom(newZoom, pivotX, pivotY) {
        const oldZoom = this.zoom;
        this.zoom = clamp(newZoom, this.minZoom, this.maxZoom);
        // Adjust offset so the pivot point stays in place
        const ratio = this.zoom / oldZoom;
        this.offsetX = pivotX - (pivotX - this.offsetX) * ratio;
        this.offsetY = pivotY - (pivotY - this.offsetY) * ratio;
    }

    zoomIn(pivotX, pivotY) {
        this.setZoom(this.zoom * 1.15, pivotX, pivotY);
    }

    zoomOut(pivotX, pivotY) {
        this.setZoom(this.zoom / 1.15, pivotX, pivotY);
    }

    zoomToFit(bounds, padding = 60) {
        if (!bounds || bounds.w === 0 || bounds.h === 0) {
            this.zoom = 1;
            this.offsetX = this.canvas.width / 2;
            this.offsetY = this.canvas.height / 2;
            return;
        }
        const cw = this.canvas.width - padding * 2;
        const ch = this.canvas.height - padding * 2;
        const scaleX = cw / bounds.w;
        const scaleY = ch / bounds.h;
        this.zoom = clamp(Math.min(scaleX, scaleY), this.minZoom, this.maxZoom);
        this.offsetX = this.canvas.width / 2 - (bounds.x + bounds.w / 2) * this.zoom;
        this.offsetY = this.canvas.height / 2 - (bounds.y + bounds.h / 2) * this.zoom;
    }

    reset() {
        this.zoom = 1;
        this.offsetX = this.canvas.width / 2;
        this.offsetY = this.canvas.height / 2;
    }

    startPan(sx, sy) {
        this.isPanning = true;
        this.panStartX = sx;
        this.panStartY = sy;
        this.panStartOffsetX = this.offsetX;
        this.panStartOffsetY = this.offsetY;
    }

    updatePan(sx, sy) {
        if (!this.isPanning) return;
        this.offsetX = this.panStartOffsetX + (sx - this.panStartX);
        this.offsetY = this.panStartOffsetY + (sy - this.panStartY);
    }

    endPan() {
        this.isPanning = false;
    }

    getZoomPercent() {
        return Math.round(this.zoom * 100);
    }

    applyTransform(ctx) {
        ctx.setTransform(this.zoom, 0, 0, this.zoom, this.offsetX, this.offsetY);
    }
}
