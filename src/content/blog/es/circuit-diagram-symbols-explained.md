---
title: "Explicación de los símbolos del diagrama de circuito: guía de referencia completa"
description: "Una guía completa de símbolos de diagramas de circuitos electrónicos. Aprenda a identificar y utilizar resistencias, condensadores, transistores, circuitos integrados y más en sus esquemas."
date: 2026-04-04
author: "Circuit Diagram Maker Team"
lang: "es"
category: "Reference"
tags: ["symbols", "reference", "components", "electronics"]
---


Comprender los símbolos de los diagramas de circuitos es el primer paso para leer y crear esquemas electrónicos. Cada componente de un diagrama de circuito está representado por un símbolo estandarizado que transmite su función, no su apariencia física. Esta guía cubre los símbolos más comunes que encontrará y utilizará en **Circuit Diagram Maker**.

## Por qué son importantes los símbolos estandarizados

Los símbolos de los diagramas de circuitos siguen los estándares internacionales, principalmente **IEC 60617** (usado a nivel mundial) y **ANSI Y32.2** (usado principalmente en Norteamérica). El uso de símbolos estandarizados garantiza:

- Los ingenieros de todo el mundo pueden leer sus esquemas.
- Las herramientas automatizadas pueden procesar y analizar sus diseños.
- Los diagramas publicados cumplen con los requisitos de las revistas y de la industria.
- Los miembros del equipo comparten un vocabulario visual común.

## Símbolos de componentes pasivos

### Resistencia
El símbolo de la resistencia aparece como una línea en zigzag (ANSI) o un rectángulo simple (IEC). Las resistencias limitan el flujo de corriente y son el componente más común en cualquier diagrama de circuito. Designador de referencia: **R** (p. ej., R1, R2, R_PULL).

### Condensador
Los condensadores se muestran como dos líneas paralelas (no polarizadas) o con una línea curva que indica el terminal negativo (polarizadas/electrolíticas). Almacenan energía y filtran señales. Designador de referencia: **C** (p. ej., C1, C_BYPASS).

### Inductor
Un inductor aparece como una serie de bucles o protuberancias. Los inductores almacenan energía en campos magnéticos y se utilizan en fuentes de alimentación, filtros y circuitos de RF. Designador de referencia: **L** (p. ej., L1, L_CHOKE).

## Símbolos semiconductores

### Diodo
Un triángulo que apunta hacia una barra vertical representa un diodo. La corriente fluye desde el ánodo (base triangular) al cátodo (barra). Las variaciones incluyen diodos Zener (extremos de barra en ángulo) y diodos Schottky (extremos de barra curvados). Designador de referencia: **D**.

### LED (diodo emisor de luz)
Un símbolo LED parece un diodo estándar con dos flechas apuntando hacia afuera, que representan la luz emitida. Circuit Diagram Maker incluye símbolos LED para indicadores de estado y circuitos de iluminación.

### Transistor (BJT)
Los transistores de unión bipolar NPN y PNP comparten un símbolo similar: una barra vertical con dos líneas en ángulo. La dirección de la flecha distingue NPN (flecha que apunta hacia afuera) de PNP (flecha que apunta hacia adentro). Designador de referencia: **Q**.

### MOSFET
Los símbolos MOSFET muestran tres terminales (puerta, drenaje, fuente) con un espacio entre la puerta y el canal. Las variantes de canal N y canal P se distinguen por la dirección de la flecha. Se utiliza ampliamente en conmutación de potencia y lógica digital.

## Símbolos de circuitos integrados

### amplificador operacional
El amplificador operacional se dibuja como un triángulo con dos entradas (invertida "-" y no inversora "+") a la izquierda y una salida a la derecha. Los amplificadores operacionales son fundamentales para el diseño de circuitos analógicos.

### Microcontrolador
Los microcontroladores aparecen como rectángulos con pines etiquetados para GPIO, interfaces de alimentación, tierra y comunicación. Circuit Diagram Maker proporciona rectángulos IC estándar que puede etiquetar con cualquier configuración de pines.

### Puertas lógicas
Las puertas AND, OR, NOT, NAND, NOR y XOR tienen cada una formas distintivas que indican su función booleana. Estos símbolos son esenciales para los diagramas de circuitos digitales.

## Símbolos de potencia y tierra

### Batería
El símbolo de una batería consta de líneas paralelas largas y cortas que se alternan. La línea larga representa el terminal positivo. Las baterías de celdas múltiples muestran pares de líneas adicionales.

### Tierra
El símbolo de tierra (tres líneas horizontales de longitud decreciente) indica el punto de voltaje de referencia del circuito (0V). Cada diagrama de circuito debe mostrar claramente las conexiones a tierra.

### Riel de voltaje
Las flechas o líneas etiquetadas con valores de voltaje (VCC, 3,3 V, 5 V, 12 V) indican las conexiones de la fuente de alimentación sin tener que volver a conectar todos los cables a la batería o al regulador.

## Símbolos de conector e interfaz

### Cabeceras y conectores
Los conectores aparecen como pequeños círculos o rectángulos en el borde de un diagrama de circuito, que representan conexiones físicas a sistemas externos. Designador de referencia: **J** (p. ej., J1, J_USB).

### Puntos de prueba
Los círculos pequeños con la etiqueta "TP" indican puntos de acceso a la medición, lo que resulta útil para la depuración y las pruebas de producción.

## Uso de símbolos en Circuit Diagram Maker

Se puede acceder a los más de 40 símbolos en **Circuit Diagram Maker** desde la barra lateral izquierda. Puede:

1. **Busca** componentes por nombre usando la barra de búsqueda
2. **Arrastra y suelta** cualquier símbolo en el lienzo.
3. **Rote** y **voltee** los símbolos para que coincidan con su diseño esquemático
4. **Edite etiquetas** haciendo doble clic en cualquier componente colocado

Cada símbolo se exporta nítidamente en formatos SVG y PNG, manteniendo la claridad de la línea en cualquier nivel de zoom. [Abra el editor ahora](/editor/) para explorar la biblioteca de símbolos completa.
