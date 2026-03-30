# Implementierungsstatus – OpenVPN-Infrastruktur

Status: Abgeschlossen

## Zweck der Komponente

Die OpenVPN-Infrastruktur stellt den ausgehenden Transportkanal zwischen Konsole und zentraler Server-Infrastruktur bereit. Sie ist die technische Grundlage für den Session-Flow zwischen Agent, Backend und später dem Gateway.

## Einordnung und Ownership

* Diese Komponente ist als Infrastrukturbaustein eigenstaendig zu betrachten und nicht als Teil des Anwendungs-Backends.
* Organisatorisch kann sie dennoch beim gleichen Team liegen wie das Backend, wenn kein separates Infrastruktur- oder Plattformteam vorhanden ist.
* Fuer die Fortschrittsverfolgung sollte sie trotzdem als eigene Komponente sichtbar bleiben, weil Risiken, Abhaengigkeiten und Betriebsfragen andere sind als im Backend-Code.

## Aktueller Stand

* Die Umsetzung wurde im dedizierten OpenVPN-Implementierungs-Repository gestartet.
* Aus dem Architekturkonzept und den angrenzenden Status- und Schnittstellendokumenten wurden konkrete Umsetzungspläne für Server, Client, Secrets, Debian-Paketierung und Integration abgeleitet.
* Die Zielrichtung für das erste Teilprojekt ist jetzt konkretisiert: zwei getrennte OpenVPN-Konfigurationen mit Debian-Paketierung, eine für den Server und eine für den Client.
* Der Server-Endpoint ist für die erste Umsetzung auf `service.rook.computer` festgelegt.
* Die Ablage von Geheimnissen wird als explizite Repo-Struktur mit getrennten `secrets/`-Bereichen für Server und Client vorbereitet, damit diese Inhalte nicht eingecheckt werden.
* Die ersten realen Repository-Artefakte sind angelegt:
  * `openvpn/server/server.conf`
  * `openvpn/client/client.conf`
  * `openvpn/server/secrets/` und `openvpn/client/secrets/` als nicht einzucheckende Secret-Bereiche
  * systemd-Units für Server und Client
  * Debian-Paketmetadaten sowie Build-Targets im `Makefile`
* Fuer die Paketierung ist die Zielrichtung weiterhin `nfpm`; zusaetzlich existiert im Repository ein verifizierbarer `dpkg-deb`-Buildpfad, damit die Paketierbarkeit auch ohne lokal installiertes `nfpm` geprueft werden kann.
* Die aktuelle Repository-Struktur wurde lokal erfolgreich statisch validiert, und fuer Server und Client konnten Debian-Pakete als Konfigurationspakete gebaut und inhaltlich geprueft werden.
* Fuer dieses Projekt ist jetzt explizit festgezogen, dass alle Cartridges dasselbe clientseitige Secret-Set verwenden. Die Serverkonfiguration ist daher auf gleichzeitige Verbindungen mit identischem Client-Zertifikat ausgelegt.
* Das Repository enthaelt jetzt auch einen Secret-Generierungs- und Paketierungsfluss: Secrets koennen lokal erzeugt oder aus einem externen Secret-Root eingebunden und beim Paketbau in Server- und Client-Paket zusammengesetzt werden.
* Praktisch nutzbare Build-Einstiege sind jetzt insbesondere `make generate-secrets`, `make validate-secrets` und `make package-dpkg`; fuer externe Secret-Ablage kann der Build ueber `SECRETS_ROOT=/pfad/zum/secret-store` gespeist werden.
* Server- und Client-Pakete wurden in einer Testumgebung erfolgreich installiert.
* Eine erste VPN-Verbindung zwischen Client und Server konnte erfolgreich aufgebaut werden.
* Der Parallelbetrieb mit zwei Clients bei gemeinsamem Client-Secret-Set wurde erfolgreich verifiziert.
* Der erfolgreiche Paralleltest wurde praktisch dadurch nachgewiesen, dass von einem Client per SSH zum Server und von dort weiter per SSH auf den zweiten Client zugegriffen wurde, waehrend beide VPN-Verbindungen gleichzeitig aktiv waren.
* Fuer die spaetere Agent-Integration ist der clientseitige Beobachtungspfad jetzt konkretisiert:
  * systemd-Dienst `rook-openvpn-client.service`
  * festes Tunnel-Interface `rookvpn`
  * Statusdatei `/var/log/rook-openvpn/client-status.log`

## Ablage der OpenVPN-Konfigurationsdateien und Debian-Paketierung

* Reale OpenVPN-Konfigurationsdateien gehoeren nicht in dieses Spezifikations-Repository.
* Gleiches gilt fuer Skripte, mit denen diese Konfigurationen in Debian-Pakete gebaut werden.
* Diese Artefakte sollten zusammen mit der OpenVPN-Implementierung in einem eigenen OpenVPN-bezogenen Implementierungs-Repository gepflegt werden.
* Sie sollten nicht als generische, komponentenuebergreifende Paketierungskomponente modelliert werden, weil sie fachlich und betrieblich zur OpenVPN-Infrastruktur gehoeren.

Eine sinnvolle Zielstruktur in einem solchen Implementierungs-Repository waere zum Beispiel:

* `openvpn/server/` fuer Server-Konfigurationen
* `openvpn/client/` fuer Cartridge- bzw. Konsolen-seitige Konfigurationen
* `packaging/debian/` fuer Debian-Metadaten und Build-Skripte rund um diese OpenVPN-Artefakte
* `plans/` fuer die aus `spec/` abgeleiteten, repo-spezifischen Umsetzungsplaene

Fuer den aktuell gestarteten Arbeitsstand ist zusaetzlich sinnvoll:

* `openvpn/server/secrets/` fuer serverseitige Zertifikate, Schluessel und weiteres nicht einzucheckendes Material
* `openvpn/client/secrets/` fuer clientseitige Zertifikate, Schluessel und weiteres nicht einzucheckendes Material

## Hauptaufgaben in der Umsetzung

* OpenVPN-Server-Infrastruktur bereitstellen
* Konsolen-seitige Verbindungsparameter und Betriebsmodell festlegen
* Erreichbarkeit zwischen Konsole, Backend und Gateway über das VPN sicherstellen
* Betriebs- und Diagnosepfade für Supportfälle vorbereiten
* Debian-Paketierung für Server- und Client-Artefakte aufsetzen
* Makefile für reproduzierbare Paket-Builds bereitstellen
* Secrets-Struktur so festziehen, dass sensible Inhalte eindeutig ausgelagert bleiben

## Abhängigkeiten

* RooK Agent auf der Konsole
* RooK Web-/API-Backend
* Browser-Terminal-Gateway

## Nächste sinnvolle Schritte

1. Netzwerkpfade zwischen Konsole, Backend und Gateway über die bestehende VPN-Strecke in den nachgelagerten Komponenten nutzen und verifizieren.
2. Routing-, Firewall- und Erreichbarkeitsdetails für die Zielumgebung in der Integrationsphase haerten.
3. Die vorhandene OpenVPN-Basis als frühe Voraussetzung für Agent- und Gateway-Integration weiterverwenden.

## Hinweise für spätere Aktualisierung

* Als naechstes sollen hier Server-Setup, Client-Setup, Paketierungsstand, bekannte Netzwerkprobleme und Testumgebungen konkret nachgezogen werden.
* Sobald die ersten Artefakte im OpenVPN-Repository vorliegen, sollte dieses Dokument den Stand getrennt fuer Server, Client, Secrets-Handling und Paketierung ausweisen.
* Bei der naechsten Aktualisierung sollten die tatsaechlich verwendeten Secrets-Dateinamen, das gewaehlte VPN-Subnetz und die Erkenntnisse aus dem ersten Paket- und Installationslauf dokumentiert werden.
* Die bewusste Einschraenkung durch gemeinsame Client-Secrets sollte in spaeteren Betriebsdokumenten fuer Audit und Sperrprozesse sichtbar bleiben.
* Bei weiteren Erkenntnissen aus Agent-, Backend- oder Gateway-Integration sollten hier nur noch betriebliche Detailanpassungen, bekannte Randprobleme oder notwendige Netzhaertungen nachgezogen werden.
