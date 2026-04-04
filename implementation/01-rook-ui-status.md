# Implementierungsstatus – RooK UI auf der Konsole

Status: In Arbeit

## Zweck der Komponente

Die RooK UI ist die lokale Benutzeroberfläche auf der Konsole. Sie zeigt Zustände an, erlaubt die Bedienung per Gamepad und spricht ausschließlich mit dem lokalen RooK Agent.

## Aktueller Stand

* Die fachliche Konzeption der Komponente wurde im lokalen Repo konkretisiert.
* Die Umsetzung wurde in eine sequenzielle lokale Planstruktur unter `plans/` zerlegt.
* Plan 01 ist umgesetzt:
  * C++-Projektgrundlage und CMake-Build existieren
  * App-Shell und CLI-Umschaltung zwischen Normalbetrieb und Preview sind angelegt
  * eine Screen-Registry mit stabilen Start-IDs und Platzhalter-Screens ist vorhanden
  * Konfigurations- und Ressourcenpfade sind vorbereitet
* Plan 02 ist in seiner bisherigen Form **verworfen**:
  * die eigentliche SDL2-/RmlUi-Grafikintegration wurde nicht geliefert
  * stattdessen wurde nur ein terminalbasierter Fallback-Renderer aufgebaut
  * die benoetigten Dev-Pakete gelten dafuer kuenftig als harter Blocker
* Vor dem Ersatzpfad fuer die Grafikintegration wird jetzt zusaetzlich ein neuer Vorbereitungsschritt eingezogen:
  * RmlUi wird projektlokal eingebettet und nicht per `apt` vorausgesetzt
  * erst danach wird die echte grafische SDL2-/RmlUi-Integration fortgesetzt
* Plan 02a ist umgesetzt:
  * RmlUi liegt jetzt als projektlokale Abhaengigkeit unter `third_party/rmlui`
  * der Quellstand ist auf Release `6.2` gepinnt
  * der Top-Level-Build bindet RmlUi ueber CMake aus dem Repo selbst ein
* Aus dem verworfenen Plan 02 bleiben als Vorarbeit nutzbar:
  * Theme-Tokens fuer Farben, Typografie und Fokusstil
  * Preview-Registry mit Default-Zustaenden pro Hauptscreen
  * Backend-Erkennung fuer optionale SDL2/RmlUi-Anbindung
* Plan 02b ist umgesetzt:
  * die App startet jetzt standardmaessig ueber einen echten SDL2-/RmlUi-Host statt ueber den Terminal-Renderer
  * Preview und Normalbetrieb laufen ueber denselben Navigations-, Fokus- und Render-Loop
  * RmlUi wird mit FreeType-Schriftengine gebaut und laedt vendored Schriftdateien fuer echte Textdarstellung
  * die grafische Laufzeit verarbeitet Tastatur- und grundlegende Gamepad-Eingaben innerhalb desselben Hosts
  * der Terminal-Renderer bleibt nur noch als Diagnosepfad erhalten, falls der grafische Host nicht starten kann
* Plan 03 ist umgesetzt:
  * Intent-Navigation fuer `NavigateTo`, `CloseApp` und `NoOp` ist technisch vorhanden
  * ein app-weiter Ruecksprung-Stack traegt den Preview-Flow zwischen mehreren Screens
  * gemeinsame Komponentenmodelle fuer Liste, Action-Row und Dialog sind eingefuehrt
  * die Fokuslogik wird zentral fuer Listen, Aktionsreihen und Dialogaktionen gesteuert
  * Preview-Navigation durchlaeuft jetzt echte Interaktionspfade wie WLAN-Liste -> Passwort -> Warte-Screens -> Status -> Dialog -> Fehler-Screen
* Plan 04 ist in seiner bisherigen Form **verworfen**:
  * die Hauptscreens wurden nicht als echte Module unter `screens/` umgesetzt
  * der Preview-Modus lief ueber einen separaten Stub-/Scenario-Pfad statt ueber denselben Screen-Code wie im Normalbetrieb
  * Microcopy und einzelne Ressourcen bleiben nutzbar, ersetzen die echte Screen-Implementierung aber nicht
* Plan 04b ist umgesetzt:
  * die produktiven Hauptscreens liegen jetzt als echte Module unter `screens/`
  * Welcome-, Status-, WLAN-, Keyboard-, Wait- und Fehler-Screens werden von derselben Screen-Registry fuer Preview und Normalbetrieb erzeugt
  * `PreviewRegistry` liefert nur noch Startparameter/Szenario-Daten und keine fertigen Screen-Model-Stubs mehr
  * der Start aus Repo-Root und aus `build/` findet die Ressourcen jetzt robust ueber die Projekterkennung
  * die grafische UI verwendet jetzt projektlokale `JetBrains Mono`-Fonts aus `resources/fonts`
  * WLAN- und VPN-Warte-Screens sind wieder reine Wartebildschirme ohne Aktionsbuttons und mit animiertem Spinner im gemeinsamen SDL-/RmlUi-Renderpfad
  * die Screen-Inhalte bleiben fuer Laufzeitdaten weiterhin mock-/previewbasiert, bis Plan 05 die echte Agent-Anbindung liefert
* Der naechste technische Schritt ist jetzt `plans/05-agent-anbindung-und-laufzeitlogik.md`.

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

1. Als naechstes Agent-Anbindung und Laufzeitlogik gemaess `plans/05-agent-anbindung-und-laufzeitlogik.md` aufbauen.
2. Danach End-to-End-Integration und Abnahme gemaess `plans/06-integration-polish-und-abnahme.md` durchziehen.
3. Anschliessend offene Produkt- und UX-Feinheiten wie die weitere Keyboard-Vervollstaendigung im Integrationskontext nachziehen.

## Hinweise für spätere Aktualisierung

* Dieses Dokument bleibt die kanonische statusbezogene Spiegelung im `spec`-Bereich.
* Die eigentliche operative Reihenfolge liegt im lokalen Repo unter `plans/00-plan-index.md`.
* Sobald die Implementierung beginnt, sollen hier mindestens Meilensteine, offene Blocker und der aktuelle Integrationsstand mit dem Agent ergänzt werden.
