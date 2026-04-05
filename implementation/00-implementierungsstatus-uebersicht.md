# Implementierungsstatus – Übersicht

Status: Aktiv gepflegt

## Zweck

Dieses Dokument bündelt den aktuellen Implementierungsstand der Hauptkomponenten des RooK-Service-Channel-Systems.

Es dient als gemeinsamer Einstiegspunkt fuer alle Teams, damit der aktuelle Betriebsstand, der Abschluss der bisherigen Implementierungsplaene und neue Aenderungen zentral sichtbar bleiben.

## Statuswerte

* `Nicht begonnen` – Die Implementierung wurde für diese Komponente noch nicht gestartet.
* `In Arbeit` – Die Implementierung läuft aktiv.
* `Blockiert` – Die Komponente kann aktuell nicht sinnvoll weiterbearbeitet werden.
* `Abgeschlossen` – Die geplante Implementierung für den aktuellen Scope ist umgesetzt.
* `In Betrieb` – Die Komponente ist für den aktuellen Scope umgesetzt, in Nutzung und wird nur noch über Betriebsänderungen, neue Befunde oder neue Ausbaustufen fortgeschrieben.

## Komponenten

1. `01-rook-ui-status.md` – RooK UI auf der Konsole
2. `02-rook-agent-status.md` – RooK Agent auf der Konsole
3. `03-openvpn-infrastruktur-status.md` – OpenVPN-Infrastruktur
4. `04-rook-backend-status.md` – RooK Web-/API-Backend
5. `05-browser-terminal-gateway-status.md` – Browser-Terminal-Gateway

## Einordnung der OpenVPN-Infrastruktur

* Die OpenVPN-Infrastruktur ist eine eigenstaendige, im Architekturkonzept explizit benannte Infrastrukturkomponente.
* Sie ist nicht identisch mit dem RooK Web-/API-Backend, auch wenn ihre technische Verantwortung organisatorisch beim gleichen Team liegen kann.
* Falls es kein separates Plattform- oder Infrastrukturteam gibt, kann die OpenVPN-Infrastruktur pragmatisch durch das Backend-nahe Team mitverantwortet werden.

## Aktueller Gesamtstand

* Fuer alle aktuell identifizierten Hauptkomponenten liegt ein gepflegtes Statusdokument vor.
* Alle Hauptkomponenten werden fuer den aktuellen Scope nun als `In Betrieb` gefuehrt.
* Die OpenVPN-Infrastruktur stellt den produktiv genutzten Transportpfad bereit.
* Die RooK UI auf der Konsole ist umgesetzt, paketiert und an den laufenden Agenten angebunden.
* Der RooK Agent laeuft als zentrale lokale Laufzeitkomponente mit Runtime-Kern, lokalem IPC, WLAN-/VPN-Integration und paketiertem Servicepfad im Betrieb.
* Das RooK Web-/API-Backend arbeitet als produktiv genutzte Control Plane mit Domain-Modell, REST-Schnittstellen, Team-UI und Terminal-Grant-Verwaltung.
* Das Browser-Terminal-Gateway ist umgesetzt, integriert und als Browser-Zugang zur Konsole im Betrieb.
* Die bisherigen Implementierungsplaene sind abgeschlossen; neue Arbeiten entstehen nur noch aus spaeteren Betriebsbefunden, gezielten Produktaenderungen oder neuen Ausbaustufen.
* Die Spezifikationsarbeit verschiebt sich damit von der initialen Implementierungsplanung auf Betriebsdokumentation, Vertragsnachpflege und die Einordnung spaeterer Aenderungen.

## Komponentenübergreifender Plan

* Die verfolgte Umsetzungsreihenfolge ist in `10-komponentenuebergreifender-entwicklungsplan.md` dokumentiert.
* Das Dokument dient jetzt vor allem als nachvollziehbare Herleitung des erreichten Gesamtstands.
* OpenVPN-bezogene Konfigurations- und Paketierungsartefakte werden innerhalb der OpenVPN-Komponente betrachtet.

## Integrationsbefunde

* Die Befunde aus den ersten interaktiven Integrationstests bleiben zentral in `11-integrationsbefunde-und-folgearbeiten.md` dokumentiert.
* Die dort zuerst abgeleiteten Folgearbeiten sind fuer den aktuellen Scope nachgezogen; das Dokument dient nun vor allem als Referenz fuer die damalige Einordnung und fuer spaetere neue Befunde.
* Die betroffenen Komponentenstatusdokumente spiegeln den nachgezogenen Stand ihrer jeweiligen Komponente.

## Pflegehinweis

* Jedes Team aktualisiert den Status der eigenen Komponente fortlaufend.
* Relevante Aenderungen am Betriebsstand oder an neuen Ausbauphasen werden zusaetzlich hier nachgezogen.
