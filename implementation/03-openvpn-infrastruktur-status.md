# Implementierungsstatus – OpenVPN-Infrastruktur

Status: Nicht begonnen

## Zweck der Komponente

Die OpenVPN-Infrastruktur stellt den ausgehenden Transportkanal zwischen Konsole und zentraler Server-Infrastruktur bereit. Sie ist die technische Grundlage für den Session-Flow zwischen Agent, Backend und später dem Gateway.

## Einordnung und Ownership

* Diese Komponente ist als Infrastrukturbaustein eigenstaendig zu betrachten und nicht als Teil des Anwendungs-Backends.
* Organisatorisch kann sie dennoch beim gleichen Team liegen wie das Backend, wenn kein separates Infrastruktur- oder Plattformteam vorhanden ist.
* Fuer die Fortschrittsverfolgung sollte sie trotzdem als eigene Komponente sichtbar bleiben, weil Risiken, Abhaengigkeiten und Betriebsfragen andere sind als im Backend-Code.

## Aktueller Stand

* Die Implementierung wurde noch nicht begonnen.
* Die Komponente muss noch implementiert werden.

## Ablage der OpenVPN-Konfigurationsdateien und Debian-Paketierung

* Reale OpenVPN-Konfigurationsdateien gehoeren nicht in dieses Spezifikations-Repository.
* Gleiches gilt fuer Skripte, mit denen diese Konfigurationen in Debian-Pakete gebaut werden.
* Diese Artefakte sollten zusammen mit der OpenVPN-Implementierung in einem eigenen OpenVPN-bezogenen Implementierungs-Repository gepflegt werden.
* Sie sollten nicht als generische, komponentenuebergreifende Paketierungskomponente modelliert werden, weil sie fachlich und betrieblich zur OpenVPN-Infrastruktur gehoeren.

Eine sinnvolle Zielstruktur in einem solchen Implementierungs-Repository waere zum Beispiel:

* `openvpn/server/` fuer Server-Konfigurationen
* `openvpn/client/` fuer Cartridge- bzw. Konsolen-seitige Konfigurationen
* `packaging/debian/` fuer Debian-Metadaten und Build-Skripte rund um diese OpenVPN-Artefakte

## Hauptaufgaben in der Umsetzung

* OpenVPN-Server-Infrastruktur bereitstellen
* Konsolen-seitige Verbindungsparameter und Betriebsmodell festlegen
* Erreichbarkeit zwischen Konsole, Backend und Gateway über das VPN sicherstellen
* Betriebs- und Diagnosepfade für Supportfälle vorbereiten

## Abhängigkeiten

* RooK Agent auf der Konsole
* RooK Web-/API-Backend
* Browser-Terminal-Gateway

## Nächste sinnvolle Schritte

1. Minimal funktionsfähige VPN-Strecke für Entwicklungs- und Testumgebungen bereitstellen.
2. Ziel-Ablage fuer OpenVPN-Konfigurationen und zugehoerige Debian-Paketierung im OpenVPN-Implementierungskontext festlegen.
3. Netzwerkpfade zwischen Konsole, Backend und Gateway verifizieren.
4. Die Infrastruktur als frühe Voraussetzung für Agent- und Gateway-Integration stabilisieren.

## Hinweise für spätere Aktualisierung

* Sobald die Implementierung beginnt, sollen hier Server-Setup, Betriebsstatus, bekannte Netzwerkprobleme und Testumgebungen dokumentiert werden.