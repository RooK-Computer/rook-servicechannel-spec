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

* Für alle aktuell identifizierten Hauptkomponenten liegt ein initiales Statusdokument vor.
* Alle Komponenten stehen derzeit auf `Nicht begonnen`.
* Die Spezifikationsarbeit ist vorläufig abgeschlossen; die nächste Phase ist die schrittweise Umsetzung.

## Komponentenübergreifender Plan

* Die empfohlene Umsetzungsreihenfolge ist in `10-komponentenuebergreifender-entwicklungsplan.md` beschrieben.
* Dieser Plan soll als gemeinsame Leitlinie dienen und bei belastbaren neuen Erkenntnissen aktualisiert werden.
* OpenVPN-bezogene Konfigurations- und Paketierungsartefakte werden innerhalb der OpenVPN-Komponente betrachtet.

## Pflegehinweis

* Jedes Team aktualisiert den Status der eigenen Komponente fortlaufend.
* Relevante Änderungen am Gesamtfortschritt werden zusätzlich hier oder im komponentenübergreifenden Entwicklungsplan nachgezogen.