package com.sheggarwheels.backend.user.dto;

import com.sheggarwheels.backend.user.model.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class RegisterRequest {
    
    @NotBlank (message = "Name is required")
    @Size (min = 3, max = 20 , message = "Name too short or long")
    private String name;

    @NotBlank (message = "Email is required")
    @Email (message = "Provide valid email")
    @Size (max = 50, message = "Email too long")
    private String email;

    @NotBlank (message = "Phone is requierd")
    @Size (min = 10, max = 13 , message = "please imput valid phone number")
    private String phone;

    @NotBlank (message = "Password is required")
    @Size (min = 8, max = 20, message = "password must be between 8 and 20 characters")
    private String password;

    @NotEmpty (message = "At least one role must be selected")
    private Set<UserRole> roles;

    public RegisterRequest(){

    }

    public String getName(){
        return name;
    }
    public void setName(String name){
        this.name = name;
    }
    public String getEmail(){
        return email;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public String getPhone(){
        return phone;
    }
    public void setPhone(String phone){
        this.phone = phone;
    }
    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }
    public  Set<UserRole> getRoles(){
        return roles;
    }
    public void setRoles (Set<UserRole> roles){
        this.roles = roles;
    }
}
