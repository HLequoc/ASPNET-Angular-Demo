using System.Collections.Concurrent;
using BestellService.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace BestellService.Controllers;

public record Bestellung(int Id, int customerId, string customerName, string Artikel, int count);

[ApiController]
[Route("api/bestellungen")]
public class BestellungenController(KundenClient kunden, IHubContext<BestellungenHub> hub) : ControllerBase
{
    // Eigene "Datenbank" dieses Dienstes
    private static readonly ConcurrentBag<Bestellung> _bestellungen = new();
    private static int _naechsteId = 0;

    [HttpGet]
    public IEnumerable<Bestellung> GetAlle() => _bestellungen.OrderBy(b => b.Id);

    // Aufruf: POST /api/bestellungen?kundenId=1&artikel=Laptop&menge=1
    [HttpPost]
    public async Task<ActionResult<Bestellung>> Anlegen(
        [FromQuery] int customerId,
        [FromQuery] string artikel,
        [FromQuery] int count)
    {
        if (count <= 0)
            return BadRequest("Die Menge muss größer als 0 sein.");

        // Aufruf des anderen Microservices
        KundeDto? kunde;
        try
        {
            kunde = await kunden.HoleAsync(customerId);
        }
        catch (HttpRequestException)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable,
                "Der KundenService ist nicht erreichbar.");
        }

        if (kunde is null)
            return BadRequest($"Kunde {customerId} existiert nicht.");

        var id = Interlocked.Increment(ref _naechsteId);
        var bestellung = new Bestellung(id, kunde.Id, kunde.Name, artikel, count);
        _bestellungen.Add(bestellung);

        //Name "BestellungAngelegt" muss identisch mit dem Verbindungsaufbau in Client sein:
        //const connection = new HubConnectionBuilder()
        //  .withUrl(ORDERS_HUB)
        //  .withAutomaticReconnect()
        //  .configureLogging(LogLevel.Warning)
        //  .build();

        //connection.on('BestellungAngelegt', (neu: Order) => {
        //    this.orders.update((liste) =>
        //      liste.some((b) => b.id === neu.id) ? liste : [...liste, neu].sort((a, b) => a.id - b.id),

        //    );
        
        await hub.Clients.All.SendAsync("BestellungAngelegt", bestellung);

        CreatedResult result = Created($"api/bestellungen/{id}", bestellung);
        return result;
    }
}
