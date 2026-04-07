// ============================================================
// Component Definitions — SVG-like drawing for each component
// Each component: type, name, category, width, height,
//   terminals[], properties{}, draw(ctx)
// All drawing is centered at origin (0,0)
// ============================================================

const CATEGORIES = [
    { id: 'passive', name: 'Passive', icon: '⟡' },
    { id: 'sources', name: 'Sources', icon: '⚡' },
    { id: 'semiconductors', name: 'Semiconductors', icon: '◇' },
    { id: 'gates', name: 'Logic Gates', icon: '⊞' },
    { id: 'arduino', name: 'Arduino', icon: '♾' },
    { id: 'pcb', name: 'PCB Layout', icon: '▣' },
    { id: 'switches', name: 'Switches', icon: '⊡' },
    { id: 'measurement', name: 'Measurement', icon: '◎' },
    { id: 'misc', name: 'Miscellaneous', icon: '⊕' },
];

const S = 2; // stroke width

function drawLeads(ctx, left, right, y = 0) {
    ctx.beginPath();
    ctx.moveTo(-left, y); ctx.lineTo(-left + (left - 20), y);
    ctx.moveTo(left - (left - 20), y); ctx.lineTo(left, y);
    ctx.stroke();
}

const COMPONENTS = [
    // ── PASSIVE ──
    {
        type: 'resistor_iec', name: 'Resistor (IEC)', category: 'passive',
        width: 60, height: 20,
        terminals: [{ x: -30, y: 0, name: 'A' }, { x: 30, y: 0, name: 'B' }],
        properties: { value: { label: 'Resistance', default: '1kΩ' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-18, 0);
            ctx.moveTo(18, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.strokeRect(-18, -7, 36, 14);
        }
    },
    {
        type: 'resistor_us', name: 'Resistor (US)', category: 'passive',
        width: 60, height: 20,
        terminals: [{ x: -30, y: 0, name: 'A' }, { x: 30, y: 0, name: 'B' }],
        properties: { value: { label: 'Resistance', default: '1kΩ' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-18, 0);
            ctx.lineTo(-14, -8); ctx.lineTo(-8, 8); ctx.lineTo(-2, -8);
            ctx.lineTo(4, 8); ctx.lineTo(10, -8); ctx.lineTo(14, 8);
            ctx.lineTo(18, 0); ctx.lineTo(30, 0);
            ctx.stroke();
        }
    },
    {
        type: 'variable_resistor', name: 'Variable Resistor', category: 'passive',
        width: 60, height: 28,
        terminals: [{ x: -30, y: 0, name: 'A' }, { x: 30, y: 0, name: 'B' }],
        properties: { value: { label: 'Resistance', default: '10kΩ' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-18, 0);
            ctx.moveTo(18, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.strokeRect(-18, -7, 36, 14);
            ctx.beginPath();
            ctx.moveTo(-10, 12); ctx.lineTo(6, -12);
            ctx.moveTo(2, -12); ctx.lineTo(6, -12); ctx.lineTo(6, -8);
            ctx.stroke();
        }
    },
    {
        type: 'potentiometer', name: 'Potentiometer', category: 'passive',
        width: 60, height: 36,
        terminals: [{ x: -30, y: 0, name: 'A' }, { x: 30, y: 0, name: 'B' }, { x: 0, y: 18, name: 'W' }],
        properties: { value: { label: 'Resistance', default: '10kΩ' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-18, 0);
            ctx.moveTo(18, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.strokeRect(-18, -7, 36, 14);
            ctx.beginPath();
            ctx.moveTo(0, 18); ctx.lineTo(0, 7);
            ctx.moveTo(-4, 10); ctx.lineTo(0, 7); ctx.lineTo(4, 10);
            ctx.stroke();
        }
    },
    {
        type: 'capacitor', name: 'Capacitor', category: 'passive',
        width: 40, height: 24,
        terminals: [{ x: -20, y: 0, name: 'A' }, { x: 20, y: 0, name: 'B' }],
        properties: { value: { label: 'Capacitance', default: '100nF' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-4, 0);
            ctx.moveTo(4, 0); ctx.lineTo(20, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-4, -10); ctx.lineTo(-4, 10);
            ctx.moveTo(4, -10); ctx.lineTo(4, 10);
            ctx.stroke();
        }
    },
    {
        type: 'capacitor_pol', name: 'Polarized Cap', category: 'passive',
        width: 40, height: 24,
        terminals: [{ x: -20, y: 0, name: '+' }, { x: 20, y: 0, name: '-' }],
        properties: { value: { label: 'Capacitance', default: '100µF' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-4, 0);
            ctx.moveTo(4, 0); ctx.lineTo(20, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-4, -10); ctx.lineTo(-4, 10);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(8, 0, 4, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
            // Plus sign
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = '9px Inter';
            ctx.fillText('+', -12, -6);
        }
    },
    {
        type: 'inductor', name: 'Inductor', category: 'passive',
        width: 60, height: 20,
        terminals: [{ x: -30, y: 0, name: 'A' }, { x: 30, y: 0, name: 'B' }],
        properties: { value: { label: 'Inductance', default: '10mH' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-18, 0);
            for (let i = 0; i < 4; i++) {
                const cx = -14 + i * 9;
                ctx.arc(cx + 4.5, 0, 4.5, Math.PI, 0, false);
            }
            ctx.lineTo(30, 0);
            ctx.stroke();
        }
    },
    {
        type: 'transformer', name: 'Transformer', category: 'passive',
        width: 60, height: 50,
        terminals: [
            { x: -30, y: -15, name: 'P1' }, { x: -30, y: 15, name: 'P2' },
            { x: 30, y: -15, name: 'S1' }, { x: 30, y: 15, name: 'S2' }
        ],
        properties: { ratio: { label: 'Turns Ratio', default: '1:1' } },
        draw(ctx) {
            // Primary
            ctx.beginPath();
            ctx.moveTo(-30, -15); ctx.lineTo(-12, -15);
            ctx.moveTo(-30, 15); ctx.lineTo(-12, 15);
            ctx.stroke();
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(-12, -12 + i * 8, 4, -Math.PI / 2, Math.PI / 2);
                ctx.stroke();
            }
            // Core lines
            ctx.beginPath();
            ctx.moveTo(-2, -18); ctx.lineTo(-2, 18);
            ctx.moveTo(2, -18); ctx.lineTo(2, 18);
            ctx.stroke();
            // Secondary
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(12, -12 + i * 8, 4, Math.PI / 2, -Math.PI / 2);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.moveTo(12, -15); ctx.lineTo(30, -15);
            ctx.moveTo(12, 15); ctx.lineTo(30, 15);
            ctx.stroke();
        }
    },
    {
        type: 'fuse', name: 'Fuse', category: 'passive',
        width: 50, height: 16,
        terminals: [{ x: -25, y: 0, name: 'A' }, { x: 25, y: 0, name: 'B' }],
        properties: { value: { label: 'Rating', default: '1A' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-14, 0);
            ctx.moveTo(14, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.strokeRect(-14, -5, 28, 10);
            ctx.beginPath();
            ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
            ctx.stroke();
        }
    },

    // ── SOURCES ──
    {
        type: 'dc_source', name: 'DC Voltage', category: 'sources',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: '+' }, { x: 25, y: 0, name: '-' }],
        properties: { value: { label: 'Voltage', default: '5V' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('+', -6, -1);
            ctx.fillText('−', 6, -1);
        }
    },
    {
        type: 'ac_source', name: 'AC Voltage', category: 'sources',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: 'A' }, { x: 25, y: 0, name: 'B' }],
        properties: { value: { label: 'Voltage', default: '120V' }, freq: { label: 'Frequency', default: '60Hz' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-7, 0);
            ctx.bezierCurveTo(-5, -7, -1, -7, 0, 0);
            ctx.bezierCurveTo(1, 7, 5, 7, 7, 0);
            ctx.stroke();
        }
    },
    {
        type: 'battery', name: 'Battery', category: 'sources',
        width: 40, height: 28,
        terminals: [{ x: -20, y: 0, name: '+' }, { x: 20, y: 0, name: '-' }],
        properties: { value: { label: 'Voltage', default: '9V' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-6, 0);
            ctx.moveTo(6, 0); ctx.lineTo(20, 0);
            ctx.stroke();
            // Long line (positive)
            ctx.beginPath();
            ctx.moveTo(-6, -10); ctx.lineTo(-6, 10);
            ctx.stroke();
            // Short line (negative)
            ctx.lineWidth = ctx.lineWidth * 1.5;
            ctx.beginPath();
            ctx.moveTo(6, -5); ctx.lineTo(6, 5);
            ctx.stroke();
            ctx.lineWidth = ctx.lineWidth / 1.5;
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = '8px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('+', -10, -8);
        }
    },
    {
        type: 'current_source', name: 'Current Source', category: 'sources',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: 'A' }, { x: 25, y: 0, name: 'B' }],
        properties: { value: { label: 'Current', default: '1A' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-7, 0); ctx.lineTo(7, 0);
            ctx.moveTo(4, -3); ctx.lineTo(7, 0); ctx.lineTo(4, 3);
            ctx.stroke();
        }
    },
    {
        type: 'ground', name: 'Ground', category: 'sources',
        width: 20, height: 28,
        terminals: [{ x: 0, y: -14, name: 'GND' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, -14); ctx.lineTo(0, -2);
            ctx.moveTo(-10, -2); ctx.lineTo(10, -2);
            ctx.moveTo(-6, 3); ctx.lineTo(6, 3);
            ctx.moveTo(-2, 8); ctx.lineTo(2, 8);
            ctx.stroke();
        }
    },
    {
        type: 'vcc', name: 'VCC / Power', category: 'sources',
        width: 20, height: 24,
        terminals: [{ x: 0, y: 12, name: 'VCC' }],
        properties: { value: { label: 'Voltage', default: '5V' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 12); ctx.lineTo(0, 0);
            ctx.moveTo(-8, 0); ctx.lineTo(0, -10); ctx.lineTo(8, 0);
            ctx.stroke();
        }
    },

    // ── SEMICONDUCTORS ──
    {
        type: 'diode', name: 'Diode', category: 'semiconductors',
        width: 40, height: 24,
        terminals: [{ x: -20, y: 0, name: 'A' }, { x: 20, y: 0, name: 'K' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-8, 0);
            ctx.moveTo(8, 0); ctx.lineTo(20, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-8, -8); ctx.lineTo(8, 0); ctx.lineTo(-8, 8); ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(8, -8); ctx.lineTo(8, 8);
            ctx.stroke();
        }
    },
    {
        type: 'led', name: 'LED', category: 'semiconductors',
        width: 40, height: 30,
        terminals: [{ x: -20, y: 0, name: 'A' }, { x: 20, y: 0, name: 'K' }],
        properties: { color: { label: 'Color', default: 'Red' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-8, 0);
            ctx.moveTo(8, 0); ctx.lineTo(20, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-8, -8); ctx.lineTo(8, 0); ctx.lineTo(-8, 8); ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(8, -8); ctx.lineTo(8, 8);
            ctx.stroke();
            // Arrow rays
            ctx.beginPath();
            ctx.moveTo(2, -10); ctx.lineTo(7, -15);
            ctx.moveTo(4, -13); ctx.lineTo(7, -15); ctx.lineTo(7, -12);
            ctx.moveTo(7, -7); ctx.lineTo(12, -12);
            ctx.moveTo(9, -10); ctx.lineTo(12, -12); ctx.lineTo(12, -9);
            ctx.stroke();
        }
    },
    {
        type: 'zener', name: 'Zener Diode', category: 'semiconductors',
        width: 40, height: 24,
        terminals: [{ x: -20, y: 0, name: 'A' }, { x: 20, y: 0, name: 'K' }],
        properties: { value: { label: 'Voltage', default: '5.1V' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-8, 0);
            ctx.moveTo(8, 0); ctx.lineTo(20, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-8, -8); ctx.lineTo(8, 0); ctx.lineTo(-8, 8); ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(5, -10); ctx.lineTo(8, -8); ctx.lineTo(8, 8); ctx.lineTo(11, 10);
            ctx.stroke();
        }
    },
    {
        type: 'npn', name: 'NPN Transistor', category: 'semiconductors',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: 'B' }, { x: 15, y: -20, name: 'C' }, { x: 15, y: 20, name: 'E' }],
        properties: { label: { label: 'Label', default: 'Q1' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-5, 0);
            ctx.moveTo(-5, -14); ctx.lineTo(-5, 14);
            ctx.moveTo(-5, -7); ctx.lineTo(15, -20);
            ctx.moveTo(-5, 7); ctx.lineTo(15, 20);
            ctx.stroke();
            // Arrow on emitter
            ctx.beginPath();
            ctx.moveTo(9, 15); ctx.lineTo(15, 20); ctx.lineTo(8, 19);
            ctx.stroke();
            // Circle
            ctx.beginPath();
            ctx.arc(2, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    {
        type: 'pnp', name: 'PNP Transistor', category: 'semiconductors',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: 'B' }, { x: 15, y: -20, name: 'E' }, { x: 15, y: 20, name: 'C' }],
        properties: { label: { label: 'Label', default: 'Q1' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-5, 0);
            ctx.moveTo(-5, -14); ctx.lineTo(-5, 14);
            ctx.moveTo(-5, -7); ctx.lineTo(15, -20);
            ctx.moveTo(-5, 7); ctx.lineTo(15, 20);
            ctx.stroke();
            // Arrow on emitter (toward base)
            ctx.beginPath();
            ctx.moveTo(-1, -9); ctx.lineTo(-5, -7); ctx.lineTo(0, -3);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(2, 0, 18, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    {
        type: 'nmosfet', name: 'N-MOSFET', category: 'semiconductors',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: 'G' }, { x: 15, y: -20, name: 'D' }, { x: 15, y: 20, name: 'S' }],
        properties: { label: { label: 'Label', default: 'M1' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-8, 0);
            ctx.moveTo(-8, -14); ctx.lineTo(-8, 14);
            ctx.moveTo(-4, -12); ctx.lineTo(-4, -4);
            ctx.moveTo(-4, -2); ctx.lineTo(-4, 4);
            ctx.moveTo(-4, 6); ctx.lineTo(-4, 12);
            ctx.moveTo(-4, -8); ctx.lineTo(15, -8); ctx.lineTo(15, -20);
            ctx.moveTo(-4, 8); ctx.lineTo(15, 8); ctx.lineTo(15, 20);
            ctx.moveTo(-4, 0); ctx.lineTo(15, 0); ctx.lineTo(15, 8);
            ctx.stroke();
            // Arrow
            ctx.beginPath();
            ctx.moveTo(1, 0); ctx.lineTo(-4, 3); ctx.lineTo(-4, -3);
            ctx.fill();
        }
    },

    // ── LOGIC GATES ──
    {
        type: 'and_gate', name: 'AND Gate', category: 'gates',
        width: 60, height: 40,
        terminals: [{ x: -30, y: -10, name: 'A' }, { x: -30, y: 10, name: 'B' }, { x: 30, y: 0, name: 'Y' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, -10); ctx.lineTo(-15, -10);
            ctx.moveTo(-30, 10); ctx.lineTo(-15, 10);
            ctx.moveTo(18, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-15, -16); ctx.lineTo(-15, 16);
            ctx.lineTo(2, 16);
            ctx.arc(2, 0, 16, Math.PI / 2, -Math.PI / 2, true);
            ctx.lineTo(-15, -16);
            ctx.stroke();
        }
    },
    {
        type: 'or_gate', name: 'OR Gate', category: 'gates',
        width: 60, height: 40,
        terminals: [{ x: -30, y: -10, name: 'A' }, { x: -30, y: 10, name: 'B' }, { x: 30, y: 0, name: 'Y' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, -10); ctx.lineTo(-12, -10);
            ctx.moveTo(-30, 10); ctx.lineTo(-12, 10);
            ctx.moveTo(18, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-15, -16);
            ctx.quadraticCurveTo(-5, -16, 18, 0);
            ctx.quadraticCurveTo(-5, 16, -15, 16);
            ctx.quadraticCurveTo(-8, 0, -15, -16);
            ctx.stroke();
        }
    },
    {
        type: 'not_gate', name: 'NOT Gate', category: 'gates',
        width: 60, height: 36,
        terminals: [{ x: -30, y: 0, name: 'A' }, { x: 30, y: 0, name: 'Y' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-14, 0);
            ctx.moveTo(22, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-14, -14); ctx.lineTo(17, 0); ctx.lineTo(-14, 14); ctx.closePath();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(19.5, 0, 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    {
        type: 'nand_gate', name: 'NAND Gate', category: 'gates',
        width: 60, height: 40,
        terminals: [{ x: -30, y: -10, name: 'A' }, { x: -30, y: 10, name: 'B' }, { x: 30, y: 0, name: 'Y' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, -10); ctx.lineTo(-15, -10);
            ctx.moveTo(-30, 10); ctx.lineTo(-15, 10);
            ctx.moveTo(22, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-15, -16); ctx.lineTo(-15, 16);
            ctx.lineTo(0, 16);
            ctx.arc(0, 0, 16, Math.PI / 2, -Math.PI / 2, true);
            ctx.lineTo(-15, -16);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(19, 0, 3, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    {
        type: 'xor_gate', name: 'XOR Gate', category: 'gates',
        width: 60, height: 40,
        terminals: [{ x: -30, y: -10, name: 'A' }, { x: -30, y: 10, name: 'B' }, { x: 30, y: 0, name: 'Y' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, -10); ctx.lineTo(-10, -10);
            ctx.moveTo(-30, 10); ctx.lineTo(-10, 10);
            ctx.moveTo(18, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-13, -16);
            ctx.quadraticCurveTo(-3, -16, 18, 0);
            ctx.quadraticCurveTo(-3, 16, -13, 16);
            ctx.quadraticCurveTo(-6, 0, -13, -16);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-17, 16);
            ctx.quadraticCurveTo(-10, 0, -17, -16);
            ctx.stroke();
        }
    },

    // ── SWITCHES ──
    {
        type: 'switch_spst', name: 'Switch (SPST)', category: 'switches',
        width: 50, height: 20,
        terminals: [{ x: -25, y: 0, name: 'A' }, { x: 25, y: 0, name: 'B' }],
        properties: { state: { label: 'State', default: 'Open' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-10, 0);
            ctx.moveTo(10, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-10, 0, 2.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(10, 0, 2.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-8, 0); ctx.lineTo(8, -10);
            ctx.stroke();
        }
    },
    {
        type: 'push_button', name: 'Push Button', category: 'switches',
        width: 50, height: 24,
        terminals: [{ x: -25, y: 0, name: 'A' }, { x: 25, y: 0, name: 'B' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-10, 0);
            ctx.moveTo(10, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-10, 0); ctx.lineTo(-10, -5);
            ctx.moveTo(10, 0); ctx.lineTo(10, -5);
            ctx.moveTo(-12, -10); ctx.lineTo(12, -10);
            ctx.stroke();
        }
    },

    // ── MEASUREMENT ──
    {
        type: 'ammeter', name: 'Ammeter', category: 'measurement',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: '+' }, { x: 25, y: 0, name: '-' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('A', 0, 0);
        }
    },
    {
        type: 'voltmeter', name: 'Voltmeter', category: 'measurement',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: '+' }, { x: 25, y: 0, name: '-' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('V', 0, 0);
        }
    },

    // ── MISCELLANEOUS ──
    {
        type: 'opamp', name: 'Op-Amp', category: 'misc',
        width: 60, height: 50,
        terminals: [
            { x: -30, y: -12, name: '+' }, { x: -30, y: 12, name: '-' }, { x: 30, y: 0, name: 'OUT' }
        ],
        properties: { label: { label: 'Label', default: 'U1' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-30, -12); ctx.lineTo(-16, -12);
            ctx.moveTo(-30, 12); ctx.lineTo(-16, 12);
            ctx.moveTo(16, 0); ctx.lineTo(30, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-16, -22); ctx.lineTo(16, 0); ctx.lineTo(-16, 22); ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = '9px Inter';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('+', -10, -12);
            ctx.fillText('−', -10, 12);
        }
    },
    {
        type: 'lamp', name: 'Lamp', category: 'misc',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: 'A' }, { x: 25, y: 0, name: 'B' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-10, -10); ctx.lineTo(10, 10);
            ctx.moveTo(10, -10); ctx.lineTo(-10, 10);
            ctx.stroke();
        }
    },
    {
        type: 'motor', name: 'Motor', category: 'misc',
        width: 50, height: 50,
        terminals: [{ x: -25, y: 0, name: 'A' }, { x: 25, y: 0, name: 'B' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-25, 0); ctx.lineTo(-15, 0);
            ctx.moveTo(15, 0); ctx.lineTo(25, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('M', 0, 1);
        }
    },
    {
        type: 'speaker', name: 'Speaker', category: 'misc',
        width: 44, height: 30,
        terminals: [{ x: -22, y: -8, name: '+' }, { x: -22, y: 8, name: '-' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-22, -8); ctx.lineTo(-10, -8);
            ctx.moveTo(-22, 8); ctx.lineTo(-10, 8);
            ctx.stroke();
            ctx.strokeRect(-10, -8, 10, 16);
            ctx.beginPath();
            ctx.moveTo(0, -8); ctx.lineTo(12, -14);
            ctx.lineTo(12, 14); ctx.lineTo(0, 8);
            ctx.stroke();
        }
    },
    {
        type: 'crystal', name: 'Crystal Osc', category: 'misc',
        width: 40, height: 24,
        terminals: [{ x: -20, y: 0, name: 'A' }, { x: 20, y: 0, name: 'B' }],
        properties: { value: { label: 'Frequency', default: '16MHz' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(-20, 0); ctx.lineTo(-8, 0);
            ctx.moveTo(8, 0); ctx.lineTo(20, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-8, -9); ctx.lineTo(-8, 9);
            ctx.moveTo(8, -9); ctx.lineTo(8, 9);
            ctx.stroke();
            ctx.strokeRect(-5, -6, 10, 12);
        }
    },
    {
        type: 'wire_junction', name: 'Junction', category: 'misc',
        width: 10, height: 10,
        terminals: [{ x: 0, y: 0, name: 'J' }],
        properties: {},
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();
        }
    },

    // ── ARDUINO ──
    {
        type: 'arduino_uno', name: 'Arduino Uno', category: 'arduino',
        width: 140, height: 100,
        terminals: [
            { x: -50, y: -45, name: 'D0' }, { x: -40, y: -45, name: 'D1' }, { x: -30, y: -45, name: 'D2' },
            { x: -20, y: -45, name: 'D3' }, { x: -10, y: -45, name: 'D4' }, { x: 0, y: -45, name: 'D5' },
            { x: 20, y: 45, name: 'A0' }, { x: 30, y: 45, name: 'A1' }, { x: 40, y: 45, name: 'A2' },
            { x: -60, y: 20, name: 'VIN' }, { x: -60, y: 30, name: '5V' }, { x: -60, y: 40, name: 'GND' }
        ],
        properties: { label: { label: 'Label', default: 'MCU1' } },
        draw(ctx) {
            ctx.strokeRect(-60, -45, 120, 90);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = 'bold 10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('ARDUINO UNO', 0, 0);
            // Header markers
            ctx.strokeRect(-55, -42, 60, 8);
            ctx.strokeRect(15, 34, 40, 8);
            ctx.strokeRect(-58, 15, 8, 30);
        }
    },
    {
        type: 'disp_7seg', name: '7-Segment', category: 'arduino',
        width: 40, height: 60,
        terminals: [
            { x: -15, y: -30, name: 'a' }, { x: 0, y: -30, name: 'b' }, { x: 15, y: -30, name: 'c' },
            { x: -15, y: 30, name: 'e' }, { x: 0, y: 30, name: 'com' }, { x: 15, y: 30, name: 'g' }
        ],
        properties: { type: { label: 'Type', default: 'Common Cathode' } },
        draw(ctx) {
            ctx.strokeRect(-15, -25, 30, 50);
            // Draw a basic "8" shape
            ctx.lineWidth = 1;
            ctx.strokeRect(-8, -20, 16, 18);
            ctx.strokeRect(-8, 2, 16, 18);
        }
    },

    // ── PCB ──
    {
        type: 'pcb_via', name: 'VIA', category: 'pcb',
        width: 20, height: 20,
        terminals: [{ x: 0, y: 0, name: 'P' }],
        properties: { drill: { label: 'Drill (mm)', default: '0.3' }, size: { label: 'Size (mm)', default: '0.6' } },
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fill();
        }
    },
    {
        type: 'pcb_pad_smt', name: 'SMT Pad', category: 'pcb',
        width: 20, height: 12,
        terminals: [{ x: 0, y: 0, name: 'P' }],
        properties: { size: { label: 'Size', default: '1.2x0.8' } },
        draw(ctx) {
            ctx.strokeRect(-8, -4, 16, 8);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(-8, -4, 16, 8);
            ctx.globalAlpha = 1.0;
        }
    },
    {
        type: 'pcb_text', name: 'Silk Label', category: 'pcb',
        width: 40, height: 20,
        terminals: [{ x: 0, y: 0, name: 'T' }],
        properties: { text: { label: 'Text', default: 'REF' } },
        draw(ctx) {
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = '8px Monospace';
            ctx.textAlign = 'center';
            ctx.fillText(ctx.canvas.__label || 'SILK', 0, 0);
            ctx.setLineDash([2, 2]);
            ctx.strokeRect(-15, -8, 30, 16);
            ctx.setLineDash([]);
        }
    },
];

// Build lookup maps
const componentMap = new Map();
COMPONENTS.forEach(c => componentMap.set(c.type, c));

const categoryMap = new Map();
CATEGORIES.forEach(cat => {
    categoryMap.set(cat.id, {
        ...cat,
        components: COMPONENTS.filter(c => c.category === cat.id)
    });
});

export { COMPONENTS, CATEGORIES, componentMap, categoryMap };
