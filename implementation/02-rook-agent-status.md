# Implementierungsstatus – RooK Agent auf der Konsole

Status: Planung konkretisiert

## Zweck der Komponente

Der RooK Agent ist der zentrale lokale Systemdienst für den Support-Modus. Er steuert den Support-Zustand, verwaltet WLAN und VPN, kommuniziert mit dem Backend und hält den echten Laufzeitzustand.

## Aktueller Stand

* Die Implementierung wurde noch nicht begonnen, aber die Umsetzungsplanung fuer dieses Repository wurde konkretisiert.
* Im Root-Repository wurden detaillierte Implementierungsplaene im Ordner `plans/` angelegt.
* Fuer dieses Repository ist als erster MVP zunaechst ein interaktives CLI-Werkzeug vorgesehen, das den Session-Lifecycle gegen das Backend abbildet.
* WLAN-Konfiguration, OpenVPN-Automatisierung und VPN-Statusabfrage bleiben fuer spaetere Ausbaustufen eingeplant.
* Die gemeinsame Architektur muss in einem spaeteren Schritt noch explizit um diesen CLI-First-MVP ergaenzt werden.

## Hauptaufgaben in der Umsetzung

* Go-Projektgrundlage und wiederverwendbaren Agent-Kern aufsetzen
* REST-Kommunikation mit dem Backend fuer Session-Start, Status, Heartbeat, PIN und Session-Ende umsetzen
* Ersten interaktiven CLI-MVP fuer Backend-Integration und Testumgebungen bereitstellen
* Danach den laenger laufenden Agent-Kern mit sauberem Zustandsmodell und spaeterem systemd-Modus ausbauen
* Lokale IPC zur UI, WLAN-Steuerung, OpenVPN-Steuerung sowie Cleanup- und Lifecycle-Operationen in nachfolgenden Phasen integrieren

## Abhängigkeiten

* OpenVPN-Infrastruktur
* RooK Web-/API-Backend
* Lokale IPC-Schnittstelle zur UI

## Nächste sinnvolle Schritte

1. Backend-Vertrag fuer den fruehen CLI-MVP und die benoetigten Session-Payloads praezisieren.
2. Go-Projektstruktur und interaktives CLI-Grundgeruest anlegen.
3. Session-Start, Status, Heartbeat, PIN-Anzeige und Session-Ende gegen das Backend implementieren.
4. Gemeinsame Architektur- und Implementierungsdokumente auf den CLI-First-MVP vorbereiten bzw. spaeter entsprechend nachziehen.
5. Danach den Ausbau in Richtung Dienstmodus, lokaler IPC sowie WLAN-/VPN-Integration fortsetzen.

## Hinweise für spätere Aktualisierung

* Sobald die Implementierung beginnt, sollen hier insbesondere der Stand des CLI-MVPs, der Backend-Integration und der Uebergang vom CLI-Werkzeug zum laenger laufenden Agent-Kern gepflegt werden.
* Der Ordner `plans/` im Root-Repository dient als detaillierte, fortschreibbare Arbeitsplanung fuer dieses Repo und sollte bei Fortschritt konsistent mit diesem Statusdokument gehalten werden.
* Aus dem OpenVPN-Repository liegen bereits konkrete Integrationshinweise vor, die bei Start der Agent-Implementierung direkt genutzt werden sollten:
  * clientseitiger systemd-Dienst: `rook-openvpn-client.service`
  * fester TUN-Name: `rookvpn`
  * OpenVPN-Statusdatei: `/var/log/rook-openvpn/client-status.log`
  * grober VPN-Status kann damit ueber Dienststatus plus Vorhandensein und IP des Interfaces `rookvpn` ermittelt werden.
* Diese Beobachtungspfade sind nicht nur konzeptionell festgelegt, sondern stammen aus einer bereits praktisch erfolgreich getesteten OpenVPN-Basis.
