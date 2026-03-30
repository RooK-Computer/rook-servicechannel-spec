# Komponentenübergreifender Entwicklungsplan

Status: Erarbeitet

## Zweck

Dieses Dokument beschreibt die empfohlene Reihenfolge für die Umsetzung der Hauptkomponenten.

Ziel ist es, zuerst den fachlichen Kern des Systems zu stabilisieren und anschließend schrittweise die nachgelagerten Oberflächen- und Integrationsschichten darauf aufzubauen.

## Leitprinzip für die Reihenfolge

* Zuerst die Komponenten umsetzen, die den Support-Session-Lifecycle fachlich tragen.
* Danach die Komponenten ergänzen, die Terminal-Zugang und Shell-Transport ermöglichen.
* Die lokale UI zuletzt anbinden, weil sie auf den stabilen Zustands- und Integrationskern aufsetzen sollte.

## Empfohlene Reihenfolge

### Phase 0 – Technische Grundlage bereitstellen

#### OpenVPN-Infrastruktur

Die OpenVPN-Infrastruktur sollte sehr früh in einer minimal funktionsfähigen Form verfügbar sein.

Begründung:

* Agent und Gateway hängen technisch an der Erreichbarkeit über das VPN.
* Frühe Netzwerkpfade reduzieren späteres Debugging in mehreren Teams gleichzeitig.

### Phase 1 – Fachlichen Kern aufbauen

#### RooK Web-/API-Backend

Das Backend sollte als zentrale Control Plane früh begonnen werden.

Begründung:

* Hier liegen Support-Sitzungen, PIN-Zuordnung, Statusführung und Terminal-Grants.
* Ohne diesen Kern haben Agent und Gateway keinen belastbaren Gegenpart.

#### RooK Agent auf der Konsole

Der Agent sollte direkt parallel oder unmittelbar nach dem Backend-Kern aufgebaut werden.

Begründung:

* Der Session-Lifecycle zwischen Agent und Backend ist das Rückgrat des Gesamtsystems.
* Bereits mit Agent plus Backend entsteht ein früher, testbarer End-to-End-Kern ohne UI und ohne Browser-Terminal.

### Phase 2 – Terminal-Zugang serverseitig ermöglichen

#### Browser-Terminal-Gateway

Der Gateway sollte nach einem stabilen Agent-/Backend-Kern begonnen werden.

Begründung:

* Er hängt fachlich von Terminal-Grants aus dem Backend ab.
* Er hängt technisch an der Erreichbarkeit der Konsole über das VPN.
* Die eigentliche Shell-Verbindung und der Datenpfad lassen sich besser bauen, wenn Session- und Grant-Logik bereits stehen.

### Phase 3 – Lokale Bedienoberfläche anbinden

#### RooK UI auf der Konsole

Die UI sollte zuletzt vollständig integriert werden.

Begründung:

* Die UI ist stark vom Agent-Zustand und von der lokalen IPC abhängig.
* Ein stabiler Agent-Kern mit klarer Zustandsführung macht die UI-Entwicklung deutlich risikoärmer.
* So kann die UI gegen reale Zustände arbeiten statt gegen bewegliche Provisorien.

## Konkrete Startempfehlung

Wenn nur mit einer kleinen Zahl paralleler Teams gestartet wird, ist folgende Startfolge am sinnvollsten:

1. OpenVPN-Infrastruktur minimal funktionsfähig aufsetzen.
2. Backend-Datenmodell und Agent-REST-API implementieren.
3. Agent-Grunddienst und Session-Lifecycle gegen das Backend implementieren.
4. Gateway-Kern für Grant-Validierung und SSH-Aufbau ergänzen.
5. Browser-Terminal-Protokoll und Web-Zugriff darauf aufbauen.
6. Lokale UI vollständig auf den Agent-Kern aufsetzen.

## Erwarteter Nutzen dieser Reihenfolge

* Früher testbarer End-to-End-Kern auf Session-Ebene
* Geringeres Integrationsrisiko zwischen mehreren Teams
* Spätere UI- und Browser-Arbeit baut auf stabileren Verträgen und realen Zuständen auf
* Fehler werden zuerst in den Systemkern-Komponenten sichtbar statt spät in den Oberflächen

## Pflegehinweis

* Wenn sich aus der Umsetzung neue technische Zwänge ergeben, muss dieses Dokument aktualisiert werden.
* Abweichungen von der empfohlenen Reihenfolge sollten kurz begründet und hier oder in der Statusübersicht nachvollziehbar festgehalten werden.