# Giám sát web Himitsu: kiểm tra mỗi 15 giây, tự bật lại web (và tunnel Cloudflare) khi bị sập.
# Chạy:  powershell -NoProfile -ExecutionPolicy Bypass -File D:\himistuhouse\scripts\watchdog.ps1
# Thử trên cổng khác, không đụng tunnel:  ... -Port 3199 -NoTunnel
param(
  [int]$Port = 3100,
  [switch]$NoTunnel,
  [string]$Root = "D:\himistuhouse",
  [string]$TunnelName = "himitsu",
  [int]$IntervalSec = 15
)

$ErrorActionPreference = "SilentlyContinue"
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
$url = "http://localhost:$Port/en"
$log = Join-Path $Root "data\watchdog.log"
New-Item -ItemType Directory -Force (Join-Path $Root "data") | Out-Null

function Log($m) { "$(Get-Date -Format s) $m" | Add-Content -Path $log }

function Test-Web {
  # Lần truy cập đầu sau khi khởi động có thể chậm, nên cho tối đa 30 giây.
  try { return ((Invoke-WebRequest $url -UseBasicParsing -TimeoutSec 30).StatusCode -eq 200) } catch { return $false }
}

function Wait-Web([int]$maxSec = 120) {
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $maxSec) {
    if (Test-Web) { return $true }
    Start-Sleep -Seconds 3
  }
  return $false
}

function Stop-Web {
  # Tắt tiến trình đang giữ cổng (trường hợp server treo nhưng chưa thoát).
  # Cổng trống làm Get-NetTCPConnection báo lỗi, nên bọc try/catch để không dừng cả hàm.
  try {
    Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  } catch { }
}

function Start-Web {
  Log "web down -> restarting on port $Port"
  Stop-Web
  try {
    # Chạy node trực tiếp (không qua cmd/npm) và ghi log ra data\web.log, data\web.err.
    $node = (Get-Command node.exe -ErrorAction Stop).Source
    $next = Join-Path $Root "node_modules\next\dist\bin\next"
    $p = Start-Process -FilePath $node -ArgumentList $next, "start", "-p", "$Port" -WorkingDirectory $Root -WindowStyle Hidden `
      -RedirectStandardOutput (Join-Path $Root "data\web.log") -RedirectStandardError (Join-Path $Root "data\web.err") -PassThru -ErrorAction Stop
    Log "web process launched (node pid $($p.Id))"
  } catch {
    Log "could not launch web: $($_.Exception.Message)"
  }
}

function Start-Tunnel {
  Log "tunnel down -> restarting"
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "cloudflared tunnel --no-autoupdate run $TunnelName >> data\tunnel.log 2>&1" -WorkingDirectory $Root -WindowStyle Minimized
}

Log "watchdog started (port $Port, tunnel check: $(-not $NoTunnel))"
$fails = 0
while ($true) {
  if (Test-Web) {
    $fails = 0
  } else {
    $fails++
    if ($fails -ge 2) {
      Start-Web
      if (Wait-Web 120) { Log "web is back" } else { Log "web still not responding after restart" }
      $fails = 0
    }
  }
  if (-not $NoTunnel -and -not (Get-Process cloudflared)) { Start-Tunnel; Start-Sleep -Seconds 8 }
  Start-Sleep -Seconds $IntervalSec
}
