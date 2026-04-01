# Spezifikationsplan 04 – Browser ↔ Terminal-Gateway (WebSocket)

Status: Wartet auf Implementierungserkenntnisse

Statushinweis: `Wartet auf Implementierungserkenntnisse` bedeutet, dass die konzeptionelle Arbeit an diesem Plan bewusst pausiert, bis neue belastbare Erkenntnisse aus der späteren Implementierung vorliegen.

## Ziel der Spezifikation

Die interaktive Browser-Schnittstelle zum Terminal-Gateway so spezifizieren, dass Verbindungsaufbau, Autorisierung, Terminal-I/O, Resize, Keepalive und Fehlerbehandlung eindeutig beschrieben sind.

## Bezug zum Konzept

Das Konzept nennt für diese Schnittstelle einen **WebSocket** zwischen Browser und Terminal-Gateway. Das Gateway validiert eine vom Backend ausgestellte Terminal-Berechtigung und leitet den Terminal-Datenstrom zur Konsole weiter.

## Zu spezifizierender Scope

* WebSocket-Handshake und Autorisierung
* Nachrichten für Eingabe, Ausgabe, Resize und Sitzungssteuerung
* Fehler- und Disconnect-Verhalten
* Ablauf und Erneuerung kurzlebiger Berechtigungen
* Relevante Zustände der Browser-Terminal-Sitzung

## Erwartete Artefakte

* OpenAPI-Entwurf oder dokumentierte Klärung, in welchem Umfang WebSocket-Verhalten über OpenAPI beschrieben wird
* ergänzende Nachrichten-Schemas unter `schemas/gateway/`
* Event- und Zustandsdefinitionen unter `models/events/` und `models/states/`

## Bereits angelegte Artefakte

* `openapi/04-browser-gateway-websocket.openapi.yaml`
* `schemas/gateway/04-browser-gateway-protocol-catalog.md`
* `models/states/04-browser-gateway-session-state.md`
* `models/events/04-browser-gateway-message-types.md`
* `models/errors/04-browser-gateway-error-strategy.md`

Diese Artefakte enthalten die aus dem Konzept, der Dokumentationsrecherche und den bisherigen Klaerungen belastbar ableitbaren Inhalte. Verbleibende offene Punkte sind explizit markiert.

## Arbeitspakete

1. Verbindungsaufbau inklusive Übergabe der Terminal-Berechtigung definieren.
2. Client- und Server-Nachrichten typisieren.
3. Regeln für Binär- vs. Textframes, Encoding und Terminal-Steuerdaten festlegen.
4. Keepalive-, Timeout- und Reconnect-Semantik dokumentieren.
5. Fehlerfälle und Close-Codes definieren.
6. Sicherheits- und Audit-Anforderungen beschreiben.

## Bereits aus dem Konzept erkennbare Elemente

* Browser-Terminal nutzt `xterm.js`
* Gateway validiert die Terminal-Berechtigung
* Gateway baut anschließend die eigentliche Verbindung zur Konsole auf
* Datenstrom wird zwischen Browser und Konsole weitergeleitet

## Offene Fragen vor der Umsetzung

* Welche konkreten Payload-Modelle tragen `input`, `output`, `resize`, `error` und `close`?
* Welche Close-Codes und Fehlertexte werden standardisiert?
* Wie sieht das finale Fehlerformat aus?
* Wie soll der Header fuer die Terminal-Berechtigung final heissen?

## Aktueller Umsetzungsstand

* Die aus dem Konzept ableitbaren Verbindungsphasen und Nachrichtenklassen wurden in erste Draft-Artefakte überführt.
* Browser-Terminal-Sitzung, Grant-Bezug und Fehlerstrategie sind als fachliche Bausteine dokumentiert.
* Die Recherche zu xterm.js und `@xterm/addon-attach` hat gezeigt, dass diese kein verbindliches Backend-Protokoll vorgeben; das Protokoll ist daher unsere eigene Vertragsentscheidung.
* OpenAPI-Umfang, Header-basierte Grant-Uebergabe als alleiniger Autorisierungspfad, Text- und Binaerframe-Nutzung, minimales Nachrichtenset, Reconnect-Semantik und das Fehlen von Terminal-Metadaten sind jetzt festgelegt.
* Verbleibend offen sind nur noch Payload-Details, Close-Codes, Fehlerformat und der finale Header-Name, die sinnvoll erst mit Implementierungserkenntnissen geschaerft werden.

## Statusbegruendung

Dieser Plan wartet jetzt bewusst auf Implementierungserkenntnisse, weil die verbleibenden offenen Punkte unmittelbar von der konkreten Gateway-Implementierung und ihrem Fehlerverhalten abhaengen.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn Handshake, Nachrichtenarten, Fehlerverhalten, Zustände und Sicherheitsregeln für Browser ↔ Gateway eindeutig und abgestimmt beschrieben sind.

## Nächste Schritte für Folge-Agenten

1. Plan erst dann wieder aktivieren, wenn aus der Implementierung konkrete Payloads, Fehlerfaelle und Close-Codes vorliegen.
2. Danach Payload-Modelle, Header-Namen und Fehlerformat in Draft und Begleitdokumente uebernehmen.
3. Anschließend den Draft auf belastbaren Vertragsstand heben.
