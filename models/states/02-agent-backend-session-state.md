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
* laufende Heartbeats halten die Session auch ohne aktiven Servicemitarbeiter offen

Noch offen:

* ob Heartbeats zusaetzliche fachliche Payload-Daten tragen muessen

Aktuell festgelegt:

* Heartbeat-Frequenz: 10 Sekunden
* Grace Period: 3 Heartbeats
* Timeout: 30 Sekunden
* eine Session in `open` bleibt offen, solange gueltige Heartbeats innerhalb der Grace Period eintreffen
* das Ende einer Browser- oder Mitarbeiteraktivitaet schliesst die Session nicht automatisch

### Session endet

Aus dem Konzept ableitbar:

* die Session kann manuell beendet werden
* die Session kann per Timeout enden
* Reboot beendet den Support-Zustand
* mit Sitzungsende wird der PIN ungueltig

Noch offen:

* ob die Endgruende spaeter auch explizit als Feld oder Fehlercode sichtbar gemacht werden sollen

Aktuell festgelegt:

* eine Session ist `open`, wenn die Konsole verbunden ist und kein Servicemitarbeiter aktiv aufgeschaltet sein muss
* eine Session ist `active`, wenn ein Servicemitarbeiter verbunden ist
* bei ausbleibendem Heartbeat nach der Grace Period wird die Session `closed`
* geschlossene Sessions werden nach einer Stunde geloescht
* ein Wechsel von `active` nach `open` ist der normale Rueckfall, wenn die Browser-/Mitarbeiteraktivitaet endet, die Agent-Heartbeats aber weiterlaufen
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
