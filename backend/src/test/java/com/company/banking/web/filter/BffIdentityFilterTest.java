package com.company.banking.web.filter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class BffIdentityFilterTest {

    private BffIdentityFilter filter;

    @BeforeEach
    void setUp() {
        filter = new BffIdentityFilter();
        ReflectionTestUtils.setField(filter, "expectedBffSecret", "test-bff-secret");
    }

    @Test
    void directApiRequestWithoutApiKeyOrBffHeaderIsRejected() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/transfers/internal");
        request.setRequestURI("/api/v1/transfers/internal");
        request.addHeader("Authorization", "Bearer jwt-like-session-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertEquals(401, response.getStatus());
        assertNull(chain.getRequest());
    }

    @Test
    void directApiRequestWithBearerApiKeyPassesToApiKeyFilter() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/v1/transfers/internal");
        request.setRequestURI("/api/v1/transfers/internal");
        request.addHeader("Authorization", "Bearer sk_test_example");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertEquals(200, response.getStatus());
        assertNotNull(chain.getRequest());
    }

    @Test
    void directApiRequestWithInternalBffHeaderStillPasses() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/accounts");
        request.setRequestURI("/api/v1/accounts");
        request.addHeader("X-Internal-BFF-Key", "test-bff-secret");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, response, chain);

        assertEquals(200, response.getStatus());
        assertNotNull(chain.getRequest());
    }
}
