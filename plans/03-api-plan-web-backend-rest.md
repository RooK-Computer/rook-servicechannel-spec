# Spezifikationsplan 03 – Web-Frontend ↔ RooK Backend (REST)

Status: Wartet auf Implementierungserkenntnisse

Statushinweis: `Wartet auf Implementierungserkenntnisse` bedeutet, dass die konzeptionelle Arbeit an diesem Plan bewusst pausiert, bis neue belastbare Erkenntnisse aus der späteren Implementierung vorliegen.

## Ziel der Spezifikation

Die vom RooK-Team genutzte REST-Schnittstelle zwischen Web-Frontend und Backend so beschreiben, dass Login, PIN-Kopplung, Session-Ansicht und Terminal-Zugang reproduzierbar und sicher implementiert werden können.

## Bezug zum Konzept

Das Konzept nennt für diese Schnittstelle HTTPS/REST und folgende Aufgaben:

* Benutzer-Login
* PIN-Eingabe
* Session-Auswahl
* Terminal-Zugang anfordern
* Session-Status anzeigen

## Zu spezifizierender Scope

* Authentisierung und Session-Handling des RooK-Teams
* PIN-basierte Kopplung einer aktiven Support-Session
* Listen- und Detailansichten aktiver bzw. relevanter Sessions
* Anforderung einer kurzlebigen Terminal-Berechtigung
* Anzeige von Session-Status und Audit-relevanten Informationen

## Erwartete Artefakte

* OpenAPI-Spezifikation unter `openapi/`
* gemeinsame Backend-Modelle unter `schemas/backend/`
* Fehlercodes und Rollen-/Rechtehinweise in begleitender Markdown-Dokumentation

## Bereits angelegte Artefakte

* `openapi/03-web-backend-rest.openapi.yaml`
* `schemas/backend/03-web-backend-session-catalog.md`
* `models/states/03-web-backend-frontend-state.md`
* `models/errors/03-web-backend-error-strategy.md`

Diese Artefakte enthalten die aus Konzept und Nutzerklaerungen belastbar ableitbaren Inhalte. Verbleibende offene Punkte sind explizit markiert.

## Arbeitspakete

1. Authentisierungsfluss und Rollenmodell an den API-Bedarf anpassen.
2. Ressourcen für PIN-Eingabe, Session-Suche, Session-Details und Terminal-Grant definieren.
3. Response-Modelle für Listen- und Detailansichten beschreiben.
4. Fehlerfälle für ungültigen PIN, abgelaufene Session und fehlende Berechtigungen festlegen.
5. Audit- und Sichtbarkeitsregeln für das RooK-Team dokumentieren.
6. Sicherheitsanforderungen und TTL des Terminal-Zugangs abstimmen.

## Bereits aus dem Konzept erkennbare Elemente

* regulärer Team-Login im Web-Frontend
* PIN-Eingabe zur Zuordnung einer aktiven Konsolen-Sitzung
* Ausstellung einer kurzlebigen Terminal-Berechtigung durch das Backend
* Statusanzeige der Support-Sitzung

## Offene Fragen vor der Umsetzung

* Welche konkreten Request- und Response-Modelle werden fuer `pinlookup`, `sessionstatus` und `requestshell` ueber die Minimalstruktur hinaus benoetigt?
* Welche fachlichen Fehlercodes sollen verbindlich reserviert werden?

## Aktueller Umsetzungsstand

* Die im Konzept explizit benannten Frontend-Aufgaben wurden in erste Draft-Artefakte überführt.
* Support-Session und Terminal-Berechtigung sind als fachliche Hauptressourcen dokumentiert.
* Login-Umfang, PIN-Semantik, Parallelnutzung, sichtbare Session-Felder, Rollenbasis und Grant-Grundmodell sind eingearbeitet.
* URL-Muster, POST-only-Strategie, implizite Kopplung, opaque Token mit grundsaetzlicher Nicht-Wiederverwendung und Reconnect-Ausnahme sowie die minimale Fehlerstrategie sind eingearbeitet.
* Konkrete Operationsnamen und erste konkrete API-Pfade sind eingearbeitet.
* Verbleibend offen sind nur noch die detaillierten Request-/Response-Modelle und die fachliche Fehlercode-Liste, die sinnvoll erst mit weiteren Implementierungserkenntnissen geschaerft werden.

## Statusbegruendung

Dieser Plan wartet jetzt bewusst auf Implementierungserkenntnisse, weil die verbleibenden offenen Punkte vor allem aus konkreten Frontend- und Backend-Implementierungsdetails entstehen werden.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn alle vom Web-Frontend benötigten REST-Endpunkte, Rollenanforderungen, Fehlerfälle, Response-Modelle und Grant-Abläufe vollständig und abgestimmt beschrieben sind.

## Nächste Schritte für Folge-Agenten

1. Plan erst dann wieder aktivieren, wenn aus der Implementierung konkrete Payload- und Fehlerfaelle vorliegen.
2. Danach Request-/Response-Modelle und Fehlercode-Liste in den Draft uebernehmen.
3. Anschließend den Draft auf belastbaren Vertragsstand heben.
