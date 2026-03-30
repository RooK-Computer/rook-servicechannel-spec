# OpenAPI-Planübersicht

Status: Erstellt

## Zweck

Dieses Dokument bündelt die Spezifikationspläne für alle aktuell aus dem Konzept ableitbaren Schnittstellen im Projekt `rook-servicechannel-spec`.

Es dient als Einstiegspunkt für Folge-Agenten, falls der Kontext zwischendurch zurückgesetzt werden muss.

## Statuswerte

* `Erstellt` – Plan ist angelegt, Spezifikation noch nicht begonnen.
* `In Umsetzung` – Spezifikation wird aktiv ausgearbeitet.
* `Wartet auf Implementierungserkenntnisse` – Der Plan ist konzeptionell vorläufig ausgereizt. Weitere Schärfung erfolgt erst, wenn aus der Umsetzung neue belastbare Erkenntnisse vorliegen.
* `Abgeschlossen` – Plan ist umgesetzt und die zugehörige Spezifikation liegt in abgestimmter Form vor.

## Verbindliche Arbeitsregel für alle Folgearbeiten

* Es dürfen bei der Umsetzung **keine zusätzlichen Annahmen** getroffen werden.
* Wenn Informationen im Konzept fehlen oder mehrdeutig sind, müssen **Rückfragen** gestellt werden.
* Die Antworten auf Rückfragen müssen anschließend **in den betroffenen Plan eingearbeitet** werden.
* Jede relevante Klärung aktualisiert mindestens: Status, offene Fragen, Scope, Entscheidungen und nächste Schritte.

## Aktuell identifizierte Schnittstellen

1. `01-api-plan-ui-agent-local-ipc.md` – RooK UI ↔ RooK Agent (lokale IPC)
2. `02-api-plan-agent-backend-rest.md` – RooK Agent ↔ RooK Backend (REST)
3. `03-api-plan-web-backend-rest.md` – Web-Frontend ↔ RooK Backend (REST)
4. `04-api-plan-browser-gateway-websocket.md` – Browser ↔ Terminal-Gateway (WebSocket)
5. `05-api-plan-gateway-console-ssh.md` – Terminal-Gateway ↔ Konsole (SSH über VPN)
6. `06-api-plan-backend-gateway-terminal-grant.md` – RooK Backend ↔ Terminal-Gateway (Terminal-Grant / Validierung)

## Hinweise zur Abarbeitung

* Die REST-Schnittstellen können direkt als OpenAPI-Spezifikationen vorbereitet werden.
* Für nicht klassische HTTP-Schnittstellen ist vor der Umsetzung zu klären, **welcher Anteil verbindlich in OpenAPI beschrieben werden soll** und welche ergänzenden Artefakte zusätzlich in `schemas/` oder `models/` gepflegt werden.
* Reihenfolgeempfehlung für die spätere Umsetzung:
  1. Agent ↔ Backend
  2. Web-Frontend ↔ Backend
  3. Backend ↔ Gateway
  4. Browser ↔ Gateway
  5. UI ↔ Agent
  6. Gateway ↔ Konsole

## Minimale Prüfkriterien je Plan

* Schnittstellenzweck ist eindeutig beschrieben.
* Verantwortliche Systeme und Transport sind benannt.
* Benötigte Ressourcen / Nachrichten / Statusmodelle sind aufgelistet.
* Offene Fragen sind explizit dokumentiert.
* Die Regel "keine Annahmen, stattdessen Rückfragen" ist enthalten.
* Ein Folge-Agent kann die Umsetzung direkt aus dem Plan heraus beginnen.
