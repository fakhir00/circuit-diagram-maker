// ============================================================
// IO — Save, Load, Export (SVG, PNG, JSON)
// ============================================================

import { componentMap } from './components.js';
import { showToast } from './utils.js';
import { Circuit } from './circuit.js';

export class IO {
    constructor(app) {
        this.app = app;
    }

    get circuit() { return this.app.circuit; }
    get storageKey() { return this.app.storageKey; }
    get defaultProjectName() { return this.app.defaultProjectName; }

    // ── SAVE / LOAD JSON ──

    saveToLocalStorage() {
        const data = this.circuit.serialize();
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        showToast('Circuit saved', 'success');
    }

    loadFromLocalStorage() {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) { showToast('No saved circuit found', 'error'); return false; }
        try {
            return this._loadJSON(raw);
        } catch (e) {
            showToast('Failed to load circuit', 'error');
            return false;
        }
    }

    downloadJSON() {
        const data = this.circuit.serialize();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this._download(blob, `${this.circuit.name || 'circuit'}.circuit`);
        showToast('JSON exported', 'success');
    }

    openFile() {
        const input = document.getElementById('file-input');
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    this._loadJSON(ev.target.result);
                    showToast('Circuit loaded', 'success');
                } catch (err) {
                    showToast('Failed to load file', 'error');
                }
            };
            reader.readAsText(file);
            input.value = '';
        };
        input.click();
    }

    _loadJSON(raw) {
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
        const restored = Circuit.deserialize(data);
        this.circuit.components = restored.components;
        this.circuit.wires = restored.wires;
        this.circuit.labels = restored.labels;
        this.circuit.name = restored.name || this.defaultProjectName;
        document.getElementById('circuit-name').value = this.circuit.name;
        this.app.history.clear();
        this.app.renderer.selection.clear();
        this.app.updateStats();
        return true;
    }

    // ── EXPORT SVG ──

    exportSVG() {
        const bounds = this.app.renderer.getCircuitBounds();
        if (!bounds) { showToast('Nothing to export', 'error'); return; }

        const pad = 40;
        const w = bounds.w + pad * 2;
        const h = bounds.h + pad * 2;
        const ox = -bounds.x + pad;
        const oy = -bounds.y + pad;

        let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n`;
        svg += `<rect width="100%" height="100%" fill="#ffffff"/>\n`;
        svg += `<g transform="translate(${ox},${oy})" stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">\n`;

        // Wires
        for (const wire of this.circuit.wires) {
            if (wire.points.length < 2) continue;
            const d = wire.points.map((p, i) =>
                `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
            ).join(' ');
            svg += `  <path d="${d}" stroke="#333333"/>\n`;
        }

        // Components as groups
        for (const comp of this.circuit.components) {
            const def = comp.getDef();
            if (!def) continue;
            svg += `  <g transform="translate(${comp.x},${comp.y}) rotate(${comp.rotation})">\n`;
            svg += this._componentToSVGPaths(def, comp);
            svg += `  </g>\n`;

            // Terminal dots
            const terminals = comp.getTerminals();
            for (const t of terminals) {
                svg += `  <circle cx="${t.x}" cy="${t.y}" r="2.5" fill="#333333"/>\n`;
            }

            // Value label
            const val = comp.properties.value || comp.label || '';
            if (val) {
                const b = comp.getBounds();
                svg += `  <text x="${comp.x}" y="${b.y + b.h + 14}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#666">${this._escXml(val)}</text>\n`;
            }
        }

        // Labels
        for (const label of this.circuit.labels) {
            svg += `  <text x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="${label.fontSize}" fill="#333">${this._escXml(label.text)}</text>\n`;
        }

        svg += `</g>\n</svg>`;

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        this._download(blob, `${this.circuit.name || 'circuit'}.svg`);
        showToast('SVG exported', 'success');
    }

    _componentToSVGPaths(def) {
        // Re-render component to an offscreen canvas and trace paths
        // For simplicity, use a canvas-to-SVG approximation
        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.translate(100, 100);
        ctx.strokeStyle = '#1a1a1a';
        ctx.fillStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Capture path operations via proxy
        const paths = [];
        let currentPath = [];
        const origBeginPath = ctx.beginPath.bind(ctx);
        const origMoveTo = ctx.moveTo.bind(ctx);
        const origLineTo = ctx.lineTo.bind(ctx);
        const origStroke = ctx.stroke.bind(ctx);
        const origArc = ctx.arc.bind(ctx);
        const origStrokeRect = ctx.strokeRect.bind(ctx);
        const origClosePath = ctx.closePath.bind(ctx);
        const origFill = ctx.fill.bind(ctx);
        const origFillText = ctx.fillText.bind(ctx);
        const origBezierCurveTo = ctx.bezierCurveTo.bind(ctx);
        const origQuadraticCurveTo = ctx.quadraticCurveTo.bind(ctx);

        let svgOut = '';
        let pathD = '';

        ctx.beginPath = () => { pathD = ''; origBeginPath(); };
        ctx.moveTo = (x, y) => { pathD += `M${x},${y} `; origMoveTo(x, y); };
        ctx.lineTo = (x, y) => { pathD += `L${x},${y} `; origLineTo(x, y); };
        ctx.arc = (cx, cy, r, sa, ea, ccw) => {
            // Approximate arc as SVG arc
            const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
            const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
            let sweep = ccw ? 0 : 1;
            let large = Math.abs(ea - sa) > Math.PI ? 1 : 0;
            if (ccw) large = large ? 0 : 1;
            pathD += `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} ${sweep} ${x2.toFixed(1)},${y2.toFixed(1)} `;
            origArc(cx, cy, r, sa, ea, ccw);
        };
        ctx.bezierCurveTo = (c1x, c1y, c2x, c2y, x, y) => {
            pathD += `C${c1x},${c1y} ${c2x},${c2y} ${x},${y} `;
            origBezierCurveTo(c1x, c1y, c2x, c2y, x, y);
        };
        ctx.quadraticCurveTo = (cx, cy, x, y) => {
            pathD += `Q${cx},${cy} ${x},${y} `;
            origQuadraticCurveTo(cx, cy, x, y);
        };
        ctx.closePath = () => { pathD += 'Z '; origClosePath(); };
        ctx.stroke = () => {
            if (pathD) svgOut += `    <path d="${pathD.trim()}" fill="none"/>\n`;
            pathD = '';
            origStroke();
        };
        ctx.fill = () => {
            if (pathD) svgOut += `    <path d="${pathD.trim()}" fill="#1a1a1a" stroke="none"/>\n`;
            pathD = '';
            origFill();
        };
        ctx.strokeRect = (x, y, w, h) => {
            svgOut += `    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none"/>\n`;
            origStrokeRect(x, y, w, h);
        };
        ctx.fillText = (text, x, y) => {
            svgOut += `    <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Inter" font-size="10" fill="#1a1a1a">${this._escXml(text)}</text>\n`;
            origFillText(text, x, y);
        };

        def.draw(ctx);
        if (pathD) svgOut += `    <path d="${pathD.trim()}" fill="none"/>\n`;

        return svgOut;
    }

    _escXml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ── EXPORT PNG ──

    exportPNG() {
        const bounds = this.app.renderer.getCircuitBounds();
        if (!bounds) { showToast('Nothing to export', 'error'); return; }

        const scale = 3; // High DPI
        const pad = 40;
        const w = (bounds.w + pad * 2) * scale;
        const h = (bounds.h + pad * 2) * scale;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.translate(-bounds.x + pad, -bounds.y + pad);

        // Draw wires
        for (const wire of this.circuit.wires) {
            if (wire.points.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(wire.points[0].x, wire.points[0].y);
            for (let i = 1; i < wire.points.length; i++) ctx.lineTo(wire.points[i].x, wire.points[i].y);
            ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            ctx.lineCap = 'round'; ctx.stroke();
        }

        // Draw components
        for (const comp of this.circuit.components) {
            const def = comp.getDef();
            if (!def) continue;
            ctx.save();
            ctx.translate(comp.x, comp.y);
            ctx.rotate(comp.rotation * Math.PI / 180);
            ctx.strokeStyle = '#1a1a1a'; ctx.fillStyle = '#1a1a1a';
            ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            def.draw(ctx);
            ctx.restore();
            // Terminals
            for (const t of comp.getTerminals()) {
                ctx.beginPath(); ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#333'; ctx.fill();
            }
        }

        // Labels
        for (const label of this.circuit.labels) {
            ctx.font = `${label.fontSize}px Inter, sans-serif`;
            ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label.text, label.x, label.y);
        }

        canvas.toBlob(blob => {
            this._download(blob, `${this.circuit.name || 'circuit'}.png`);
            showToast('PNG exported (3x resolution)', 'success');
        }, 'image/png');
    }

    _download(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
}
