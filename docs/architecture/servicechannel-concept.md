# RooK Fernwartung – Technisches Konzept

## Ziel

RooK-Konsolen auf Cartridges sollen bei Bedarf eine **temporäre Fernwartung** ermöglichen.

Der gewünschte Ablauf ist:

1. Der Nutzer öffnet auf der Konsole den Bereich **RooK**.
2. Dort richtet er bei Bedarf eine **temporäre WLAN-Verbindung** ein.
3. Die Konsole verbindet sich mit dem zentralen RooK-Server über **OpenVPN Community Edition**.
4. Die Konsole handelt mit dem Server einen **4-stelligen PIN** aus.
5. Der PIN wird auf der Konsole angezeigt.
6. Ein RooK-Mitarbeiter meldet sich im Web-Frontend an, gibt den PIN ein und erhält im Browser eine **Terminal-Sitzung** auf genau dieser Konsole.
7. Nach Ende der Support-Sitzung oder nach einem Reboot wird der temporäre Support-Zustand wieder entfernt.

## Grundprinzipien

* Support wird **nur lokal auf der Konsole aktiviert**.
* Die Konsole baut **nur ausgehende Verbindungen** auf.
* Es werden **keine eingehenden Ports beim Kunden** benötigt.
* Die WLAN-Verbindung ist **temporär** und wird nach der Sitzung oder beim Boot bereinigt.
* Die Kopplung zwischen RooK-Team und Konsole erfolgt über einen **kurzlebigen 4-stelligen PIN**.
* Die eigentliche Shell-Verbindung wird **serverseitig** aufgebaut und im Browser bereitgestellt.

## Architekturüberblick

Das Laufzeitsystem besteht aus fünf Hauptbausteinen:

1. **RooK UI auf der Konsole**
2. **RooK Agent auf der Konsole**
3. **OpenVPN-Infrastruktur**
4. **RooK Web-/API-Backend**
5. **Browser-Terminal-Gateway**

---

## 1. RooK UI auf der Konsole

### Aufgabe

Die RooK UI ist die lokale Benutzeroberfläche auf der Konsole.

Sie dient dazu,

* den Support-Modus zu starten und zu beenden,
* WLAN-Netze anzuzeigen,
* Zugangsdaten per Gamepad einzugeben,
* Verbindungsstatus anzuzeigen,
* den Support-PIN anzuzeigen.

### Technologie

* **C++**
* **SDL2**

### Anforderungen

* läuft direkt unter Linux ohne X oder Wayland,
* vollständig per **Gamepad** bedienbar,
* Fullscreen-Oberfläche,
* On-Screen-Keyboard für WLAN-Passwörter,
* keine direkte Systemlogik.

### Verantwortung

Die RooK UI ist nur für Darstellung und Eingabe zuständig.

Sie spricht ausschließlich mit dem lokalen RooK Agent und führt selbst **keine** systemnahen Operationen aus.

---

## 2. RooK Agent auf der Konsole

### Aufgabe

Der RooK Agent ist der zentrale lokale Systemdienst für den Support-Modus.

Er übernimmt:

* Steuerung des Support-Zustands,
* WLAN-Scan und WLAN-Verbindung,
* Start und Stop von OpenVPN,
* Kommunikation mit dem zentralen RooK-Backend,
* Empfang und Verwaltung des Support-PIN,
* Start und Ende der lokalen Support-Freigabe,
* Cleanup nach Sitzungsende oder Reboot.

### Technologie

* **Go**
* läuft als **systemd-Dienst**

### Systemintegration

Der Agent nutzt auf der Konsole:

* **NetworkManager / nmcli** für WLAN
* **OpenVPN Community Edition** für die VPN-Verbindung
* einen lokalen **SSH-Server** bzw. einen dedizierten Support-Zugang für die spätere Terminal-Sitzung

### Zustandsverantwortung

Der Agent hält den echten Laufzeitzustand.

Die UI kann jederzeit neu gestartet werden und fragt den aktuellen Zustand beim Agent erneut ab.

---

## 3. OpenVPN-Infrastruktur

### Aufgabe

OpenVPN stellt die Netzverbindung zwischen Konsole und zentraler Server-Infrastruktur her.

### Technologie

* **OpenVPN Community Edition**

### Eigenschaften

* die Konsole baut eine **ausgehende VPN-Verbindung** zum RooK-Server auf,
* die Verbindung wird nur im Supportfall benötigt,
* das RooK-Team greift nicht direkt über das Kundennetz zu, sondern über die zentrale RooK-Infrastruktur.

### Rolle im Gesamtsystem

OpenVPN ist ausschließlich der Transportkanal.

Die Zuordnung einer Browser-Sitzung zu einer Konsole erfolgt nicht durch manuelle Auswahl von IP-Adressen, sondern über den vom Server verwalteten **PIN-basierten Session-Flow**.

Reale OpenVPN-Konfigurationsdateien und Skripte fuer deren Debian-Paketierung sind Umsetzungsartefakte dieser OpenVPN-Komponente und gehoeren nicht in dieses Spezifikations-Repository.

---

## 4. RooK Web-/API-Backend

### Aufgabe

Das RooK Backend ist die zentrale Control Plane.

Es übernimmt:

* Team-Login,
* Verwaltung aktiver Support-Sitzungen,
* Aushandeln und Verwalten von PIN-Codes,
* Zuordnung von PIN zu aktiver Konsolen-Sitzung,
* Ausgabe kurzlebiger Terminal-Berechtigungen,
* Statusverwaltung und Audit-Informationen.

### Technologie

* **Drupal**
* **PHP**
* **React** mit **TypeScript** fuer browserseitige Oberflaechen

### Rolle von Drupal

Drupal stellt bereit:

* Benutzer- und Rechteverwaltung für das RooK-Team,
* Admin-Oberfläche,
* Datenmodell für Support-Sitzungen,
* REST-API für die Kommunikation mit Konsole, Frontend und Gateway.

### Identifikation der Konsole

Eine separate dauerhafte Geräteidentität wird im Konzept **nicht** vorgesehen.

Die Zuordnung erfolgt implizit über die aktive Support-Sitzung:

* die Konsole verbindet sich mit dem Server,
* der Server handelt mit dieser konkreten Verbindung einen PIN aus,
* der Server kennt dabei die IP-Adresse bzw. die laufende VPN-Sitzung,
* der vom Nutzer angezeigte PIN kann dadurch eindeutig der aktiven Konsole zugeordnet werden.

---

## 5. Browser-Terminal-Gateway

### Aufgabe

Das Terminal-Gateway stellt dem RooK-Team eine interaktive Shell im Browser bereit.

Es übernimmt:

* Annahme der Browser-Verbindung,
* Validierung einer vom Backend ausgestellten Terminal-Berechtigung,
* Aufbau der eigentlichen Terminal-Sitzung zur Konsole,
* Weiterleitung des Datenstroms zwischen Browser und Konsole.

### Technologie

* separater Dienst außerhalb von Drupal
* Browser-Terminal mit **React**
* Terminal-Komponente **xterm.js**

### Rolle im Gesamtsystem

Das Gateway baut die eigentliche Verbindung zur Konsole serverseitig auf.

Der Browser kennt die Konsole nicht direkt und verbindet sich nicht selbst zur Zielkonsole.

---

## Open-Source-Komponenten

Folgende Open-Source-Komponenten werden direkt genutzt:

### Auf der Konsole

* **SDL2** – Rendering, Eingabe, Gamepad-Unterstützung
* **NetworkManager / nmcli** – WLAN-Verwaltung
* **OpenVPN Community Edition** – VPN-Verbindung
* **OpenSSH** oder äquivalenter lokaler SSH-Dienst – Shell-Zugang für die Support-Sitzung

### Auf dem Server

* **Drupal** – Benutzerverwaltung, Rollen, Admin, REST/API
* **React** – Browser-Oberflächen
* **xterm.js** – Terminal im Browser
* **OpenVPN Community Edition** – VPN-Server

---

## Lokale Schnittstelle: RooK UI ↔ RooK Agent

### Ziel

Die UI kommuniziert lokal mit dem Agent.

### Transport

* **Unix Domain Socket**

### Datenformat

* **JSON**

### Kommunikationsmuster

* dauerhafte lokale Socket-Verbindung
* **Request/Response** für Benutzeraktionen
* **asynchrone Events** für Zustandsänderungen

### Socket-Ermittlung durch die UI

Die UI darf den lokalen Socket nicht über Heuristiken oder Dateisystem-Scans suchen.

Stattdessen gilt für den Agent im paketierten Betrieb:

1. Der systemd-Dienst `rook-agent.service` liest seine Laufzeitkonfiguration aus `/etc/default/rook-agent`.
2. Die UI liest aus derselben Datei den Wert von `ROOK_AGENT_SOCKET_PATH`.
3. Genau dieser Wert ist der verbindliche Pfad des Unix Domain Sockets, auf dem der Agent auf lokale UI-Verbindungen wartet.

Damit ist `/etc/default/rook-agent` im paketierten Zielsystem die gemeinsame Quelle der Wahrheit für die Socket-Ermittlung zwischen Agent und UI.

Falls `ROOK_AGENT_SOCKET_PATH` dort nicht gesetzt ist, gilt im Debian-Paket standardmäßig:

* `/run/rook-agent/agent.sock`

Für ungepackte Entwicklungsstarts ohne systemd-Umgebung gilt weiterhin der pro Benutzer aufgelöste Defaultpfad unter dem User-Config-Verzeichnis:

* `rook-agent/agent.sock` relativ zu `os.UserConfigDir()`
* typischerweise also `~/.config/rook-agent/agent.sock` bzw. `$XDG_CONFIG_HOME/rook-agent/agent.sock`

### Agent-Konfigurationsdatei im paketierten Betrieb

**Pfad:** `/etc/default/rook-agent`

**Format:** zeilenorientierte Environment-Datei im Stil von `EnvironmentFile` unter systemd.

Regeln:

* eine Zuweisung pro Zeile im Format `NAME=WERT`
* Kommentarzeilen beginnen mit `#`
* die Datei ist keine JSON-, YAML- oder TOML-Datei
* Leerzeilen sind erlaubt

Beispiel:

```ini
# RooK agent packaged runtime configuration.
# Adjust the backend URL for the target environment before enabling the service.

ROOK_AGENT_BACKEND_URL=http://localhost:8080
ROOK_AGENT_LOG_LEVEL=info
ROOK_AGENT_STATE_PATH=/var/lib/rook-agent/session.json
ROOK_AGENT_SOCKET_PATH=/run/rook-agent/agent.sock
# ROOK_AGENT_CONSOLE_ID=
```

### Bedeutung aller Parameter in `/etc/default/rook-agent`

| Parameter | Bedeutung |
| --- | --- |
| `ROOK_AGENT_BACKEND_URL` | Basis-URL des RooK-Backends für Session-Start, Status, Heartbeat und Session-Ende. |
| `ROOK_AGENT_LOG_LEVEL` | Log-Level des Agents, aktuell `debug`, `info`, `warn` oder `error`. |
| `ROOK_AGENT_STATE_PATH` | Pfad zur lokal persistierten Session-State-Datei, aus der der Agent aktive Support-Sitzungen wiederaufnehmen kann. |
| `ROOK_AGENT_SOCKET_PATH` | Pfad des lokalen Unix Domain Sockets für die Kommunikation zwischen UI und Agent. Dieser Wert ist für die UI maßgeblich zur Socket-Ermittlung. |
| `ROOK_AGENT_CONSOLE_ID` | Stabile Kennung der Konsole für die Backend-Kommunikation. Der Parameter ist optional und kann auskommentiert oder leer bleiben. |

Die Datei wird durch den systemd-Dienst vor dem Start des Agents eingelesen. Änderungen an `ROOK_AGENT_SOCKET_PATH` wirken daher sowohl auf den Agent als auch auf jeden UI-Client, der den Socket gemäß dieser Spezifikation über `/etc/default/rook-agent` auflöst.

### Beispielhafte Befehle

* `GetStatus`
* `ScanWifi`
* `ConnectWifi`
* `DisconnectWifi`
* `StartSupport`
* `StopSupport`
* `GetPin`

### Beispielhafte Events

* `WifiScanCompleted`
* `WifiConnectionStateChanged`
* `VpnStateChanged`
* `SupportStateChanged`
* `PinAssigned`
* `PinExpired`
* `ErrorRaised`

### Verantwortungsgrenze

* Die UI rendert Screens und verarbeitet Eingaben.
* Der Agent besitzt die Zustandslogik.

---

## Zentrale Schnittstelle: RooK Agent ↔ RooK Backend

### Ziel

Der Agent meldet dem zentralen Backend den Zustand der laufenden Support-Sitzung.

### Transport

* HTTPS / REST

### Aufgaben dieser Schnittstelle

* Support-Sitzung registrieren
* Zustand melden
* PIN abrufen
* Heartbeats senden
* Session beenden

### Typische Operationen

* Support-Session starten
* Session-Status abrufen
* Session-Lebenszeichen senden
* Session schließen

### Lifecycle-Regel fuer laufende Support-Sitzungen

Fuer den fachlichen Session-Lifecycle gilt:

* Die Support-Session bleibt offen, solange der Agent gueltige Heartbeats innerhalb der vorgesehenen Grace Period liefert.
* Eine offene Support-Session braucht nicht dauerhaft einen aktiv verbundenen Service-Mitarbeiter.
* Das Ende einer Browser- oder Mitarbeiteraktivitaet beendet daher nicht automatisch die uebergeordnete Support-Session.
* Die Support-Session wird erst beendet, wenn:
  * sie manuell geschlossen wird,
  * der Agent-Reboot den Support-Zustand beendet,
  * oder die Heartbeats des Agenten ueber die Grace Period hinaus ausbleiben.

---

## Zentrale Schnittstelle: Web-Frontend ↔ RooK Backend

### Ziel

Das RooK-Team bedient die Fernwartung über das Web-Frontend.

### Transport

* HTTPS / REST

### Aufgaben dieser Schnittstelle

* Benutzer-Login
* PIN-Eingabe
* Session-Auswahl
* Terminal-Zugang anfordern
* Session-Status anzeigen

---

## Realtime-Schnittstelle: Browser ↔ Terminal-Gateway

### Ziel

Das Browser-Terminal kommuniziert interaktiv mit dem Gateway.

### Transport

* WebSocket

### Aufgabe

* Weiterleitung des Terminal-Datenstroms zwischen Browser und Gateway

### Lifecycle-Regel fuer Browser-Terminals

Fuer die Browser-Terminal-Sitzung gilt:

* Fehlende Tastatur- oder Resize-Aktivitaet allein beendet die Browser-Terminal-Sitzung nicht.
* Browser, Gateway und die dazwischenliegende Infrastruktur muessen den WebSocket-Pfad so behandeln, dass ruhende, aber weiterhin offene Terminal-Sitzungen nicht allein durch Inaktivitaet des Nutzers abgebrochen werden.
* Keepalive- oder Ping-Mechanismen duerfen verwendet werden, um transportbedingte Idle-Timeouts in Browser-, Proxy- oder Gateway-Pfaden zu vermeiden.
* Wenn die Browser-Verbindung tatsaechlich verloren geht, endet die Browser-Terminal-Sitzung; die uebergeordnete Support-Sitzung kann dabei dennoch offen bleiben, solange der Agent weiter Heartbeats liefert.

---

## Interne Schnittstelle: Terminal-Gateway ↔ Konsole

### Ziel

Das Gateway stellt die eigentliche Shell-Verbindung zur Konsole her.

### Transport

* SSH über das OpenVPN-Netz

### Aufgabe

* Aufbau der Shell-Sitzung zur richtigen Konsole
* Weiterleitung der Terminaldaten

---

## Ablauf einer Support-Sitzung

### 1. Support lokal starten

Der Nutzer öffnet auf der Konsole die RooK UI und startet den Support-Modus.

### 2. Temporäres WLAN einrichten

Die RooK UI zeigt verfügbare WLANs an.

Der Nutzer wählt ein Netz aus und gibt das Passwort per Gamepad über ein On-Screen-Keyboard ein.

Der RooK Agent baut die WLAN-Verbindung auf.

### 3. VPN-Verbindung aufbauen

Der RooK Agent startet OpenVPN und verbindet die Konsole mit der zentralen RooK-Infrastruktur.

### 4. PIN aushandeln

Der RooK Agent startet beim Backend eine Support-Sitzung.

Das Backend erzeugt einen kurzlebigen 4-stelligen PIN und ordnet ihn der aktiven Konsolen-Sitzung zu.

Die Konsole zeigt diesen PIN an.

### 5. RooK-Team koppelt sich auf die Konsole

Ein RooK-Mitarbeiter meldet sich im Web-Frontend an und gibt den PIN ein.

Das Backend findet die zugehörige aktive Konsolen-Sitzung und erstellt eine kurzlebige Terminal-Berechtigung.

### 6. Browser-Terminal öffnen

Das Web-Frontend öffnet ein Terminal im Browser.

Das Terminal-Gateway validiert die Berechtigung und baut über OpenVPN eine SSH-Verbindung zur zugehörigen Konsole auf.

### 7. Support durchführen

Der RooK-Mitarbeiter arbeitet im Browser-Terminal auf der Konsole.

Wenn das Browser-Terminal spaeter wieder geschlossen wird, kann die uebergeordnete Support-Sitzung dennoch offen bleiben, solange der Agent die Sitzung weiter per Heartbeat am Backend haelt.

### 8. Support beenden

Nach manuellem Ende, Timeout oder Reboot werden:

* die Terminal-Sitzung beendet,
* der PIN ungültig,
* OpenVPN gestoppt,
* die temporäre WLAN-Verbindung gelöscht,
* der Support-Zustand bereinigt.

---

## Temporäre WLAN-Verbindung

### Ziel

Das WLAN soll nur für den Support-Fall bestehen.

### Umsetzung

* WLAN wird durch den Agent über **NetworkManager / nmcli** angelegt und aktiviert.
* Die Verbindung ist als temporäre RooK-Support-Verbindung zu behandeln.
* Nach Sitzungsende wird sie entfernt.
* Beim Boot läuft zusätzlich ein Cleanup, der verbliebene RooK-Support-Verbindungen beseitigt.

---

## Sicherheitsmodell

### Lokale Aktivierung

Fernwartung ist nur möglich, wenn sie lokal auf der Konsole aktiviert wurde.

### PIN-Modell

Der 4-stellige PIN dient als kurzlebiger Kopplungscode zwischen Nutzer und RooK-Team.

### Team-Zugang

Das RooK-Team meldet sich regulär am Web-Frontend an.

### Serverseitige Durchsetzung

Die eigentliche Shell-Verbindung wird nur serverseitig hergestellt.

Der Browser erhält keinen direkten Zugriff auf die Konsole.

### Sitzungslimits

* PIN ist kurzlebig
* Session kann bei ausbleibenden Agent-Heartbeats ablaufen
* fehlende Browser-Aktivitaet allein beendet die uebergeordnete Support-Session nicht
* Reboot beendet den Support-Zustand
* Cleanup entfernt temporäre Zugangsdaten und Netzkonfiguration

---

## Komponentenübersicht mit Verantwortlichkeiten

### RooK UI

* Benutzerführung auf der Konsole
* WLAN-Auswahl und Passwort-Eingabe
* Statusanzeige
* PIN-Anzeige

### RooK Agent

* Zustandsmaschine des Support-Modus
* WLAN-Steuerung
* OpenVPN-Steuerung
* Kommunikation mit Backend
* Cleanup

### OpenVPN

* Netzverbindung zwischen Konsole und Server

### RooK Backend

* Benutzerverwaltung
* Support-Sitzungen
* PIN-Verwaltung
* Terminal-Berechtigungen
* Status- und Audit-Daten

### Terminal-Gateway

* Browser-Terminal anbinden
* Terminal-Berechtigungen prüfen
* SSH zur Konsole aufbauen

---

## Build-, Paket- und Repository-Strategie

### Ziel

Die auf der Konsole laufenden Komponenten sollen als **Debian-Pakete** ausgeliefert werden.

Die Paketierung erfolgt mit **nfpm**.

Dabei muss die Struktur so gewählt werden, dass:

* API-Verträge sauber versioniert werden,
* Konsole und Server unabhängig entwickelbar bleiben,
* Releases kontrolliert gebaut werden können,
* gemeinsame Spezifikationen nicht in einzelnen Implementierungen versteckt sind.

### Grundsatzentscheidung

Es wird **nicht** empfohlen, die Gesamtcodebasis über mehrere langlebige Branches innerhalb eines einzigen Repositories zu organisieren.

Stattdessen wird empfohlen:

* **mehrere Repositories mit klaren Verantwortlichkeiten** zu verwenden,
* pro Repository einen normalen Branch-Workflow zu nutzen,
* die API-Spezifikation als eigenes, separates Zuhause zu führen.

### Warum keine Architektur über Branches

Langlebige Branches pro Komponente oder pro Verantwortung führen typischerweise zu Problemen bei:

* Nachvollziehbarkeit,
* Review,
* Release-Management,
* CI/CD,
* Versionierung gemeinsamer Schnittstellen.

Branches sind für Entwicklungsfluss gedacht, nicht als dauerhafte Produktstruktur.

Eine API-Spezifikation in einem eigenen dauerhaften Branch eines Sammel-Repositories wäre unnötig schwer handhabbar.

---

## Repository-Aufteilung

Die Servicechannel-Plattform wird über mehrere Repositories mit klaren Verantwortlichkeiten organisiert.

### Empfohlene Repository-Namen

* `rook-servicechannel-spec`
* `rook-servicechannel-console-ui`
* `rook-servicechannel-console-agent`
* `rook-servicechannel-openvpn`
* `rook-servicechannel-backend`
* `rook-servicechannel-gateway`

## Zweck des Spec-Repositories

Das Repository `rook-servicechannel-spec` ist das verbindliche Zuhause für:

* Schnittstellenspezifikationen,
* Nachrichtenformate,
* Zustandsmodelle,
* Fehlercodes,
* Versionierungsregeln,
* begleitende Architektur- und Konzeptdokumentation.

### Einordnung dieses Dokuments

Das vorliegende Dokument gehört in das Repository **`rook-servicechannel-spec`**.

Dort ist es als **Architektur- und Konzeptdokument** einzuordnen, nicht als eigentliche Vertragsspezifikation.

Die eigentlichen verbindlichen Spezifikationsartefakte liegen daneben in strukturierten Dateien wie:

* OpenAPI-Spezifikationen,
* JSON-Schemas,
* Ereignis- und Zustandsdefinitionen.

### Empfohlene Verzeichnisstruktur im Spec-Repository

```text
rook-servicechannel-spec/
  docs/
    architecture/
      servicechannel-concept.md
  openapi/
  schemas/
    local-ipc/
    backend/
    gateway/
  models/
    states/
    events/
  changelog/
```

## Empfohlene Repository-Aufteilung

### 1. `rook-servicechannel-console-ui`

**Inhalt:**

* C++-Code der SDL2-basierten RooK UI
* Assets der lokalen Support-Oberfläche
* Build-Skripte
* Paketdefinition für das UI-Debian-Paket

**Ergebnis:**

* Debian-Paket für die lokale RooK-Oberfläche

### 2. `rook-servicechannel-console-agent`

**Inhalt:**

* Go-Code des RooK Agents
* systemd-Units
* Integrationslogik für NetworkManager / nmcli
* Integrationslogik für OpenVPN
* lokale Unix-Socket-API
* Paketdefinition für das Agent-Debian-Paket

**Ergebnis:**

* Debian-Paket für den Agent

### 3. `rook-servicechannel-spec`

**Inhalt:**

* gesamte Schnittstellenspezifikation des Systems
* lokale Socket-Nachrichten zwischen UI und Agent
* REST-API zwischen Agent und Backend
* REST-API zwischen Web-Frontend und Backend
* Terminal-Grant-/Gateway-Schnittstellen
* Zustandsmodelle, Fehlercodes, Ereignisse, Versionierung

**Wichtige Regel:**
Dieses Repository ist das **verbindliche Zuhause der gesamten API-Spezifikation**.

Hier werden Nachrichtenformate, Endpunkte, Fehlercodes und Zustandsübergänge festgezogen.

Implementierungen in UI, Agent, Backend und Gateway richten sich nach dieser Spezifikation.

### 4. `rook-servicechannel-openvpn`

**Inhalt:**

* OpenVPN-Server-Konfigurationen
* Konsolen- bzw. Client-Konfigurationen fuer die Cartridge-Seite
* Skripte und Debian-Paketdefinitionen fuer die Auslieferung dieser OpenVPN-Artefakte
* betriebsnahe Hilfsdateien fuer Zertifikate, Profile und Rollout der VPN-Komponente

**Ergebnis:**

* installierbare OpenVPN-bezogene Debian-Pakete und gepflegte Konfigurationsartefakte ausserhalb des Spec-Repositories

### 5. `rook-servicechannel-backend`

**Inhalt:**

* Drupal-Konfiguration, Custom Modules und API-Endpunkte
* PHP-Code für Session-, PIN- und Berechtigungslogik
* React-Frontend für das RooK-Team
* Datenmodell und Admin-Funktionalität

### 6. `rook-servicechannel-gateway`

**Inhalt:**

* separater Gateway-Dienst für Browser-Terminal und SSH-Bridging
* Validierung von Terminal-Berechtigungen
* WebSocket-Handling
* Integration mit xterm.js-Frontend und Backend

### Optional 7. `rook-servicechannel-deploy`

Optional kann ein zusätzliches Repository sinnvoll sein für:

* Build-Orchestrierung
* Release-Manifeste
* Paketfeeds / Repository-Metadaten
* Installations- und Update-Playbooks

Dieses Repository ist nur dann sinnvoll, wenn Packaging, Release und Deployment zentral gebündelt werden sollen.

---

## Warum die API-Spezifikation ein eigenes Repository bekommen sollte

Die API-Spezifikation ist keine Nebendatei einer einzelnen Implementierung, sondern ein produktweiter Vertrag.

Ein eigenes Repository dafür hat mehrere Vorteile:

* klare Ownership,
* saubere Reviews von Schnittstellenänderungen,
* unabhängige Versionierung,
* bessere Nachvollziehbarkeit von Breaking Changes,
* keine implizite Dominanz einer einzelnen Implementierung.

### Inhalt der API-Spezifikation

Das API-Repository sollte mindestens enthalten:

* Beschreibung aller Komponenten und ihrer Kommunikationsbeziehungen
* JSON-Schemas für lokale Socket-Nachrichten
* OpenAPI-Spezifikation für HTTP/REST-Schnittstellen
* WebSocket-/Terminal-Grant-Protokolle
* Fehlercodes
* Event-Typen
* Zustandsmodelle
* Versionierungsregeln
* Migrationshinweise bei inkompatiblen Änderungen

### Empfehlte Artefakte

* `openapi.yaml` für HTTP-Schnittstellen
* JSON-Schema-Dateien für lokale Unix-Socket-Nachrichten
* Markdown-Dokumentation für Ablaufmodelle und Zustandsmaschinen

---

## Branch-Strategie innerhalb der Repositories

Für jedes Repository wird ein normaler Branch-Workflow empfohlen:

* `main` als Integrations- und Release-Hauptzweig
* kurzlebige Feature-Branches
* Pull-Request-basierte Änderungen
* Version-Tags für Releases

### Nicht empfohlen

* ein Repository mit langlebigen Branches wie `ui`, `agent`, `backend`, `api`
* ein API-Branch als dauerhaftes Zuhause der Spezifikation

Das erschwert CI, Releases und Ownership unnötig.

---

## Debian-Paketierung mit nfpm

### Paketierbare Komponenten auf der Konsole

Auf der Konsole sollten mindestens zwei Pakete entstehen:

#### Paket 1 – RooK UI

**Beispielname:** `rook-console-ui`

**Enthält:**

* SDL2-UI-Binary
* UI-Assets
* Startskripte oder Launcher-Definitionen
* fuer diese UI konkret:
  * das Binary
  * die Laufzeitressourcen unter `/usr/share/rook-console-ui/resources`
  * der oeffentliche Launcher `/usr/bin/rook-ui`

#### Paket 2 – RooK Agent

**Beispielname:** `rook-console-agent`

**Enthält:**

* Agent-Binary
* systemd-Service-Dateien
* Standardkonfiguration
* ggf. Hilfsskripte für Cleanup oder Startlogik

### Mögliche weitere Pakete

#### Paket 3 – RooK Integration

**Beispielname:** `rook-console-integration`

**Enthält optional:**

* EmulationStation-Integration
* Menüeinträge
* Wrapper-Skripte
* gemeinsame Konfigurationsdateien

Fuer den aktuellen RooK-UI-Zielpfad ist dieses Integrationspaket jetzt konkretisiert auf:

* die systemweite EmulationStation-Integration des Zielimages
* ein paketiertes Startskript `Service.sh`
* idempotente Installationslogik, die ein fehlendes System `RooK` in der systemweiten EmulationStation-Konfiguration anlegt
* ein konservatives RooK-Theme-Snippet fuer die Systemgrafik, das standardmaessig im Theme `carbon-2021` das paketierte UI-SVG verwendet
* eine konservative Update-Strategie:
  * vorhandene RooK-/Service-Eintraege werden nicht automatisch normalisiert oder ueberschrieben
  * von uns zuvor ausgelieferte RooK-Theme-Dateien duerfen bei Paket-Upgrades auf den aktuellen verwalteten Stand gezogen werden
  * fremde oder manuell angepasste RooK-Theme-Dateien werden nicht automatisch ueberschrieben
  * fehlende Eintraege werden ergaenzt

### nfpm-Rolle

`nfpm` wird pro paketierbarer Komponente verwendet, um reproduzierbare `.deb`-Pakete zu erzeugen.

Empfohlen ist:

* jede paketierbare Komponente besitzt ihre eigene `nfpm`-Konfiguration im jeweiligen Repository,
* Versionen werden aus dem Build-/Release-Prozess injiziert,
* Abhängigkeiten werden explizit in den Debian-Metadaten gepflegt.

### Abhängigkeitsmodell

Beispielhaft:

* `rook-console-ui` hängt von `rook-console-agent` **nicht zwingend** direkt ab, wenn beide durch ein Integrationspaket gemeinsam installiert werden
* alternativ kann `rook-console-ui` den Agent als Abhängigkeit deklarieren
* `rook-console-agent` deklariert Systemabhängigkeiten wie OpenVPN, NetworkManager oder OpenSSH, sofern diese nicht Teil eines Basisimages sind

---

## Release-Strategie

### API zuerst

Schnittstellenänderungen starten im Repository `rook-servicechannel-spec`.

Dort werden festgelegt:

* neue Nachrichten,
* neue Felder,
* neue Fehlercodes,
* Breaking Changes,
* Versionssprünge.

### Danach Implementierungen

Erst nach Festziehen der Spezifikation werden abhängige Implementierungen in:

* UI,
* Agent,
* Backend,
* Gateway

angepasst.

### Vorteil

Damit entsteht ein sauberer Vertragsfluss:

1. Spezifikation ändern
2. Versionieren
3. Implementierungen anpassen
4. Pakete bauen
5. Releases erzeugen

---

## Empfohlene Minimalstruktur

Für den Start ist folgende Aufteilung am sinnvollsten:

* `rook-servicechannel-spec`
* `rook-servicechannel-console-agent`
* `rook-servicechannel-console-ui`
* `rook-servicechannel-backend`
* `rook-servicechannel-gateway`

Das ist klar genug für Ownership und klein genug, um nicht in Repo-Fragmentierung zu kippen.

---

## Ergebnis

Die RooK-Fernwartung besteht aus einer klar getrennten Architektur:

* **C++/SDL2** für die lokale Konsolenoberfläche
* **Go** für den lokalen Support-Agent
* **OpenVPN Community Edition** als Transportkanal
* **Drupal/PHP + React** als zentrale Web- und API-Plattform
* **xterm.js + separates Gateway** für das Browser-Terminal
* **Unix Domain Sockets + JSON** für die lokale IPC
* **nfpm + Debian-Pakete** für die auf der Konsole laufenden Komponenten
* **`rook-servicechannel-spec`** als verbindliches Zuhause aller Nachrichten, Schnittstellen und begleitenden Architektur-Dokumente

Damit ist festgelegt,

* welche Komponenten existieren,
* welche Aufgabe jede Komponente hat,
* wie die Komponenten miteinander sprechen,
* welche Open-Source-Bausteine direkt eingesetzt werden,
* wie Codebasis, Schnittstellen und Paketierung organisatorisch aufgeteilt werden.
