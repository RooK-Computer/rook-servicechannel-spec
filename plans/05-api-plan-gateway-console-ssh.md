# Spezifikationsplan 05 – Terminal-Gateway ↔ Konsole (SSH über VPN)

Status: Abgeschlossen

Statushinweis: `Abgeschlossen` bedeutet, dass die aus diesem Plan abgeleiteten SSH-/Konsolen-Vertragsartefakte fuer den aktuellen Scope umgesetzt und nachgezogen sind.

## Ziel der Spezifikation

Die serverseitige Shell-Verbindung vom Terminal-Gateway zur Konsole so spezifizieren, dass Verbindungsaufbau, Zielauswahl, Authentisierung, Sitzungsstart und Beendigung eindeutig beschrieben sind.

## Bezug zum Konzept

Das Konzept beschreibt diese Schnittstelle als **SSH über das OpenVPN-Netz**. Das Gateway baut die eigentliche Shell-Verbindung zur passenden Konsole serverseitig auf.

## Zu spezifizierender Scope

* Zielidentifikation der Konsole innerhalb einer aktiven Support-Sitzung
* SSH-Verbindungsaufbau über das VPN
* Authentisierung des Gateway gegenüber der Konsole
* Shell-Start, PTY-Parameter und Sitzungsbeendigung
* Sicherheits- und Cleanup-Regeln auf der Konsole

## Erwartete Artefakte

* OpenAPI-Entwurf oder dokumentierte Klärung, welcher Teil dieser nicht-HTTP-Schnittstelle in OpenAPI beschrieben werden soll
* ergänzende Protokoll- und Schema-Dokumentation unter `schemas/gateway/` oder `schemas/backend/`
* Zustandsbeschreibung für die Terminal-Verbindungsphasen unter `models/states/`

## Bereits angelegte Artefakte

* `openapi/05-gateway-console-ssh.openapi.yaml`
* `schemas/gateway/05-gateway-console-ssh-catalog.md`
* `models/states/05-gateway-console-session-state.md`
* `models/errors/05-gateway-console-error-strategy.md`

Diese Artefakte enthalten die aus dem Konzept, der Recherche und den bisherigen Klaerungen belastbar ableitbaren Inhalte. Verbleibende offene Punkte sind explizit markiert.

## Arbeitspakete

1. Regeln zur Auswahl der Zielkonsole aus Session- und VPN-Kontext beschreiben.
2. SSH-Authentisierungsmodell und Schlüsselverwaltung klären.
3. Shell-/PTY-Anforderungen und Terminalparameter definieren.
4. Fehlerfälle bei Verbindungsaufbau, Authentisierung und Sitzungsabbruch strukturieren.
5. Cleanup-Anforderungen auf Konsole und Gateway dokumentieren.
6. Sicherheitsgrenzen zwischen Gateway, VPN und lokalem SSH-Dienst festhalten.

## Bereits aus dem Konzept erkennbare Elemente

* SSH läuft über das OpenVPN-Netz
* ein lokaler SSH-Dienst oder dedizierter Support-Zugang ist vorgesehen
* der Browser spricht nie direkt mit der Konsole
* Sitzungsende oder Reboot beendet den Support-Zustand

## Ehemals offene Punkte

* Die fuer den aktuellen Scope benoetigten Audit-Informationen sind im Vertragsstand dokumentiert.
* Die fachlichen Fehlercodes des aktuellen Scope sind im Vertragsstand gespiegelt.

## Aktueller Umsetzungsstand

* Die aus dem Konzept ableitbaren Verbindungsphasen und fachlichen Hauptressourcen wurden in erste Draft-Artefakte überführt.
* Zielkonsole, SSH-Sitzung und Fehlerstrategie sind als fachliche Bausteine dokumentiert.
* Zielidentifikation ueber Session-Metadaten und IP-Adresse, Gateway-Schluessel in `authorized_keys`, kein Pro-Sitzung-Account sowie die Dokumentationsform aus OpenAPI-Draft und begleitendem Markdown sind eingearbeitet.
* Der Zielaccount `pi`, die Ausklammerung von Schluessellaufzeit und Rotation aus der Spezifikation sowie minimale PTY-Regeln fuer regulaeres Terminalverhalten sind eingearbeitet.
* Zielaufloesung, SSH-Authentisierung, PTY-Regeln und Fehlerstrategie sind fuer den aktuellen Scope nachgezogen.

## Abschlussbegruendung

Dieser Plan ist fuer den aktuellen Scope abgeschlossen, weil Zielaufloesung, SSH-Sitzungsaufbau, Sicherheitsgrenzen und Fehlerfaelle in den Vertragsartefakten und den Gateway-/Agent-/OpenVPN-Statusdokumenten gespiegelt sind.

## Verbindliche Arbeitsregel

* Bei der Umsetzung dürfen **keine zusätzlichen Annahmen** getroffen werden.
* Fehlende oder mehrdeutige Details werden als **Rückfragen** dokumentiert und vor der Spezifikation geklärt.
* Antworten auf Rückfragen führen zu einer **Aktualisierung dieses Plans** inklusive Status, Scope, Entscheidungen und offener Punkte.

## Definition von "fertig"

Dieser Plan ist umgesetzt, wenn Zielauswahl, SSH-Authentisierung, Sitzungsparameter, Fehlerfälle, Sicherheitsanforderungen und Cleanup-Verhalten für Gateway ↔ Konsole abgestimmt dokumentiert sind.

## Naechste Schritte fuer Folge-Agenten

1. Diesen Plan nur bei spaeteren SSH-/Zielsystemaenderungen oder neuen Sicherheitsbefunden wieder oeffnen.
2. Neue Audit- oder Fehleranforderungen direkt in Plan und Vertragsartefakte zurueckspiegeln.
