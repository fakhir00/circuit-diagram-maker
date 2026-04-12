---
title: "SPST Symbol – Complete Guide to Single Pole Single Throw Switch"
description: "Learn what the SPST symbol means, how a single pole single throw switch works, where it is used, and how to draw it correctly in circuit diagrams."
date: 2026-04-07
author: "Circuit Diagram Maker Team"
lang: "en"
category: "Symbols"
tags: ["symbols", "switches", "electronics-basics", "schematic-reading"]
---

The **SPST symbol** is the simplest switch symbol in electronics — and one of the most important. It represents a basic on-off control with exactly one circuit path and exactly one switching position. If you are learning to read or draw schematics, mastering the SPST symbol is an essential first step before moving to more complex switch types.

## What Does SPST Stand For?

SPST breaks down into two terms that describe the switch's electrical topology:

| Term | Meaning | Practical Effect |
|---|---|---|
| Single Pole | Controls **one** circuit path | Only one wire is switched |
| Single Throw | Has **one** contact position | The path is either connected or disconnected |

Combined, a Single Pole Single Throw switch is the electrical equivalent of a light switch — flip it one way and current flows, flip it the other way and current stops.

> **Analogy:** Imagine a drawbridge over a river. When the bridge is down (closed), traffic crosses. When the bridge is up (open), traffic halts. An SPST switch is exactly that drawbridge — one road, one position.

## What the SPST Symbol Looks Like

On a schematic, the SPST symbol is drawn as two terminal dots connected by an angled line that can pivot:

- **Open state** — the angled line does not touch the far terminal, leaving a visible gap. No current flows.
- **Closed state** — the line connects both terminals. Current flows through the path.

Most schematics show the switch in its **normal (resting) state**, which for a basic SPST is usually open unless the datasheet specifies otherwise.

## How an SPST Switch Works

The operation is binary — there are only two possible states:

| State | Contacts | Current Flow | Circuit Effect |
|---|---|---|---|
| Open | Separated | None | Path is broken |
| Closed | Touching | Full | Path is complete |

This simplicity makes the SPST switch ideal for any application where you need a human-operated on-off control without selecting between multiple outputs.

## Where SPST Switches Appear in Real Circuits

| Application | Why SPST Is Used |
|---|---|
| Battery power toggle | Simple on-off for portable devices |
| LED enable switch | Manual control of indicator lights |
| Appliance power entry | Main disconnect for safety |
| Prototype test circuits | Quick way to enable or disable a branch |
| Emergency stop (when latching) | Single action to cut a critical power path |

> **Did you know?** The humble wall light switch in your home is typically an SPST switch. It controls one circuit (the light) with one action (flip up or down).

## How to Read the SPST Symbol in a Schematic

When you encounter the symbol, ask three questions:

1. **What path does it control?** Trace the wire entering and leaving the switch. That is the circuit branch being opened or closed.
2. **Is it shown open or closed?** The default drawing state tells you the switch's normal position. Open usually means "off by default."
3. **Where is it in the circuit?** An SPST in the power path acts as a main power switch. An SPST on a signal line acts as an enable gate.

## SPST vs Other Switch Types

Understanding how SPST fits into the switch family prevents confusion when you encounter more complex symbols:

| Switch Type | Poles | Throws | Typical Use |
|---|---|---|---|
| SPST | 1 | 1 | Simple on-off |
| SPDT | 1 | 2 | Toggle between two outputs (e.g., A/B selector) |
| DPST | 2 | 1 | Switch two independent paths simultaneously |
| DPDT | 2 | 2 | Motor direction reversal, signal routing |

> **Quick rule:** If the symbol shows only two terminals and one movable contact, it is SPST. If you see a third terminal, it is likely SPDT.

## Drawing the SPST Symbol in Circuit Diagram Maker

Follow these conventions for a clean, readable schematic:

1. Place the switch **in line** with the wire it controls — do not let it float between unrelated nets.
2. Orient it so the signal flows left to right through the switch.
3. Label it with a standard designator: `S1`, `SW1`, or a descriptive name like `Power Switch`.
4. If the switch has a specific mechanical type (toggle, push-button, slide), add a note next to the designator.

### Example Layout

A basic battery-powered LED circuit with an SPST switch follows this order on the canvas:

| Position | Component | Designator |
|---|---|---|
| Far left | 9 V Battery | BT1 |
| Left-center | SPST Switch | S1 |
| Center | 330 Ω Resistor | R1 |
| Right | Red LED | D1 |
| Return path | Wire back to battery negative | GND |

This left-to-right arrangement makes the switching function immediately obvious to any reviewer.

## Common Mistakes to Avoid

1. **Confusing SPST with SPDT.** If your symbol shows a choice between two output terminals, it is not SPST.
2. **Omitting labels in complex schematics.** A switch labeled only as a generic symbol is ambiguous. Always add `S1` or a descriptive name.
3. **Placing the switch off the controlled path.** The switch must sit directly on the wire it interrupts. A floating switch connected by long diagonal wires creates visual confusion.

## Summary

The SPST symbol is the foundation of switch notation in electronics. It controls one path with one action — on or off. Once you recognize the two-terminal, single-contact drawing, you can immediately understand any power toggle or enable gate in a schematic.

Practice placing switch symbols in a clean layout by opening the [Circuit Diagram Maker editor](/editor/) and browsing the [component library](/components/). For more symbol guides, see [Circuit Diagram Symbols Explained](/blog/circuit-diagram-symbols-explained/) and [Circuit Diagrams for Beginners](/blog/circuit-diagram-for-beginners/).
