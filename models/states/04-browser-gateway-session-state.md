# Browser ↔ Gateway – Terminal-Sitzungszustand

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus dem Konzept ableitbaren Zustandsaspekte der Browser-Terminal-Sitzung fest.

## Direkt ableitbare Zustandsaspekte

### Berechtigung liegt vor oder nicht vor

Aus dem Konzept ableitbar:

* das Gateway validiert eine vom Backend ausgestellte Terminal-Berechtigung

Noch offen:

* wie dieser Zustand technisch in Nachrichten oder Close-Codes sichtbar wird

### Terminal-Sitzung wird aufgebaut

Aus dem Konzept ableitbar:

* nach Validierung baut das Gateway die eigentliche Verbindung zur Konsole auf

Noch offen:

* ob `authorized` allein den erfolgreichen Aufbau abschliesst oder ob spaeter noch weitere Initialsignale noetig sind

### Terminal-Sitzung ist aktiv

Aus dem Konzept ableitbar:

* der Datenstrom wird zwischen Browser und Konsole weitergeleitet

Noch offen:

* keine weiteren offenen Fragen zu Metadaten, da derzeit keine zurueckgegeben werden

Aktuell festgelegt:

* bei erfolgreichem Aufbau werden keine zusaetzlichen Terminal-Metadaten zurueckgegeben

### Terminal-Sitzung endet

Aus dem Konzept ableitbar:

* nach Sitzungsende wird auch die Terminal-Sitzung beendet

Noch offen:

* genaue Beendigungsgruende und ihre Darstellung im Protokoll

Aktuell festgelegt:

* Reconnects gelten immer als neue Sitzungen

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.