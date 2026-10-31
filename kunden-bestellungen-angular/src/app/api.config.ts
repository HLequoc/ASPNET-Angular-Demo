// Adressen der beiden Microservices (Ports aus appsettings.json / launchSettings.json)
export const CUSTOMERS_API = 'http://localhost:5001/api/kunden';
export const ORDERS_API = 'http://localhost:5002/api/bestellungen';
// SignalR-Hub des BestellService: schickt neue Bestellungen an alle verbundenen Browser
export const ORDERS_HUB = 'http://localhost:5002/hubs/bestellungen';