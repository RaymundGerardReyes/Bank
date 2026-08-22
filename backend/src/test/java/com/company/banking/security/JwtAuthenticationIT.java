package com.company.banking.security;

import com.company.banking.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import com.company.banking.customer.application.port.out.CustomerPersistencePort;
import com.company.banking.customer.domain.Customer;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class JwtAuthenticationIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @MockitoBean
    private CustomerPersistencePort customerPersistencePort;

    @Test
    public void requestWithoutJwt_ShouldReturn4xxClientError() throws Exception {
        mockMvc.perform(get("/api/v1/accounts")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void requestWithMalformedJwt_ShouldReturn4xxClientError() throws Exception {
        mockMvc.perform(get("/api/v1/accounts")
                .header(HttpHeaders.AUTHORIZATION, "Bearer completely-invalid-token-string")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void requestWithValidJwt_ShouldPassSecurityFilter() throws Exception {
        UserDetails mockUser = new User(
                "test@nova.bank",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mockUser);

        String validToken = jwtTokenProvider.generateToken(mockUser);

        Customer mockCustomer = Customer.builder().id(1L).email("test@nova.bank").build();
        when(customerPersistencePort.findByEmail("test@nova.bank")).thenReturn(Optional.of(mockCustomer));

        mockMvc.perform(get("/api/v1/accounts")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
