# Implementierungsstatus – Browser-Terminal-Gateway

Status: Nicht begonnen

## Zweck der Komponente

Das Browser-Terminal-Gateway validiert Terminal-Berechtigungen, baut serverseitig die Verbindung zur Konsole auf und stellt dem RooK-Team die interaktive Shell im Browser bereit.

## Aktueller Stand

* Die Implementierung wurde noch nicht begonnen.
* Die Komponente muss noch implementiert werden.

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

1. Minimalen Gateway-Kern für Grant-Validierung und SSH-Aufbau implementieren.
2. Danach den Browser-seitigen Terminal-Handshake und das Nachrichtenmodell ergänzen.
3. Anschließend Reconnect-, Fehler- und Sitzungsende-Verhalten härten.

## Hinweise für spätere Aktualisierung

* Sobald die Implementierung beginnt, sollen hier insbesondere der Stand von Backend-Validierung, SSH-Anbindung und Browser-Integration gepflegt werden.