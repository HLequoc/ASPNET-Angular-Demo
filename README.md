- Projekte BestellService und KundenService in Visual Studio.net geöffnet.
- Die beiden ASP.NET Projekte werden gestartet mit Port 5001 und 5002
- Projekt kunden-bestellung-angular in Visual Studio Code geöffnet. Starten das Projekt in Debug-Mode.
- BrowserChrom wird gestartet mit Url http://localhost:4200
- Öffnen eine zweite Seite in Browser http://localhost:4200. Dort werden Bestellungen hinzugefügt. Diese Änderungen werden auf der ersten Seite automatisch aktualisiert

  Beschreibung:
  - die beiden Services werden in customers.service.ts und orders.services.ts definiert
  - die Services werden in app.ts hochgeladen:<br>
           protected readonly customers = inject(CustomersService);<br>
           protected readonly orders = inject(OrdersService);
  - Urls von Sevices werden in api.config.ts definiert:<br>
           export const CUSTOMERS_API = 'http://localhost:5001/api/kunden'; <br>
           export const ORDERS_API = 'http://localhost:5002/api/bestellungen';

    die Services rufen API über get post:
    <br>
    <img style="width: auto; height: auto;" alt="image" src="https://github.com/user-attachments/assets/b451ae36-6781-4efb-a382-44159b4e16c5" /><br>
    <img alt="image" src="https://github.com/user-attachments/assets/8470e4d1-5477-4fe9-94bb-591c41238178" />


