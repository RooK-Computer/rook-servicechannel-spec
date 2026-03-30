# Implementierungsstatus – RooK Web-/API-Backend

Status: In Arbeit

## Zweck der Komponente

Das RooK Backend ist die zentrale Control Plane. Es verwaltet Support-Sitzungen, PIN-Codes, Rollen und Terminal-Berechtigungen und stellt die REST-Schnittstellen für Agent, Web-Frontend und Gateway bereit.

## Aktueller Stand

* Das eigentliche Backend ist weiterhin noch nicht fachlich implementiert, aber Detailplanung und technisches Bootstrap wurden gestartet und validiert.
* Im Backend-Repository liegen fortsetzbare Teilplaene unter `plans/`, damit mehrere Agenten an klar abgegrenzten Arbeitspaketen weiterarbeiten koennen.
* Das lokale Drupal-/Docker-Grundgeruest wurde angelegt:
  * `composer.json` im Repo-Root
  * `composer.lock` und installierte Composer-Abhaengigkeiten
  * `docker-compose.yml` fuer App- und Datenbank-Container
  * `.docker/php/Dockerfile` fuer PHP/Apache mit Composer
  * `docroot/` als Drupal-Webroot
  * `configurations/` als Config-Sync-Verzeichnis
  * vorbereitete Drupal-Settings unter `docroot/sites/default/`
  * persistenter Host-Mount fuer Datenbankdaten unter `.docker/db-data/`
* Drupal wurde lokal gegen die Compose-Datenbank installiert und erfolgreich validiert:
  * `drush status` meldet erfolgreichen Bootstrap und verbundene Datenbank
  * HTTP-Antwort auf `http://localhost:8080` liefert `200 OK`
* Fuer dieses Repository gilt zusaetzlich die Projektentscheidung, dass ein ausfuehrbarer Stand eingecheckt werden soll; benoetigte Runtime- und Build-Artefakte werden daher nicht pauschal per `.gitignore` ausgeschlossen.
* Fuer die lokale Entwicklungsumgebung sind damit die zentralen Strukturentscheidungen bereits technisch verankert:
  * `composer.json` direkt im Repo-Root
  * `docroot/` als oeffentlicher Webroot
  * `configurations/` als Config-Sync-Verzeichnis im Repo-Root
  * `docker-compose.yml` fuer lokale PHP- und Datenbank-Container
  * persistenter Host-Mount fuer Datenbankdaten

## Hauptaufgaben in der Umsetzung

* Drupal-/Composer-Grundgeruest im Repo-Root aufbauen
* Datenmodell für Support-Sitzungen und PIN-Zuordnung umsetzen
* Agent-REST-API für Session-Start, Status, Heartbeat und Session-Ende implementieren
* Web-REST-API für PIN-Kopplung, Session-Status und Terminal-Grant implementieren
* Terminal-Grant-Validierung für das Gateway implementieren
* Rollen- und Rechteintegration über Drupal vorbereiten
* Laufzeitlogik für Cleanup, Timeout und Revocation ergänzen

## Abhängigkeiten

* OpenVPN-Infrastruktur
* RooK Agent auf der Konsole
* Browser-Terminal-Gateway

## Nächste sinnvolle Schritte

1. Support-Session-Datenmodell und Session-Lifecycle im Backend anlegen.
2. Modulgrenzen fuer Domain-Logik, REST-Endpunkte und Laufzeitprozesse konkretisieren.
3. Agent-seitige REST-Endpunkte zuerst implementieren.
4. Danach Web-API, Grant-Logik und Gateway-seitige Validierung ergänzen.

## Hinweise für spätere Aktualisierung

* Dieses Dokument soll waehrend der Umsetzung fortlaufend mit dem Stand von Bootstrap, Datenmodell, REST-Endpunkten, Rechtemodell, Gateway-Integration und Testabdeckung aktualisiert werden.
* Relevante Planungs- und Architekturentscheidungen aus `plans/` sollen hier in verdichteter Form gespiegelt werden, sobald sie belastbar umgesetzt oder bewusst festgelegt sind.
