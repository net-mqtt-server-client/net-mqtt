FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env 
WORKDIR /app 
 
COPY . . 
RUN dotnet restore SIN/SIN.csproj
RUN dotnet publish -c Release -o out SIN/SIN.csproj
 
FROM mcr.microsoft.com/dotnet/aspnet:7.0 
WORKDIR /app 
COPY --from=build-env /app/out . 
 
HEALTHCHECK --interval=30s --timeout=30s --start-period=20s --retries=3 CMD [ "CMD", "curl", "-f", "http://" ] 
 
ENTRYPOINT [ "dotnet", "SIN.dll" ]