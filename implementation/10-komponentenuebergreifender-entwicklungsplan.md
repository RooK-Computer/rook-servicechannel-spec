# Komponentenübergreifender Entwicklungsplan

Status: Abgeschlossen

## Zweck

Dieses Dokument beschreibt die verfolgte Reihenfolge fuer die Umsetzung der Hauptkomponenten.

Die beschriebene Reihenfolge fuehrt den spaeter erreichten Betriebsstand her und dient jetzt als nachvollziehbare Rueckschau auf die initiale Aufbauphase.

## Leitprinzip für die Reihenfolge

* Zuerst die Komponenten umsetzen, die den Support-Session-Lifecycle fachlich tragen.
* Danach die Komponenten ergänzen, die Terminal-Zugang und Shell-Transport ermöglichen.
* Die lokale UI zuletzt anbinden, weil sie auf den stabilen Zustands- und Integrationskern aufsetzen sollte.

## Umgesetzte Reihenfolge

### Phase 0 – Technische Grundlage bereitstellen

#### OpenVPN-Infrastruktur

Die OpenVPN-Infrastruktur sollte sehr früh in einer minimal funktionsfähigen Form verfügbar sein.

Einordnung:

* Die OpenVPN-Infrastruktur ist eine eigenstaendige Infrastrukturkomponente.
* Sie sollte nicht mit dem RooK Web-/API-Backend zusammengezogen werden, auch wenn beide organisatorisch vom gleichen Team betreut werden koennen.

Begründung:

* Agent und Gateway hängen technisch an der Erreichbarkeit über das VPN.
* Frühe Netzwerkpfade reduzieren späteres Debugging in mehreren Teams gleichzeitig.

Hinweis:

* OpenVPN-Konfigurationsdateien und die Skripte zu ihrer Debian-Paketierung sollen frueh mitgedacht werden.
* Diese Artefakte gehoeren fachlich zur OpenVPN-Infrastruktur und nicht in einen generischen, separaten Paketierungs-Track.

### Phase 1 – Fachlichen Kern aufbauen

#### RooK Web-/API-Backend

Das Backend sollte als zentrale Control Plane früh begonnen werden.

Begründung:

* Hier liegen Support-Sitzungen, PIN-Zuordnung, Statusführung und Terminal-Grants.
* Ohne diesen Kern haben Agent und Gateway keinen belastbaren Gegenpart.

#### RooK Agent auf der Konsole

Der Agent sollte direkt parallel oder unmittelbar nach dem Backend-Kern aufgebaut werden.

Begründung:

* Der Session-Lifecycle zwischen Agent und Backend ist das Rückgrat des Gesamtsystems.
* Bereits mit Agent plus Backend entsteht ein früher, testbarer End-to-End-Kern ohne UI und ohne Browser-Terminal.

### Phase 2 – Terminal-Zugang serverseitig ermöglichen

#### Browser-Terminal-Gateway

Der Gateway sollte nach einem stabilen Agent-/Backend-Kern begonnen werden.

Begründung:

* Er hängt fachlich von Terminal-Grants aus dem Backend ab.
* Er hängt technisch an der Erreichbarkeit der Konsole über das VPN.
* Die eigentliche Shell-Verbindung und der Datenpfad lassen sich besser bauen, wenn Session- und Grant-Logik bereits stehen.

### Phase 3 – Lokale Bedienoberfläche anbinden

#### RooK UI auf der Konsole

Die UI sollte zuletzt vollständig integriert werden.

Begründung:

* Die UI ist stark vom Agent-Zustand und von der lokalen IPC abhängig.
* Ein stabiler Agent-Kern mit klarer Zustandsführung macht die UI-Entwicklung deutlich risikoärmer.
* So kann die UI gegen reale Zustände arbeiten statt gegen bewegliche Provisorien.

## Tatsaechlich verfolgte Startreihenfolge

Fuer den initialen Aufbau mit wenigen parallelen Teams war folgende Startfolge sinnvoll und ist in dieser Reihenfolge dokumentiert worden:

1. OpenVPN-Infrastruktur minimal funktionsfähig aufsetzen.
2. OpenVPN-Konfigurationsablage und Debian-Paketierung fuer die VPN-Artefakte festlegen.
3. Backend-Datenmodell und Agent-REST-API implementieren.
4. Agent-Grunddienst und Session-Lifecycle gegen das Backend implementieren.
5. Gateway-Kern für Grant-Validierung und SSH-Aufbau ergänzen.
6. Browser-Terminal-Protokoll und Web-Zugriff darauf aufbauen.
7. Lokale UI vollständig auf den Agent-Kern aufsetzen.

Wenn OpenVPN und Backend vom gleichen Team umgesetzt werden, ist das in Ordnung. Fuer Planung, Status und Risikoanalyse sollten beide Themen aber weiterhin getrennt dokumentiert werden.

## Erreichter Nutzen dieser Reihenfolge

* Früher testbarer End-to-End-Kern auf Session-Ebene
* Geringeres Integrationsrisiko zwischen mehreren Teams
* Spätere UI- und Browser-Arbeit baut auf stabileren Verträgen und realen Zuständen auf
* Fehler werden zuerst in den Systemkern-Komponenten sichtbar statt spät in den Oberflächen

## Pflegehinweis

* Dieses Dokument bleibt als historische Einordnung des initialen Aufbaus bestehen.
* Neue Ausbauphasen oder spaetere Priorisierungswechsel sollen in den Komponentenstatusdateien und der Statusuebersicht dokumentiert werden statt diese abgeschlossene Aufbaufolge neu zu oeffnen.
