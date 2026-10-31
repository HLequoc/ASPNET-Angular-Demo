# Kunden und Bestellungen (Angular 21)

Angular-Frontend für die beiden ASP.NET-Core-Dienste:

- KundenService: http://localhost:5001/api/kunden (Liste der Kunden)
- BestellService: http://localhost:5002/api/bestellungen (Liste und Anlegen von Bestellungen)

## Voraussetzungen

- Node.js 20.19 oder neuer (oder 22.12 oder neuer)
- Beide ASP.NET-Core-Dienste laufen (mit der CORS-Freigabe für http://localhost:4200)

## Starten

    npm install
    npm start

Danach im Browser öffnen: http://localhost:4200

## Aufbau (src/app)

- api.config.ts              Adressen der beiden Dienste
- models.ts                  Kunde, Bestellung
- kunden.service.ts          lädt die Kunden
- bestellungen.service.ts    lädt Bestellungen, legt neue an (POST mit Parametern in der URL)
- kunden-liste/              Tabelle der Kunden
- bestellungen-liste/        Tabelle der Bestellungen, neueste zuerst
- bestell-formular/          Formular: Kunde wählen, Artikel, Menge
- dienst-status/             Anzeige, ob ein Dienst erreichbar ist
