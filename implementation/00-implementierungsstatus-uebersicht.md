# Implementierungsstatus – Übersicht

Status: Aktiv gepflegt

## Zweck

Dieses Dokument bündelt den aktuellen Implementierungsstand der Hauptkomponenten des RooK-Service-Channel-Systems.

Es dient als gemeinsamer Einstiegspunkt für alle Teams, damit der aktuelle Entwicklungsstand, die offenen Arbeiten und die nächste sinnvolle Reihenfolge zentral sichtbar bleiben.

## Statuswerte

* `Nicht begonnen` – Die Implementierung wurde für diese Komponente noch nicht gestartet.
* `In Arbeit` – Die Implementierung läuft aktiv.
* `Blockiert` – Die Komponente kann aktuell nicht sinnvoll weiterbearbeitet werden.
* `Abgeschlossen` – Die geplante Implementierung für den aktuellen Scope ist umgesetzt.

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
* Die OpenVPN-Infrastruktur ist fuer den aktuell geplanten Scope auf einem praktisch verifizierten Stand und wird in `03-openvpn-infrastruktur-status.md` als `Abgeschlossen` gefuehrt.
* Die RooK UI auf der Konsole ist weiterhin `Nicht begonnen`.
* Der RooK Agent steht nicht mehr auf einem reinen CLI-MVP-Zwischenstand, sondern auf einem reviewed freigegebenen Lieferstand mit Runtime-Kern, lokalem IPC, WLAN-/VPN-Integration, Debian-Paketierung und servicegebundenem Interaktivmodus; `02-rook-agent-status.md` fuehrt ihn entsprechend als freigegebene Paketierungs- und Betriebsgrundlage.
* Das RooK Web-/API-Backend steht auf `In Arbeit`; zentrale Domain-, API- und erste Team-UI-Bausteine sind umgesetzt und lokal validiert.
* Das Browser-Terminal-Gateway steht nicht mehr am Anfang, sondern auf einem umgesetzten Plan-06-Stand und wartet laut `05-browser-terminal-gateway-status.md` auf Review.
* Nach den ersten interaktiven Integrationstests sind nun mehrere komponentenuebergreifende Nacharbeiten sichtbar geworden. Dazu gehoeren insbesondere Web-/Frontend-Nachschliffe, Browser-Terminal-Lifecycle-Themen sowie Fragen zum Agent-/Session-Lifecycle.
* Die Spezifikationsarbeit ist damit nicht abgeschlossen, sondern geht in eine Phase ueber, in der Integrationsbefunde, Vertragsnachschaerfungen und Folgearbeiten fuer die Implementierungsrepos systematisch nachgezogen werden muessen.

## Komponentenübergreifender Plan

* Die empfohlene Umsetzungsreihenfolge ist in `10-komponentenuebergreifender-entwicklungsplan.md` beschrieben.
* Dieser Plan soll als gemeinsame Leitlinie dienen und bei belastbaren neuen Erkenntnissen aktualisiert werden.
* OpenVPN-bezogene Konfigurations- und Paketierungsartefakte werden innerhalb der OpenVPN-Komponente betrachtet.

## Integrationsbefunde

* Die Befunde aus den ersten interaktiven Integrationstests werden zentral in `11-integrationsbefunde-und-folgearbeiten.md` gebuendelt.
* Die dortige Aufgabe ist nicht nur Sammlung, sondern die Trennung zwischen Implementierungsarbeit, Spezifikationsnachschaerfung und moeglichem Rechercheauftrag.
* Die betroffenen Komponentenstatusdokumente sollen ihre jeweils teamnahen Folgearbeiten parallel dazu nachziehen.

## Pflegehinweis

* Jedes Team aktualisiert den Status der eigenen Komponente fortlaufend.
* Relevante Änderungen am Gesamtfortschritt werden zusätzlich hier oder im komponentenübergreifenden Entwicklungsplan nachgezogen.
