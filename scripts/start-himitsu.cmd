@echo off
rem Chay web Himitsu (cong 3100) va tunnel Cloudflare. Duoc Task Scheduler goi khi dang nhap Windows.
cd /d D:\himistuhouse
set "PATH=C:\Program Files\nodejs;C:\Program Files (x86)\cloudflared;C:\Program Files\cloudflared;%PATH%"
start "himitsu-web" /min cmd /c "npm run start -- -p 3100 >> data\web.log 2>&1"
timeout /t 8 /nobreak >nul
start "himitsu-tunnel" /min cmd /c "cloudflared tunnel --no-autoupdate run himitsu >> data\tunnel.log 2>&1"
