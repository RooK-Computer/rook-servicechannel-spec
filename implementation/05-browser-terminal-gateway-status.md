# Implementierungsstatus – Browser-Terminal-Gateway

Status: Plan 04 umgesetzt, wartet auf Review

## Zweck der Komponente

Das Browser-Terminal-Gateway validiert Terminal-Berechtigungen, baut serverseitig die Verbindung zur Konsole auf und stellt dem RooK-Team die interaktive Shell im Browser bereit.

## Aktueller Stand

* Plan 01 (`Runtime-Grundgeruest und Backend-Validierung`) wurde umgesetzt und bildet die Runtime-Basis.
* Plan 02 (`Browser-WebSocket und Sitzungssteuerung`) wurde umgesetzt und bildet die Browser-/Session-Basis.
* Plan 03 (`SSH-Bridge und Terminaldatenpfad`) wurde umgesetzt.
* Plan 04 (`Hardening, Betrieb und Lieferfaehigkeit`) wurde im Gateway-Repository umgesetzt und wartet auf Review.
* Das Gateway-Repository enthaelt jetzt ein gehaertetes Go-Dienstgeruest:
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
* Die WebSocket-Laufzeit ist jetzt mit Betriebsgrenzen gehaertet:
  * getrennte Lese-/Schreibpfade
  * konfigurierbare maximale WebSocket-Nachrichtengroesse
  * konfigurierbare Queue-Tiefe pro Sitzung
  * konfigurierbares Session-Idle-Timeout
  * konfigurierbare maximale Parallelitaet
  * explizites Cleanup aus dem Sitzungsregister
* Die Browser-Gateway-Protokollentscheidung wurde geschaerft und im `spec`-Submodul nachgezogen:
  * der Header-basierte Handshake ist die alleinige Autorisierung
  * `authorize` und `authorized` sind nicht mehr Teil des aktiven Laufzeitprotokolls
  * Kontrollnachrichten bleiben Text-Frames; Terminaleingaben duerfen weiterhin als Binary-Frames kommen
* Die SSH-Bridge und der Terminaldatenpfad aus Plan 03 sind jetzt produktiv verdrahtet:
  * serverseitiger SSH-Aufbau zur Ziel-IP aus dem validierten Grant
  * PTY-Anforderung mit `TERM=xterm-256color`
  * Browser-`input` wird an SSH-STDIN geschrieben
  * SSH-Output wird als Browser-`output` weitergegeben
  * Browser-`resize` propagiert bis in das PTY
  * Browser-, Session- und SSH-Cleanup sind gekoppelt
* Plan 04 haertet Fehler- und Betriebsverhalten:
  * konsistente Session-Endgruende und WebSocket-Close-Pfade
  * explizite Fehler fuer Session-Limit, Idle-Timeout, SSH-Lese-/Schreibfehler und Backend-Nichterreichbarkeit
  * strukturierte Session-Start-/End-Logs mit Session-ID als Korrelationsanker
  * Audit-Ereignisse ueber einen Logger-Sink mit vorbereiteten Feldern wie `pin` und `mitarbeiteraccount`, sofern das Backend sie liefert
* Der Gateway bleibt lokal reproduzierbar testbar, obwohl die finale Backend-Integration noch nicht fertig ist:
  * Mock-Backend fuer die Grant-Seite
  * lokaler Integrationspfad gegen Test-SSH-Server und WebSocket-Client unter `tests/e2e/`
* Bekannter MVP-Kompromiss:
  * Host-Key-Verifikation wird aktuell bewusst umgangen, weil die Konsolen-Host-Keys noch nicht verifizierbar bereitstehen
  * dieses Hardening ist in Plan 04 nachzuziehen
* Die Backend-Validierung fuer Terminal-Grants wurde als eigener Client fuer `POST /api/gateway/1/validateToken` umgesetzt.
* Die Fehlerpfade des Grant-Clients sind mit Mock-Backends abgesichert:
  * Erfolg mit `ipAddress`
  * fachlich ungueltiger Grant
  * Backend-Fehler
  * Transport-/Timeout-Fehler
* Die Browser-WebSocket-, Session- und SSH-Logik ist mit Tests gegen Mock-Validatoren, WebSocket-Clients und einen lokalen Test-SSH-Server abgesichert:
  * fehlender Grant
  * ungueltiger Grant
  * Backend-Fehler
  * erfolgreicher Upgrade-Pfad
  * Ablehnung veralteter `authorize`-Nachrichten
  * Queue-Ueberlauf und Session-Cleanup
  * Session-Limit
  * Idle-Timeout
  * Resize-Propagation
  * Browser-zu-SSH-MVP-Datenpfad
  * lokaler E2E-Erfolgspfad mit echtem Grant-HTTP-Client und echtem SSH-Client
  * Negativpfade fuer Backend-Ausfall und SSH-Ausfall
* `go test ./...` und `go build ./...` wurden fuer den neuen Stand erfolgreich ausgefuehrt.
* Ein erster Betriebs-/Lieferpfad liegt jetzt im Repo:
  * `deploy/systemd/rook-servicechannel-gateway.service`
  * `deploy/systemd/gateway.env.example`
  * `Makefile`-Pfade `test-e2e` und `verify`
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

1. Plan 04 reviewen und Rueckmeldungen in Code, Plan und Statusartefakten nachziehen.
2. Danach anhalten und keinen weiteren Plan ohne explizite Freigabe beginnen.

## Hinweise für spätere Aktualisierung

* Diese Datei ist das komponentenuebergreifende Bindeglied im `spec`-Submodule und muss parallel zu den repo-lokalen Plaenen gepflegt werden.
* Sobald ein Plan begonnen, abgeschlossen oder im Review ist, soll dieser Stand hier in verdichteter Form gespiegelt werden.
* Sobald die Implementierung beginnt, sollen hier insbesondere der Stand von Backend-Validierung, WebSocket-Integration, SSH-Anbindung, Browser-Integration und Betriebs-Haertung gepflegt werden.
