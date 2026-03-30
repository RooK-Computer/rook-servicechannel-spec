# Implementierungsstatus – RooK Web-/API-Backend

Status: Nicht begonnen

## Zweck der Komponente

Das RooK Backend ist die zentrale Control Plane. Es verwaltet Support-Sitzungen, PIN-Codes, Rollen und Terminal-Berechtigungen und stellt die REST-Schnittstellen für Agent, Web-Frontend und Gateway bereit.

## Aktueller Stand

* Die Implementierung wurde noch nicht begonnen.
* Die Komponente muss noch implementiert werden.

## Hauptaufgaben in der Umsetzung

* Datenmodell für Support-Sitzungen und PIN-Zuordnung umsetzen
* Agent-REST-API für Session-Start, Status, Heartbeat und Session-Ende implementieren
* Web-REST-API für PIN-Kopplung, Session-Status und Terminal-Grant implementieren
* Terminal-Grant-Validierung für das Gateway implementieren
* Rollen- und Rechteintegration über Drupal vorbereiten

## Abhängigkeiten

* OpenVPN-Infrastruktur
* RooK Agent auf der Konsole
* Browser-Terminal-Gateway

## Nächste sinnvolle Schritte

1. Support-Session-Datenmodell und Session-Lifecycle im Backend anlegen.
2. Agent-seitige REST-Endpunkte zuerst implementieren.
3. Danach Grant-Logik und Gateway-seitige Validierung ergänzen.
4. Web-/Frontend-nahe Endpunkte anschließend darauf aufbauen.

## Hinweise für spätere Aktualisierung

* Sobald die Implementierung beginnt, sollen hier der Stand von Datenmodell, REST-Endpunkten, Rechtemodell und Gateway-Integration nachgezogen werden.