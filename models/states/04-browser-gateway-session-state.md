# Browser ↔ Gateway – Terminal-Sitzungszustand

Status: Implementierungsstand nach Plan 06

## Zweck

Dieses Dokument haelt die aus dem Konzept ableitbaren Zustandsaspekte der Browser-Terminal-Sitzung fest.

## Direkt ableitbare Zustandsaspekte

### Vorautorisierte WebSocket-Verbindung

Aus dem Konzept ableitbar:

* nach erfolgreichem Upgrade besteht zunaechst nur eine rohe WebSocket-Verbindung ohne aktive Terminal-Sitzung

Noch offen:

* ob fuer diesen Zustand spaeter ein eigener kuerzerer Timeout konfigurierbar gemacht wird

Aktuell festgelegt:

* die erste fachliche Client-Nachricht muss `authorize` sein
* vor erfolgreicher Autorisierung wird keine SSH-Verbindung aufgebaut
* fehlende Nutzereingaben duerfen eine bereits geoeffnete Browser-Terminal-Sitzung nicht automatisch beenden

### Terminal-Sitzung wird aufgebaut

Aus dem Konzept ableitbar:

* nach Validierung baut das Gateway die eigentliche Verbindung zur Konsole auf

Noch offen:

* keine weiteren offenen Fragen zur aktuellen Minimal-Signalisierung

Aktuell festgelegt:

* erfolgreiche Autorisierung wird mit `authorized` bestaetigt

### Terminal-Sitzung ist aktiv

Aus dem Konzept ableitbar:

* der Datenstrom wird zwischen Browser und Konsole weitergeleitet

Noch offen:

* keine weiteren offenen Fragen zu Metadaten, da derzeit keine zurueckgegeben werden

Aktuell festgelegt:

* bei erfolgreichem Aufbau werden keine zusaetzlichen Terminal-Metadaten zurueckgegeben
* `authorized` markiert den Abschluss des Autorisierungspfads
* eine autorisierte Browser-Terminal-Sitzung darf auch ohne laufende Eingaben oder Resize-Ereignisse aktiv bleiben

### Terminal-Sitzung endet

Aus dem Konzept ableitbar:

* nach Sitzungsende wird auch die Terminal-Sitzung beendet

Noch offen:

* genaue Beendigungsgruende und ihre Darstellung im Protokoll

Aktuell festgelegt:

* Reconnects gelten immer als neue Sitzungen
* fehlende Tastatureingaben sind kein eigenstaendiger Beendigungsgrund
* geht die Browser-Verbindung tatsaechlich verloren, endet die Browser-Terminal-Sitzung
* das Ende der Browser-Terminal-Sitzung beendet nicht automatisch die uebergeordnete Support-Sitzung

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.
