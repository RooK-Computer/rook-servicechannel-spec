# Spezifikationsplan 01 – RooK UI ↔ RooK Agent (lokale IPC)

Status: Wartet auf Implementierungserkenntnisse

Statushinweis: `Wartet auf Implementierungserkenntnisse` bedeutet, dass die konzeptionelle Arbeit an diesem Plan bewusst pausiert, bis neue belastbare Erkenntnisse aus der späteren Implementierung vorliegen.

## Ziel der Spezifikation

Die lokale Schnittstelle zwischen RooK UI und RooK Agent so spezifizieren, dass Zustände, Kommandos, Antworten und asynchrone Events eindeutig und versionierbar beschrieben sind.

## Bezug zum Konzept

Im Konzept ist diese Schnittstelle als lokale Kommunikation über **Unix Domain Socket** mit **JSON** beschrieben. Genannt sind sowohl Request/Response-Kommandos als auch asynchrone Events.

## Zu spezifizierender Scope

* Transportannahmen der lokalen IPC-Verbindung
* Request/Response-Kommandos der UI an den Agent
* Event-Typen des Agent an die UI
* gemeinsame Nachrichtenhülle, Korrelationsmechanismus und Fehlerformat
* Zustandsmodelle für WLAN, VPN, Support-Modus und PIN-Anzeige
* Versionierungsstrategie der lokalen Schnittstelle

## Erwartete Artefakte

* OpenAPI-Entwurf oder dokumentierte Klärung, wie OpenAPI für diese lokale Nicht-HTTP-Schnittstelle verbindlich eingesetzt werden soll
* ergänzende JSON-Schemas unter `schemas/local-ipc/`
* Zustands- und Event-Definitionen unter `models/states/` und `models/events/`

## Bereits angelegte Artefakte

* `schemas/local-ipc/01-ui-agent-local-ipc-message-catalog.md`
* `models/events/01-ui-agent-local-ipc-events.md`
* `models/states/01-ui-agent-observable-state.md`
* `models/errors/01-ui-agent-error-codes.md`
* `openapi/01-ui-agent-local-ipc.openapi.yaml`

Diese Artefakte enthalten die aus dem Konzept und den bisherigen Klaerungen belastbar ableitbaren Inhalte. Nur verbleibende offene Punkte bleiben explizit markiert.

## Arbeitspakete

1. Alle im Konzept genannten Kommandos und Events in eine vollständige Liste überführen.
2. Gemeinsame Nachrichtentypen definieren: Request, Response, Event, Error.
3. Datenmodelle für WLAN-Scan, WLAN-Verbindung, VPN-Status, Support-Status und PIN-Zustand ableiten.
4. Fehlerfälle und Fehlercodes für UI-relevante Bedienfehler und Systemfehler strukturieren.
5. Versionierung und Kompatibilitätsregeln für UI und Agent festlegen.
6. Ergebnis gegen das Konzept auf Vollständigkeit prüfen.

## Bereits aus dem Konzept erkennbare Elemente

### Beispiel-Kommandos

* `GetStatus`
* `ScanWifi`
* `ConnectWifi`
* `DisconnectWifi`
* `StartSupport`
* `StopSupport`
* `GetPin`

### Beispiel-Events

* `WifiScanCompleted`
* `WifiConnectionStateChanged`
* `VpnStateChanged`
* `SupportStateChanged`
* `PinAssigned`
* `PinExpired`
* `ErrorRaised`

## Offene Fragen vor der Umsetzung

* Welche konkrete Syntax und Kompatibilitätsregel soll das Nachrichtenfeld `version` verwenden?
* Welche fachlichen Fehlercodes sollen als erste verbindliche Einträge reserviert werden, sobald die Komponentenentwicklung startet?
* Welche Zustandsübergänge zwischen `idle`, `online`, `online+vpnup` und `servicemode` sollen formal erlaubt sein?

## Aktueller Umsetzungsstand

* Transport, Kommunikationsmuster sowie die im Konzept explizit benannten Kommandos und Events wurden in erste Arbeitsartefakte überführt.
* Die bisherigen Klaerungen zu `type`, Nachrichtenrichtung, Support-Zustaenden sowie minimalen WLAN- und PIN-Feldern wurden eingearbeitet.
* Ein erster OpenAPI-Entwurf für die Nachrichtenmodelle wurde angelegt.
* Das Verbindungsmodell ist nun als Zwei-Socket-Modell mit genau einem ausstehenden Request präzisiert.
* Socket-Namen, Response-Typisierung, PIN-Gültigkeit und `ConnectWifi`-Verhalten sind jetzt festgezogen.
* Versionierungsfeld, numerische Fehlercodes sowie binäre WLAN-/VPN-Zustände sind jetzt festgelegt.
* Verbleibend offen sind nur noch die genaue Versionssyntax, erste reservierte Fehlercodes und die formale Zustandsübergangsmatrix.
* Diese verbleibenden Punkte werden erst weiter geschärft, wenn aus der Implementierung neue belastbare Erkenntnisse vorliegen.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn die Nachrichtenstruktur, die Kommandos, die Events, die Statusmodelle und die Fehlerfälle für UI ↔ Agent vollständig beschrieben und mit den offenen Fragen abgestimmt sind.

## Nächste Schritte für Folge-Agenten

1. Plan erst dann wieder aktivieren, wenn aus der Implementierung neue Erkenntnisse zu Versionierung, Fehlercodes oder Zustandsübergängen vorliegen.
2. Danach die verbleibenden offenen Punkte konkretisieren und in die Spezifikation zurückführen.
3. Anschließend den OpenAPI-Entwurf von Draft auf belastbaren Vertragsstand heben.
