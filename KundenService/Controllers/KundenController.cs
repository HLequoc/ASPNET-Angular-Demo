using Microsoft.AspNetCore.Mvc;

namespace KundenService.Controllers;

public record Kunde(int Id, string Name, string Email);

[ApiController]
[Route("api/kunden")]
public class KundenController : ControllerBase
{
    // Eigene "Datenbank" dieses Dienstes (hier nur eine Liste im Speicher)
    private static readonly List<Kunde> _kunden = new()
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
}
