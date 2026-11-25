using KundenService.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace TestKundenAPI;

public class KundenControllerTests
{
    [Fact]
    public void GetAlle_LiefertDieVorhandenenKunden()
    {
        var controller = new KundenController();

        var kunden = controller.GetAlle().ToList();

        Assert.Contains(kunden, kunde =>
            kunde.Id == 1 &&
            kunde.Name == "Anna Schmidt" &&
            kunde.Email == "anna@example.com");

        Assert.Contains(kunden, kunde =>
            kunde.Id == 2 &&
            kunde.Name == "Ben Weber" &&
            kunde.Email == "ben@example.com");
    }

    [Fact]
    public void GetAlle_LiefertEineNichtLeereKundenliste()
    {
        var controller = new KundenController();

        var kunden = controller.GetAlle().ToList();

        Assert.NotEmpty(kunden);
    }

    [Fact]
    public void Get_LiefertKundenMitDerGesuchtenId()
    {
        var controller = new KundenController();

        var result = controller.Get(1);

        var kunde = Assert.IsType<Kunde>(result.Value);
        Assert.Equal(1, kunde.Id);
        Assert.Equal("Anna Schmidt", kunde.Name);
        Assert.Equal("anna@example.com", kunde.Email);
    }

    [Fact]
    public void Get_LiefertDenZweitenKunden()
    {
        var controller = new KundenController();

        var result = controller.Get(2);

        Assert.Equal(new Kunde(2, "Ben Weber", "ben@example.com"), result.Value);
    }

    [Fact]
    public void Get_LiefertNotFoundWennKundeNichtExistiert()
    {
        var controller = new KundenController();

        var result = controller.Get(999999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void Get_LiefertNotFoundBeiNegativerId()
    {
        var controller = new KundenController();

        var result = controller.Get(-1);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void Add_ErstelltKundenUndLiefertCreatedAtAction()
    {
        var controller = new KundenController();
        var neuerKunde = new NeuerKunde(
            "Clara Müller",
            "clara@example.com");

        var result = controller.Add(neuerKunde);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var kunde = Assert.IsType<Kunde>(createdResult.Value);

        Assert.Equal(neuerKunde.Name, kunde.Name);
        Assert.Equal(neuerKunde.Email, kunde.Email);
        Assert.True(kunde.Id > 2);
    }

    [Fact]
    public void Add_VerwendetDieNeueKundenIdAlsRouteValue()
    {
        var controller = new KundenController();
        var neuerKunde = new NeuerKunde(
            "David Bauer",
            "david@example.com");

        var result = controller.Add(neuerKunde);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var kunde = Assert.IsType<Kunde>(createdResult.Value);

        Assert.Equal(nameof(KundenController.Get), createdResult.ActionName);
        Assert.NotNull(createdResult.RouteValues);
        Assert.Equal(kunde.Id, createdResult.RouteValues["id"]);
    }

    [Fact]
    public void Add_MachtDenNeuenKundenAnschliessendAbrufbar()
    {
        var controller = new KundenController();
        var neuerKunde = new NeuerKunde(
            "Eva Fischer",
            "eva@example.com");

        var addResult = controller.Add(neuerKunde);
        var hinzugefuegterKunde =
            Assert.IsType<Kunde>(
                Assert.IsType<CreatedAtActionResult>(addResult.Result).Value);

        var getResult = controller.Get(hinzugefuegterKunde.Id);

        Assert.Equal(hinzugefuegterKunde, getResult.Value);
    }
}