@echo off
setlocal enabledelayedexpansion

:: ==============================
:: ROOT DIR
:: ==============================
set ROOT_DIR=%cd%

:: ==============================
:: DISCOVERY SERVICE
:: ==============================
set DISCOVERY_NAME=discovery-service
set DISCOVERY_PORT=8761

:: ==============================
:: MICROSERVICES
:: ==============================
set SERVICES_LIST=customer-service 8081 inventory-service 8082 order-service 8083 payment-service 8084 pricing-service 8085 product-service 8086

:: ==============================
:: API GATEWAY
:: ==============================
set GATEWAY_NAME=api-gateway
set GATEWAY_PORT=8080

:: ==============================
:: GUI FUNCTION
:: ==============================
:show_gui
set "PS_CMD=Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing;"
set "PS_CMD=%PS_CMD% $f = New-Object System.Windows.Forms.Form;"
set "PS_CMD=%PS_CMD% $f.Text = 'Server Manager'; $f.StartPosition = 'CenterScreen'; $f.Width = 450; $f.Height = 250; $f.FormBorderStyle = 'FixedDialog'; $f.MaximizeBox = $false;"
set "PS_CMD=%PS_CMD% $font = New-Object System.Drawing.Font('Segoe UI', 14, [System.Drawing.FontStyle]::Bold);"

:: Button Start
set "PS_CMD=%PS_CMD% $b1 = New-Object System.Windows.Forms.Button;"
set "PS_CMD=%PS_CMD% $b1.Text = 'Start All Services'; $b1.Font = $font; $b1.Top = 30; $b1.Left = 60; $b1.Width = 310; $b1.Height = 60;"
set "PS_CMD=%PS_CMD% $b1.Add_Click({ $host.SetShouldExit(1); $f.Close() }); $f.Controls.Add($b1);"

:: Button Stop
set "PS_CMD=%PS_CMD% $b2 = New-Object System.Windows.Forms.Button;"
set "PS_CMD=%PS_CMD% $b2.Text = 'Stop All Services'; $b2.Font = $font; $b2.Top = 110; $b2.Left = 60; $b2.Width = 310; $b2.Height = 60;"
set "PS_CMD=%PS_CMD% $b2.Add_Click({ $host.SetShouldExit(2); $f.Close() }); $f.Controls.Add($b2);"

:: Show Form
set "PS_CMD=%PS_CMD% $f.ShowDialog() | Out-Null;"
powershell -NoProfile -Command "%PS_CMD%"
exit /b %ERRORLEVEL%

:: ==============================
:: HELPER FUNCTION TO WAIT PORT
:: ==============================
:wait_for_port
:: %1 = port
:: %2 = service name
set PORT=%1
set SERVICE=%2
set COUNT=0

:wait_loop
powershell -Command "try { $tcp = New-Object System.Net.Sockets.TcpClient('localhost',%PORT%); $tcp.Close(); exit 0 } catch { exit 1 }"
if errorlevel 1 (
    timeout /t 1 >nul
    set /a COUNT+=1
    if !COUNT! GEQ 30 (
        echo ❌ %SERVICE% failed to start within 30 seconds
        exit /b 1
    )
    goto wait_loop
)
echo ✅ %SERVICE% started!
exit /b 0

:: ==============================
:: START FUNCTIONS
:: ==============================
:start_discovery
echo 🚀 Starting %DISCOVERY_NAME% on port %DISCOVERY_PORT%
cd "%ROOT_DIR%\backend\%DISCOVERY_NAME%" && start "" mvn spring-boot:run
call :wait_for_port %DISCOVERY_PORT% %DISCOVERY_NAME%
exit /b 0

:start_services
setlocal enabledelayedexpansion
for %%A in (%SERVICES_LIST%) do (
    set /a toggle=!toggle!+1
    if !toggle! EQU 1 (
        set SERVICE=%%A
    ) else (
        set PORT=%%A
        set toggle=0
        echo 🚀 Starting !SERVICE! on port !PORT!
        cd "%ROOT_DIR%\backend\!SERVICE!" && start "" mvn spring-boot:run
    )
)
:: Wait for all services
set toggle=0
for %%A in (%SERVICES_LIST%) do (
    set /a toggle=!toggle!+1
    if !toggle! EQU 1 (
        set SERVICE=%%A
    ) else (
        set PORT=%%A
        set toggle=0
        call :wait_for_port !PORT! !SERVICE!
    )
)
endlocal
exit /b 0

:start_gateway
echo 🚀 Starting %GATEWAY_NAME% on port %GATEWAY_PORT%
cd "%ROOT_DIR%\backend\%GATEWAY_NAME%" && start "" mvn spring-boot:run
call :wait_for_port %GATEWAY_PORT% %GATEWAY_NAME%
exit /b 0

:start_all
call :start_discovery
call :start_services
call :start_gateway
echo ✨ All services started successfully!
pause
exit /b

:: ==============================
:: STOP FUNCTION
:: ==============================
:stop_ports
echo 🛑 Stopping all microservices...

:: Discovery + Gateway
set PORTS=%DISCOVERY_PORT% %GATEWAY_PORT%

:: Services
setlocal enabledelayedexpansion
for %%A in (%SERVICES_LIST%) do (
    set /a toggle=!toggle!+1
    if !toggle! EQU 1 (
        set SERVICE=%%A
    ) else (
        set PORT=%%A
        set toggle=0
        set PORTS=!PORTS! !PORT!
    )
)
endlocal

:: Kill all ports
for %%P in (%PORTS%) do (
    for /f "tokens=5" %%i in ('netstat -aon ^| findstr :%%P ^| findstr LISTENING') do (
        echo 🔪 Killing port %%P (PID %%i)
        taskkill /PID %%i /F >nul 2>&1
    )
)
echo 🧹 All services stopped!
pause
exit /b

:: ==============================
:: MAIN
:: ==============================
call :show_gui
if %ERRORLEVEL%==1 (
    call :start_all
) else if %ERRORLEVEL%==2 (
    call :stop_ports
) else (
    echo Exiting...
)
exit /b
