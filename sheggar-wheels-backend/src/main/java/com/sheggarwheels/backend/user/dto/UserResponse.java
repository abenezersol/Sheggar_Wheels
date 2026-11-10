package com.sheggarwheels.backend.user.dto;

import com.sheggarwheels.backend.user.model.User;
import com.sheggarwheels.backend.user.model.UserRole;
import com.sheggarwheels.backend.user.model.AccountStatus;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private Set<UserRole> roles;
    private AccountStatus status;
    private LocalDateTime createdAt;

    public UserResponse(User user){
        this.id = user.getid();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.roles = Set.copyOf(user.getRoles());
        this.status = user.getStatus();
        this.createdAt = user.getCreatedAt();
    }

    public UUID getid(){
        return id;
    }
    public String getName(){
        return name;
    }
    public String getEmail(){
        return email;
    }
    public String getPhone(){
        return phone;
    }
    public Set<UserRole> getRoles(){
        return roles;
    }
    public AccountStatus geStatus(){
        return status;
    }
    public LocalDateTime getCreatdAt(){
        return createdAt;
    }
}
