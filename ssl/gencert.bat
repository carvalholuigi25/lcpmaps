@echo off
setlocal enableextensions

@REM Sources:
@REM https://stackoverflow.com/a/41366949

cd "C:\Users\Luis\Documents\projects\websites\demos\lcpmaps\ssl"
openssl req -x509 -nodes -days 3650 -newkey rsa:4096 -keyout server.key -out server.crt -subj "/C=PT/ST=Braga/L=Braga/O=LCP Maps/OU=LCPMaps/CN=localhost/emailAddress=luiscarvalho239@gmail.com" -addext "subjectAltName=DNS:localhost,DNS:localhost.loc,IP:127.0.0.1,IP:10.0.0.1"

@REM openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ./server.key -out server.crt

pause
exit /b %errorlevel%
endlocal