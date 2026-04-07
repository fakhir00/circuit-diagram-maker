---
title: "SPST Symbol – Complete Guide to Single Pole Single Throw Switch"
description: "Learn what the SPST symbol means, how a single pole single throw switch works, where it is used, and how to draw it correctly in circuit diagrams."
date: 2026-04-07
author: "Circuit Diagram Maker Team"
lang: "en"
category: "Symbols"
tags: ["symbols", "switches", "electronics-basics", "schematic-reading"]
---

# SPST Symbol – Complete Guide to Single Pole Single Throw Switch

The **SPST symbol** is one of the most common switch symbols in electronics and electrical schematics. If you are learning how to read circuit diagrams, understanding this symbol is essential because it represents the simplest type of manual switching action: a basic **on/off connection**.

In this guide, we will explain what the **single pole single throw switch** symbol means, how it works, where it is used, and how to draw it correctly in a schematic.

## What Does SPST Mean?

SPST stands for:

- **Single Pole**
- **Single Throw**

Each term describes one part of the switch behavior.

### Single Pole

“Single pole” means the switch controls **one circuit path**. It has one input line and one output line being connected or disconnected.

### Single Throw

“Single throw” means the switch has **one switching position** for making the connection. In practical terms, it is simply either:

- Open
- Closed

That is why an SPST switch is often described as the most basic **on/off switch**.

## What the SPST Symbol Looks Like

In a circuit diagram, the **SPST symbol** is usually drawn as two terminals with a break between them and a movable angled contact line.

When the switch is:

- **Open**, the circuit path is broken
- **Closed**, the contact joins the two terminals

This symbol shows logical operation, not the physical look of the switch body.

## How an SPST Switch Works

An SPST switch controls current by opening or closing a single path.

### Open State

In the open state, the contacts do not touch, so current cannot flow through that path.

### Closed State

In the closed state, the contacts connect, allowing current to move through the circuit.

This makes the SPST switch ideal for:

- Turning a circuit on or off
- Enabling a power input
- Acting as a simple control switch

## Typical Applications of the SPST Switch

The SPST symbol appears in many everyday and technical schematics.

| Application | Why SPST Is Used |
|------------|------------------|
| Battery-powered devices | Simple power on/off control |
| LED circuits | Manual enable/disable |
| Appliance schematics | Basic switching function |
| Prototypes and test circuits | Easy user control |
| Power entry section | Main disconnect point |

Because it is so simple, it is often the first switch symbol beginners learn.

## How to Read the SPST Symbol in a Circuit Diagram

When you see an SPST symbol in a schematic, ask these questions:

### What Path Is It Controlling?

Trace the wire entering and leaving the switch. That tells you which branch of the circuit is being opened or closed.

### Is It Normally Open or Shown Closed?

Most schematic symbols are drawn in their **normal state**, which usually means unpressed or inactive. In many diagrams, an SPST switch is shown open unless noted otherwise.

### Is It in the Power Path or Signal Path?

An SPST switch may be used to switch:

- Main power
- A control signal
- A sensor input
- A branch output

Its role depends on where it appears in the circuit.

## How to Draw the SPST Symbol Correctly

If you are creating a schematic in **Circuit Diagram Maker**, keep the SPST symbol clean and easy to read.

### Drawing Tips

- Place the switch in line with the wire it controls
- Keep the left-to-right flow clear
- Label it if needed as `S1`, `SW1`, or `Power Switch`
- Avoid placing it where the controlled path becomes ambiguous

### Example Layout

A simple battery-and-LED circuit with an SPST switch might be arranged like this:

| Block | Example Order |
|------|---------------|
| Power source | Battery |
| Control element | SPST switch |
| Load | Resistor + LED |
| Return path | Ground or battery negative |

That structure makes the switching function immediately obvious.

## SPST vs Other Switch Symbols

It helps to compare SPST with related switch types.

| Switch Type | Full Form | Main Difference |
|------------|-----------|-----------------|
| SPST | Single Pole Single Throw | One path, simple on/off |
| SPDT | Single Pole Double Throw | One path switched between two outputs |
| DPST | Double Pole Single Throw | Two separate paths switched together |
| DPDT | Double Pole Double Throw | Two paths, each switched between two outputs |

If you only need to connect or disconnect one line, SPST is usually the right symbol.

## Common Mistakes When Using the SPST Symbol

### Mixing It Up with SPDT

An SPDT switch has an extra throw path. If your symbol shows a choice between two outputs, it is not SPST.

### Using It Without Labels in Complex Schematics

In larger circuits, it helps to label the switch clearly so reviewers know whether it is a power switch, reset switch, or mode selector.

### Placing It in a Visually Confusing Position

The symbol should be aligned with the wire being controlled, not floating in a way that makes the path unclear.

## Best Practices for SPST Symbols in Schematics

- Use standard switch notation like `S1`
- Keep it aligned with the branch it controls
- Show the normal state clearly
- Place it near the circuit section it affects
- Avoid excessive wire bends around the symbol

## Final Thoughts

The **SPST symbol** represents one of the simplest and most important switching elements in circuit diagrams. Once you understand that it controls a single path with a basic open-or-closed action, it becomes very easy to recognize in schematics.

If you want to practice placing switch symbols in a clean layout, open the [Circuit Diagram Maker editor](/editor/), browse the [component library](/components/), and continue learning with our related guides such as [How to Read a Circuit Diagram: A Step-by-Step Guide](/blog/how-to-read-a-circuit-diagram-step-by-step-guide/), [Circuit Diagram Symbols Explained](/blog/circuit-diagram-symbols-explained/), and [Circuit Diagrams for Beginners](/blog/circuit-diagram-for-beginners/).
