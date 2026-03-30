# Agent ↔ Backend – Support-Session-Zustand

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus dem Konzept ableitbaren Zustandsanforderungen fuer die serverseitige Support-Session fest.

## Direkt ableitbare Zustandsaspekte

### Session existiert

Aus dem Konzept ableitbar:

* der Agent startet eine Support-Sitzung beim Backend
* das Backend verwaltet aktive Support-Sitzungen

Noch offen:

* technischer Startzustand der Session vor `open`, falls benoetigt

Aktuell festgelegt:

* eine Session ist `open`, wenn sich eine Konsole anmeldet

### Session ist mit PIN verknuepft

Aus dem Konzept ableitbar:

* das Backend erzeugt einen kurzlebigen 4-stelligen PIN
* der PIN wird der aktiven Konsolen-Sitzung zugeordnet

Noch offen:

* ob PIN-Erzeugung und Session-Start immer atomar sind

Aktuell festgelegt:

* der PIN wird direkt in der Response auf den Session-Start geliefert

### Session lebt durch Heartbeats

Aus dem Konzept ableitbar:

* der Agent sendet periodische Lebenszeichen

Noch offen:

* ob Heartbeats zusaetzliche fachliche Payload-Daten tragen muessen

Aktuell festgelegt:

* Heartbeat-Frequenz: 10 Sekunden
* Grace Period: 3 Heartbeats
* Timeout: 30 Sekunden

### Session endet

Aus dem Konzept ableitbar:

* die Session kann manuell beendet werden
* die Session kann per Timeout enden
* Reboot beendet den Support-Zustand
* mit Sitzungsende wird der PIN ungueltig

Noch offen:

* keine weiteren offenen Uebergangsfragen auf Basis der aktuellen Klaerung

Aktuell festgelegt:

* eine Session ist `active`, wenn ein Servicemitarbeiter verbunden ist
* bei ausbleibendem Heartbeat nach der Grace Period wird die Session `closed`
* geschlossene Sessions werden nach einer Stunde geloescht
* erlaubte Uebergaenge sind:
	* `open` -> `closed`
	* `open` -> `active`
	* `active` -> `open`
	* `active` -> `closed`

## Vorlaeufiger Schluss

Es ist belastbar, dass die Session mit den Zustandsnamen `open`, `active` und `closed` arbeitet und die oben genannten Uebergaenge erlaubt sind.

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.