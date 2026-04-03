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
* Der naechste technische Schritt ist jetzt `plans/02b-sdl2-und-rmlui-grafikintegration.md`.

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

1. Als naechstes `plans/02b-sdl2-und-rmlui-grafikintegration.md` abarbeiten.
2. Danach `plans/04b-echte-screens-und-preview-gleichlauf.md` umsetzen.
3. Anschliessend Agent-Anbindung und Laufzeitlogik gemaess `plans/05-agent-anbindung-und-laufzeitlogik.md` aufbauen.

## Hinweise für spätere Aktualisierung

* Dieses Dokument bleibt die kanonische statusbezogene Spiegelung im `spec`-Bereich.
* Die eigentliche operative Reihenfolge liegt im lokalen Repo unter `plans/00-plan-index.md`.
* Sobald die Implementierung beginnt, sollen hier mindestens Meilensteine, offene Blocker und der aktuelle Integrationsstand mit dem Agent ergänzt werden.
