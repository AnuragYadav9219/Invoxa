// package com.invoice.tracker.service.auth;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import com.invoice.tracker.common.exception.AccountDeletedException;
// import com.invoice.tracker.entity.auth.User;
// import com.invoice.tracker.repository.auth.UserRepository;
// import com.invoice.tracker.security.UserPrincipal;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class CustomUserDetailsService implements UserDetailsService {

//     private final UserRepository userRepository;

//     @Override
//     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

//         User user = userRepository.findByEmail(email)
//                 .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

//         if (user.isDeleted()) {
//             throw new AccountDeletedException("ACCOUNT_DELETED");
//         }

//         return new UserPrincipal(user);
//     }
// }

package com.invoice.tracker.service.auth;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.invoice.tracker.common.exception.AccountDeletedException;
import com.invoice.tracker.entity.auth.User;
import com.invoice.tracker.repository.auth.UserRepository;
import com.invoice.tracker.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Cacheable(value = "users", key = "#email")
    public UserDetails loadUserByUsername(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

        if (user.isDeleted()) {
            throw new AccountDeletedException("ACCOUNT_DELETED");
        }

        return new UserPrincipal(user);
    }
}