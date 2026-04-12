---
title: "How to Make a 12V to 220V AC Circuit Diagram"
description: "Learn how to draw a 12V to 220V AC inverter circuit diagram step by step. Understand the main components, power flow, transformer stage, and safety rules before building or documenting an inverter schematic."
date: 2026-04-07
author: "Circuit Diagram Maker Team"
lang: "en"
category: "Power Electronics"
tags: ["inverter", "tutorial", "power-electronics", "circuit-design"]
---

A **12 V to 220 V AC inverter** converts low-voltage battery power into mains-level alternating current. Whether you are documenting an off-grid solar project, preparing a university lab report, or simply learning power electronics fundamentals, knowing how to lay out this circuit on a schematic is an essential skill. This guide walks you through the five functional blocks, the key components, and the step-by-step drawing process inside **Circuit Diagram Maker**.

> **Safety warning:** 220 V AC is lethal. This article covers *schematic documentation*, not construction. If you intend to build a physical inverter, verify every component rating, use proper isolation, and consult a qualified engineer.

## The Five Functional Blocks

Every basic inverter schematic can be divided into five clearly separated sections. Thinking in blocks — rather than individual parts — keeps the diagram readable.

| Block | Location on Schematic | Key Components |
|---|---|---|
| 1. DC input | Far left | 12 V battery, fuse, main switch |
| 2. Oscillator / driver | Left-center | CD4047, 555 timer, or MCU PWM output |
| 3. Power switching | Center | MOSFET pair (e.g., IRF3205, IRFZ44N) |
| 4. Transformer | Center-right | Center-tapped step-up transformer |
| 5. AC output | Far right | Output terminals, fuse, load label |

> **Layout principle:** Keep power flowing left to right across the schematic. Low-voltage blocks sit on the left; high-voltage blocks sit on the right. This makes the danger boundary visually obvious.

## Key Components and Their Roles

| Component | Designator | Role in the Inverter |
|---|---|---|
| 12 V lead-acid battery | BT1 | Provides the DC energy source |
| Input fuse (15 A) | F1 | Protects against short-circuit current |
| SPST power switch | S1 | Manual on-off control |
| CD4047 astable IC | U1 | Generates 50 Hz complementary square-wave outputs |
| Timing resistor and capacitor | R1, C1 | Set the oscillation frequency to 50 Hz |
| N-channel MOSFETs (×2) | Q1, Q2 | Switch current alternately through each half of the transformer primary |
| Gate resistors | R2, R3 | Limit gate current and damp oscillation |
| Center-tapped transformer | T1 | Steps 12 V AC up to 220 V AC |
| Output fuse (3 A) | F2 | Protects the load side |

## How the Circuit Works

Understanding the operating principle makes the schematic far easier to draw — and to debug later.

1. **Battery supplies DC.** BT1 provides 12 V to both the oscillator and the power stage.
2. **Oscillator generates drive signals.** U1 (CD4047) outputs two complementary 50 Hz square waves on its Q and Q̅ pins.
3. **MOSFETs alternate current.** Q1 and Q2 each conduct during opposite half-cycles, pushing current through alternating halves of the transformer primary winding.
4. **Transformer steps up voltage.** The alternating magnetic field in the primary induces a higher voltage on the secondary winding. With the correct turns ratio, the secondary output reaches approximately 220 V AC.
5. **Output reaches the load.** The stepped-up AC passes through an output fuse and arrives at the load terminals.

## Step-by-Step Drawing Guide

Open the [Circuit Diagram Maker editor](/editor/) and follow these five steps:

### Step 1 — DC Input Block

Place the battery symbol on the far left. Wire a fuse (F1) in series with the positive terminal, then add the power switch (S1). Connect the battery negative terminal to a ground symbol. Label the rail `12 V DC`.

### Step 2 — Oscillator Block

To the right of the input block, place the CD4047 IC symbol (U1). Add the timing resistor (R1) and capacitor (C1) on the appropriate pins. Wire VCC to the 12 V rail and VSS to ground.

### Step 3 — Power Switching Stage

Place two N-channel MOSFET symbols (Q1, Q2) to the right of the oscillator. Connect each gate to one of the CD4047's complementary outputs through a gate resistor. Connect both sources to ground.

### Step 4 — Transformer

Place the transformer symbol (T1) with its center-tapped primary. Wire each MOSFET drain to one end of the primary winding. Connect the center tap to the 12 V rail. The secondary winding's two terminals become the AC output.

### Step 5 — AC Output Block

On the far right, place an output fuse (F2), label the output terminals `220 V AC`, and add a load symbol or connector if needed. This visually separates the high-voltage output from everything else.

## Common Schematic Mistakes

| Mistake | Consequence | Fix |
|---|---|---|
| Mixing low-voltage and high-voltage sections | Dangerous ambiguity for reviewers | Separate blocks with clear whitespace |
| Unlabeled transformer winding | Impossible to verify turns ratio | Always label primary center tap and secondary voltage |
| Missing fuses | No over-current protection documented | Add F1 on DC input and F2 on AC output |
| Overlapping oscillator and power nets | Wiring confusion during layout | Route gate-drive lines cleanly away from power paths |

## Best Practices for Inverter Schematics

- Label every net: `12 V`, `GND`, `GATE_Q1`, `GATE_Q2`, `220 V AC`.
- Draw the transformer large enough that primary and secondary are clearly distinguishable.
- Use reference designators on every single component.
- Add a title block with project name, revision, and the safety label `CAUTION: HIGH VOLTAGE`.

> **Documentation tip:** Even for an educational sketch, include the safety warning. Reviewers and classmates will take the schematic more seriously, and it establishes a professional habit early.

## Summary

Drawing a 12 V to 220 V AC inverter schematic is straightforward when you think in five blocks: DC input, oscillator, switching, transformer, and AC output. Lay them left to right, label every net and component, and keep the high-voltage section visually isolated.

Build the diagram section by section in the [Circuit Diagram Maker editor](/editor/). For related guides, see [How to Make a Circuit Diagram Online](/blog/how-to-make-circuit-diagram-online/) and [Best Practices for Circuit Schematic Design](/blog/best-practices-circuit-schematic-design/).
