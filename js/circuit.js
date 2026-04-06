// ============================================================
// Circuit Model — Data structures for components and wires
// ============================================================

import { generateId, deepClone } from './utils.js';
import { componentMap } from './components.js';

export class CircuitComponent {
    constructor(type, x, y, rotation = 0) {
        this.id = generateId();
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = rotation; // degrees: 0, 90, 180, 270
        this.flipH = false;
        this.flipV = false;
        this.properties = {};
        this.label = '';

        const def = componentMap.get(type);
        if (def && def.properties) {
            for (const [key, prop] of Object.entries(def.properties)) {
                this.properties[key] = prop.default || '';
            }
        }
        if (def) {
            this.label = def.properties?.label?.default || '';
        }
    }

    getDef() {
        return componentMap.get(this.type);
    }

    getTerminals() {
        const def = this.getDef();
        if (!def) return [];
        const rot = this.rotation * Math.PI / 180;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        return def.terminals.map(t => {
            let tx = t.x, ty = t.y;
            if (this.flipH) tx = -tx;
            if (this.flipV) ty = -ty;
            return {
                name: t.name,
                x: this.x + tx * cos - ty * sin,
                y: this.y + tx * sin + ty * cos
            };
        });
    }

    getBounds() {
        const def = this.getDef();
        if (!def) return { x: this.x - 20, y: this.y - 20, w: 40, h: 40 };
        const hw = def.width / 2 + 4;
        const hh = def.height / 2 + 4;
        // Approximate rotated bounding box
        const rot = this.rotation * Math.PI / 180;
        const cos = Math.abs(Math.cos(rot));
        const sin = Math.abs(Math.sin(rot));
        const w = hw * cos + hh * sin;
        const h = hw * sin + hh * cos;
        return { x: this.x - w, y: this.y - h, w: w * 2, h: h * 2 };
    }

    containsPoint(px, py) {
        const b = this.getBounds();
        return px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h;
    }

    serialize() {
        return {
            id: this.id, type: this.type,
            x: this.x, y: this.y,
            rotation: this.rotation,
            flipH: this.flipH, flipV: this.flipV,
            properties: { ...this.properties },
            label: this.label
        };
    }

    static deserialize(data) {
        const c = new CircuitComponent(data.type, data.x, data.y, data.rotation);
        c.id = data.id;
        c.flipH = data.flipH || false;
        c.flipV = data.flipV || false;
        c.properties = data.properties || {};
        c.label = data.label || '';
        return c;
    }
}

export class Wire {
    constructor(points = []) {
        this.id = generateId();
        this.points = points; // [{x, y}, ...]
        this.startTerminal = null; // {componentId, terminalName}
        this.endTerminal = null;
    }

    addPoint(x, y) {
        this.points.push({ x, y });
    }

    getBounds() {
        if (this.points.length === 0) return { x: 0, y: 0, w: 0, h: 0 };
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of this.points) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        }
        return { x: minX - 4, y: minY - 4, w: maxX - minX + 8, h: maxY - minY + 8 };
    }

    containsPoint(px, py, threshold = 6) {
        for (let i = 0; i < this.points.length - 1; i++) {
            const a = this.points[i], b = this.points[i + 1];
            const dx = b.x - a.x, dy = b.y - a.y;
            const lenSq = dx * dx + dy * dy;
            if (lenSq === 0) continue;
            let t = ((px - a.x) * dx + (py - a.y) * dy) / lenSq;
            t = Math.max(0, Math.min(1, t));
            const cx = a.x + t * dx, cy = a.y + t * dy;
            const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
            if (dist <= threshold) return true;
        }
        return false;
    }

    serialize() {
        return {
            id: this.id,
            points: this.points.map(p => ({ x: p.x, y: p.y })),
            startTerminal: this.startTerminal ? { ...this.startTerminal } : null,
            endTerminal: this.endTerminal ? { ...this.endTerminal } : null
        };
    }

    static deserialize(data) {
        const w = new Wire(data.points);
        w.id = data.id;
        w.startTerminal = data.startTerminal;
        w.endTerminal = data.endTerminal;
        return w;
    }
}

export class TextLabel {
    constructor(x, y, text = 'Label') {
        this.id = generateId();
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontSize = 14;
    }

    containsPoint(px, py) {
        const hw = this.text.length * 4 + 8;
        const hh = this.fontSize;
        return px >= this.x - hw && px <= this.x + hw && py >= this.y - hh && py <= this.y + hh / 2;
    }

    getBounds() {
        const hw = this.text.length * 4 + 8;
        const hh = this.fontSize;
        return { x: this.x - hw, y: this.y - hh, w: hw * 2, h: hh * 1.5 };
    }

    serialize() {
        return { id: this.id, x: this.x, y: this.y, text: this.text, fontSize: this.fontSize };
    }

    static deserialize(data) {
        const l = new TextLabel(data.x, data.y, data.text);
        l.id = data.id;
        l.fontSize = data.fontSize || 14;
        return l;
    }
}

export class Circuit {
    constructor() {
        this.components = [];
        this.wires = [];
        this.labels = [];
        this.name = 'Untitled Circuit';
    }

    addComponent(comp) {
        this.components.push(comp);
    }

    addWire(wire) {
        this.wires.push(wire);
    }

    addLabel(label) {
        this.labels.push(label);
    }

    removeComponent(id) {
        // Also remove wires connected to this component
        this.wires = this.wires.filter(w => {
            if (w.startTerminal && w.startTerminal.componentId === id) return false;
            if (w.endTerminal && w.endTerminal.componentId === id) return false;
            return true;
        });
        this.components = this.components.filter(c => c.id !== id);
    }

    removeWire(id) {
        this.wires = this.wires.filter(w => w.id !== id);
    }

    removeLabel(id) {
        this.labels = this.labels.filter(l => l.id !== id);
    }

    findComponentAt(x, y) {
        // Reverse order so top-most (last added) is found first
        for (let i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].containsPoint(x, y)) return this.components[i];
        }
        return null;
    }

    findWireAt(x, y) {
        for (let i = this.wires.length - 1; i >= 0; i--) {
            if (this.wires[i].containsPoint(x, y)) return this.wires[i];
        }
        return null;
    }

    findLabelAt(x, y) {
        for (let i = this.labels.length - 1; i >= 0; i--) {
            if (this.labels[i].containsPoint(x, y)) return this.labels[i];
        }
        return null;
    }

    findTerminalAt(x, y, threshold = 10) {
        for (const comp of this.components) {
            const terminals = comp.getTerminals();
            for (const t of terminals) {
                const dist = Math.sqrt((x - t.x) ** 2 + (y - t.y) ** 2);
                if (dist <= threshold) {
                    return { componentId: comp.id, terminalName: t.name, x: t.x, y: t.y };
                }
            }
        }
        return null;
    }

    findItemAt(x, y) {
        const comp = this.findComponentAt(x, y);
        if (comp) return { type: 'component', item: comp };
        const label = this.findLabelAt(x, y);
        if (label) return { type: 'label', item: label };
        const wire = this.findWireAt(x, y);
        if (wire) return { type: 'wire', item: wire };
        return null;
    }

    getComponentById(id) {
        return this.components.find(c => c.id === id);
    }

    clear() {
        this.components = [];
        this.wires = [];
        this.labels = [];
    }

    serialize() {
        return {
            name: this.name,
            version: 1,
            components: this.components.map(c => c.serialize()),
            wires: this.wires.map(w => w.serialize()),
            labels: this.labels.map(l => l.serialize())
        };
    }

    static deserialize(data) {
        const circuit = new Circuit();
        circuit.name = data.name || 'Untitled Circuit';
        circuit.components = (data.components || []).map(d => CircuitComponent.deserialize(d));
        circuit.wires = (data.wires || []).map(d => Wire.deserialize(d));
        circuit.labels = (data.labels || []).map(d => TextLabel.deserialize(d));
        return circuit;
    }

    getStats() {
        return { components: this.components.length, wires: this.wires.length };
    }
}
