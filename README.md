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

Layout implementierung
- app.config.ts <br>
    import { provideRouter } from '@angular/router';<br>
    import { routes } from './app.routes';<br>

    providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes),  provideHttpClient()],
-   app.html <br>
     <img width="191" height="33" alt="image" src="https://github.com/user-attachments/assets/b941ff72-a765-4fe2-a415-8013c8224398" /><br>

-   app.routes.ts <br>
    <img width="759" height="314" alt="image" src="https://github.com/user-attachments/assets/33c4830b-d7ef-4ed6-b9bd-420c1a65e7a1" />
    <br>

-   app.ts <br>
      import { RouterOutlet } from '@angular/router';<br>
      imports: [RouterOutlet] <br>
- layout.html <br>
  <img width="770" height="595" alt="image" src="https://github.com/user-attachments/assets/5f63e7db-80da-4d78-98b1-e91db6b4a22a" /><br>
- layout.ts<br>
    import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';<br>
    imports: [RouterOutlet, RouterLink, RouterLinkActive],<br>
- 

Test API Funktionen mit CoPilot <br>
- Swagger <br>
  dotnet add .\KundenService\KundenService.csproj package Swashbuckle.AspNetCore --version 6.6.2 <br>
  dotnet build .\KundenService\KundenService.csproj <br>
  dotnet run --project .\KundenService\KundenService.csproj <br>
  http://localhost:5001/swagger <br>
  
  <img width="1073" height="648" alt="image" src="https://github.com/user-attachments/assets/1755984b-d96b-48d4-8746-400e96edc001" /><br>
- UniTest wird hinzugefügt
