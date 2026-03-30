# Implementierungsstatus – RooK Agent auf der Konsole

Status: Nicht begonnen

## Zweck der Komponente

Der RooK Agent ist der zentrale lokale Systemdienst für den Support-Modus. Er steuert den Support-Zustand, verwaltet WLAN und VPN, kommuniziert mit dem Backend und hält den echten Laufzeitzustand.

## Aktueller Stand

* Die Implementierung wurde noch nicht begonnen.
* Die Komponente muss noch implementiert werden.

## Hauptaufgaben in der Umsetzung

* Systemd-Dienst in Go aufsetzen
* Lokalen Zustandsautomaten für WLAN, VPN, Support-Modus und PIN modellieren
* Lokale IPC zur UI umsetzen
* REST-Kommunikation mit dem Backend für Session-Start, Status, Heartbeat und Session-Ende umsetzen
* OpenVPN sowie lokale Cleanup- und Lifecycle-Operationen integrieren

## Abhängigkeiten

* OpenVPN-Infrastruktur
* RooK Web-/API-Backend
* Lokale IPC-Schnittstelle zur UI

## Nächste sinnvolle Schritte

1. Agent-Grunddienst und internes Zustandsmodell anlegen.
2. Backend-Anbindung für Support-Session-Lifecycle implementieren.
3. WLAN- und VPN-Steuerung integrieren.
4. Lokale IPC für die spätere UI-Anbindung ergänzen.

## Hinweise für spätere Aktualisierung

* Sobald die Implementierung beginnt, sollen hier insbesondere der Stand von Backend-Integration, VPN-Steuerung und lokalem Cleanup gepflegt werden.