using KundenService.Controllers;
using KundenService.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace TestKundenAPI;

public class KundenControllerTests
{
    private static (KundenController Controller,Mock<IClientProxy> ClientProxy) CreateController()
    {
        var hub = new Mock<IHubContext<KundenHub>>();
        var clients = new Mock<IHubClients>();
        var clientProxy = new Mock<IClientProxy>();

        clients
            .Setup(clients => clients.All)
            .Returns(clientProxy.Object);

        hub
            .Setup(hub => hub.Clients)
            .Returns(clients.Object);

        clientProxy
            .Setup(proxy => proxy.SendCoreAsync(
                It.IsAny<string>(),
                It.IsAny<object?[]>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        return (new KundenController(hub.Object), clientProxy);
    }

    [Fact]
    public void Get_LiefertKundenMitDerGesuchtenId()
    {
        var (controller, _) = CreateController();

        var result = controller.Get(1);

        Assert.Equal(
            new Kunde(1, "Anna Schmidt", "anna@example.com"),
            result.Value);
    }

    [Fact]
    public async Task Add_ErstelltKundenUndSendetSignalRNachricht()
    {
        var (controller, clientProxy) = CreateController();
        var neuerKunde = new NeuerKunde(
            "Clara Müller",
            "clara@example.com");

        var result = await controller.Add(neuerKunde);

        var createdResult =
            Assert.IsType<CreatedAtActionResult>(result.Result);

        var kunde = Assert.IsType<Kunde>(createdResult.Value);

        if (kunde != null)
        {
            Assert.Equal(neuerKunde.Name, kunde.Name);
            Assert.Equal(neuerKunde.Email, kunde.Email);

            clientProxy.Verify(proxy => proxy.SendCoreAsync(
                    "KundeAngelegt",
                    It.Is<object?[]>(args =>
                        args.Length == 1 &&
                        args[0] is Kunde &&
                        args[0] == kunde),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}