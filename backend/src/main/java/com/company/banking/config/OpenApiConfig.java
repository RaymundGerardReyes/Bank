package com.company.banking.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class OpenApiConfig {

    @Value("${API_PUBLIC_URL:https://novabank.ph.dev}")
    private String apiPublicUrl;

    @Value("${spring.profiles.active:prod}")
    private String activeProfile;

    // --- ENTERPRISE FIX: Whitelist ONLY External Banking Domains ---
    @Bean
    public GroupedOpenApi externalDeveloperApi() {
        return GroupedOpenApi.builder()
                .group("developer-gateway")
                // ONLY allow these domain paths to be documented
                .pathsToMatch(
                        "/api/v1/transactions/**",
                        "/api/v1/transfers/**",
                        "/api/v1/statements/**"
                )
                // EXPLICITLY strip internal operations from the spec
                .pathsToExclude(
                        "/api/v1/auth/**",
                        "/api/v1/admin/**",
                        "/api/v1/apikeys/**",
                        "/api/v1/customers/**"
                )
                .build();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        
        // Use a relative URL so the Scalar API viewer (rendered in the browser) uses
        // the current browser origin for all requests. This works correctly in both
        // dev (behind Nginx at localhost) and production (behind Nginx at the public domain).
        // An absolute URL would cause Scalar to fetch from the production API domain directly,
        // which fails due to browser network restrictions when accessed from the UI domain.
        String serverUrl = "/";

        return new OpenAPI()
                .addServersItem(new Server()
                        .url(serverUrl)
                        .description("NovaBank API Gateway"))
                .info(new Info()
                        .title("NovaBank Enterprise Developer Gateway")
                        .version("1.0.0")
                        .description("Public integration specifications for Virtual Account Management, Payment Orchestration, and Core Ledgers."))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("API Key")));
    }

    @Bean
    public OperationCustomizer transferCodeSampleCustomizer() {
        return (operation, handlerMethod) -> {
            String path = handlerMethod.getMethod().getName();
            if ("transferInternal".equals(path)) {
                operation.addExtension("x-codeSamples", buildInternalTransferSamples());
            }
            return operation;
        };
    }

    private List<Map<String, String>> buildInternalTransferSamples() {
        return List.of(
            Map.of(
                "lang", "curl",
                "label", "cURL",
                "source", """
                    curl -X POST "$API_BASE_URL/api/v1/transfers/internal" \\
                      -H "Content-Type: application/json" \\
                      -H "Authorization: Bearer $API_TOKEN" \\
                      -d '{
                        "sourceAccountNumber": "4859228705057459",
                        "destinationAccountNumber": "4859228705057460",
                        "amount": 150.00,
                        "idempotencyKey": "idemp-example",
                        "description": "Payment for consulting services",
                        "scheduledDate": "2026-09-01T10:00:00Z"
                      }'"""
            ),
            Map.of(
                "lang", "csharp",
                "label", "C# · RestSharp",
                "source", """
                    var baseUrl = Environment.GetEnvironmentVariable("API_BASE_URL")
                        ?? throw new InvalidOperationException("API_BASE_URL is not configured");
                    
                    var token = Environment.GetEnvironmentVariable("API_TOKEN")
                        ?? throw new InvalidOperationException("API_TOKEN is not configured");
                    
                    var client = new RestClient(baseUrl);
                    var request = new RestRequest("/api/v1/transfers/internal", Method.Post);
                    
                    request.AddHeader("Authorization", $"Bearer {token}");
                    
                    var body = new {
                        sourceAccountNumber = "4859228705057459",
                        destinationAccountNumber = "4859228705057460",
                        amount = 150.00m,
                        idempotencyKey = Guid.NewGuid().ToString(),
                        description = "Payment for consulting services",
                        scheduledDate = "2026-09-01T10:00:00Z"
                    };
                    
                    request.AddJsonBody(body);
                    
                    var response = await client.ExecuteAsync(request);"""
            ),
            Map.of(
                "lang", "go",
                "label", "Go · net/http",
                "source", """
                    baseURL := os.Getenv("API_BASE_URL")
                    if baseURL == "" {
                        log.Fatal("API_BASE_URL is not configured")
                    }
                    
                    token := os.Getenv("API_TOKEN")
                    if token == "" {
                        log.Fatal("API_TOKEN is not configured")
                    }
                    
                    type InternalTransferRequest struct {
                        SourceAccountNumber      string  `json:"sourceAccountNumber"`
                        DestinationAccountNumber string  `json:"destinationAccountNumber"`
                        Amount                   float64 `json:"amount"`
                        IdempotencyKey           string  `json:"idempotencyKey"`
                        Description              string  `json:"description,omitempty"`
                        ScheduledDate            string  `json:"scheduledDate,omitempty"`
                    }
                    
                    payload := InternalTransferRequest{
                        SourceAccountNumber:      "4859228705057459",
                        DestinationAccountNumber: "4859228705057460",
                        Amount:                   150.00,
                        IdempotencyKey:           "idemp-" + uuid.New().String(),
                        Description:              "Payment for consulting services",
                        ScheduledDate:            "2026-09-01T10:00:00Z",
                    }
                    
                    jsonData, err := json.Marshal(payload)
                    if err != nil {
                        log.Fatalf("failed to marshal request: %v", err)
                    }
                    
                    req, err := http.NewRequest("POST", baseURL+"/api/v1/transfers/internal", bytes.NewBuffer(jsonData))
                    if err != nil {
                        log.Fatalf("failed to build request: %v", err)
                    }
                    
                    req.Header.Set("Content-Type", "application/json")
                    req.Header.Set("Authorization", "Bearer "+token)
                    
                    resp, err := http.DefaultClient.Do(req)"""
            ),
            Map.of(
                "lang", "python",
                "label", "Python · httpx",
                "source", """
                    import os
                    import httpx
                    
                    base_url = os.environ.get("API_BASE_URL")
                    if not base_url:
                        raise RuntimeError("API_BASE_URL is not configured")
                    
                    token = os.environ.get("API_TOKEN")
                    if not token:
                        raise RuntimeError("API_TOKEN is not configured")
                    
                    payload = {
                        "sourceAccountNumber": "4859228705057459",
                        "destinationAccountNumber": "4859228705057460",
                        "amount": 150.00,
                        "idempotencyKey": "idemp-example",
                        "description": "Payment for consulting services",
                        "scheduledDate": "2026-09-01T10:00:00Z",
                    }
                    
                    response = httpx.post(
                        f"{base_url}/api/v1/transfers/internal",
                        json=payload,
                        headers={"Authorization": f"Bearer {token}"},
                    )
                    response.raise_for_status()"""
            ),
            Map.of(
                "lang", "java",
                "label", "Java · HttpClient",
                "source", """
                    String baseUrl = System.getenv("API_BASE_URL");
                    if (baseUrl == null) throw new IllegalStateException("API_BASE_URL is not configured");
                    
                    String token = System.getenv("API_TOKEN");
                    if (token == null) throw new IllegalStateException("API_TOKEN is not configured");
                    
                    String body = \"\"\"
                        {
                          "sourceAccountNumber": "4859228705057459",
                          "destinationAccountNumber": "4859228705057460",
                          "amount": 150.00,
                          "idempotencyKey": "idemp-" + UUID.randomUUID(),
                          "description": "Payment for consulting services",
                          "scheduledDate": "2026-09-01T10:00:00Z"
                        }\"\"\";
                    
                    HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(baseUrl + "/api/v1/transfers/internal"))
                        .header("Content-Type", "application/json")
                        .header("Authorization", "Bearer " + token)
                        .POST(HttpRequest.BodyPublishers.ofString(body))
                        .build();
                    
                    HttpResponse<String> response = HttpClient.newHttpClient()
                        .send(request, HttpResponse.BodyHandlers.ofString());"""
            )
        );
    }
}
