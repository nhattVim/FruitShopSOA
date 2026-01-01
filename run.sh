#!/bin/bash

set -e

ROOT_DIR=$(pwd)

declare -A DISCOVERY=(
    ["discovery-server"]="8761"
)

declare -A SERVICES=(
    ["customer-service"]="8081"
    ["inventory-service"]="8082"
    ["order-service"]="8083"
    ["payment-service"]="8084"
    ["pricing-service"]="8085"
    ["product-service"]="8086"
    ["identity-service"]="8087"
)

declare -A GATEWAY=(
    ["api-gateway"]="8080"
)

wait_for_port() {
    local port=$1
    local name=$2
    local count=0

    echo "⏳ Waiting for $name ($port)..."
    while ! (echo >/dev/tcp/localhost/$port) >/dev/null 2>&1; do
        sleep 0.5
        count=$((count + 1))

        if [ $count -ge 60 ]; then
            echo "❌ $name failed to start within 30 seconds"
            exit 1
        fi
    done
    echo "✅ $name started!"
}

start_discovery() {
    for srv in "${!DISCOVERY[@]}"; do
        port=${DISCOVERY[$srv]}
        echo "🚀 Starting $srv on port $port"
        cd "$ROOT_DIR/backend/$srv" && mvn spring-boot:run &
        wait_for_port "$port" "$srv"
    done
}

start_services() {
    for srv in "${!SERVICES[@]}"; do
        port=${SERVICES[$srv]}
        echo "🚀 Starting $srv on port $port"
        cd "$ROOT_DIR/backend/$srv" && mvn spring-boot:run &
    done

    for srv in "${!SERVICES[@]}"; do
        port=${SERVICES[$srv]}
        wait_for_port "$port" "$srv"
    done
}

start_gateway() {
    for srv in "${!GATEWAY[@]}"; do
        port=${GATEWAY[$srv]}
        echo "🚀 Starting $srv on port $port"
        cd "$ROOT_DIR/backend/$srv" && mvn spring-boot:run &
        wait_for_port "$port" "$srv"
    done
}

stop_ports() {
    echo "🛑 Stopping all microservices..."

    ports=()

    for p in "${DISCOVERY[@]}"; do ports+=("$p"); done
    for p in "${SERVICES[@]}"; do ports+=("$p"); done
    for p in "${GATEWAY[@]}"; do ports+=("$p"); done

    for port in "${ports[@]}"; do
        pids=$(lsof -t -i:"$port" 2>/dev/null || true)
        if [ -z "$pids" ]; then
            echo "⚠️ Port $port not running"
        else
            for pid in $pids; do
                echo "🔪 Killing port $port (PID $pid)"
                kill -9 "$pid" 2>/dev/null || true
            done
        fi
    done
}

case "$1" in
start)
    start_discovery
    start_services
    start_gateway
    echo "✨ All services started successfully!"
    ;;
stop)
    stop_ports
    echo "🧹 All services stopped!"
    ;;
*)
    echo "Usage: ./run.sh {start|stop}"
    ;;
esac
