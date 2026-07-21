// package com.invoice.tracker.config;

// import java.io.IOException;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.invoice.tracker.security.JwtUtil;
// import com.invoice.tracker.service.auth.CustomUserDetailsService;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;

// @Component
// @RequiredArgsConstructor
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     private final JwtUtil jwtUtil;
//     private final CustomUserDetailsService userDetailsService;

//     private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

//     @Override
//     protected void doFilterInternal(
//             HttpServletRequest request,
//             HttpServletResponse response,
//             FilterChain filterChain)
//             throws ServletException, IOException {

//         final String authHeader = request.getHeader("Authorization");

//         // No token → skip
//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             filterChain.doFilter(request, response);
//             return;
//         }

//         String jwt = authHeader.substring(7);

//         try {
//             String email = jwtUtil.extractUsername(jwt);

//             if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

//                 UserDetails userDetails = userDetailsService.loadUserByUsername(email);

//                 if (jwtUtil.isTokenValid(jwt, userDetails)) {

//                     UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                             userDetails,
//                             null,
//                             userDetails.getAuthorities());

//                     authToken.setDetails(
//                             new WebAuthenticationDetailsSource().buildDetails(request));

//                     SecurityContextHolder.getContext().setAuthentication(authToken);

//                     // tenant + role
//                     request.setAttribute("shopId", jwtUtil.getShopId(jwt));
//                     request.setAttribute("role", jwtUtil.getRole(jwt));
//                 }
//             }

//         } catch (Exception e) {
//             // NEVER break request
//             log.warn("JWT authentication failed: {}", e.getMessage());

//             // clear context just in case
//             SecurityContextHolder.clearContext();
//         }

//         filterChain.doFilter(request, response);
//     }

//     @Override
//     protected boolean shouldNotFilter(HttpServletRequest request) {
//         return "OPTIONS".equalsIgnoreCase(request.getMethod());
//     }
// }

package com.invoice.tracker.config;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.invoice.tracker.security.JwtUtil;
import com.invoice.tracker.security.UserPrincipal;
import com.invoice.tracker.service.auth.CustomUserDetailsService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            String jwt = authHeader.substring(7);

            // Parse JWT only once
            Claims claims = jwtUtil.getClaims(jwt);

            String email = jwtUtil.extractUsername(claims);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserByUsername(email);

                if (jwtUtil.isTokenValid(claims, principal)) {

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            principal.getAuthorities());

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Store commonly used values for this request
                    request.setAttribute("shopId", jwtUtil.getShopId(claims));
                    request.setAttribute("role", jwtUtil.getRole(claims));
                }
            }

        } catch (Exception ex) {

            SecurityContextHolder.clearContext();
            log.warn("JWT authentication failed: {}", ex.getMessage());

        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod());
    }
}