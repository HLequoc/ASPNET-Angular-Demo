using System.Net;

namespace BestellService;

public record KundeDto(int Id, string Name, string Email);

// Kapselt den HTTP-Aufruf an den KundenService
public class KundenClient(HttpClient http)
{
    public async Task<KundeDto?> HoleAsync(int id)
    {
        var antwort = await http.GetAsync($"api/kunden/{id}");

        if (antwort.StatusCode == HttpStatusCode.NotFound)
            return null;

        antwort.EnsureSuccessStatusCode();
        return await antwort.Content.ReadFromJsonAsync<KundeDto>();
    }
}
