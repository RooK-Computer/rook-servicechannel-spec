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
  * HTTP-Antwort auf die konfigurierte lokale Basis-URL liefert `200 OK`
* Fuer dieses Repository gilt zusaetzlich die Projektentscheidung, dass ein ausfuehrbarer Stand eingecheckt werden soll; benoetigte Runtime- und Build-Artefakte werden daher nicht pauschal per `.gitignore` ausgeschlossen.
* Das Domain-Modell fuer den Backend-Kern wurde initial umgesetzt:
  * Custom-Modul `rook_servicechannel_core`
  * Content Entities `support_session` und `terminal_grant`
  * PIN als Feld auf `support_session`, nicht als eigene Entity
  * dedizierte Tabellen `rook_support_session_participant` und `rook_support_audit_log`
  * erste Domain-Services fuer Session-, Grant- und Audit-Logik
* Das Modell wurde gegen die laufende Drupal-Instanz verifiziert:
  * Modul ist aktiviert
  * alle vier Kern-Tabellen existieren in MariaDB
  * Smoke-Tests fuer Session-Erzeugung, Grant-Ausgabe, Audit-Log und Teilnehmer-Tabelle liefen erfolgreich
* Die erste Agent-API-Schicht wurde auf das Domain-Modell aufgesetzt:
  * Custom-Modul `rook_servicechannel_console_api`
  * REST-Endpunkte `POST /api/console/1/beginsession`, `status`, `ping`, `endsession`
  * Lifecycle-Service fuer PIN-Ausgabe, Heartbeat-Verarbeitung, Session-Ende und "latest start wins"
  * optionales Hardening-Modul `rook_servicechannel_console_ip_guard` fuer produktive Quell-IP-Restriktionen
  * UI-konfigurierbare Allowlist unter `/admin/config/services/rook-servicechannel/console-ip-guard` inklusive Eintrag unter `Configuration/System`
  * OpenAPI-basierte Contract-Validierung gegen `spec/openapi/02-agent-backend-rest.openapi.yaml`
* Die erste Web-API-Schicht wurde auf das Domain-Modell und die Agent-API aufgesetzt:
  * Custom-Modul `rook_servicechannel_client_api`
  * REST-Endpunkte `POST /api/client/1/pinlookup`, `sessionstatus`, `requestshell`
  * reproduzierbare Drupal-Rolle `Service` inklusive Zugriff auf die Client-API
  * Session-Kopplung ueber `rook_support_session_participant`
  * OpenAPI-basierte Contract-Validierung gegen `spec/openapi/03-web-backend-rest.openapi.yaml`
* Die erste Gateway- und Runtime-Schicht wurde auf die vorhandene Grant-Logik aufgesetzt:
  * Custom-Modul `rook_servicechannel_gateway_api`
  * REST-Endpunkt `POST /api/gateway/1/validateToken`
  * Grant-Validierung mit Redeem- und Reconnect-Regeln
  * Cron-basierte Maintenance fuer Grant-Expiry und das Aufraeumen alter geschlossener Sessions
  * OpenAPI-basierte Contract-Validierung gegen `spec/openapi/06-backend-gateway-terminal-grant.openapi.yaml`
* Die erste Team-UI-Schicht wurde im Backend-Repository ergänzt:
  * Custom-Modul `rook_servicechannel_team_ui`
  * geschuetzte Drupal-Route `/servicechannel/team` fuer Service-Mitarbeiter
  * Browser-UI fuer PIN-Eingabe, Session-Status und `requestshell`
  * `xterm.js`-basierte Terminal-Oberflaeche mit konfigurierbarer Gateway-URL und WebSocket-Autorisierung ueber `authorize`/`authorized`
  * eigener Kernel-Test fuer Rollen-Provisionierung, Seitenzugriff und Laufzeit-Settings
* Der Test-, Delivery- und Statuspflege-Slice wurde initial konsolidiert:
  * dokumentierter Drupal-PHPUnit-Entrypoint fuer Kernel-Tests ueber `docroot/core/phpunit.xml.dist`
  * lokaler Workflow fuer Testlauf, API-Checks und Reset im `README.md`
  * eigener Core-Kernel-Test fuer gemeinsam genutzte Domain-Services
  * fortgeschriebene Teilplaene und Statusartefakte fuer den realen Implementierungsstand
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

1. Die echte Ende-zu-Ende-Integration der aktualisierten Team-UI gegen eine laufende Gateway-Komponente nachvalidieren.
2. Fehlercode- und Revocation-Semantik an den bestehenden API-Schnitten gezielt nachschärfen, statt neue Flaechen aufzumachen.
3. Die Browser-Gateway-Protokolldetails fuer `resize` weiter explizit stabilisieren; der Integrationsstand stuetzt derzeit `columns` und `rows`.
4. Weitere Integrations- oder Delivery-Anforderungen nur bei belastbarem Bedarf ergänzen, statt vorschnell neue Toolketten einzuführen.

## Aktuelle Integrationsbefunde

* Die ersten interaktiven Integrationstests zeigen neue Folgearbeiten sowohl in der Team-UI als auch im Session-Lifecycle.
* Erste backendseitige Folgearbeiten daraus wurden bereits umgesetzt:
  * zentrale Heartbeat-/Timeout-Pruefung im Core statt duplizierter Ablaufpruefung in mehreren API-Schichten,
  * expliziter Rueckfall `active -> open`, ohne die uebergeordnete Support-Session zu schliessen,
  * Team-UI in React mit TypeScript als Quellbasis bei weiter committedem Laufzeit-Bundle,
  * Umstellung der Team-Oberflaeche auf einen vertikalen Zwei-Block-Aufbau,
  * Debug-Informationen hinter einem klickbaren Info-Symbol,
  * vollbreite 4:3-Anordnung des Browser-Terminals mit Hoehenbegrenzung gegen die verfuegbare Bildschirmhoehe unter Beruecksichtigung der Drupal-Oberflaeche,
  * Menueeinbindung der Team-UI in die Hauptnavigation und des Konfigurationszugangs unter Drupal `Configuration/System`.
* Fuer die offene Folgepflege bleiben aktuell vor allem:
  * Ende-zu-Ende-Nachvalidierung der Team-UI gegen ein laufendes Gateway,
  * weitere Schaerfung von Fehler- und Revocation-Semantik,
  * laufende Abgleiche mit neuen Integrationsbefunden im `11`er-Dokument.
* Die zentrale Einordnung, inklusive moeglichem Spezifikations- oder Recherchebedarf, wird in `11-integrationsbefunde-und-folgearbeiten.md` gepflegt.

## Hinweise für spätere Aktualisierung

* Dieses Dokument soll waehrend der Umsetzung fortlaufend mit dem Stand von Bootstrap, Datenmodell, REST-Endpunkten, Rechtemodell, Gateway-Integration und Testabdeckung aktualisiert werden.
* Relevante Planungs- und Architekturentscheidungen aus `plans/` sollen hier in verdichteter Form gespiegelt werden, sobald sie belastbar umgesetzt oder bewusst festgelegt sind.
