# Backend ↔ Gateway – Terminal-Grant-Lebenszyklus

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus Konzept und Nachbarplaenen ableitbaren Zustandsaspekte des Terminal-Grants fest.

## Direkt ableitbare Zustandsaspekte

### Grant ist ausgestellt

Aus Konzept und Nachbarplaenen ableitbar:

* das Backend erstellt eine kurzlebige Terminal-Berechtigung
* sie ist an Mitarbeiter und Session gekoppelt
* die Zielkonsole ist ueber die Session und ihre IP-Adresse mitgebunden

Noch offen:

* ob die Ausstellung bereits einen eigenen protokollierbaren Zustand erzeugt

Aktuell festgelegt:

* der Grant ist an Drupal-User, Session und Zielkonsole gebunden

### Grant wird validiert

Aus Konzept und Nachbarplaenen ableitbar:

* das Gateway validiert die Berechtigung vor Aufbau der Konsole-Verbindung

Noch offen:

* derzeit keine weiteren offenen Fragen zur Wiederverwendungsgrenze im 30-Sekunden-Fenster

Aktuell festgelegt:

* Validierung und Einloesung sind derselbe Schritt
* innerhalb des 30-Sekunden-Reconnect-Fensters darf derselbe Grant erneut verwendet werden
* innerhalb dieses Fensters ist die Wiederverwendung nicht auf genau einen weiteren Versuch begrenzt

### Grant ist verbraucht oder ungueltig

Aus Konzept und Nachbarplaenen ableitbar:

* das Token ist grundsaetzlich nicht wiederverwendbar
* die Berechtigung endet spaetestens mit Session-Ende oder Terminal-Disconnect

Noch offen:

* ob ein eigener Zustand fuer Widerruf benoetigt wird

Aktuell festgelegt:

* bei Browser-Abbruch endet die Gateway-Verbindung verzoegert nach 30 Sekunden, um Wiederverbinden zu ermoeglichen
* bei Revocation oder Sitzungsende nach bereits erfolgreicher Validierung werden Browser- und Konsolenverbindung aktiv abgebaut

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.