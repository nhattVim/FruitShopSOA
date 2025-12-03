@echo off
setlocal EnableDelayedExpansion

:: ==========================================
:: 1. CONFIGURATION
:: ==========================================
:: Switch to the script's directory (to avoid path errors)
cd /d "%~dp0"
set "ROOT_DIR=%cd%"
title Microservices Launcher

:: Service List (Format: FolderName:Port)
set "DISCOVERY_SVC=discovery-service:8761"
set "GATEWAY_SVC=api-gateway:8080"
set "MICROSERVICES=customer-service:8081 inventory-service:8082 order-service:8083 payment-service:8084 pricing-service:8085 product-service:8086"

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

:: --- STEP 4: Start API Gateway (Last) ---
echo.
echo ========================================================
echo    STARTING API GATEWAY...
echo ========================================================
for /f "tokens=1,2 delims=:" %%a in ("%GATEWAY_SVC%") do (
    call :LAUNCH "%%a" "%%b"
    call :WAIT_PORT "%%b" "%%a"
)

echo.
echo [*] All services started! Exiting launcher...
timeout /t 3 >nul
exit

:: ==========================================
:: 3. FUNCTIONS
:: ==========================================

:LAUNCH
:: %1 = Folder Name, %2 = Port
echo [+] Launching %~1 on port %~2...

:: Check if the directory exists
if not exist "backend\%~1" (
    echo [!] Error: Folder "backend\%~1" not found!
    exit /b 1
)

:: Start command:
:: - Window Title: "TenService (Port)"
:: - cmd /k: Keep the window open to view logs and close manually
start "%~1" /D "backend\%~1" cmd /k "title %~1 (%~2) & echo Starting %~1... & mvn spring-boot:run"
exit /b 0

:WAIT_PORT
:: %1 = Port, %2 = Name
set "PORT=%~1"
set "NAME=%~2"
set /a COUNT=0

echo [...] Checking %NAME%:%PORT%...

:WAIT_LOOP
:: Use PowerShell to check port (faster and more accurate than telnet)
powershell -NoProfile -Command "$tcp = New-Object System.Net.Sockets.TcpClient; try { $tcp.Connect('localhost', %PORT%); $tcp.Close(); exit 0 } catch { exit 1 }"

if %ERRORLEVEL% EQU 0 (
    echo     [OK] %NAME% is UP!
    exit /b 0
)

:: Wait 1 second before retrying
timeout /t 1 >nul
set /a COUNT+=1

:: Timeout after 60 seconds
if %COUNT% GEQ 60 (
    echo     [!] %NAME% timeout. Proceeding anyway...
    exit /b 1
)
goto :WAIT_LOOP