@echo off
rem Khoi dong Himitsu: chay watchdog, no se bat web (cong 3100) va tunnel Cloudflare, va tu bat lai neu bi sap.
rem Dat file nay (hoac shortcut) vao thu muc Startup (Win+R -> shell:startup) de chay khi dang nhap Windows.
cd /d D:\himistuhouse
start "himitsu-watchdog" /min powershell -NoProfile -ExecutionPolicy Bypass -File "D:\himistuhouse\scripts\watchdog.ps1"
