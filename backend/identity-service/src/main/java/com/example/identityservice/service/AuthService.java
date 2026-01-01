package com.example.identityservice.service;

import com.example.identityservice.dto.AuthRequest;
import com.example.identityservice.entity.UserCredential;
import com.example.identityservice.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserCredentialRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;

    public String saveUser(UserCredential credential) {
        credential.setPassword(passwordEncoder.encode(credential.getPassword()));
        repository.save(credential);
        return "user added to the system";
    }

    public String generateToken(String username) {
        // Fetch role from DB
        UserCredential user = repository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return jwtService.generateToken(username, user.getRole());
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }
}
