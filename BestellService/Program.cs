using BestellService;
using BestellService.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Erlaubt dem Angular-Frontend (ng serve, Port 4200) den Zugriff aus dem Browser
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()));

// Adresse des anderen Dienstes kommt aus der Konfiguration, nicht fest im Code.
// In Azure wäre das z. B. "http://kundenservice" (interner Name im Environment).
var kundenUrl = builder.Configuration["KundenService:BaseUrl"] ?? "http://localhost:5001";
builder.Services.AddHttpClient<KundenClient>(c => c.BaseAddress = new Uri(kundenUrl));

var app = builder.Build();
app.UseCors();
app.MapControllers();
app.MapHub<BestellungenHub>("/hubs/bestellungen");
app.Run();
