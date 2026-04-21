# Spezifikationsplan 04 – Browser ↔ Terminal-Gateway (WebSocket)

Status: Abgeschlossen

Statushinweis: `Abgeschlossen` bedeutet, dass die aus diesem Plan abgeleiteten WebSocket-Vertragsartefakte fuer den aktuellen Scope umgesetzt und nachgezogen sind.

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

## Ehemals offene Punkte

* Die benoetigten Payload-Modelle des aktuellen Scope sind in den Vertragsartefakten dokumentiert.
* Close-Codes, Fehlertexte und Fehlerformat sind fuer den aktuellen Scope nachgezogen.
* `authorize` und `authorized` sind als aktive Protokollteile verbindlich gespiegelt.

## Aktueller Umsetzungsstand

* Die aus dem Konzept ableitbaren Verbindungsphasen und Nachrichtenklassen wurden in erste Draft-Artefakte überführt.
* Browser-Terminal-Sitzung, Grant-Bezug und Fehlerstrategie sind als fachliche Bausteine dokumentiert.
* Die Recherche zu xterm.js und `@xterm/addon-attach` hat gezeigt, dass diese kein verbindliches Backend-Protokoll vorgeben; das Protokoll ist daher unsere eigene Vertragsentscheidung.
* OpenAPI-Umfang, `authorize` als erste Client-Nachricht nach erfolgreichem Upgrade, `authorized` als Erfolgsbestaetigung, Text- und Binaerframe-Nutzung, minimales Nachrichtenset, Reconnect-Semantik und das Fehlen von Terminal-Metadaten sind jetzt festgelegt.
* Payloads, Close-Verhalten, Keepalive- und Reconnect-Semantik sind fuer den aktuellen Scope nachgezogen.

## Abschlussbegruendung

Dieser Plan ist fuer den aktuellen Scope abgeschlossen, weil Handshake, Nachrichtenarten, Fehlerverhalten und Laufzeitsemantik in den Vertragsartefakten und den Gateway-/Backend-Statusdokumenten gespiegelt sind.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn Handshake, Nachrichtenarten, Fehlerverhalten, Zustände und Sicherheitsregeln für Browser ↔ Gateway eindeutig und abgestimmt beschrieben sind.

## Naechste Schritte fuer Folge-Agenten

1. Diesen Plan nur bei spaeteren Protokollaenderungen oder neuen Laufzeitbefunden wieder oeffnen.
2. Neue Nachrichtentypen, Fehlerfaelle oder Sicherheitsregeln direkt in Plan und Vertragsartefakte zurueckspiegeln.
