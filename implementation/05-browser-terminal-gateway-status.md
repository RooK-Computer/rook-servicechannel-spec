# Implementierungsstatus – Browser-Terminal-Gateway

Status: Plan 07 umgesetzt, wartet auf Review

## Zweck der Komponente

Das Browser-Terminal-Gateway validiert Terminal-Berechtigungen, baut serverseitig die Verbindung zur Konsole auf und stellt dem RooK-Team die interaktive Shell im Browser bereit.

## Aktueller Stand

* Plan 01 (`Runtime-Grundgeruest und Backend-Validierung`) wurde umgesetzt und bildet die Runtime-Basis.
* Plan 02 (`Browser-WebSocket und Sitzungssteuerung`) wurde umgesetzt und bildet die Browser-/Session-Basis.
* Plan 03 (`SSH-Bridge und Terminaldatenpfad`) wurde umgesetzt.
* Plan 04 (`Hardening, Betrieb und Lieferfaehigkeit`) wurde umgesetzt und reviewt.
* Plan 05 (`nfpm-Debian-Paketierung und Installationspfad`) wurde umgesetzt und reviewt.
* Plan 06 (`WebSocket-Autorisierung per Nachricht statt Header`) wurde umgesetzt und im Zuge des ersten echten Browser-Integrationslaufs indirekt reviewed.
* Der in der ersten Integrationsvorbereitung erkannte Browser-Blocker wurde in Plan 06 technisch adressiert:
  * Browser-WebSocket-APIs brauchen keine benutzerdefinierten Auth-Header mehr.
  * Der Grant wird jetzt als erste WebSocket-Nachricht `authorize` uebertragen.
  * Erfolgreiche Autorisierung und erfolgreicher Sitzungsaufbau werden mit `authorized` bestaetigt.
* Der erste echte Browser-Integrationslauf hat direkt den naechsten Folgeplan ausgelost; Plan 07 ist jetzt umgesetzt und wartet auf Review:
  * fuer das Gateway wurden die Befunde 4 und 5 aus `11-integrationsbefunde-und-folgearbeiten.md` nachgezogen.
  * Schwerpunkt war die Trennung von Bedieninaktivitaet, Transport-Idle und echten Disconnect-/Endgruenden.
  * Befund 6 zur uebergeordneten Support-Session bleibt fuer das Gateway eine externe Abhaengigkeit, aber kein primaerer Umsetzungsschnitt in diesem Repo.
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
* Der Browser-WebSocket-Handshake aus Plan 02 ist jetzt browser-kompatibel nachgezogen:
  * `GET /gateway/terminal` fuehrt das WebSocket-Upgrade ohne Grant-Header aus
  * die erste fachliche Client-Nachricht muss `authorize` mit dem Terminal-Grant sein
  * ungueltige Autorisierung wird nach dem Upgrade als `error` plus `close` signalisiert
  * fuer den laufenden Integrationstest ist die WebSocket-Origin-Pruefung per Hotfix derzeit bewusst offen
  * eine belastbare Origin-/Proxy-Strategie fuer produktionsnahe Deployments und Portweiterleitungen ist als Folgeplanung noch zu konkretisieren
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
  * konfigurierbarer Autorisierungs-Timeout vor `authorize`
  * konfigurierbare WebSocket-Keepalive-Intervalle und -Timeouts
  * konfigurierbare maximale Parallelitaet
  * explizites Cleanup aus dem Sitzungsregister
* Gleichzeitig ist aus dem Integrationslauf jetzt eine gezielte Folgearbeit abgeleitet:
  * aktive Browser-Terminal-Sitzungen werden nicht mehr allein wegen fehlender Eingaben beendet
  * die Vorautorisierungsphase verwendet jetzt einen getrennten `authorize_timeout`
  * eine explizite WebSocket-Keepalive-Strategie ist jetzt im Gateway eingezogen
  * `GATEWAY_SESSION_AUTHORIZE_TIMEOUT` ist der klare Konfigurationswert fuer die Vorautorisierungsphase; `GATEWAY_SESSION_IDLE_TIMEOUT` bleibt als Legacy-Fallback erhalten
* Die Browser-Gateway-Protokollentscheidung ist in Plan 06 neu festgezogen:
  * `authorize` ist wieder Teil des aktiven Laufzeitprotokolls
  * `authorized` bleibt als explizite Erfolgsbestaetigung im aktiven Laufzeitprotokoll
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
  * explizite Fehler fuer Session-Limit, `authorize_timeout`, `keepalive_timeout`, SSH-Lese-/Schreibfehler und Backend-Nichterreichbarkeit
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
  * erfolgreicher Upgrade-Pfad ohne benutzerdefinierten Header
  * ungueltiger Grant nach `authorize`
  * Backend-Fehler nach `authorize`
  * Ablehnung fachlicher Nachrichten vor erfolgreicher Autorisierung
  * explizite `authorized`-Bestaetigung vor dem Terminal-Datenpfad
  * Queue-Ueberlauf und Session-Cleanup
  * Session-Limit
  * getrennter `authorize_timeout`
  * ruhende, aber weiter offene Browser-Sitzung mit Keepalive
  * Resize-Propagation
  * Browser-zu-SSH-MVP-Datenpfad
  * lokaler E2E-Erfolgspfad mit echtem Grant-HTTP-Client und echtem SSH-Client
  * Negativpfade fuer Backend-Ausfall und SSH-Ausfall
* Die Testabdeckung ist jetzt auf echte Browser-Kompatibilitaet ohne benutzerdefinierte WebSocket-Header ausgerichtet.
* `go test ./...` und `go build ./...` wurden fuer den neuen Stand erfolgreich ausgefuehrt.
* Ein erster Betriebs-/Lieferpfad liegt jetzt im Repo:
  * `deploy/systemd/rook-servicechannel-gateway.service`
  * `deploy/systemd/gateway.env.example`
  * `Makefile`-Pfade `test-e2e` und `verify`
* Plan 05 ergaenzt jetzt einen Debian-Paketierungspfad:
  * `nfpm.yaml`
  * Maintainer-Skripte unter `packaging/nfpm/`
  * `Makefile`-Pfade `package` und `package-inspect`
  * `.deb`-Paketbau mit `nfpm`
* Der Paketierungsansatz bleibt betriebsseitig konservativ:
  * Binary, `systemd`-Unit und Beispiel-Environment werden paketiert
  * Laufzeitkonfiguration bleibt extern
  * der `systemd`-Dienst wird bei Paketinstallation weder automatisch aktiviert noch gestartet
* Der Paketbuild ist fuer das aktuelle Team-Setup auf lokale Vorvalidierung ohne Debian-Toolchain ausgelegt:
  * Paketbau ueber `go run ... nfpm`
  * Inhaltspruefung per `ar`/`tar`
  * echte Installations- und Laufzeittests auf Debian bleiben Folgearbeit
* Im Gateway-Repository wurden fortsetzbare Detailplaene unter `plans/` angelegt.
* Die Planung ist bewusst in reviewbare Teilabschnitte geschnitten:
  * `plans/01-runtime-grundgeruest-und-backend-validierung.md`
  * `plans/02-browser-websocket-und-sitzungssteuerung.md`
  * `plans/03-ssh-bridge-und-terminaldatenpfad.md`
  * `plans/04-hardening-betrieb-und-lieferfaehigkeit.md`
  * `plans/05-nfpm-debian-paketierung-und-installationspfad.md`
  * `plans/06-websocket-autorisierung-per-nachricht-statt-header.md`
  * `plans/07-idle-keepalive-und-session-endgruende.md`
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

1. Review von Plan 07 durchfuehren.
2. Rueckmeldungen aus Review und weiteren Integrationslaeufen in Runtime, Tests und `spec`-Artefakten nachziehen.
3. Erst anschliessend weitere Folgearbeiten wie Debian-Installations-/Runtime-Tests, Paket-Signing oder Host-Key-Haertung priorisieren.

## Aktuelle Integrationsbefunde

* Der erste echte Browser-Integrationslauf hat einen neuen Fokus auf Idle-, Timeout- und Keepalive-Verhalten gelegt.
* Die bisherige Idle-Abbruchbeobachtung wurde im Gateway in eine getrennte Autorisierungs- und Keepalive-Semantik ueberfuehrt.
* Die zentrale Einordnung und die komponentenuebergreifenden Folgearbeiten dazu werden in `11-integrationsbefunde-und-folgearbeiten.md` gepflegt.
* Fuer dieses Statusdokument heisst das insbesondere:
  * beobachten, ob die neue Keepalive-Strategie den Integrationspfad stabil haelt,
  * echte Abbruchursache entlang Browser, Proxy, Gateway, SSH und Backend bei weiteren Befunden weiter eingrenzen,
  * offene Fragen zu finalen Close-Codes oder weiteren Laufzeitgrenzen aus Review ableiten.
* Der repo-lokale Umsetzungsschnitt dafuer ist jetzt in `plans/07-idle-keepalive-und-session-endgruende.md` festgehalten.

## Hinweise für spätere Aktualisierung

* Diese Datei ist das komponentenuebergreifende Bindeglied im `spec`-Submodule und muss parallel zu den repo-lokalen Plaenen gepflegt werden.
* Sobald ein Plan begonnen, abgeschlossen oder im Review ist, soll dieser Stand hier in verdichteter Form gespiegelt werden.
* Sobald die Implementierung beginnt, sollen hier insbesondere der Stand von Backend-Validierung, WebSocket-Integration, SSH-Anbindung, Browser-Integration und Betriebs-Haertung gepflegt werden.
