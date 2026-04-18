// package com.invoice.tracker.common.exception;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.MethodArgumentNotValidException;
// import org.springframework.web.bind.annotation.ExceptionHandler;
// import org.springframework.web.bind.annotation.RestControllerAdvice;

// import com.invoice.tracker.common.response.ApiResponse;
// import com.invoice.tracker.common.response.ResponseBuilder;

// @RestControllerAdvice
// public class GlobalExceptionHandler {

//         private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

//         // ========================== BAD REQUEST (400) ===============================
//         @ExceptionHandler(IllegalArgumentException.class)
//         public ResponseEntity<ApiResponse<Object>> handleBadException(IllegalArgumentException ex) {

//                 log.warn("Bad Request: {}", ex.getMessage());

//                 ApiResponse<Object> response = ApiResponse.builder()
//                                 .success(false)
//                                 .message(ex.getMessage())
//                                 .data(null)
//                                 .build();

//                 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
//         }

//         // ============================= NOT FOUND (404) ===========================
//         @ExceptionHandler(ResourceNotFoundException.class)
//         public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {

//                 log.warn("Resource Not Found: {}", ex.getMessage());

//                 return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                                 .body(ApiResponse.builder()
//                                                 .success(false)
//                                                 .message(ex.getMessage())
//                                                 .data(null)
//                                                 .build());
//         }

//         // ======================= VALIDATION ERRORS (400) =========================
//         @ExceptionHandler(MethodArgumentNotValidException.class)
//         public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {

//                 String errorMessage = ex.getBindingResult()
//                                 .getFieldErrors()
//                                 .stream()
//                                 .findFirst()
//                                 .map(error -> error.getField() + " : " + error.getDefaultMessage())
//                                 .orElse("Validation Error");

//                 log.warn("Validation Error: {}", errorMessage);

//                 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                                 .body(ApiResponse.builder()
//                                                 .success(false)
//                                                 .message(errorMessage)
//                                                 .data(null)
//                                                 .build());
//         }

//         // ============================= FALLBACK (500) ===========================
//         @ExceptionHandler(Exception.class)
//         public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {

//                 log.error("Unexpected Exception: {}", ex.getMessage(), ex);

//                 ApiResponse<Object> response = ApiResponse.builder()
//                                 .success(false)
//                                 .message("Internal Server Error")
//                                 .data(null)
//                                 .build();

//                 return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//         }

//         @ExceptionHandler(UnauthorizedException.class)
//         public ResponseEntity<ApiResponse<Object>> handleUnauthorized(UnauthorizedException ex) {

//                 return ResponseBuilder.error(ex.getMessage(), HttpStatus.UNAUTHORIZED);
//         }
// }
























package com.invoice.tracker.common.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.invoice.tracker.common.response.ApiResponse;
import com.invoice.tracker.common.response.ResponseBuilder;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ================= AUTHENTICATION (401) =================
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthException(AuthenticationException ex) {

        log.warn("Authentication Error: {}", ex.getMessage());

        return ResponseBuilder.error("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // ================= ACCESS DENIED (403) =================
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(AccessDeniedException ex) {

        log.warn("Access Denied: {}", ex.getMessage());

        return ResponseBuilder.error("Access Denied", HttpStatus.FORBIDDEN);
    }

    // ================= UNAUTHORIZED (CUSTOM) =================
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorized(UnauthorizedException ex) {

        log.warn("Unauthorized: {}", ex.getMessage());

        return ResponseBuilder.error(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // ================= BAD REQUEST (400) =================
    @ExceptionHandler({ IllegalArgumentException.class, BadRequestException.class })
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(Exception ex) {

        log.warn("Bad Request: {}", ex.getMessage());

        return ResponseBuilder.error(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // ================= NOT FOUND (404) =================
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {

        log.warn("Resource Not Found: {}", ex.getMessage());

        return ResponseBuilder.error(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // ================= VALIDATION (400) =================
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getField() + " : " + error.getDefaultMessage())
                .orElse("Validation Error");

        log.warn("Validation Error: {}", errorMessage);

        return ResponseBuilder.error(errorMessage, HttpStatus.BAD_REQUEST);
    }

    // ================= FALLBACK (500) =================
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {

        log.error("Unexpected Exception: {}", ex.getMessage(), ex);

        return ResponseBuilder.error("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}