# Implementierungsstatus – Browser-Terminal-Gateway

Status: Plan 02 umgesetzt, wartet auf Review

## Zweck der Komponente

Das Browser-Terminal-Gateway validiert Terminal-Berechtigungen, baut serverseitig die Verbindung zur Konsole auf und stellt dem RooK-Team die interaktive Shell im Browser bereit.

## Aktueller Stand

* Plan 01 (`Runtime-Grundgeruest und Backend-Validierung`) wurde umgesetzt und bildet die Runtime-Basis.
* Plan 02 (`Browser-WebSocket und Sitzungssteuerung`) wurde im Gateway-Repository umgesetzt und wartet auf Review.
* Das Gateway-Repository enthaelt jetzt ein erstes Go-Dienstgeruest:
  * `go.mod`
  * `cmd/gateway/main.go`
  * `internal/config/`
  * `internal/httpserver/`
  * `internal/grants/`
  * `internal/shutdown/`
  * vorbereitende Interface-Pakete unter `internal/session/`, `internal/websocket/`, `internal/sshbridge/` und `internal/audit/`
* Eine erste englischsprachige `README.md` im Repo-Root beschreibt Zweck, Status und lokale Startschritte fuer GitHub-Leser.
* Konfiguration und Runtime-Basis aus Plan 01 bleiben die Grundlage:
  * Konfiguration per Umgebungsvariablen und optionaler lokaler `KEY=VALUE`-Datei
  * strukturierte Logs ab Start
  * `/healthz` und `/readyz` fuer Liveness/Grundbereitschaft
* Der Browser-WebSocket-Handshake aus Plan 02 ist jetzt produktiv verdrahtet:
  * `GET /gateway/terminal` fuehrt bei gueltigem Grant ein echtes WebSocket-Upgrade aus
  * der Grant wird vor dem Upgrade ueber den Header gelesen und gegen das Backend validiert
  * fehlerhafte Handshakes bleiben HTTP-JSON-Antworten mit `code` und `message`
* Das Sitzungsmodell wurde fuer Browser-Verbindungen zentral eingezogen:
  * technische Session-ID
  * Browser-State
  * Validierungsergebnis inklusive Ziel-IP
  * Start-, Aktivitaets- und Endzeitpunkte
  * Abschlussgrund
* Die WebSocket-Laufzeit wurde vorbereitet:
  * getrennte Lese-/Schreibpfade
  * begrenzte ausgehende Queue pro Sitzung
  * explizites Cleanup aus dem Sitzungsregister
  * Hook-Punkt fuer spaeteren SSH-Abbau
* Die Browser-Gateway-Protokollentscheidung wurde geschaerft und im `spec`-Submodul nachgezogen:
  * der Header-basierte Handshake ist die alleinige Autorisierung
  * `authorize` und `authorized` sind nicht mehr Teil des aktiven Laufzeitprotokolls
  * Kontrollnachrichten bleiben Text-Frames; Terminaleingaben duerfen weiterhin als Binary-Frames kommen
* Die Backend-Validierung fuer Terminal-Grants wurde als eigener Client fuer `POST /api/gateway/1/validateToken` umgesetzt.
* Die Fehlerpfade des Grant-Clients sind mit Mock-Backends abgesichert:
  * Erfolg mit `ipAddress`
  * fachlich ungueltiger Grant
  * Backend-Fehler
  * Transport-/Timeout-Fehler
* Die Browser-WebSocket- und Session-Logik ist mit Tests gegen Mock-Validatoren und WebSocket-Clients abgesichert:
  * fehlender Grant
  * ungueltiger Grant
  * Backend-Fehler
  * erfolgreicher Upgrade-Pfad
  * Ablehnung veralteter `authorize`-Nachrichten
  * Queue-Ueberlauf und Session-Cleanup
* `go test ./...` und `go build ./...` wurden fuer den neuen Stand erfolgreich ausgefuehrt.
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

1. Plan 02 reviewen und Rueckmeldungen in Code, Plan und Statusartefakten nachziehen.
2. Erst nach expliziter Freigabe Plan 03 umsetzen: SSH-Bridge und Terminal-Datenpfad an die bestehenden Session-Hooks anbinden.
3. Danach Plan 04 fuer Hardening, Betrieb, Audit und Lieferfaehigkeit umsetzen.

## Hinweise für spätere Aktualisierung

* Diese Datei ist das komponentenuebergreifende Bindeglied im `spec`-Submodule und muss parallel zu den repo-lokalen Plaenen gepflegt werden.
* Sobald ein Plan begonnen, abgeschlossen oder im Review ist, soll dieser Stand hier in verdichteter Form gespiegelt werden.
* Sobald die Implementierung beginnt, sollen hier insbesondere der Stand von Backend-Validierung, WebSocket-Integration, SSH-Anbindung, Browser-Integration und Betriebs-Haertung gepflegt werden.
