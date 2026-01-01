package com.example.apigateway.filter;

import com.example.apigateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator validator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            if (validator.isSecured.test(exchange.getRequest())) {
                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null) {
                    throw new RuntimeException("missing authorization header");
                }

                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    authHeader = authHeader.substring(7);
                }
                try {
                    jwtUtil.validateToken(authHeader);

                    // RBAC Logic
                    Claims claims = jwtUtil.getAllClaimsFromToken(authHeader);
                    String role = claims.get("role", String.class);
                    String path = exchange.getRequest().getURI().getPath();
                    String method = exchange.getRequest().getMethod().name();

                    if (!hasPermission(role, path, method)) {
                        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                        return exchange.getResponse().setComplete();
                    }

                } catch (Exception e) {
                    System.out.println("invalid access...!" + e.getMessage());
                    throw new RuntimeException("unauthorized access to application");
                }
            }
            return chain.filter(exchange);
        });
    }

    private boolean hasPermission(String role, String path, String method) {
        if ("ROLE_ADMIN".equals(role)) {
            return true; // Admin has full access
        }
        if ("ROLE_STAFF".equals(role)) {
            // Staff restrictions
            if (path.contains("/api/pricing") || path.contains("/api/payment/refund")) {
                return false;
            }
            if (path.contains("/api/product") && !method.equals("GET")) {
                return false; // Staff can only view products
            }
            if (path.contains("/api/inventory") && 
                (path.contains("/inbound") || method.equals("DELETE"))) {
                return false; // Staff cannot add inbound or delete inventory
            }
            // Add more specific rules as needed
        }
        return true;
    }

    public static class Config {

    }
}
