# Browser ↔ Gateway – WebSocket-Protokollkatalog

Status: Wartet auf Implementierungserkenntnisse

## Zweck

Dieses Dokument sammelt die aus Konzept und Ablaufbeschreibung explizit ableitbaren Elemente der Browser-zu-Gateway-Schnittstelle.

Es dient als Arbeitsgrundlage fuer die spaetere Spezifikation des WebSocket-Protokolls. Nicht festgelegte Details bleiben bewusst offen und muessen vor weiterer Schaerfung per Rueckfrage geklaert werden.

## Explizit bekannte Rahmendaten

* Transport: WebSocket
* Beteiligte Systeme:
  * Browser-Terminal als Client
  * Terminal-Gateway als Server
* Aufgabe:
  * Weiterleitung des Terminal-Datenstroms zwischen Browser und Gateway

## Aus dem Ablauf direkt ableitbare Fakten

* Das Web-Frontend oeffnet ein Terminal im Browser.
* Das Terminal-Gateway validiert die vom Backend ausgestellte Terminal-Berechtigung.
* Nach erfolgreicher Validierung baut das Gateway die eigentliche Verbindung zur Konsole auf.
* Danach wird der Datenstrom zwischen Browser und Konsole weitergeleitet.

## Fachliche Hauptressourcen

### Browser-Terminal-Sitzung

Mindestens fachlich ableitbar:

* eine interaktive Terminal-Sitzung im Browser
* sie ist an eine gueltige Terminal-Berechtigung gebunden
* sie endet, wenn die Support-Sitzung endet oder die Verbindung getrennt wird

Noch offen:

* konkrete Zustandsmenge der Browser-Terminal-Sitzung
* genaue Initialisierungs- und Abschlussnachrichten

### Terminal-Berechtigung im Gateway-Kontext

Mindestens fachlich ableitbar:

* wird dem Gateway vom Browser zur Validierung vorgelegt
* entscheidet ueber den Aufbau der Terminal-Sitzung

Noch offen:

* Fehlerverhalten bei ungueltiger oder abgelaufener Berechtigung

## Offene Architekturfragen

* Welche konkreten Payload-Modelle tragen die Nachrichtenarten?
* Welche Close-Codes und Fehlertexte werden standardisiert?
* Wie sieht das finale Fehlerformat aus?
* Wie soll der Header fuer die Terminal-Berechtigung final heissen?

## Bereits festgelegte Protokollentscheidungen

* OpenAPI bildet hier sowohl Handshake als auch Nachrichtenprotokoll mit ab.
* Die Terminal-Berechtigung wird im Header uebergeben.
* Der erfolgreiche Header-basierte Handshake ist die alleinige Autorisierung; es gibt keine separaten Laufzeitnachrichten `authorize` oder `authorized`.
* Es werden Textframes und Binaerframes verwendet.
* Steuernachrichten laufen als Textframes.
* Terminaldaten duerfen auch als Binaerframes uebertragen werden.
* Minimale Nachrichtenarten sind:
  * `input`
  * `output`
  * `resize`
  * `error`
  * `close`
* Reconnects sind immer neue Sitzungen.
* Bei erfolgreichem Verbindungsaufbau werden keine zusaetzlichen Terminal-Metadaten zurueckgegeben.

## Verbindliche Arbeitsregel

* Es duerfen keine zusaetzlichen Annahmen getroffen werden.
* Fehlende Details werden per Rueckfrage geklaert.
* Jede Klaerung aktualisiert dieses Dokument und den zugehoerigen Plan.
