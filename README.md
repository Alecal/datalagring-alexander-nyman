# Membler

Webbapp för att hantera användare, kurser, lärare, kurstillfällen och expertiser. Backend i ASP.NET Core (Minimal API, EF Core, PostgreSQL), frontend i React (Vite, Tailwind).

## Så kör du lokalt

**Krävs:** .NET SDK, Node.js, PostgreSQL.

1. **Databas**  
   Skapa en databas i PostgreSQL. Lägg till din connection string i `Membler.Presentation.Api/appsettings.json` under `ConnectionStrings:MemblerDatabase` (Host, Database, Username, Password).

2. **Migrationer**  
   Från projektmappen:
   ```bash
   cd Membler.Presentation.Api
   dotnet ef database update --project ../Membler.Infrastructure
   ```

3. **Backend**  
   ```bash
   cd Membler.Presentation.Api
   dotnet run
   ```
   API:et körs på https://localhost:62356.

4. **Frontend**  
   I ett nytt terminalfönster:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Öppna adressen som Vite visar (t.ex. http://localhost:5173). Frontend anropar API:et via proxy. Om API:et kör på annan adress/port, skapa `frontend/.env.local` med t.ex. `VITE_API_TARGET=https://localhost:DIN_PORT`.

## Tester

```bash
dotnet test Membler.Tests/Membler.Tests.csproj
```
