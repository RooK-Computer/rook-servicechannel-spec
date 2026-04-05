# Spezifikationsplan 01 – RooK UI ↔ RooK Agent (lokale IPC)

Status: Abgeschlossen

Statushinweis: `Abgeschlossen` bedeutet, dass die aus diesem Plan abgeleiteten Vertragsartefakte fuer den aktuellen Scope umgesetzt und auf den erreichten Implementierungsstand nachgezogen sind.

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

## Ehemals offene Punkte

* Die konkrete Syntax und Kompatibilitaetsregel des Nachrichtenfelds `version` ist fuer den aktuellen Scope im Vertragsstand nachgezogen.
* Erste verbindliche Fehlercodes und die tatsaechlichen Payload-Formen sind fuer den aktuellen Scope dokumentiert.
* Die benoetigten Zustandsuebergaenge werden fuer den aktuellen Scope ueber die nachgezogenen Status- und Eventartefakte beschrieben.

## Aktueller Umsetzungsstand

* Transport, Kommunikationsmuster sowie die im Konzept explizit benannten Kommandos und Events wurden in erste Arbeitsartefakte überführt.
* Die bisherigen Klaerungen zu `type`, Nachrichtenrichtung, Support-Zustaenden sowie minimalen WLAN- und PIN-Feldern wurden eingearbeitet.
* Das OpenAPI-Artefakt fuer die Nachrichtenmodelle ist auf den aktuellen Vertragsstand nachgezogen.
* Das Verbindungsmodell ist als Ein-Socket-Stream mit genau einem JSON-Objekt pro Zeile und gemeinsamem bidirektionalem Nachrichtenstrom praezisiert.
* Socket-Pfad, Response-Typisierung, PIN-Gueltigkeit, `ConnectWifi`-Verhalten sowie die tatsaechlichen Action- und Event-Formen sind festgezogen.
* Versionierungsfeld, Fehlercodes und die benoetigten beobachtbaren WLAN-/VPN-/Support-Zustaende sind fuer den aktuellen Scope dokumentiert.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn die Nachrichtenstruktur, die Kommandos, die Events, die Statusmodelle und die Fehlerfälle für UI ↔ Agent vollständig beschrieben und mit den offenen Fragen abgestimmt sind.

## Naechste Schritte fuer Folge-Agenten

1. Diesen Plan nur bei neuen Produktentscheidungen oder spaeteren Betriebsbefunden wieder oeffnen.
2. Aenderungen an IPC-Nachrichten, Fehlercodes oder Zustandsmodellen direkt in Plan und Vertragsartefakte zurueckspiegeln.
