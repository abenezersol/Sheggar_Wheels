package com.sheggarwheels.backend.user.controller;

import com.sheggarwheels.backend.user.dto.RegisterRequest;
import com.sheggarwheels.backend.user.dto.UserResponse;
import com.sheggarwheels.backend.user.model.User;
import com.sheggarwheels.backend.user.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController 
@RequestMapping ("/api/auth")
public class UserController {

    private final UserService userService;
    public UserController( UserService userService){
        this.userService =userService;
    }
    @PostMapping("/register")
    public ResponseEntity<UserResponse>registeruser(
        @Valid @RequestBody RegisterRequest request){
            User user = userService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword(),
                request.getRoles()
            );
            UserResponse response = new UserResponse(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
