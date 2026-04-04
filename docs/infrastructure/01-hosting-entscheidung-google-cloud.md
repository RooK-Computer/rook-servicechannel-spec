# Hosting-Entscheidung - Google Cloud fuer die serverseitige Umgebung

Status: Festgehalten

## Zweck

Dieses Dokument haelt die aktuelle Hosting-Entscheidung fuer die serverseitigen Komponenten des RooK Service Channel fest.

Es dokumentiert insbesondere:

* die Entscheidung zugunsten von Google Cloud,
* die fachliche und betriebliche Begruendung dafuer,
* die Abgrenzung gegen andere gepruefte Anbieter,
* die bereits geklaerten API-Moeglichkeiten zum bedarfsgesteuerten Starten und Stoppen der Umgebung.

## Beschluss

Fuer die serverseitige Umgebung soll Google Cloud als bevorzugte Hosting-Plattform verwendet werden.

Die Plattformentscheidung ist vor allem durch den Wunsch motiviert, eine frei konfigurierbare VM-Umgebung nur bei Bedarf zu betreiben, ohne fuer reine Existenz einer ausgeschalteten Instanz dieselben Laufzeitkosten wie im aktiven Betrieb zu tragen.

## Ausgangslage und Anforderung

Die serverseitige RooK-Umgebung muss nach aktuellem Stand nicht rund um die Uhr verfuegbar sein.

Gesucht war daher eine Infrastruktur mit folgenden Eigenschaften:

* frei konfigurierbare VM statt stark eingeschraenktem Spezialprodukt,
* moeglichst kostenguenstiger Betrieb bei seltener Nutzung,
* keine fortlaufenden Compute-Kosten nur dafuer, dass eine ausgeschaltete Maschine existiert,
* spaetere Moeglichkeit, ein teaminternes UI zum kontrollierten Starten und Stoppen der Umgebung zu bauen,
* insgesamt geringere Alltagskomplexitaet als bei AWS.

## Begruendung fuer Google Cloud

### 1. Passendes Kostenmodell fuer selten genutzte VMs

Google Compute Engine erlaubt das Stoppen einer VM, wobei die Compute-Kosten entfallen und nur weiter gebuchte Ressourcen wie Persistenzspeicher oder statische IP-Adressen verbleiben.

Damit passt das Modell grundsaetzlich gut zu einer Umgebung, die nur bei Bedarf gestartet werden soll.

### 2. Geringere wahrgenommene Plattformkomplexitaet als AWS

AWS wurde zwar als technisch gut geeignet fuer Start-/Stop-Betrieb bewertet, fuer den vorliegenden Anwendungsfall aber als zu kleinteilig wahrgenommen.

Google Cloud erscheint fuer eine einzelne, gezielt gesteuerte VM-Umgebung als das einfacher zu durchschauende Betriebsmodell.

### 3. Geringere Stolpergefahr als bei Azure fuer den Stop-Zustand

Azure waere ebenfalls grundsaetzlich nutzbar, hat aber fuer dieses Vorhaben eine unguenstigere Bedienlogik:

* `Stopped` kann dort weiterhin kostenpflichtig sein,
* erst `Stopped (Deallocated)` beendet die Compute-Abrechnung.

Google Cloud ist fuer diesen konkreten Fall leichter mental zu greifen: VM stoppen, Compute-Kosten enden, Persistenzressourcen bleiben erhalten.

## Einordnung der geprueften Alternativen

### Hetzner Cloud

Hetzner Cloud wurde fuer diesen Anwendungsfall verworfen, weil dort weiterhin fuer Server abgerechnet wird, solange sie existieren, auch wenn sie ausgeschaltet sind.

Damit ist Hetzner fuer ein "nur bei Bedarf einschalten"-Modell deutlich unpassender.

### AWS

AWS EC2 wurde als technisch geeignete Option eingeordnet, weil gestoppte Instanzen keine Compute-Kosten verursachen.

Gegen AWS sprach im vorliegenden Fall aber nicht die technische Eignung, sondern die wahrgenommene betriebliche und begriffliche Komplexitaet fuer den Alltag.

### Azure

Azure bleibt eine grundsaetzlich moegliche Alternative, wurde aber gegenueber Google Cloud als weniger angenehm fuer dieses Szenario bewertet.

Der Hauptgrund ist die zusaetzliche Stolperfalle rund um die Abgrenzung zwischen `Stopped` und `Stopped (Deallocated)`.

## API-Faehigkeit fuer ein teaminternes Betriebs-UI

Google Cloud bietet eine offizielle Compute Engine API, mit der ein internes Team-UI die Umgebung bei Bedarf steuern kann.

Fuer die hier relevante VM-Steuerung sind insbesondere folgende Operationen entscheidend:

1. Instanz starten
2. Instanz stoppen
3. Instanzstatus abfragen

Die Compute-API eignet sich damit ausdruecklich fuer einen Ablauf wie:

* Team oeffnet internes UI,
* UI veranlasst "Umgebung starten",
* Backend ruft Google Compute Engine API auf,
* UI zeigt Zwischenstatus an,
* nach Abschluss steht die Umgebung fuer Support oder Wartung bereit.

## Relevante API-Operationen

### Instanz starten

`POST /compute/v1/projects/{project}/zones/{zone}/instances/{instance}/start`

### Instanz stoppen

`POST /compute/v1/projects/{project}/zones/{zone}/instances/{instance}/stop`

### Instanzstatus lesen

`GET /compute/v1/projects/{project}/zones/{zone}/instances/{instance}`

Die Start-/Stop-Aufrufe liefern asynchrone Operationsobjekte. Ein internes Betriebs-UI sollte deshalb den Vorgang nicht nur absenden, sondern den Fortschritt und anschliessend den Zielstatus der Instanz sichtbar machen.

## Empfohlenes Integrationsmuster fuer das Projekt

Die Cloud-API soll nicht direkt aus einem Browser-Frontend aufgerufen werden.

Empfohlen ist stattdessen folgendes Muster:

* internes Team-UI,
* projektinternes Backend als vermittelnde Schicht,
* Google Compute Engine API als nachgelagerte Steuerungsschnittstelle.

Damit bleiben Authentisierung, Autorisierung und Auditierbarkeit in einer serverseitig kontrollierten Komponente gebuendelt.

## Authentisierung und Rechtezuschnitt

Google Cloud unterstuetzt den programmgesteuerten Zugriff per REST, Client Libraries und CLI.

Fuer das geplante interne UI ist ein serverseitiger Zugriff ueber einen Service Account der naheliegende Weg.

Dabei soll der Rechtezuschnitt moeglichst eng gehalten werden:

* nur fuer die konkret zu steuernden Instanzen,
* nur fuer die benoetigten Operationen,
* keine unnoetigen Projekt-Adminrechte.

## Betriebsfolgen fuer die weitere Spezifikation

Aus dieser Entscheidung folgen fuer die weitere Ausarbeitung mindestens diese Punkte:

1. Die serverseitige Zielumgebung darf als bei Bedarf start- und stoppbare Google-Cloud-VM-Landschaft gedacht werden.
2. Ein spaeteres Team-Werkzeug zum kontrollierten Ein- und Ausschalten der Umgebung ist technisch vorgesehen und realistisch.
3. Persistente Kosten fuer Storage und gegebenenfalls reservierte Netzressourcen muessen in spaeteren Betriebsdokumenten gesondert betrachtet werden.
4. Die genaue Aufteilung der serverseitigen Komponenten auf einzelne Instanzen oder Dienste ist mit diesem Dokument noch nicht festgelegt.

## Noch nicht festgelegt

Dieses Dokument trifft bewusst noch keine Detailentscheidung zu folgenden Punkten:

* ob Backend, Gateway und OpenVPN auf einer gemeinsamen oder auf getrennten Instanzen laufen,
* welche Groesse die erste produktive oder vorproduktive VM erhaelt,
* ob spaeter zusaetzlich Managed-Dienste von Google Cloud genutzt werden,
* ob das Team-UI nur Start/Stop oder auch Status, Logs und einfache Schutzmechanismen enthalten soll.

Diese Punkte sollen erst dann nachgezogen werden, wenn die serverseitige Umsetzungsplanung weiter konkretisiert wird.
