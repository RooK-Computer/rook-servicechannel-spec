# Implementierungsstatus – RooK Agent auf der Konsole

Status: Interaktiver CLI-MVP umgesetzt, Review ausstehend

## Zweck der Komponente

Der RooK Agent ist der zentrale lokale Systemdienst für den Support-Modus. Er steuert den Support-Zustand, verwaltet WLAN und VPN, kommuniziert mit dem Backend und hält den echten Laufzeitzustand.

## Aktueller Stand

* Die Umsetzungsplanung fuer dieses Repository wurde konkretisiert und in den Root-Dokumenten verankert.
* Plan 01 wurde als Bootstrap-Phase umgesetzt, nach einem Review-Befund korrigiert, erneut validiert und anschliessend freigegeben.
* Es gibt jetzt ein erstes Go-Projektgeruest mit ausfuehrbarem Einstiegspunkt, Konfigurationsmodell, Logging-Basis, Build-Makefile und ersten Tests.
* Der anfangs gefundene Fehler im Bootstrap-Runloop wurde behoben; der Prozess bleibt nun bis zum Interrupt aktiv und beendet sich danach sauber.
* Der Backend-API-Endpoint ist von Beginn an per Flag und Umgebungsvariable konfigurierbar angelegt.
* Fuer dieses Repository ist der erste interaktive CLI-MVP fuer den Session-Lifecycle gegen das Backend umgesetzt.
* Der Agent besitzt jetzt einen internen Backend-Vertrag, einen HTTP-Client, einen interaktiven Prompt-Modus sowie direkte CLI-Befehle fuer `start`, `status`, `pin`, `ping`, `stop` und lokale Session-Persistenz.
* Die CLI nutzt den vorhandenen Agent-Backend-OpenAPI-Vertrag und behandelt den PIN fuer den MVP ueber Start-/Status-Responses statt ueber einen separaten Backend-Endpunkt.
* Im interaktiven Modus startet `start` nun auch einen automatischen Heartbeat, der die Session bis `stop`, `exit` oder zu einem fatalen Backend-Fehler offen haelt.
* Plan 02 ist damit umgesetzt und wartet nun auf Review, bevor weitere Ausbaustufen beginnen.
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

1. Review des interaktiven CLI-MVPs abschliessen.
2. Gemeinsame Architektur- und Implementierungsdokumente fuer den CLI-First-MVP weiter nachziehen.
3. Danach entscheiden, ob als naechster Schritt zunaechst der automatische Heartbeat-/Runtime-Kern von Plan 03 oder weitere gezielte CLI-Nachschliffe noetig sind.
4. Erst danach den Ausbau in Richtung Dienstmodus, lokaler IPC sowie WLAN-/VPN-Integration fortsetzen.

## Aktuelle Integrationsbefunde

* Der erste interaktive Integrationslauf hat einen neuen Schwerpunkt auf den Session-Lifecycle gelegt.
* Im Mittelpunkt steht die Frage, ob eine vom Agent gestartete Support-Session serverseitig offen bleibt, solange weiterhin Agent-Pings eintreffen.
* Die zentrale Einordnung und die komponentenuebergreifenden Folgearbeiten dazu werden in `11-integrationsbefunde-und-folgearbeiten.md` gepflegt.
* Fuer dieses Statusdokument heisst das insbesondere:
  * Heartbeat- und Beobachtbarkeitspfad gegen den realen Integrationsfall absichern.
  * Nach dem Review explizit pruefen, ob Plan 03 den laenger laufenden Agent-Kern und die gewuenschte Session-Persistenz ausreichend abdeckt.

## Hinweise für spätere Aktualisierung

* Nach jedem abgeschlossenen Plan-Abschnitt ist vor dem naechsten Abschnitt ein Review-Stopp vorgesehen; dieser Status sollte hier jeweils sichtbar nachgefuehrt werden.
* Nach dem Review des interaktiven CLI-MVPs sollen hier insbesondere der Stand des Uebergangs vom promptgetriebenen Werkzeug zum laenger laufenden Agent-Kern gepflegt werden.
* Der Ordner `plans/` im Root-Repository dient als detaillierte, fortschreibbare Arbeitsplanung fuer dieses Repo und sollte bei Fortschritt konsistent mit diesem Statusdokument gehalten werden.
* Aus dem OpenVPN-Repository liegen bereits konkrete Integrationshinweise vor, die bei Start der Agent-Implementierung direkt genutzt werden sollten:
  * clientseitiger systemd-Dienst: `rook-openvpn-client.service`
  * fester TUN-Name: `rookvpn`
  * OpenVPN-Statusdatei: `/var/log/rook-openvpn/client-status.log`
  * grober VPN-Status kann damit ueber Dienststatus plus Vorhandensein und IP des Interfaces `rookvpn` ermittelt werden.
* Diese Beobachtungspfade sind nicht nur konzeptionell festgelegt, sondern stammen aus einer bereits praktisch erfolgreich getesteten OpenVPN-Basis.
