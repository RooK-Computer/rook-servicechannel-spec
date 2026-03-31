# Implementierungsstatus – Browser-Terminal-Gateway

Status: Planung konkretisiert, Implementierung nicht begonnen

## Zweck der Komponente

Das Browser-Terminal-Gateway validiert Terminal-Berechtigungen, baut serverseitig die Verbindung zur Konsole auf und stellt dem RooK-Team die interaktive Shell im Browser bereit.

## Aktueller Stand

* Die eigentliche Implementierung wurde noch nicht begonnen.
* Im Gateway-Repository wurden fortsetzbare Detailplaene unter `plans/` angelegt.
* Die Planung ist bewusst in reviewbare Teilabschnitte geschnitten:
  * `plans/01-runtime-grundgeruest-und-backend-validierung.md`
  * `plans/02-browser-websocket-und-sitzungssteuerung.md`
  * `plans/03-ssh-bridge-und-terminaldatenpfad.md`
  * `plans/04-hardening-betrieb-und-lieferfaehigkeit.md`
* `plans/README.md` dient als Einstieg, Reihenfolge und Review-Gate fuer die Umsetzung.
* `AGENTS.md` beschreibt fuer frische Agenten, wie nach Unterbrechungen weitergearbeitet wird.
* Lokale SSH-Secrets fuer den spaeteren Gateway-zu-Konsole-Zugang wurden vorbereitet:
  * `secrets/gateway_ssh_ed25519`
  * `secrets/gateway_ssh_ed25519.pub`
* Das Verzeichnis `secrets/` ist per Root-`.gitignore` vom Commit ausgeschlossen, damit die Schluessel nicht versehentlich eingecheckt werden.
* Die Schluessel sind nur als lokaler Startpunkt gedacht und muessen vor echter Nutzung in einen externen Secret-Store uebernommen werden.

## Hauptaufgaben in der Umsetzung

* Browser-Verbindung und Handshake implementieren
* Terminal-Grant gegen das Backend validieren
* SSH-Verbindung zur Zielkonsole über das VPN aufbauen
* Terminal-Datenstrom zwischen Browser und Konsole weiterleiten
* Reconnect-, Fehler- und Cleanup-Verhalten umsetzen

## Abhängigkeiten

* RooK Web-/API-Backend
* OpenVPN-Infrastruktur
* Zielkonsole mit lokalem SSH-Zugang

## Nächste sinnvolle Schritte

1. Plan 01 aus `plans/` umsetzen: Runtime-Grundgeruest, Konfiguration, Health-Endpoints und Backend-Grant-Validierung aufbauen.
2. Nach Review von Plan 01 Plan 02 umsetzen: Browser-WebSocket-Handshake, Sitzungsmodell und Nachrichtenrahmen produktiv machen.
3. Danach Plan 03 fuer SSH-Bridge und Terminal-Datenpfad umsetzen.
4. Abschliessend Plan 04 fuer Hardening, Betrieb, Audit und Lieferfaehigkeit umsetzen.

## Hinweise für spätere Aktualisierung

* Diese Datei ist das komponentenuebergreifende Bindeglied im `spec`-Submodule und muss parallel zu den repo-lokalen Plaenen gepflegt werden.
* Sobald ein Plan begonnen, abgeschlossen oder im Review ist, soll dieser Stand hier in verdichteter Form gespiegelt werden.
* Sobald die Implementierung beginnt, sollen hier insbesondere der Stand von Backend-Validierung, WebSocket-Integration, SSH-Anbindung, Browser-Integration und Betriebs-Haertung gepflegt werden.
