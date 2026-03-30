# Gateway ↔ Konsole – Verbindungszustand

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus dem Konzept ableitbaren Zustandsaspekte der serverseitigen Terminal-Verbindung zur Konsole fest.

## Direkt ableitbare Zustandsaspekte

### Zielkonsole ist bestimmt oder unbestimmt

Aus dem Konzept ableitbar:

* das Gateway muss die zur Support-Sitzung passende Konsole finden

Noch offen:

* ob die IP-Adresse als alleiniges Zielmerkmal langfristig ausreicht

Aktuell festgelegt:

* die Zielkonsole wird ueber Session-Metadaten aus dem Backend bestimmt
* das Gateway nutzt dazu die in der Session hinterlegte IP-Adresse

### SSH-Verbindung wird aufgebaut

Aus dem Konzept ableitbar:

* das Gateway baut ueber OpenVPN eine SSH-Verbindung zur Konsole auf

Noch offen:

* ob mehrere Zwischenschritte oder vorbereitende Signale modelliert werden muessen

Aktuell festgelegt:

* die SSH-Verbindung wird mit einem Gateway-Schluessel aufgebaut
* der SSH-Login erfolgt ueber den Account `pi`

### Shell-Sitzung ist aktiv

Aus dem Konzept ableitbar:

* der Support-Mitarbeiter arbeitet im Browser-Terminal auf der Konsole

Noch offen:

* welche PTY-Parameter oder Shell-Restriktionen den aktiven Zustand praegen

Aktuell festgelegt:

* die Shell soll sich moeglichst wie ein regulaeres Terminal verhalten
* interaktive Werkzeuge wie `htop`, `btop` und `tmux` sollen funktionieren
* `TERM=xterm-256color` wird gesetzt
* initiale Zeilen- und Spaltenwerte werden uebergeben
* Resize-Aenderungen werden weitergereicht
* die Shell-Umgebung muss eine UTF-8-faehige Locale unterstuetzen

### Shell-Sitzung endet

Aus dem Konzept ableitbar:

* nach manuellem Ende, Timeout oder Reboot endet die Terminal-Sitzung

Noch offen:

* wie die Endursachen technisch unterschieden und erfasst werden

Aktuell festgelegt:

* mindestens `pin` und `mitarbeiteraccount` werden beim Aufbau und Ende protokolliert

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.