# Browser ↔ Gateway – Nachrichtenarten

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument sammelt die mindestens noetigen Nachrichtenarten fuer die Browser-zu-Gateway-Kommunikation, soweit sie aus dem Konzept ableitbar oder als Klärbedarf erkennbar sind.

## Aus dem Konzept indirekt erkennbare Nachrichtenklassen

### Berechtigungsuebergabe

Fachlich notwendig, weil:

* das Gateway die Terminal-Berechtigung validieren muss

Noch offen:

* genaue Header-Bezeichnung fuer die Uebergabe der Berechtigung

Aktuell festgelegt:

* die Berechtigung wird im Header uebergeben
* die Header-basierte Handshake-Validierung ist der einzige Autorisierungspfad
* es gibt keine zusaetzlichen Laufzeitnachrichten `authorize` oder `authorized`

### Terminal-Eingabe

Fachlich notwendig, weil:

* der Mitarbeiter im Browser-Terminal auf der Konsole arbeitet

Noch offen:

* konkretes Payload-Format

Aktuell festgelegt:

* `input` gehoert zum minimalen Protokoll
* Terminaldaten duerfen als Binaerframes uebertragen werden

### Terminal-Ausgabe

Fachlich notwendig, weil:

* der Datenstrom vom Gateway an den Browser weitergeleitet wird

Noch offen:

* konkretes Payload-Format

Aktuell festgelegt:

* `output` gehoert zum minimalen Protokoll
* Terminaldaten duerfen als Binaerframes uebertragen werden

### Sitzungsende oder Fehler

Fachlich notwendig, weil:

* ungueltige Berechtigungen und Sitzungsende dem Browser signalisiert werden muessen

Noch offen:

* genaue Abgrenzung zwischen `error` und `close`

Aktuell festgelegt:

* `error` und `close` gehoeren beide zum minimalen Protokoll

### Resize oder Terminalsteuerung

Als fachlicher Klaerbedarf erkennbar, weil:

* die Planung explizit Resize und Terminal-Steuerdaten als Spezifikationsgegenstand nennt

Noch offen:

* konkretes Payload-Format fuer `resize`

Aktuell festgelegt:

* `resize` gehoert zum minimalen Protokoll

## Weitere festgelegte Nachrichtenarten

* es gibt keine gesonderte Protokoll-ACK-Nachricht fuer erfolgreiche Autorisierung; ein erfolgreicher WebSocket-Handshake ist die positive Bestaetigung

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.
