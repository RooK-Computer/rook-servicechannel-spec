# Spezifikationsplan 06 – RooK Backend ↔ Terminal-Gateway (Terminal-Grant / Validierung)

Status: Abgeschlossen

Statushinweis: `Abgeschlossen` bedeutet, dass die aus diesem Plan abgeleiteten Grant-Vertragsartefakte fuer den aktuellen Scope umgesetzt und nachgezogen sind.

## Ziel der Spezifikation

Die implizit benötigte Schnittstelle zwischen RooK Backend und Terminal-Gateway so spezifizieren, dass ausgestellte Terminal-Berechtigungen eindeutig geprüft, eingelöst und auditiert werden können.

## Bezug zum Konzept

Das Konzept sagt aus, dass das Backend eine kurzlebige Terminal-Berechtigung ausstellt und das Gateway diese Berechtigung validiert, bevor es die Verbindung zur Konsole aufbaut. Die konkrete technische Schnittstelle dafür ist im Konzept noch nicht ausgearbeitet.

## Zu spezifizierender Scope

* Format und Lebensdauer der Terminal-Berechtigung
* Validierung der Berechtigung durch das Gateway
* Bindung der Berechtigung an Session, Mitarbeiter und Zielkonsole
* Einmalverwendung, Ablauf, Widerruf und Auditierung
* Fehlerfälle bei ungültiger, abgelaufener oder bereits eingelöster Berechtigung

## Erwartete Artefakte

* OpenAPI-Spezifikation unter `openapi/`, sofern die Validierung per HTTPS/REST zwischen Gateway und Backend erfolgt
* ergänzende gemeinsame Schemas unter `schemas/backend/` oder `schemas/gateway/`
* Zustands- und Ablaufbeschreibung des Grant-Lebenszyklus unter `models/states/`

## Bereits angelegte Artefakte

* `openapi/06-backend-gateway-terminal-grant.openapi.yaml`
* `schemas/backend/06-backend-gateway-terminal-grant-catalog.md`
* `models/states/06-terminal-grant-lifecycle.md`
* `models/errors/06-terminal-grant-error-strategy.md`

Diese Artefakte enthalten die aus dem Konzept und den bereits geklaerten Nachbarplaenen belastbar ableitbaren Inhalte. Verbleibende offene Punkte bleiben explizit markiert.

## Arbeitspakete

1. Grant-Modell fachlich definieren.
2. Technische Validierungsstrategie und Validierungsaufruf beschreiben.
3. Ressourcen, Endpunkte und Fehlercodes für Grant-Ausstellung, Prüfung und Einlösung beschreiben.
4. TTL-, Replay- und Revocation-Regeln festlegen.
5. Audit- und Sicherheitsanforderungen dokumentieren.
6. Zusammenspiel mit Browser ↔ Gateway und Gateway ↔ Konsole konsistent halten.

## Bereits aus dem Konzept erkennbare Elemente

* das Backend stellt eine kurzlebige Terminal-Berechtigung aus
* das Gateway validiert diese Berechtigung
* erst danach wird die Verbindung zur Konsole aufgebaut

## Ehemals offene Punkte

* Die fachlichen Fehlercodes des aktuellen Scope sind im Vertragsstand dokumentiert.
* Die Trennung zwischen fachlichen Validierungsfehlern und Backend-Ausfaellen ist fuer den aktuellen Scope nachgezogen.

## Aktueller Umsetzungsstand

* Das Grundmodell des opaque Tokens, seine grundsaetzliche Nicht-Wiederverwendbarkeit mit Reconnect-Ausnahme sowie seine Nutzung durch das Gateway zur Session-Metadatenabfrage sind aus den Nachbarplaenen uebernommen.
* Terminal-Grant, Grant-Lebenszyklus und Fehlerstrategie sind als fachliche Bausteine dokumentiert.
* Online-Validierung gegen die HTTPS-URL des Backends, Bindung an Drupal-User, Session und Konsolen-IP, sofortige Einloesung bei Validierung, Reconnect-Ausnahme im 30-Sekunden-Fenster sowie fehlende separate Auditpflicht sind eingearbeitet.
* Der konkrete Validierungspfad `/api/gateway/1/validateToken`, `POST` als Methode, die Minimalantwort mit Konsolen-IP sowie das minimale Fehlerobjekt sind eingearbeitet.
* Grant-Format, Validierungsablauf, Reconnect-Regeln und Fehlerklassifikation sind fuer den aktuellen Scope nachgezogen.

## Abschlussbegruendung

Dieser Plan ist fuer den aktuellen Scope abgeschlossen, weil Grant-Lebenszyklus, Validierungsaufruf, Fehlerstrategie und Reconnect-Ausnahme in den Vertragsartefakten und den Komponentenstatusdokumenten gespiegelt sind.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn Grant-Format, Validierungsablauf, Sicherheitsregeln, Fehlerfälle und Audit-Aspekte für Backend ↔ Gateway vollständig und abgestimmt beschrieben sind.

## Naechste Schritte fuer Folge-Agenten

1. Diesen Plan nur bei spaeteren Grant-/Sicherheitsaenderungen oder neuen Laufzeitbefunden wieder oeffnen.
2. Neue Validierungs- oder Fehleranforderungen direkt in Plan und Vertragsartefakte zurueckspiegeln.
