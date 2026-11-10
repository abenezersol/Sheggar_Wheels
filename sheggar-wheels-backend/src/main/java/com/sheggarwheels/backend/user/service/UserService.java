package com.sheggarwheels.backend.user.service;

import com.sheggarwheels.backend.user.model.User;
import com.sheggarwheels.backend.user.model.AccountStatus;
import com.sheggarwheels.backend.user.model.UserRole;
import com.sheggarwheels.backend.user.repository.UserRepository;
import com.sheggarwheels.backend.common.exception.DuplicateEmailException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;


@Service 
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService ( UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    @Transactional 
    public User registerUser(String name, String email, String phone, String password, Set<UserRole> roles){

            String normalizedEmail = email.trim().toLowerCase();

            if (userRepository.existsByEmail(normalizedEmail)){
                throw new DuplicateEmailException(
                    "An account with this email already exists"
                );
            }

            if (roles == null || roles.isEmpty() || roles.contains(UserRole.ADMIN)) {
                throw new IllegalArgumentException(
                    "Please select a valid Role"
                );
            }

            User user = new User();

            user.setName(name.trim());
            user.setEmail(normalizedEmail);
            user.setPhone(phone.trim());
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setRoles(roles);
            user.setStatus(AccountStatus.ACTIVE);

            return userRepository.save(user);
    }
}
