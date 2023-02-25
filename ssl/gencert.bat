@echo off
setlocal enableextensions

cd "C:\Users\Luis\Documents\projects\websites\demos\lcpmaps\ssl"
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ./server.key -out server.crt

pause
exit /b %errorlevel%
endlocal