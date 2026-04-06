// ============================================================
// Utility Functions — Geometry, ID generation, helpers
// ============================================================

export function generateId() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
}

export function snapToGrid(value, gridSize = 20) {
    return Math.round(value / gridSize) * gridSize;
}

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

export function rectIntersect(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function rotatePoint(x, y, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: x * cos - y * sin,
        y: x * sin + y * cos
    };
}

export function getTerminalWorldPos(component, terminal) {
    const rot = (component.rotation || 0) * Math.PI / 180;
    const p = rotatePoint(terminal.x, terminal.y, rot);
    return {
        x: component.x + p.x,
        y: component.y + p.y
    };
}

export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Manhattan distance for wire routing heuristic
export function manhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

// Check if a point is near a line segment
export function pointNearSegment(px, py, x1, y1, x2, y2, threshold = 5) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return distance(px, py, x1, y1) <= threshold;
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = clamp(t, 0, 1);
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    return distance(px, py, closestX, closestY) <= threshold;
}

// Find closest point on a set of wire segments
export function findNearestWirePoint(px, py, wirePoints, threshold = 8) {
    let minDist = Infinity;
    let nearestIdx = -1;
    for (let i = 0; i < wirePoints.length - 1; i++) {
        const x1 = wirePoints[i].x, y1 = wirePoints[i].y;
        const x2 = wirePoints[i + 1].x, y2 = wirePoints[i + 1].y;
        if (pointNearSegment(px, py, x1, y1, x2, y2, threshold)) {
            const d = distToSegment(px, py, x1, y1, x2, y2);
            if (d < minDist) {
                minDist = d;
                nearestIdx = i;
            }
        }
    }
    return nearestIdx >= 0 ? { segmentIndex: nearestIdx, distance: minDist } : null;
}

function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return distance(px, py, x1, y1);
    let t = clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
    return distance(px, py, x1 + t * dx, y1 + t * dy);
}

// Toast notification helper
export function showToast(message, type = 'info', duration = 2500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = {
        success: '✓',
        error: '✗',
        info: 'ℹ'
    };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.2s ease forwards';
        setTimeout(() => toast.remove(), 200);
    }, duration);
}
