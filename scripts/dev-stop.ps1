$ErrorActionPreference = 'Stop'

function Stop-Tree($pid) {
  try {
    $children = Get-CimInstance Win32_Process -Filter "ParentProcessId=$pid"
    foreach ($c in $children) { Stop-Tree -pid $c.ProcessId }
  } catch {}
  try { Get-Process -Id $pid -ErrorAction Stop | Stop-Process -Force -ErrorAction SilentlyContinue } catch {}
}

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$stateFile = Join-Path $root '.dev/vite-pid.json'
if (-not (Test-Path $stateFile)) {
  Write-Host "No PID state found at $stateFile" -ForegroundColor Yellow
  exit 0
}
$state = Get-Content -Raw $stateFile | ConvertFrom-Json

Write-Host "Stopping Vite (npm pid=$($state.vitePid)) and child node pids: $($state.nodePids -join ', ')"
if ($state.nodePids) {
  foreach ($pid in $state.nodePids) { Stop-Tree -pid $pid }
}
if ($state.vitePid) { Stop-Tree -pid $state.vitePid }

Remove-Item -Force $stateFile -ErrorAction SilentlyContinue
Write-Host "Stopped."

