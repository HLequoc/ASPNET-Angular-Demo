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
    <img style="width: 40%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/b451ae36-6781-4efb-a382-44159b4e16c5" /><br>
    <img style="width: 40%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/8470e4d1-5477-4fe9-94bb-591c41238178" />

Layout implementierung
- app.config.ts <br>
    import { provideRouter } from '@angular/router';<br>
    import { routes } from './app.routes';<br>

    providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes),  provideHttpClient()],
-   app.html <br>
     <img width="191" height="33" alt="image" src="https://github.com/user-attachments/assets/b941ff72-a765-4fe2-a415-8013c8224398" /><br>

-   app.routes.ts <br>
    <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/33c4830b-d7ef-4ed6-b9bd-420c1a65e7a1" />
    <br>

-   app.ts <br>
      import { RouterOutlet } from '@angular/router';<br>
      imports: [RouterOutlet] <br>
- layout.html <br>
  <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/5f63e7db-80da-4d78-98b1-e91db6b4a22a" /><br>
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
  
  <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/1755984b-d96b-48d4-8746-400e96edc001" /><br>
- UniTest wird hinzugefügt

Aktualisierung der anderen Browsern beim Hinzufügen von einem Kunden <br>
- api.config.ts: CUSTOMERS_HUB hinzufügen <br>
<img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/867bda60-d00d-4b49-91e9-cc8794567f8e" /> <br>
- customers.service.ts <br>:
      HubConnection unf LiveStatus hinzufügen <br>
      <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/e1296b2f-5341-47dc-8237-1702699ed72a" /> <br>
      liveStarten und connectionBuilder (event connection.on, connection.onreconnecting, connection.onreconnected, connection.onclose) <br>
      Wichtige Info: connection.on: der Name "KundeAngelegt" muss identisch mit Aufruf von API <br>
      <img  style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/b517f8ce-6820-4654-9cd6-0fce9fca0069" /> <br>
      und <br>
      <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/31d93bbd-bf6e-483d-b54d-5f013c84bdb8" /> <br>
      in:
      <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/c9ea4bc4-7a4f-4f72-a7f2-f9ca893f6628" /> <br>
      Kontakt.ts: Überwachung der Änderung starten<br>
      <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/99bdc338-eab8-4ef9-b849-09d368ac6f7c" /> <br>
      ASP.NET KundenController.cs <br>
        IHubContext-Service injected:<br>
         <img  style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/6812e810-15f6-4184-ac91-74508fa509ac" /> <br>
        Beim Kundenhinzufügen werden Browser zurückgerufen: <br>
        <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/75c6d396-c6b3-4465-9fad-7874ccba0251" /> <br>
        KundenHub.cs wird angelegt: <br>
        <img style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/9c3e5fed-55b0-4d23-9803-bc4f22bae100" /> <br>
        program.cs : MapHub hinzufügen <br>
        <img  style="width: 50%; height: auto;" alt="image" src="https://github.com/user-attachments/assets/14608b28-d07f-4b5f-91dc-802d64271bea" /> <br>









