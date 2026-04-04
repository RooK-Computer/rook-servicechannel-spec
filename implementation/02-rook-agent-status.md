# Implementierungsstatus – RooK Agent auf der Konsole

Status: Paketierung und Betriebsgrundlage freigegeben

## Zweck der Komponente

Der RooK Agent ist der zentrale lokale Systemdienst für den Support-Modus. Er steuert den Support-Zustand, verwaltet WLAN und VPN, kommuniziert mit dem Backend und hält den echten Laufzeitzustand.

## Aktueller Stand

* Die Umsetzungsplanung fuer dieses Repository wurde konkretisiert und in den Root-Dokumenten verankert.
* Plan 01 wurde als Bootstrap-Phase umgesetzt, nach einem Review-Befund korrigiert, erneut validiert und anschliessend freigegeben.
* Es gibt jetzt ein erstes Go-Projektgeruest mit ausfuehrbarem Einstiegspunkt, Konfigurationsmodell, Logging-Basis, Build-Makefile und ersten Tests.
* Der anfangs gefundene Fehler im Bootstrap-Runloop wurde behoben; der Prozess bleibt nun bis zum Interrupt aktiv und beendet sich danach sauber.
* Der Backend-API-Endpoint ist von Beginn an per Flag und Umgebungsvariable konfigurierbar angelegt.
* Fuer dieses Repository wurde der interaktive CLI-MVP fuer den Session-Lifecycle gegen das Backend erfolgreich umgesetzt, integriert getestet, formal reviewed und freigegeben.
* Der Agent besitzt einen internen Backend-Vertrag, einen HTTP-Client, einen interaktiven Prompt-Modus sowie direkte CLI-Befehle fuer `service`, `start`, `status`, `pin`, `ping` und `stop`.
* Die CLI nutzt den vorhandenen Agent-Backend-OpenAPI-Vertrag und behandelt den PIN fuer den aktuellen Stand weiter ueber Start-/Status-Responses statt ueber einen separaten Backend-Endpunkt.
* Der automatische Heartbeat liegt nicht mehr nur im Prompt-Code, sondern in einem wiederverwendbaren Runtime-Kern unter `internal/runtime`.
* Der Agent kann eine lokal persistierte Session nun auch in einem lang laufenden Service-Modus wieder aufnehmen, Heartbeats im Hintergrund weiterfuehren und die Session bei einem geordneten Shutdown sauber beenden.
* Plan 03 wurde reviewed und freigegeben; auf dieser Grundlage wurde Plan 04 fuer die lokale IPC- und UI-Vertragsschicht umgesetzt und anschliessend freigegeben.
* Der Agent startet im Service-Modus jetzt zusaetzlich einen lokalen Unix-Domain-Socket-Server fuer eine spaetere Konsole-UI.
* Der erste lokale IPC-Vertrag ist in JSON umgesetzt und wurde inzwischen schrittweise um Service-, WLAN- und VPN-bezogene Aktionen erweitert.
* Asynchrone UI-taugliche Events werden lokal ueber denselben Socket geliefert; darunter insbesondere `SupportStateChanged`, `PinAssigned`, `WifiScanCompleted`, `WifiConnectionStateChanged`, `VpnStateChanged` und `ErrorRaised`.
* Die IPC-Schicht greift nicht an der CLI vorbei in eigene Zustandslogik ein, sondern nutzt denselben Runtime-Kern fuer Snapshot, Session-Start, Session-Ende und Heartbeat-Eigentum.
* Reconnect-faehige Statusabfrage fuer UI-Neustarts ist ueber den lokalen Persistenzpfad und den Runtime-Snapshot abgesichert.
* Plan 05 wurde auf dieser Grundlage nun umgesetzt: Der Agent besitzt einen lokalen WLAN- und OpenVPN-Adapter, Cleanup-Logik fuer temporaere Support-Netzwerkreste sowie reboot-sensible Recovery fuer lokal persistierten Support-Zustand.
* Der WLAN-Teil nutzt `nmcli` und behandelt die Support-Verbindung als temporaeres Profil `rook-support-wifi`.
* Der OpenVPN-Teil steuert den Dienst `rook-openvpn-client.service` und beobachtet den effektiven VPN-Zustand ueber Dienststatus, Interface `rookvpn` und die Statusdatei `/var/log/rook-openvpn/client-status.log`.
* Die lokale IPC wurde um `ScanWifi`, `ConnectWifi` und `DisconnectWifi` sowie um `WifiScanCompleted`, `WifiConnectionStateChanged` und `VpnStateChanged` erweitert.
* `GetStatus` und `SupportStateChanged` unterscheiden beim WLAN jetzt explizit zwischen dem RooK-Support-WLAN-Zustand und der Frage, ob auf dem Host ueberhaupt irgendein WLAN aktiv ist.
* Die CLI besitzt jetzt zusaetzlich direkte Netzwerkbefehle fuer WLAN-Scan, WLAN-Status, WLAN-Verbindung, WLAN-Trennung, VPN-Status, VPN-Start, VPN-Stopp und Cleanup.
* Plan 05 wurde reviewed und freigegeben; darauf aufbauend wurde nun auch Plan 06 fuer Paketierung, Betrieb und Release-Vorbereitung umgesetzt.
* Der Agent kann jetzt ueber `nfpm` als Debian-Paket gebaut werden und liefert Binary, `systemd`-Unit sowie eine Environment-Datei fuer den paketierten Betrieb aus.
* Der paketierte Service nutzt weiterhin denselben `service`-Pfad des vorhandenen Agent-Binaries und fuehrt keinen separaten Laufzeitpfad neben CLI und Runtime-Kern ein.
* Die paketierten Standardpfade sind jetzt fuer State und Socket auf `/var/lib/rook-agent/session.json` und `/run/rook-agent/agent.sock` festgezogen.
* Der Backend-Endpoint bleibt auch im Paketbetrieb explizit ueber `/etc/default/rook-agent` konfigurierbar.
* README und Plan-Dokumente enthalten jetzt erste Operator-Hinweise fuer Installation, `systemctl`, `journalctl` und die paketierte Konfiguration.
* Die gemeinsame Spezifikation dokumentiert fuer das UI-Team jetzt explizit, dass der Socket-Pfad im paketierten Betrieb ueber `/etc/default/rook-agent` und dort ueber `ROOK_AGENT_SOCKET_PATH` aufgeloest wird; ausserdem sind Dateiformat und alle dort gepflegten Parameter beschrieben.
* Der interaktive Modus wurde danach aus einem lokalen Direktpfad in einen echten IPC-Client fuer den laufenden Service umgebaut.
* `rook-agent --interactive` spricht damit jetzt ueber den lokalen Unix-Socket mit dem Service und eignet sich dadurch direkt fuer den Test des echten Servicepfads.
* Wenn kein laufender Service bzw. kein erreichbarer Socket vorhanden ist, bricht der Interaktivmodus jetzt bewusst mit einer klaren Fehlermeldung ab statt still lokal weiterzulaufen.
* Der lokale IPC-Vertrag wurde dafuer um weitere Service-Aktionen wie `Ping`, `VpnStatus`, `VpnStart`, `VpnStop` und `Cleanup` erweitert.
* Plan 06 wurde reviewed und freigegeben; die Debian-Paketierung, die Betriebsgrundlage und der servicegebundene Interaktivmodus gelten damit als aktueller freigegebener Lieferstand dieses Repositories.
* Die gemeinsame Architektur muss in einem spaeteren Schritt noch explizit um den Uebergang vom CLI-First-MVP zum wiederverwendbaren Runtime-Kern ergaenzt werden.

## Hauptaufgaben in der Umsetzung

* Go-Projektgrundlage und wiederverwendbaren Agent-Kern aufsetzen
* REST-Kommunikation mit dem Backend fuer Session-Start, Status, Heartbeat, PIN und Session-Ende umsetzen
* Ersten interaktiven CLI-MVP fuer Backend-Integration und Testumgebungen bereitstellen
* Den laenger laufenden Agent-Kern mit sauberem Zustandsmodell und Service-Modus als Rueckgrat des Agents betreiben
* Lokale IPC zur UI auf denselben Runtime-Kern aufsetzen
* WLAN-Steuerung, OpenVPN-Steuerung sowie Cleanup- und Lifecycle-Operationen auf diesen Kern integrieren
* Danach Paketierung, Betriebsintegration und Release-Vorbereitung angehen

## Abhängigkeiten

* OpenVPN-Infrastruktur
* RooK Web-/API-Backend
* Lokale IPC-Schnittstelle zur UI

## Nächste sinnvolle Schritte

1. Die naechsten Folgearbeiten aus Paket-Haertung, Betriebsfeinschliff oder weiterer Architekturangleichung priorisieren.
2. Gemeinsame Architektur- und Implementierungsdokumente fuer den Uebergang vom CLI-First-MVP zum langfristigen Agent-Laufzeitmodell weiter nachziehen.
3. Die Netzwerkintegration und den paketierten Betrieb in einer Zielumgebung gegen echte `nmcli`-, OpenVPN- und `systemd`-Signale haerten.
4. Bei Bedarf einen naechsten repo-lokalen Folgeplan fuer haertere Service-/Operations-Anforderungen starten.

## Aktuelle Integrationsbefunde

* Der erfolgreiche interaktive Integrationslauf hat den Session-Lifecycle gegen das Backend fuer den CLI-MVP praktisch bestaetigt.
* Der daraus abgeleitete Schwerpunkt lag auf der Frage, wie Heartbeat-Eigentum, Beobachtbarkeit und Wiederanlauf in den eigentlichen Laufzeitkern ueberfuehrt werden.
* Die zentrale Einordnung und die komponentenuebergreifenden Folgearbeiten dazu werden in `11-integrationsbefunde-und-folgearbeiten.md` gepflegt.
* Fuer dieses Statusdokument heisst das insbesondere:
  * Heartbeat-, Netzwerk-, IPC-, interaktive Servicebedienung und Paketierungspfad sind nun bis zur installierbaren Debian-Auslieferung zusammengefuehrt.
  * Der aktuelle Review hat diese erste Paketierungs- und Betriebsgrundlage als akzeptablen Delivery-Slice bestaetigt.

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
