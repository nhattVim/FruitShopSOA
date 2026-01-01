@echo off
setlocal EnableDelayedExpansion

:: ==========================================
:: 1. CONFIGURATION
:: ==========================================
:: Switch to the script's directory
cd /d "%~dp0"
set "ROOT_DIR=%cd%"
title Microservices Launcher

:: Service List (Format: FolderName:Port)
:: IMPORTANT: These folders must exist inside the "backend" folder
set "DISCOVERY_SVC=discovery-server:8761"
set "GATEWAY_SVC=api-gateway:8080"
set "MICROSERVICES=customer-service:8081 inventory-service:8082 order-service:8083 payment-service:8084 pricing-service:8085 product-service:8086 identity-service:8087"

:: Frontend Folder Name (Must exist in the same directory as this script)
set "FRONTEND_DIR=frontend"

:: ==========================================
:: 2. START SEQUENCE
:: ==========================================
cls
echo.
echo ========================================================
echo    STARTING INFRASTRUCTURE...
echo ========================================================

:: --- STEP 1: Start Discovery Service ---
for /f "tokens=1,2 delims=:" %%a in ("%DISCOVERY_SVC%") do (
    call :LAUNCH "%%a" "%%b"
    call :WAIT_PORT "%%b" "%%a"
)

:: --- STEP 2: Start Microservices (Parallel) ---
echo.
echo ========================================================
echo    STARTING MICROSERVICES...
echo ========================================================
for %%s in (%MICROSERVICES%) do (
    for /f "tokens=1,2 delims=:" %%a in ("%%s") do (
        call :LAUNCH "%%a" "%%b"
    )
)

:: --- STEP 3: Wait for Microservices to be ready ---
echo.
echo [...] Waiting for all microservices to be ready...
for %%s in (%MICROSERVICES%) do (
    for /f "tokens=1,2 delims=:" %%a in ("%%s") do (
        call :WAIT_PORT "%%b" "%%a"
    )
)

:: --- STEP 4: Start API Gateway (Last Backend Service) ---
echo.
echo ========================================================
echo    STARTING API GATEWAY...
echo ========================================================
for /f "tokens=1,2 delims=:" %%a in ("%GATEWAY_SVC%") do (
    call :LAUNCH "%%a" "%%b"
    call :WAIT_PORT "%%b" "%%a"
)

:: --- STEP 5: Start Frontend (After Backend is ready) ---
echo.
echo ========================================================
echo    STARTING FRONTEND...
echo ========================================================
call :LAUNCH_FRONTEND "%FRONTEND_DIR%"

echo.
echo [*] All services & frontend started!
echo [*] Waiting for Frontend (5173) to be ready before opening browser...

:: Call the wait and open function (Port 5173, URL http://localhost:5173)
call :wait_and_open_impl 5173 "http://localhost:5173"

exit

:: ==========================================
:: 3. FUNCTIONS
:: ==========================================

:LAUNCH
:: %1 = Folder Name, %2 = Port
echo [+] Launching %~1 on port %~2...

:: Check if folder exists inside "backend"
if not exist "backend\%~1" (
    echo [!] Error: Folder "backend\%~1" not found!
    exit /b 1
)

:: Start command
start "%~1" /D "backend\%~1" cmd /k "title %~1 (%~2) & echo Starting %~1... & mvn spring-boot:run"
exit /b 0

:LAUNCH_FRONTEND
:: %1 = Frontend Folder Name
echo [+] Launching Frontend (%~1)...

:: Check if frontend folder exists in root
if not exist "%~1" (
    echo [!] Error: Folder "%~1" not found! Check CONFIGURATION.
    exit /b 1
)

:: Start npm install and npm dev/start
:: NOTE: Changed to 'npm dev' as requested. Change back to 'npm start' if using CRA.
start "Frontend" /D "%~1" cmd /k "title Frontend & echo Installing dependencies... & call npm install & echo Starting frontend... & call npm run dev"
exit /b 0

:WAIT_PORT
:: %1 = Port, %2 = Name
set "PORT=%~1"
set "NAME=%~2"
set /a COUNT=0

echo [...] Checking %NAME%:%PORT%...

:WAIT_LOOP
:: Use PowerShell to check port
powershell -NoProfile -Command "$tcp = New-Object System.Net.Sockets.TcpClient; try { $tcp.Connect('localhost', %PORT%); $tcp.Close(); exit 0 } catch { exit 1 }"

if %ERRORLEVEL% EQU 0 (
    echo      [OK] %NAME% is UP!
    exit /b 0
)

:: Wait 1 second before retrying
timeout /t 1 >nul
set /a COUNT+=1

:: Timeout after 60 seconds
if %COUNT% GEQ 60 (
    echo      [!] %NAME% timeout. Proceeding anyway...
    exit /b 1
)
goto :WAIT_LOOP

:: ============================================================
:: IMPLEMENTATION: WAIT AND OPEN BROWSER
:: ============================================================
:wait_and_open_impl
:: %1 = Port, %2 = Target URL
set "TARGET_PORT=%1"
set "TARGET_URL=%~2"

echo Waiting for port %TARGET_PORT% to become active...
:: Loop 60 times, 1s/time (Timeout 60s)
for /L %%i in (1,1,60) do (
    netstat -an | find ":%TARGET_PORT%" | find "LISTENING" >nul
    if !errorlevel! equ 0 (
        echo.
        echo [OK] Server UP on port %TARGET_PORT%! Opening browser...
        start "" "%TARGET_URL%"
        exit
    )
    timeout /t 1 >nul
)
echo.
echo [!] Server start timeout (60s). Browser will not open automatically.
exit