# Web-Frontend ↔ Backend – Sichtbare Zustandsaspekte

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument haelt die aus dem Konzept ableitbaren Zustandsaspekte fest, die das Web-Frontend vom Backend sehen oder anfragen koennen muss.

## Direkt ableitbare Zustandsaspekte

### Login-Zustand

Aus dem Konzept ableitbar:

* ein RooK-Mitarbeiter meldet sich regulaer am Web-Frontend an

Noch offen:

* keine weiteren offenen Fragen zum Login-Umfang

Aktuell festgelegt:

* der Team-Login wird nicht in dieser API modelliert, sondern ueber Drupal-Standards abgedeckt

### PIN-Kopplungszustand

Aus dem Konzept ableitbar:

* ein eingegebener PIN wird einer aktiven Konsolen-Sitzung zugeordnet

Noch offen:

* wie die Kopplung im Response-Modell konkret sichtbar gemacht wird

Aktuell festgelegt:

* die PIN-Eingabe koppelt oder reserviert die Session direkt fuer den Mitarbeiter
* die Kopplung bleibt im Frontend implizit und wird nicht als eigenes sichtbares Fachfeld modelliert

### Session-Sichtbarkeit

Aus dem Konzept ableitbar:

* der Session-Status wird im Frontend angezeigt

Noch offen:

* ob es spaeter mehr als den Session-Status als sichtbares Feld geben muss

Aktuell festgelegt:

* ein Mitarbeiter kann mehrere Sessions parallel ueber mehrere Browserfenster bedienen
* im Frontend ist derzeit nur der Session-Status sichtbar
* es werden aktuell keine weiteren sichtbaren Session-Felder benoetigt

### Terminal-Zugangsstatus

Aus dem Konzept ableitbar:

* das Backend stellt eine kurzlebige Terminal-Berechtigung aus

Noch offen:

* derzeit keine weiteren offenen Fragen zur Wiederverwendungsregel des Grants

Aktuell festgelegt:

* die Berechtigung ist ein opaque Token
* die Berechtigung gilt fuer den Mitarbeiter so lange, wie die Session laeuft oder die Terminalverbindung getrennt wird
* das Token ist grundsaetzlich nicht wiederverwendbar
* innerhalb des 30-Sekunden-Reconnect-Fensters darf derselbe Grant erneut verwendet werden

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.