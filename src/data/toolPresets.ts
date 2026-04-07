export interface Preset {
  id: string;
  label: string;
  title: string;
  summary: string;
  specs: [string, string][];
  metrics: { label: string; value: string; strength: number; accent: string }[];
  stages: { name: string; detail: string; load: number }[];
  checkpoints: string[];
}

export const toolPresets: Preset[] = [
  {
    id: 'logic',
    label: 'Logic Control',
    title: 'Sensor and MCU interface',
    summary: 'Plan input protection, pull resistors, and connector strategy for digital control systems.',
    specs: [
      ['Primary parts', '12'],
      ['Estimated nets', '16'],
      ['Signal class', 'Mixed signal']
    ],
    metrics: [
      { label: 'Bus utilization', value: '57%', strength: 57, accent: 'violet' },
      { label: 'Pin fan-out', value: '71%', strength: 71, accent: 'cyan' },
      { label: 'Protection cover', value: '88%', strength: 88, accent: 'emerald' }
    ],
    stages: [
      { name: 'Sensor ingress', detail: 'ESD and pull network', load: 24 },
      { name: 'MCU processing', detail: 'Core logic and timing', load: 49 },
      { name: 'Peripheral links', detail: 'UART and GPIO breakout', load: 27 }
    ],
    checkpoints: ['Reserve spare GPIO labels', 'Flag mixed-voltage crossings', 'Document pull-up defaults']
  },
  {
    id: 'audio',
    label: 'Audio Amp',
    title: 'Class-A Preamplifier',
    summary: 'Design high-fidelity signal paths with DC blocking capacitors and precision gain stages.',
    specs: [
      ['Primary parts', '7'],
      ['Estimated nets', '11'],
      ['Signal class', 'Hi-Fi Audio']
    ],
    metrics: [
      { label: 'Gain balance', value: '76%', strength: 76, accent: 'fuchsia' },
      { label: 'DC isolation', value: '84%', strength: 84, accent: 'cyan' },
      { label: 'Output clarity', value: '73%', strength: 73, accent: 'emerald' }
    ],
    stages: [
      { name: 'Input coupling', detail: 'DC block and source trim', load: 21 },
      { name: 'Transistor gain', detail: 'Bias and amplification core', load: 53 },
      { name: 'Line conditioning', detail: 'Output cap and line handoff', load: 26 }
    ],
    checkpoints: ['Verify bias point symmetry', 'Keep audio ground quiet', 'Separate line output from supply return']
  },
  {
    id: 'gates',
    label: 'Logic Designer',
    title: 'Digital Logic Controller',
    summary: 'Design binary logic CMOS circuits with AND, OR, and XOR gates for specialized digital handshakes.',
    specs: [
      ['Primary gates', '7'],
      ['Logic depth', '4-layer'],
      ['Signal class', 'Digital CMOS']
    ],
    metrics: [
      { label: 'Logic stability', value: '72%', strength: 72, accent: 'violet' },
      { label: 'Timing margin', value: '85%', strength: 85, accent: 'cyan' },
      { label: 'Fan-out efficiency', value: '64%', strength: 64, accent: 'emerald' }
    ],
    stages: [
      { name: 'Binary ingress', detail: 'Input levels and pull-downs', load: 21 },
      { name: 'Condition logic', detail: 'Branching and XOR gates', load: 56 },
      { name: 'Signal output', detail: 'Buffer stage and edge trim', load: 23 }
    ],
    checkpoints: ['Minimize gate propagation delay', 'Verify CMOS logic thresholds', 'Buffer fan-out branches']
  },
  {
    id: 'pcb_tool',
    label: 'PCB Drafting',
    title: 'Multi-layer Schematic',
    summary: 'Design manufacturing-ready PCBs with multi-layer trace routing, VIAs, and thermal pad relief.',
    specs: [
      ['Layer count', '4-Layer'],
      ['Trace width', '6 mil'],
      ['Clearance', '0.15 mm']
    ],
    metrics: [
      { label: 'Signal Integrity', value: '91%', strength: 91, accent: 'cyan' },
      { label: 'Thermal relief', value: '82%', strength: 82, accent: 'emerald' },
      { label: 'EMI shielding', value: '67%', strength: 67, accent: 'rose' }
    ],
    stages: [
      { name: 'Trace routing', detail: 'Automatic differential routing', load: 46 },
      { name: 'Layer stacking', detail: 'Ground plane and isolation', load: 38 },
      { name: 'Gerber prep', detail: 'VIA drill path optimization', load: 16 }
    ],
    checkpoints: ['Keep differential pairs matched', 'Balance ground plane coverage', 'Minimize high-speed VIA hops']
  },
  {
    id: 'arduino',
    label: 'Arduino Lab',
    title: 'Standard Arduino Uno Shield',
    summary: 'Create custom shields with Arduino header alignment, pin mappings, and peripheral integration.',
    specs: [
      ['Header pins', '28'],
      ['Voltage rail', '5V/3.3V'],
      ['Bus type', 'I2C / SPI']
    ],
    metrics: [
      { label: 'Pin availability', value: '58%', strength: 58, accent: 'blue' },
      { label: 'Power headroom', value: '77%', strength: 77, accent: 'amber' },
      { label: 'Shield fit', value: '94%', strength: 94, accent: 'emerald' }
    ],
    stages: [
      { name: 'Header mapping', detail: 'Pin assignment and grouping', load: 31 },
      { name: 'Shield layout', detail: 'Component footprint and fit', load: 42 },
      { name: 'Bus breakout', detail: 'I2C/SPI network routing', load: 27 }
    ],
    checkpoints: ['Verify shield height clearance', 'Keep I2C pull-ups on-module', 'Standardize pin 1 position']
  },
  {
    id: 'analog',
    label: 'Analog Filter',
    title: 'Two-stage active filter',
    summary: 'Preview how op-amps, passive parts, and measurement nodes fit together before you open the editor.',
    specs: [
      ['Primary parts', '8'],
      ['Estimated nets', '14'],
      ['Signal class', 'Low-noise analog']
    ],
    metrics: [
      { label: 'Noise headroom', value: '82 dB', strength: 82, accent: 'cyan' },
      { label: 'Loop stability', value: '74%', strength: 74, accent: 'blue' },
      { label: 'Probe access', value: '91%', strength: 91, accent: 'emerald' }
    ],
    stages: [
      { name: 'Input RC shaping', detail: 'Bias cleanup and corner tuning', load: 28 },
      { name: 'Active gain stage', detail: 'Dual op-amp response control', load: 46 },
      { name: 'Output monitor', detail: 'Measurement node and trim path', load: 26 }
    ],
    checkpoints: ['Shield high-impedance nodes', 'Keep feedback loop short', 'Probe filter corner before export']
  },
  {
    id: 'power',
    label: 'Power Supply',
    title: 'Buck regulator block',
    summary: 'Map the high-current path, feedback loop, and decoupling strategy in a layout-friendly structure.',
    specs: [
      ['Primary parts', '10'],
      ['Estimated nets', '18'],
      ['Signal class', 'Power conversion']
    ],
    metrics: [
      { label: 'Current density', value: '68%', strength: 68, accent: 'amber' },
      { label: 'Ripple control', value: '79%', strength: 79, accent: 'rose' },
      { label: 'Thermal margin', value: '63%', strength: 63, accent: 'emerald' }
    ],
    stages: [
      { name: 'PWM switch node', detail: 'Fast edge energy loop', load: 37 },
      { name: 'Inductor smoothing', detail: 'Current ripple containment', load: 41 },
      { name: 'Feedback return', detail: 'Quiet sensing and compensation', load: 22 }
    ],
    checkpoints: ['Separate power and sense return', 'Tighten hot loop geometry', 'Place decoupling next to load']
  },
  {
    id: 'iot',
    label: 'IoT Node',
    title: 'Wireless Sensor Module',
    summary: 'Low-power design featuring ESP32/ARM controllers, I2C sensors, and battery management.',
    specs: [
      ['Primary parts', '14'],
      ['Estimated nets', '22'],
      ['Signal class', 'Digital Pulse']
    ],
    metrics: [
      { label: 'Battery budget', value: '72%', strength: 72, accent: 'emerald' },
      { label: 'RF activity', value: '66%', strength: 66, accent: 'rose' },
      { label: 'Sensor readiness', value: '87%', strength: 87, accent: 'amber' }
    ],
    stages: [
      { name: 'Power source', detail: 'Battery path and regulation', load: 29 },
      { name: 'Controller core', detail: 'ESP32 logic and sleep flow', load: 44 },
      { name: 'Edge links', detail: 'I2C sensing and RF handoff', load: 27 }
    ],
    checkpoints: ['Segment sleep and active rails', 'Annotate RF exclusion area', 'Review sensor pull-up sizing']
  }
];
