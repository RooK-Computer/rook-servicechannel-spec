# Spezifikationsplan 02 – RooK Agent ↔ RooK Backend (REST)

Status: Abgeschlossen

Statushinweis: `Abgeschlossen` bedeutet, dass die aus diesem Plan abgeleiteten REST-Vertragsartefakte fuer den aktuellen Scope umgesetzt und nachgezogen sind.

## Ziel der Spezifikation

Die zentrale REST-Schnittstelle zwischen RooK Agent und RooK Backend vollständig beschreiben, damit Support-Sitzungen serverseitig sauber registriert, überwacht und beendet werden können.

## Bezug zum Konzept

Das Konzept nennt für diese Schnittstelle HTTPS/REST und folgende Aufgaben:

* Support-Sitzung registrieren
* Zustand melden
* PIN abrufen
* Heartbeats senden
* Session beenden

## Zu spezifizierender Scope

* Lifecycle-Endpunkte für Support-Sessions
* Status- und Heartbeat-Kommunikation
* PIN-Aushandlung bzw. PIN-Auslieferung
* Session-Abschluss und Timeout-Verhalten
* Authentisierung des Agent gegenüber dem Backend
* Fehlercodes, Wiederholbarkeit und Idempotenz

## Erwartete Artefakte

* OpenAPI-Spezifikation unter `openapi/`
* ergänzende JSON-Schemas für wiederverwendete Backend-Modelle unter `schemas/backend/`
* Zustandsmodell der Support-Session unter `models/states/`

## Bereits angelegte Artefakte

* `openapi/02-agent-backend-rest.openapi.yaml`
* `schemas/backend/02-agent-backend-session-catalog.md`
* `models/states/02-agent-backend-session-state.md`
* `models/errors/02-agent-backend-error-strategy.md`

Diese Artefakte enthalten die aus Konzept und Nutzerklaerungen belastbar ableitbaren Inhalte. Verbleibende offene Punkte sind explizit markiert.

## Arbeitspakete

1. Ressourcenmodell für Support-Sessions definieren.
2. Endpunkte für Start, Status, Heartbeat, PIN-Abruf und Beenden entwerfen.
3. Request-/Response-Modelle und Fehlerobjekte festlegen.
4. Session-Zustände, Timeouts und Ablaufregeln spezifizieren.
5. Authentisierung, Autorisierung und Transport-Sicherheitsanforderungen dokumentieren.
6. Retry- und Idempotenzverhalten des Agents beschreiben.

## Bereits aus dem Konzept erkennbare Elemente

* Start einer Support-Sitzung nach erfolgreichem VPN-Aufbau
* Erzeugung eines kurzlebigen 4-stelligen PIN im Backend
* Zuordnung des PIN zur aktiven Konsolen-Sitzung
* periodische Lebenszeichen des Agent
* Beendigung bei manuellem Ende, Timeout oder Reboot

## Ehemals offene Punkte

* Die fachlichen Fehlercodes des aktuellen Scope sind im Vertragsstand dokumentiert.
* Retry-, Heartbeat- und Timeout-Verhalten sind fuer den aktuellen Scope spezifiziert und mit dem erreichten Implementierungsstand abgeglichen.

## Aktueller Umsetzungsstand

* Die im Konzept explizit benannten Aufgaben und Operationen wurden in erste Draft-Artefakte überführt.
* Eine fachliche Hauptressource `Support-Session` ist als Arbeitsbegriff dokumentiert.
* Authentisierung über die aktive VPN-Verbindung, POST-basierter Session-Start, PIN-Auslieferung in der Start-Response sowie Heartbeat- und Timeout-Regeln sind eingearbeitet.
* URL-Muster, POST-only-Strategie, minimale Session-Felder und formale Zustandsübergänge sind eingearbeitet.
* Konkrete Operationsnamen, Pfadversion `1` und das minimale Fehlerobjekt sind eingearbeitet.
* VPN-Vertrauensdurchsetzung, Audit-Minimum und die aktuelle HTTP-Statuscode-Strategie sind jetzt ebenfalls festgehalten.
* `status` und `endsession` fuehren jetzt den `pin` im Request mit, und als minimales Response-Modell fuer Start und Status gelten `status`, `pin` und `ipAddress`.
* Fehlercodes, Retry-Regeln und Timeout-Semantik sind fuer den aktuellen Scope nachgezogen.

## Abschlussbegruendung

Dieser Plan ist fuer den aktuellen Scope abgeschlossen, weil Session-Ressource, Endpunkte, Fehlerstrategie und Heartbeat-/Timeout-Semantik in den Vertragsartefakten und den Komponentenstatusdokumenten gespiegelt sind.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn die Session-Ressourcen, REST-Endpunkte, Datenmodelle, Fehlercodes, Zustände, Sicherheitsregeln und Timeout-Semantik für Agent ↔ Backend vollständig und abgestimmt spezifiziert sind.

## Naechste Schritte fuer Folge-Agenten

1. Diesen Plan nur bei spaeteren API-Aenderungen oder neuen Laufzeitbefunden wieder oeffnen.
2. Neue Fehler- oder Retry-Szenarien direkt in Plan, OpenAPI und Fehlerstrategie zurueckspiegeln.
