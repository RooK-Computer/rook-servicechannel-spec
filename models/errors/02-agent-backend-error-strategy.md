# Agent ↔ Backend – Fehlerstrategie

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die bereits ableitbare Fehlerstrategie fuer die REST-Schnittstelle zwischen Agent und Backend fest.

## Bereits belastbar ableitbar

* Es wird Fehlerfaelle fuer Session-Start, Statusabfrage, Heartbeat, PIN-Auslieferung und Session-Ende geben.
* Doppelte Startanfragen und verspaetete Heartbeats sind explizit als zu klaerende Faelle erkannt.
* Timeout und Sitzungsende sind fachlich relevante Fehler- oder Endeszenarien.

## Bereits festgelegte Regeln

* Bei doppelten Startanfragen gewinnt immer die letzte Startanfrage.
* Heartbeats innerhalb der Grace Period werden als regulaere Heartbeats gewertet.
* Heartbeats nach Ablauf der Grace Period werden ignoriert.

## Noch offen

* fachliche Fehlercode-Liste
* Retry-faehige vs. nicht retry-faehige Fehler

## Bereits festgelegtes Fehlerobjekt

* Fehlerobjekte enthalten mindestens `code` und `message`.
* Die konkrete Fehlercode-Liste wird als Living Spec weitergefuehrt, sobald aus der Implementierung konkrete Fehlerfaelle sichtbar werden.

## Bereits festgelegte HTTP-Statuscode-Strategie

* `200` fuer erfolgreiche Antworten
* `500` als Signal, dass ein Fehlerobjekt zurueckgegeben wird

## Aktueller Audit-Mindestumfang

* `ipAddress`
* `timestamp`
* `eventType`

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.