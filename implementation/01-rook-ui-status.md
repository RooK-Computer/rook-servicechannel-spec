# Implementierungsstatus – RooK UI auf der Konsole

Status: Nicht begonnen

## Zweck der Komponente

Die RooK UI ist die lokale Benutzeroberfläche auf der Konsole. Sie zeigt Zustände an, erlaubt die Bedienung per Gamepad und spricht ausschließlich mit dem lokalen RooK Agent.

## Aktueller Stand

* Die Implementierung wurde noch nicht begonnen.
* Die Komponente muss noch implementiert werden.

## Hauptaufgaben in der Umsetzung

* Fullscreen-Oberfläche unter Linux ohne X oder Wayland bereitstellen
* Bedienung per Gamepad ermöglichen
* On-Screen-Keyboard für WLAN-Passwörter integrieren
* Zustandsanzeige für WLAN, VPN, Support-Modus und PIN umsetzen
* Anbindung an die lokale IPC-Schnittstelle zum RooK Agent umsetzen

## Abhängigkeiten

* Lokaler RooK Agent
* Lokale IPC-Schnittstelle UI ↔ Agent

## Nächste sinnvolle Schritte

1. UI-Grundgerüst und Navigationsfluss anlegen.
2. IPC-Anbindung gegen einen frühen Agent-Stub oder Mock vorbereiten.
3. Zustandsdarstellung und Eingabeflüsse für WLAN und Support-Modus schrittweise integrieren.

## Hinweise für spätere Aktualisierung

* Sobald die Implementierung beginnt, sollen hier mindestens Meilensteine, offene Blocker und der aktuelle Integrationsstand mit dem Agent ergänzt werden.