package com.sheggarwheels.backend.common.exception;

import com.sheggarwheels.backend.common.dto.ApiError;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;


@RestControllerAdvice 
public class GlobalExceptionHandler {

    @ExceptionHandler (DuplicateEmailException.class)
    public ResponseEntity<ApiError> handleDuplicateEmail(
        DuplicateEmailException exception){
            ApiError error = new ApiError(
                LocalDateTime.now(),
                409,
                "Conflict",
                exception.getMessage(),
                Map.of()
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

    @ExceptionHandler (MethodArgumentNotValidException.class)
    public  ResponseEntity<ApiError> handlevalidationError(
        MethodArgumentNotValidException exception){
            Map<String, String> details = new LinkedHashMap<>();

            exception.getBindingResult()
                .getFieldErrors()
                .forEach(fieldError ->
                    details.put(
                        fieldError.getField(),
                        fieldError.getDefaultMessage()
                    )
                );
            ApiError error = new ApiError(
                LocalDateTime.now(),
                400,
                "Bad Request",
                "Please cheack your information",
                details
            );

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).
            body(error);
        }
        @ExceptionHandler (IllegalArgumentException.class)
        public ResponseEntity<ApiError>hndleBadRequest(
            IllegalArgumentException exception
        ){
            ApiError error = new ApiError(
                LocalDateTime.now(),
                400,
                "Bad Requestr",
                exception.getMessage(),
                Map.of()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(error);
        }

        @ExceptionHandler (Exception.class) 
        public ResponseEntity<ApiError> handleGeneralError(
            Exception exception,
            HttpServletRequest request
        ){
            System.err.println(
                "Unexpected Error at" + request.getRequestURI()
            );
            exception.printStackTrace();
            ApiError error = new ApiError(
                LocalDateTime.now(),
                500,
                "interna server Error",
                "Please try again later",
                Map.of()
            );

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(error);
        }
}
