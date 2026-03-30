# Web-Frontend ↔ Backend – Fehlerstrategie

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus dem Konzept bereits ableitbare Fehlerstrategie fuer die Frontend-REST-Schnittstelle fest.

## Bereits belastbar ableitbar

* Es wird Fehlerfaelle fuer ungueltigen oder abgelaufenen PIN geben.
* Es wird Fehlerfaelle fuer fehlende Berechtigungen geben.
* Es wird Fehlerfaelle fuer nicht verfuegbare oder beendete Sessions geben.

## Noch offen

* fachliche Fehlercode-Liste
* Rollen- bzw. Berechtigungsfehler im Detail

## Bereits festgelegtes Fehlerobjekt

* Fehlerobjekte enthalten mindestens `code` und `message`.

## Bereits festgelegte HTTP-Statuscode-Strategie

* `200` fuer erfolgreiche Antworten
* `500` als Signal, dass ein Fehlerobjekt zurueckgegeben wird

## Bereits festgelegte Rollenbasis

* Fuer diese API wird mindestens die Rolle `Service` vorausgesetzt.
* Innerhalb der Rolle `Service` werden aktuell keine feineren Unterrechte unterschieden.

## Fehlercodes als Living Spec

* Die konkrete fachliche Fehlercode-Liste wird spaeter als Living Spec ergaenzt, sobald aus der Implementierung konkrete Fehlerfaelle sichtbar werden.

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.