$ErrorActionPreference = 'Stop'

function Get-ChildPidsRecursive($parentPid) {
  $children = @()
  try {
    $procs = Get-CimInstance Win32_Process -Filter "ParentProcessId=$parentPid"
    foreach ($p in $procs) {
      $children += [int]$p.ProcessId
      $children += Get-ChildPidsRecursive -parentPid $p.ProcessId
    }
  } catch {}
  return $children
}

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location -Path $root

# Ensure Node 18 path (NVM for Windows)
if (Test-Path 'C:\nvm4w\nodejs') {
  $env:NVM_SYMLINK = 'C:\nvm4w\nodejs'
  if (-not ($env:Path -split ';' | Where-Object { $_ -eq $env:NVM_SYMLINK })) {
    $env:Path = "$env:NVM_SYMLINK;" + $env:Path
  }
}

# Start Vite dev server hidden
$reactDir = Join-Path $root 'react-app'
Write-Host "Starting Vite dev server (hidden)..."
$vite = Start-Process -FilePath npm -ArgumentList 'run','dev' -WorkingDirectory $reactDir -WindowStyle Hidden -PassThru

# Wait for dev server to be ready
$deadline = (Get-Date).AddSeconds(60)
$ready = $false
while ((Get-Date) -lt $deadline) {
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:5173' -TimeoutSec 2
    if ($resp.StatusCode -eq 200) { $ready = $true; break }
  } catch {}
  Start-Sleep -Milliseconds 600
}
if (-not $ready) {
  Write-Error "Vite dev server did not start on port 5173 in time. (npm pid=$($vite.Id))"
}

# Capture likely Node (vite) child PIDs for later stop
$nodePids = @()
try {
  $nodeChildren = Get-ChildPidsRecursive -parentPid $vite.Id | Sort-Object -Unique
  foreach ($pid in $nodeChildren) {
    try {
      $proc = Get-Process -Id $pid -ErrorAction Stop
      if ($proc.ProcessName -match 'node') { $nodePids += $pid }
    } catch {}
  }
} catch {}

# Persist PID info
$stateDir = Join-Path $root '.dev'
New-Item -ItemType Directory -Force -Path $stateDir | Out-Null
$stateFile = Join-Path $stateDir 'vite-pid.json'
$payload = @{ vitePid = $vite.Id; nodePids = $nodePids; started = (Get-Date).ToString('s') } | ConvertTo-Json -Depth 3
Set-Content -Path $stateFile -Value $payload -Encoding UTF8
Write-Host "Saved Vite PID state -> $stateFile" -ForegroundColor Green

# Launch Electron pointing to dev server
$env:VITE_DEV_SERVER_URL = 'http://localhost:5173'
$env:NO_ATTACH = '1'       # normal window behavior
$env:SAFE_MODE = '1'       # safer GPU/off transparency
Remove-Item Env:\OVERLAY_MODE -ErrorAction SilentlyContinue
Write-Host "Launching Electron (dev server at http://localhost:5173)..."
npx electron . --enable-logging

