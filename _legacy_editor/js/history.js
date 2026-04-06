// ============================================================
// History — Undo / Redo stack using circuit snapshots
// ============================================================

import { Circuit } from './circuit.js';

export class History {
    constructor(circuit, maxSize = 50) {
        this.circuit = circuit;
        this.maxSize = maxSize;
        this.undoStack = [];
        this.redoStack = [];
        this.onChange = null;
        // Save initial state
        this.saveState();
    }

    saveState() {
        const snapshot = JSON.stringify(this.circuit.serialize());
        this.undoStack.push(snapshot);
        if (this.undoStack.length > this.maxSize) {
            this.undoStack.shift();
        }
        this.redoStack = [];
        this._notify();
    }

    undo() {
        if (this.undoStack.length <= 1) return false;
        const current = this.undoStack.pop();
        this.redoStack.push(current);
        const prev = this.undoStack[this.undoStack.length - 1];
        this._restore(prev);
        this._notify();
        return true;
    }

    redo() {
        if (this.redoStack.length === 0) return false;
        const next = this.redoStack.pop();
        this.undoStack.push(next);
        this._restore(next);
        this._notify();
        return true;
    }

    _restore(snapshot) {
        const data = JSON.parse(snapshot);
        const restored = Circuit.deserialize(data);
        this.circuit.components = restored.components;
        this.circuit.wires = restored.wires;
        this.circuit.labels = restored.labels;
    }

    canUndo() {
        return this.undoStack.length > 1;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    _notify() {
        if (this.onChange) this.onChange();
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
        this.saveState();
    }
}
