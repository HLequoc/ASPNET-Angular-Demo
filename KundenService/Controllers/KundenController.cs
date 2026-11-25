using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using KundenService.Hubs;

namespace KundenService.Controllers;

public record Kunde(int Id, string Name, string Email);
public record NeuerKunde(string Name, string Email);

[ApiController]
[Route("api/kunden")]
public class KundenController : ControllerBase
{
    private readonly IHubContext<KundenHub> _hub;

    public KundenController(IHubContext<KundenHub> hub)
    {
        _hub = hub;
    }

    // Eigene "Datenbank" dieses Dienstes (hier nur eine Liste im Speicher)
    private static List<Kunde> _kunden = new()
    {
        new(1, "Anna Schmidt", "anna@example.com"),
        new(2, "Ben Weber",    "ben@example.com")
    };

    [HttpGet]
    public IEnumerable<Kunde> GetAlle() => _kunden;

    [HttpGet("{id:int}")]
    public ActionResult<Kunde> Get(int id)
    {
        var kunde = _kunden.FirstOrDefault(k => k.Id == id);
        return kunde is null ? NotFound() : kunde;
    }

    [HttpPost]
    public async Task<ActionResult<Kunde>> Add(NeuerKunde neuerKunde)
    {
        var id = _kunden.Count == 0 ? 1 : _kunden.Max(k => k.Id) + 1;
        var kunde = new Kunde(id, neuerKunde.Name, neuerKunde.Email);

        _kunden.Add(kunde);
        await _hub.Clients.All.SendAsync("KundeAngelegt", kunde);

        return CreatedAtAction(nameof(Get), new { id = kunde.Id }, kunde);
    }
}
