---
title: "JFET Symbol – How to Read and Draw Junction Field-Effect Transistor"
description: "Learn the JFET symbol, how to identify gate, drain, and source terminals, and how to read and draw junction field-effect transistor symbols in circuit diagrams."
date: 2026-04-07
author: "Circuit Diagram Maker Team"
lang: "en"
category: "Symbols"
tags: ["symbols", "transistors", "electronics-basics", "schematic-reading"]
---

The **JFET symbol** appears in circuit diagrams wherever a designer needs voltage-controlled current flow — audio preamps, sensor buffers, and analog switches all rely on junction field-effect transistors. If you can already recognize resistors and diodes, the JFET is the next symbol to add to your vocabulary.

## What Is a JFET?

A Junction Field-Effect Transistor (JFET) controls current through a semiconductor channel using an electric field applied at the gate terminal. Unlike a BJT, which is current-controlled, a JFET is **voltage-controlled** — the gate draws almost no current, which makes it ideal for high-impedance input stages.

| Characteristic | JFET | BJT |
|---|---|---|
| Control mechanism | Gate voltage | Base current |
| Input impedance | Very high (MΩ range) | Moderate (kΩ range) |
| Typical designator | Q | Q |
| Common applications | Audio preamps, sensor buffers, analog switches | General amplification, switching |
| Noise performance | Excellent at low frequencies | Good but higher 1/f noise |

> **Why choose a JFET?** When you need to amplify a weak signal from a high-impedance source — such as a piezoelectric sensor or a condenser microphone — a JFET input stage prevents the amplifier from loading down the source and distorting the measurement.

## Anatomy of the JFET Symbol

Every JFET symbol shows three terminals connected to a vertical channel line:

| Terminal | Location on Symbol | Role |
|---|---|---|
| Gate (G) | Side arm with an arrow | Controls channel conductivity via electric field |
| Drain (D) | Top of channel line | Current enters here (N-channel) |
| Source (S) | Bottom of channel line | Current exits here (N-channel) |

The **arrow direction** on the gate tells you whether the device is N-channel or P-channel:

- **N-channel JFET** — arrow points **inward** toward the channel.
- **P-channel JFET** — arrow points **outward** away from the channel.

> **Memory trick:** "N points iN." If the arrow aims into the channel, it is an N-channel JFET.

## N-Channel vs P-Channel at a Glance

| Parameter | N-Channel JFET | P-Channel JFET |
|---|---|---|
| Arrow direction | Inward | Outward |
| Channel carriers | Electrons | Holes |
| Gate bias for cutoff | Negative voltage | Positive voltage |
| Popularity | More common | Less common |
| Typical use | Low-noise preamps, analog switches | Complementary designs, level shifting |

In practice, N-channel JFETs dominate because electron mobility is higher than hole mobility, which translates to lower noise and faster switching.

## How a JFET Works in a Circuit

The core operating principle is simple:

1. **With zero gate-source voltage**, the channel is fully open and maximum current flows from drain to source. This is called the **IDSS** condition.
2. **As gate voltage moves toward the pinch-off value**, the electric field squeezes the channel, reducing current.
3. **At the pinch-off voltage (VP)**, the channel is fully constricted and current drops to near zero.

This behavior makes the JFET a **normally-on** device — it conducts by default and turns off when you apply a control voltage. This is the opposite of a typical enhancement-mode MOSFET, which is normally off.

## Typical Applications in Schematics

When you spot the JFET symbol, the surrounding circuit usually falls into one of these categories:

| Circuit Pattern | What the JFET Does |
|---|---|
| Common-source amplifier | Voltage gain stage with high input impedance |
| Source follower (common-drain) | Unity-gain buffer for impedance matching |
| Analog switch / multiplexer | Routes signals with minimal distortion |
| Current source | Provides a stable bias current using self-biasing |
| Chopper / sample-and-hold | Gates analog signals for precision measurement |

## How to Read the JFET Symbol Step by Step

1. **Locate the three terminals.** Find gate, drain, and source either by labels or by position on the symbol.
2. **Check the arrow.** Inward = N-channel. Outward = P-channel.
3. **Trace the drain-source path.** Follow the main current path through the circuit to understand whether the JFET is amplifying, switching, or buffering.
4. **Inspect the gate connection.** Look at what drives the gate — a bias resistor, a coupling capacitor, a sensor output, or a control signal. This tells you how the JFET is being controlled.

## Drawing the JFET in Circuit Diagram Maker

Follow these conventions when placing the symbol in your schematic:

- Use the designator prefix **Q** (e.g., Q1, Q2).
- Orient the symbol so the drain-source path aligns with the main signal flow — typically vertical.
- Place gate bias resistors and coupling capacitors close to the gate terminal.
- Label the part number if known (e.g., 2N5457, J201, BF245).

> **Schematic style tip:** Keep the gate connection entering from the left and the drain-source path running vertically. This makes the signal flow intuitive and prevents the symbol from looking upside-down to reviewers used to standard conventions.

## JFET vs MOSFET — Avoiding Confusion

Beginners often mix up the two because both are "field-effect transistors." The key visual difference is:

- **JFET** — gate connects directly to the channel (no gap in the symbol).
- **MOSFET** — gate is separated from the channel by a gap representing the insulating oxide layer.

If you see a gap between the gate line and the channel, it is a MOSFET. If the gate touches or connects via an arrow, it is a JFET.

## Summary

The JFET symbol is straightforward once you memorize three things: the arrow direction encodes the channel type, the gate controls the channel with voltage (not current), and the device is normally on. With that knowledge, you can read JFET stages in audio preamps, sensor interfaces, and analog switches with confidence.

Practice placing JFET symbols in the [Circuit Diagram Maker editor](/editor/) and explore the full [component library](/components/). For related guides, see [Circuit Diagram Symbols Explained](/blog/circuit-diagram-symbols-explained/) and [The Ultimate Guide to Circuit Diagrams](/blog/ultimate-guide-circuit-diagrams/).
