---
layout: page.njk
title: Demonstration of diagram tags
---


This document demonstrates various settings for custom tags for rendering PlantUML, Mermaid and Pintora diagrams.

PlantUML default settings to PNG

<diagrams-plantuml input-file="activity-1.puml"
    output-file="activity-1.png" tpng/>

PlantUML default settings to SVG

<diagrams-plantuml input-file="activity-1.puml"
    output-file="activity-1.svg" tsvg/>

PlantUML width=100 SVG

<diagrams-plantuml input-file="activity-1.puml"
    output-file="activity-1-width-100.svg" tsvg
    width='100'/>

PlantUML width=200 SVG

<diagrams-plantuml input-file="activity-1.puml"
    output-file="activity-1-width-200.svg" tsvg
    width='200'/>

Pintora default settings to PNG

<diagrams-pintora input-file="pintora-class-1.pint"
    output-file="pintora-class-1.png"
    mime-type="image/png"/>

Pintora default settings to SVG

<diagrams-pintora input-file="pintora-class-1.pint"
    output-file="pintora-class-1.svg"
    mime-type="image/svg+xml"/>

Pintora width=100 to SVG

<diagrams-pintora input-file="pintora-class-1.pint"
    output-file="pintora-class-1-width-100.svg"
    mime-type="image/svg+xml" width="100"/>

Pintora width=200 to SVG

<diagrams-pintora input-file="pintora-class-1.pint"
    output-file="pintora-class-1-width-200.svg"
    mime-type="image/svg+xml" width="200"/>

Pintora inline to element to JPEG

<diagrams-pintora
    output-file="img/pintora-sequence-1.jpg"
    mime-type="image/jpeg">
sequenceDiagram
  Frida-->>Georgia: Flowers are beautiful
  @note over Frida,Georgia: Painters
  @note right of Georgia: Right
  @start_note left of Georgia
  multiline
  note
  @end_note
</diagrams-pintora>

Pintora inline to element to PNG

<diagrams-pintora
    output-file="img/pintora-sequence-1.png"
    mime-type="image/png">
sequenceDiagram
  Frida-->>Georgia: Flowers are beautiful
  @note over Frida,Georgia: Painters
  @note right of Georgia: Right
  @start_note left of Georgia
  multiline
  note
  @end_note
</diagrams-pintora>

Pintora inline to element to SVG

<diagrams-pintora
    output-file="img/pintora-sequence-1.svg"
    mime-type="image/svg+xml">
sequenceDiagram
  Frida-->>Georgia: Flowers are beautiful
  @note over Frida,Georgia: Painters
  @note right of Georgia: Right
  @start_note left of Georgia
  multiline
  note
  @end_note
</diagrams-pintora>

Pintora inline to element to SVG width=300

<diagrams-pintora
    output-file="img/pintora-sequence-1-width-300.svg"
    mime-type="image/svg+xml" width="300">
sequenceDiagram
  Frida-->>Georgia: Flowers are beautiful
  @note over Frida,Georgia: Painters
  @note right of Georgia: Right
  @start_note left of Georgia
  multiline
  note
  @end_note
</diagrams-pintora>

Mermaid inline to Markdown


```mermaid Optional title for the win
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```


Mermaid from file to PNG

<diagrams-mermaid
        input-file='./simple-sample-1.mmd'
        output-file='./simple-sample-1.png'/>


Mermaid from file to SVG

<diagrams-mermaid
        input-file='./simple-sample-1.mmd'
        output-file='./simple-sample-1.svg'/>


Mermaid from file to SVG width=200

<diagrams-mermaid
        input-file='./simple-sample-1.mmd'
        output-file='./simple-sample-1-width-200.svg'
        width='200'/>


