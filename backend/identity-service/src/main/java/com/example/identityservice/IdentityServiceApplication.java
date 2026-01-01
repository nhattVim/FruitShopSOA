package com.example.identityservice;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.identityservice.entity.UserCredential;
import com.example.identityservice.repository.UserCredentialRepository;
import com.example.identityservice.service.AuthService;

@SpringBootApplication
public class IdentityServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(IdentityServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(AuthService service, UserCredentialRepository repository) {
		return args -> {
			if (repository.findByUsername("admin").isEmpty()) {
				UserCredential admin = new UserCredential();
				admin.setUsername("admin");
				admin.setPassword("admin123");
				admin.setEmail("admin@fruitshop.com");
				admin.setRole("ROLE_ADMIN");
				service.saveUser(admin);
				System.out.println("Valid admin user created: admin/admin123");
			}

			if (repository.findByUsername("staff").isEmpty()) {
				UserCredential staff = new UserCredential();
				staff.setUsername("staff");
				staff.setPassword("staff123");
				staff.setEmail("staff@fruitshop.com");
				staff.setRole("ROLE_STAFF");
				service.saveUser(staff);
				System.out.println("Valid staff user created: staff/staff123");
			}
		};
	}
}
