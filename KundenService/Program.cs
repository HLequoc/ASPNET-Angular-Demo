var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// Erlaubt dem Angular-Frontend (ng serve, Port 4200) den Zugriff aus dem Browser
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();
app.UseCors();
app.MapControllers();
app.Run();
