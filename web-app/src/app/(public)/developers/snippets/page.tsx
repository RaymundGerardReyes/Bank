"use client";

import React, { useState } from "react";
import DeveloperNavTabs from "@/components/docs/DeveloperNavTabs";
import CodeSnippetViewer from "@/components/docs/CodeSnippetViewer";
import MultiStackVerificationProof from "@/components/docs/MultiStackVerificationProof";
import { Card } from "@/components/ui/Card";
import {
  KeyRound,
  Lock,
  ArrowLeftRight,
  Webhook,
  RotateCw,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Server,
  CreditCard,
  RefreshCcw,
  FlaskConical,
  ShieldCheck,
  Zap,
} from "lucide-react";

type SdkLanguage = "C# .NET" | "Java" | "Python" | "TypeScript" | "cURL";
type ActiveWorkflow =
  | "auth"
  | "checkout_session"
  | "payment_intent"
  | "vam_transfer"
  | "refund"
  | "webhook_receiver"
  | "webhook_simulate";

export default function CodebaseSnippetsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<SdkLanguage>("C# .NET");
  const [activeWorkflow, setActiveWorkflow] = useState<ActiveWorkflow>("checkout_session");

  // Dynamic Credentials Context (reactive across all code generators)
  const [apiKey, setApiKey] = useState("sk_test_novabank_99214b");
  const [webhookSecret, setWebhookSecret] = useState("whsec_test_secret_123456789");
  const [baseUrl, setBaseUrl] = useState("https://api.novabank.ph");
  const [vamAccount, setVamAccount] = useState("4859220013371001");
  const [destAccount, setDestAccount] = useState("4859220013379999");

  const safeKey = apiKey.trim() || "sk_test_novabank_99214b";
  const safeSecret = webhookSecret.trim() || "whsec_test_secret_123456789";
  const safeBaseUrl = baseUrl.trim().replace(/\/+$/, "") || "https://api.novabank.ph";
  const safeVamAccount = vamAccount.trim() || "4859220013371001";
  const safeDestAccount = destAccount.trim() || "4859220013379999";

  const languages: { name: SdkLanguage; badge: string }[] = [
    { name: "C# .NET", badge: "ASP.NET 8 / 9" },
    { name: "Java", badge: "Spring Boot 3" },
    { name: "Python", badge: "FastAPI / httpx" },
    { name: "TypeScript", badge: "Express / Node" },
    { name: "cURL", badge: "Shell / CLI" },
  ];

  interface WorkflowDef {
    id: ActiveWorkflow;
    category: "gateway" | "webhooks";
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    summary: string;
    badge: string;
  }

  const workflows: WorkflowDef[] = [
    {
      id: "auth",
      category: "gateway",
      label: "1. Auth & Tracing Setup",
      icon: KeyRound,
      summary: "Initialize client headers, SHA-256 API Key verification, and UUIDv4 MDC correlation tracing.",
      badge: "Perimeter",
    },
    {
      id: "checkout_session",
      category: "gateway",
      label: "2. Checkout & QR Ph Session",
      icon: CreditCard,
      summary: "Create orchestrated checkout sessions returning hosted payment URLs and EMVCo QR Ph payloads.",
      badge: "Checkout",
    },
    {
      id: "payment_intent",
      category: "gateway",
      label: "3. Direct Payment Intent",
      icon: Lock,
      summary: "Charge accounts directly using client-side UUIDv4 idempotency keys and retry guards.",
      badge: "Idempotent",
    },
    {
      id: "vam_transfer",
      category: "gateway",
      label: "4. Internal VAM Transfer",
      icon: ArrowLeftRight,
      summary: "Execute atomic sub-ledger transfers adhering to strict 2D Virtual Account boundaries.",
      badge: "Ledger",
    },
    {
      id: "refund",
      category: "gateway",
      label: "5. Query Status & Refund",
      icon: RefreshCcw,
      summary: "Inspect payment intent status and issue idempotent partial or full transaction refunds.",
      badge: "Lifecycle",
    },
    {
      id: "webhook_receiver",
      category: "webhooks",
      label: "6. Secure Webhook Server",
      icon: Webhook,
      summary: "Production receiver verifying HMAC-SHA256 on raw body bytes with replay protection.",
      badge: "Security",
    },
    {
      id: "webhook_simulate",
      category: "webhooks",
      label: "7. Webhook Simulator & Testing",
      icon: FlaskConical,
      summary: "Test edge cases against NovaBank's simulation engine (VALID, INVALID_SIGNATURE, OLD_TIMESTAMP).",
      badge: "Sandbox",
    },
  ];

  // -------------------------------------------------------------
  // Workflow 1: Authentication & Setup Snippets
  // -------------------------------------------------------------
  const getAuthSnippet = (lang: SdkLanguage) => {
    switch (lang) {
      case "C# .NET":
        return {
          title: "NovaBankGatewayClient.cs",
          badge: "C# · HttpClient",
          code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;

public class NovaBankGatewayClient
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "${safeBaseUrl}";
    private const string ApiKey = "${safeKey}";

    public NovaBankGatewayClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri(BaseUrl);
        
        // Hardened Banking Perimeter Headers
        _httpClient.DefaultRequestHeaders.Add("X-API-Key", ApiKey);
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _httpClient.Timeout = TimeSpan.FromSeconds(15);
    }

    // Attach unique correlation ID to every outgoing request for end-to-end tracing in backend MDC
    public HttpRequestMessage CreateTracedRequest(HttpMethod method, string relativeUri)
    {
        var request = new HttpRequestMessage(method, relativeUri);
        request.Headers.Add("X-Request-Id", Guid.NewGuid().ToString());
        return request;
    }
}`,
          notes: "Injects SHA-256 verified API key and auto-generates X-Request-Id for distributed tracing.",
        };

      case "Java":
        return {
          title: "NovaBankClientConfig.java",
          badge: "Java · Spring Boot 3",
          code: `package com.merchant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Configuration
public class NovaBankClientConfig {

    private static final String BASE_URL = "${safeBaseUrl}";
    private static final String API_KEY = "${safeKey}";

    @Bean
    public RestClient novaBankRestClient() {
        return RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader("X-API-Key", API_KEY)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .requestInterceptor((request, body, execution) -> {
                    // Inject correlation ID for distributed tracing (captured in backend MDC)
                    request.getHeaders().add("X-Request-Id", UUID.randomUUID().toString());
                    return execution.execute(request, body);
                })
                .build();
    }
}`,
          notes: "Uses Spring 6+ RestClient with a dynamic request interceptor for correlation tracking.",
        };

      case "Python":
        return {
          title: "novabank_client.py",
          badge: "Python · httpx",
          code: `import uuid
import httpx

BASE_URL = "${safeBaseUrl}"
API_KEY = "${safeKey}"

class NovaBankClient:
    def __init__(self, base_url: str = BASE_URL, api_key: str = API_KEY):
        self.client = httpx.AsyncClient(
            base_url=base_url,
            headers={
                "X-API-Key": api_key,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            timeout=15.0
        )

    def get_traced_headers(self, idempotency_key: str = None) -> dict:
        headers = {
            "X-Request-Id": str(uuid.uuid4())
        }
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key
        return headers

    async def close(self):
        await self.client.aclose()`,
          notes: "Provides asynchronous connection pooling with automatic correlation ID generation.",
        };

      case "TypeScript":
        return {
          title: "novabankClient.ts",
          badge: "TypeScript · Node.js",
          code: `import { randomUUID } from "crypto";

export interface NovaBankClientConfig {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
}

export class NovaBankClient {
  private baseUrl: string;
  private apiKey: string;
  private timeoutMs: number;

  constructor(config?: NovaBankClientConfig) {
    this.baseUrl = (config?.baseUrl || "${safeBaseUrl}").replace(/\\/+$/, "");
    this.apiKey = config?.apiKey || "${safeKey}";
    this.timeoutMs = config?.timeoutMs || 15000;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      "X-API-Key": this.apiKey,
      "X-Request-Id": randomUUID(),
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    try {
      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(\`NovaBank API Error [\${response.status}]: \${errorBody}\`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }
}`,
          notes: "Built on native fetch with AbortSignal timeout management and request ID stamping.",
        };

      case "cURL":
      default:
        return {
          title: "test_connection.sh",
          badge: "cURL · Shell",
          code: `# Set environment variables
export API_BASE_URL="${safeBaseUrl}"
export API_KEY="${safeKey}"
export REQUEST_ID=$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)

# Verify API Key & Gateway Connectivity
curl -i -X GET "$API_BASE_URL/api/v1/accounts" \\
  -H "X-API-Key: $API_KEY" \\
  -H "X-Request-Id: $REQUEST_ID" \\
# Verify API Key, Gateway Connectivity, and MDC Correlation Tracing
curl -i -X GET "$API_BASE_URL/api/v1/health" \
  -H "X-API-Key: $API_KEY" \
  -H "X-Request-Id: $REQUEST_ID" \
  -H "Accept: application/json"`,
          notes: "Quick check to confirm that your API key is active and reaches the core gateway.",
          notes: "Pings /api/v1/health with X-API-Key and X-Request-Id to verify perimeter routing, latency, and MDC correlation tracking.",
        };
    }
  };

  // -------------------------------------------------------------
  // Workflow 2: Checkout Session Creation (QR Ph & Cards)
  // -------------------------------------------------------------
  const getCheckoutSessionSnippet = (lang: SdkLanguage) => {
    switch (lang) {
      case "C# .NET":
        return {
          title: "CreateCheckoutSessionService.cs",
          badge: "C# · ASP.NET",
          code: `using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class CheckoutService
{
    private readonly HttpClient _client;

    public CheckoutService(HttpClient client)
    {
        _client = client;
    }

    public async Task<string> CreateSessionAsync(decimal totalAmount, string reference)
    {
        // 1. Mandatory Idempotency Key to prevent duplicate order generation
        var idempotencyKey = $"idemp-{Guid.NewGuid()}";

        var payload = new
        {
            reference = reference,
            currency = "PHP",
            successUrl = "https://merchant.example.com/checkout/success",
            cancelUrl = "https://merchant.example.com/checkout/cancel",
            lineItems = new[]
            {
                new { name = "Order Payment", quantity = 1, unitAmount = totalAmount }
            }
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/gateway/checkout/sessions");
        request.Headers.Add("X-API-Key", "${safeKey}");
        request.Headers.Add("Idempotency-Key", idempotencyKey);
        request.Headers.Add("X-Request-Id", Guid.NewGuid().ToString());
        request.Content = JsonContent.Create(payload);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        // Response contains "checkoutUrl" and EMVCo "qrPayload"
        Console.WriteLine($"[CHECKOUT CREATED]: {json}");
        return json;
    }
}`,
          notes: "Returns checkout session with hosted payment URL and EMVCo TLV string for QR Ph display.",
        };

      case "Java":
        return {
          title: "CheckoutOrchestrationService.java",
          badge: "Java · Spring Boot",
          code: `package com.merchant.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutOrchestrationService {

    private final RestClient novaBankRestClient;

    public Map<String, Object> createCheckoutSession(BigDecimal amount, String orderRef) {
        String idempotencyKey = "idemp-" + UUID.randomUUID();

        Map<String, Object> lineItem = Map.of(
            "name", "Order " + orderRef,
            "quantity", 1,
            "unitAmount", amount
        );

        Map<String, Object> payload = Map.of(
            "reference", orderRef,
            "currency", "PHP",
            "successUrl", "https://merchant.example.com/checkout/success",
            "cancelUrl", "https://merchant.example.com/checkout/cancel",
            "lineItems", List.of(lineItem)
        );

        log.info("Creating Checkout Session for reference: {} [Idempotency: {}]", orderRef, idempotencyKey);

        return novaBankRestClient.post()
                .uri("/api/v1/gateway/checkout/sessions")
                .header("Idempotency-Key", idempotencyKey)
                .body(payload)
                .retrieve()
                .body(Map.class);
    }
}`,
          notes: "Dispatches checkout session request with idempotency protection and line items.",
        };

      case "Python":
        return {
          title: "create_checkout.py",
          badge: "Python · FastAPI/httpx",
          code: `import uuid
import httpx

async def create_checkout_session(amount: float, order_ref: str = "ORD-8821") -> dict:
    url = "${safeBaseUrl}/api/v1/gateway/checkout/sessions"
    idempotency_key = f"idemp-{uuid.uuid4()}"
    
    headers = {
        "X-API-Key": "${safeKey}",
        "Idempotency-Key": idempotency_key,
        "X-Request-Id": str(uuid.uuid4()),
        "Content-Type": "application/json"
    }

    payload = {
        "reference": order_ref,
        "currency": "PHP",
        "successUrl": "https://merchant.example.com/checkout/success",
        "cancelUrl": "https://merchant.example.com/checkout/cancel",
        "lineItems": [
            {"name": f"Payment for {order_ref}", "quantity": 1, "unitAmount": amount}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers, timeout=15.0)
        response.raise_for_status()
        data = response.json()
        print(f"Session created: {data.get('data', {}).get('checkoutUrl')}")
        return data`,
          notes: "Async creation of hosted checkout sessions returning QR Ph EMVCo payload & URL.",
        };

      case "TypeScript":
        return {
          title: "createCheckoutSession.ts",
          badge: "TypeScript · Node.js",
          code: `import { randomUUID } from "crypto";

export interface CheckoutParams {
  amount: number;
  orderReference: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createCheckoutSession(params: CheckoutParams) {
  const idempotencyKey = \`idemp-\${randomUUID()}\`;
  const url = "${safeBaseUrl}/api/v1/gateway/checkout/sessions";

  const payload = {
    reference: params.orderReference,
    currency: "PHP",
    successUrl: params.successUrl || "https://merchant.example.com/checkout/success",
    cancelUrl: params.cancelUrl || "https://merchant.example.com/checkout/cancel",
    lineItems: [
      { name: \`Payment \${params.orderReference}\`, quantity: 1, unitAmount: params.amount }
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-Key": "${safeKey}",
      "Idempotency-Key": idempotencyKey,
      "X-Request-Id": randomUUID(),
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(\`Checkout session creation failed [\${response.status}]: \${errorText}\`);
  }

  const result = await response.json();
  console.log("Checkout Session Response:", result.data);
  return result.data;
}`,
          notes: "Full TypeScript function for server actions or checkout API route handlers.",
        };

      case "cURL":
      default:
        return {
          title: "create_checkout_session.sh",
          badge: "cURL · Shell",
          code: `IDEMPOTENCY_KEY="idemp-$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)"

curl -X POST "${safeBaseUrl}/api/v1/gateway/checkout/sessions" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${safeKey}" \\
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \\
  -H "X-Request-Id: $IDEMPOTENCY_KEY" \\
  -d '{
    "reference": "ORD-2026-9901",
    "currency": "PHP",
    "successUrl": "https://merchant.example.com/success",
    "cancelUrl": "https://merchant.example.com/cancel",
    "lineItems": [
      {
        "name": "Invoice Settlement #9901",
        "quantity": 1,
        "unitAmount": 2500.00
      }
    ]
  }'`,
          notes: "Generates a fresh UUID idempotency key to prevent accidental duplicate charges.",
        };
    }
  };

  // -------------------------------------------------------------
  // Workflow 3: Direct Idempotent Payment Intent Snippets
  // -------------------------------------------------------------
  const getPaymentIntentSnippet = (lang: SdkLanguage) => {
    switch (lang) {
      case "C# .NET":
        return {
          title: "CreatePaymentIntentService.cs",
          badge: "C# · ASP.NET",
          code: `using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class PaymentIntentService
{
    private readonly HttpClient _client;

    public PaymentIntentService(HttpClient client)
    {
        _client = client;
    }

    public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency, string description)
    {
        // 1. Mandatory Banking Invariant: Unique Idempotency Key
        // Prevents duplicate billing during network timeouts or automated retries
        var idempotencyKey = $"idemp-{Guid.NewGuid()}";

        var payload = new
        {
            sourceAccountId = "${safeVamAccount}", // Bound to API Key's VAM ledger
            amount = amount,
            currency = currency,
            description = description
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/gateway/payments/intents");
        request.Headers.Add("X-API-Key", "${safeKey}");
        request.Headers.Add("Idempotency-Key", idempotencyKey);
        request.Headers.Add("X-Request-Id", Guid.NewGuid().ToString());
        request.Content = JsonContent.Create(payload);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"[PAYMENT INTENT CREATED]: {json}");
        return json;
    }
}`,
          notes: "Guards against double-charging by requiring an explicit Idempotency-Key header.",
        };

      case "Java":
        return {
          title: "PaymentOrchestrationService.java",
          badge: "Java · Spring Boot",
          code: `package com.merchant.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentOrchestrationService {

    private final RestClient novaBankRestClient;

    public Map<String, Object> createPaymentIntent(BigDecimal amount, String currency, String description) {
        // Enforce Idempotency-Key constraint
        String idempotencyKey = "idemp-" + UUID.randomUUID();

        Map<String, Object> payload = Map.of(
            "sourceAccountId", "${safeVamAccount}",
            "amount", amount,
            "currency", currency,
            "description", description
        );

        log.info("Creating Payment Intent with Idempotency Key: {}", idempotencyKey);

        return novaBankRestClient.post()
                .uri("/api/v1/gateway/payments/intents")
                .header("Idempotency-Key", idempotencyKey)
                .body(payload)
                .retrieve()
                .body(Map.class);
    }
}`,
          notes: "Synchronously creates payment intent while logging transaction idempotency UUID.",
        };

      case "Python":
        return {
          title: "create_payment.py",
          badge: "Python · FastAPI/httpx",
          code: `import uuid
import httpx

async def create_payment_intent(amount: float, currency: str = "PHP", description: str = "Order #1002") -> dict:
    url = "${safeBaseUrl}/api/v1/gateway/payments/intents"
    idempotency_key = f"idemp-{uuid.uuid4()}"
    
    headers = {
        "X-API-Key": "${safeKey}",
        "Idempotency-Key": idempotency_key,
        "X-Request-Id": str(uuid.uuid4()),
        "Content-Type": "application/json"
    }

    payload = {
        "sourceAccountId": "${safeVamAccount}",
        "amount": amount,
        "currency": currency,
        "description": description
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers, timeout=15.0)
        response.raise_for_status()
        data = response.json()
        print(f"Payment intent created: {data}")
        return data`,
          notes: "Async HTTP request using httpx with clean error raising on non-2xx status codes.",
        };

      case "TypeScript":
        return {
          title: "createPaymentIntent.ts",
          badge: "TypeScript · Node.js",
          code: `import { randomUUID } from "crypto";

export interface PaymentIntentParams {
  amount: number;
  currency?: string;
  description?: string;
}

export async function createPaymentIntent(params: PaymentIntentParams) {
  const idempotencyKey = \`idemp-\${randomUUID()}\`;
  const url = "${safeBaseUrl}/api/v1/gateway/payments/intents";

  const payload = {
    sourceAccountId: "${safeVamAccount}",
    amount: params.amount,
    currency: params.currency || "PHP",
    description: params.description || "Digital Commerce Payment",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-Key": "${safeKey}",
      "Idempotency-Key": idempotencyKey,
      "X-Request-Id": randomUUID(),
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(\`Payment intent creation failed: \${JSON.stringify(err)}\`);
  }

  const result = await response.json();
  console.log("Created Payment Intent:", result);
  return result;
}`,
          notes: "Standard TypeScript function ready to be called from Next.js server actions or Express handlers.",
        };

      case "cURL":
      default:
        return {
          title: "create_payment_intent.sh",
          badge: "cURL · Shell",
          code: `IDEMPOTENCY_KEY="idemp-$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)"

curl -X POST "${safeBaseUrl}/api/v1/gateway/payments/intents" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${safeKey}" \\
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \\
  -H "X-Request-Id: $IDEMPOTENCY_KEY" \\
  -d '{
    "sourceAccountId": "${safeVamAccount}",
    "amount": 1500.00,
    "currency": "PHP",
    "description": "Invoice Payment #8841"
  }'`,
          notes: "Generates a fresh UUID idempotency key to prevent accidental duplicate charges during testing.",
        };
    }
  };

  // -------------------------------------------------------------
  // Workflow 4: Internal VAM Transfer Snippets
  // -------------------------------------------------------------
  const getVamTransferSnippet = (lang: SdkLanguage) => {
    switch (lang) {
      case "C# .NET":
        return {
          title: "InternalTransferService.cs",
          badge: "C# · ASP.NET",
          code: `using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class InternalTransferService
{
    private readonly HttpClient _client;

    public InternalTransferService(HttpClient client)
    {
        _client = client;
    }

    public async Task ExecuteTransferAsync(decimal amount, string reference)
    {
        var idempotencyKey = $"idemp-{Guid.NewGuid()}";

        // Security Invariant: The source account MUST fall within the VAM sub-ledger
        // bound to your API key. Breaches trigger an immediate 403 Forbidden.
        var transferPayload = new
        {
            sourceAccountNumber = "${safeVamAccount}",
            destinationAccountNumber = "${safeDestAccount}",
            amount = amount,
            idempotencyKey = idempotencyKey,
            description = reference,
            scheduledDate = DateTime.UtcNow.ToString("o")
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/transfers/internal");
        request.Headers.Add("X-API-Key", "${safeKey}");
        request.Headers.Add("Idempotency-Key", idempotencyKey);
        request.Content = JsonContent.Create(transferPayload);

        var response = await _client.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new InvalidOperationException($"Transfer failed ({response.StatusCode}): {error}");
        }

        Console.WriteLine("Internal transfer committed to double-entry ledger.");
    }
}`,
          notes: "Executes atomic double-entry balance transfer with deterministic pessimistic locking on backend.",
        };

      case "Java":
        return {
          title: "VamTransferClient.java",
          badge: "Java · Spring Boot",
          code: `package com.merchant.transfer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VamTransferClient {

    private final RestClient novaBankRestClient;

    public void transferInternal(BigDecimal amount, String description) {
        String idempotencyKey = "idemp-" + UUID.randomUUID();

        Map<String, Object> body = Map.of(
            "sourceAccountNumber", "${safeVamAccount}",
            "destinationAccountNumber", "${safeDestAccount}",
            "amount", amount,
            "idempotencyKey", idempotencyKey,
            "description", description,
            "scheduledDate", Instant.now().toString()
        );

        log.info("Dispatching internal ledger transfer for amount: {}", amount);

        novaBankRestClient.post()
                .uri("/api/v1/transfers/internal")
                .header("Idempotency-Key", idempotencyKey)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }
}`,
          notes: "Dispatches transfer request. Systemic debits will equal systemic credits atomically.",
        };

      case "Python":
        return {
          title: "internal_transfer.py",
          badge: "Python · FastAPI/httpx",
          code: `import uuid
import datetime
import httpx

async def execute_internal_transfer(amount: float, memo: str = "Treasury allocation"):
    url = "${safeBaseUrl}/api/v1/transfers/internal"
    idempotency_key = f"idemp-{uuid.uuid4()}"

    payload = {
        "sourceAccountNumber": "${safeVamAccount}",
        "destinationAccountNumber": "${safeDestAccount}",
        "amount": amount,
        "idempotencyKey": idempotency_key,
        "description": memo,
        "scheduledDate": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    headers = {
        "X-API-Key": "${safeKey}",
        "Idempotency-Key": idempotency_key,
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers)
        if res.status_code == 403:
            raise PermissionError("VAM Boundary violation: API Key is not authorized for source account.")
        res.raise_for_status()
        print("Transfer confirmed:", res.json())`,
          notes: "Explicitly handles HTTP 403 VAM boundary violations to alert against unauthorized sub-ledger moves.",
        };

      case "TypeScript":
        return {
          title: "transferInternal.ts",
          badge: "TypeScript · Node.js",
          code: `import { randomUUID } from "crypto";

export async function executeVamTransfer(amount: number, memo = "Supplier disbursement") {
  const idempotencyKey = \`idemp-\${randomUUID()}\`;
  const url = "${safeBaseUrl}/api/v1/transfers/internal";

  const payload = {
    sourceAccountNumber: "${safeVamAccount}",
    destinationAccountNumber: "${safeDestAccount}",
    amount,
    idempotencyKey,
    description: memo,
    scheduledDate: new Date().toISOString(),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-Key": "${safeKey}",
      "Idempotency-Key": idempotencyKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 403) {
    throw new Error("VAM Violation: The API key is restricted from debiting source account ${safeVamAccount}");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(\`Transfer error [\${response.status}]: \${errorText}\`);
  }

  return await response.json();
}`,
          notes: "Checks VAM boundaries before returning the double-entry confirmation payload.",
        };

      case "cURL":
      default:
        return {
          title: "transfer_internal.sh",
          badge: "cURL · Shell",
          code: `IDEMPOTENCY_KEY="idemp-$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)"

curl -X POST "${safeBaseUrl}/api/v1/transfers/internal" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${safeKey}" \\
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \\
  -d '{
    "sourceAccountNumber": "${safeVamAccount}",
    "destinationAccountNumber": "${safeDestAccount}",
    "amount": 250.00,
    "idempotencyKey": "'$IDEMPOTENCY_KEY'",
    "description": "Vendor payout",
    "scheduledDate": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
  }'`,
          notes: "Post internal transfer using ISO-8601 UTC timestamp and UUID idempotency key.",
        };
    }
  };

  // -------------------------------------------------------------
  // Workflow 5: Payment Status & Refund Operations
  // -------------------------------------------------------------
  const getRefundSnippet = (lang: SdkLanguage) => {
    switch (lang) {
      case "C# .NET":
        return {
          title: "PaymentRefundService.cs",
          badge: "C# · ASP.NET",
          code: `using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class PaymentRefundService
{
    private readonly HttpClient _client;

    public PaymentRefundService(HttpClient client)
    {
        _client = client;
    }

    // 1. Inspect Payment Intent Status
    public async Task<string> GetPaymentStatusAsync(string intentId)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/gateway/payments/{intentId}");
        request.Headers.Add("X-API-Key", "${safeKey}");
        
        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }

    // 2. Issue Idempotent Refund
    public async Task<string> RefundPaymentAsync(string intentId, decimal amount, string reason)
    {
        var idempotencyKey = $"ref-idemp-{Guid.NewGuid()}";
        var payload = new { amount = amount, reason = reason };

        using var request = new HttpRequestMessage(HttpMethod.Post, $"/api/v1/gateway/payments/{intentId}/refund");
        request.Headers.Add("X-API-Key", "${safeKey}");
        request.Headers.Add("Idempotency-Key", idempotencyKey);
        request.Content = JsonContent.Create(payload);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync();
    }
}`,
          notes: "Fetches status and executes transactional refund producing ledger reversal events.",
        };

      case "Java":
        return {
          title: "PaymentRefundService.java",
          badge: "Java · Spring Boot",
          code: `package com.merchant.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentRefundService {

    private final RestClient novaBankRestClient;

    public Map<String, Object> getPaymentStatus(String intentId) {
        return novaBankRestClient.get()
                .uri("/api/v1/gateway/payments/{intentId}", intentId)
                .retrieve()
                .body(Map.class);
    }

    public Map<String, Object> refundPayment(String intentId, BigDecimal amount, String reason) {
        String idempotencyKey = "ref-idemp-" + UUID.randomUUID();
        Map<String, Object> body = Map.of("amount", amount, "reason", reason);

        log.info("Issuing refund for Intent {} [Idempotency: {}]", intentId, idempotencyKey);

        return novaBankRestClient.post()
                .uri("/api/v1/gateway/payments/{intentId}/refund", intentId)
                .header("Idempotency-Key", idempotencyKey)
                .body(body)
                .retrieve()
                .body(Map.class);
    }
}`,
          notes: "Synchronously queries payment state and issues double-entry refund.",
        };

      case "Python":
        return {
          title: "refund_service.py",
          badge: "Python · FastAPI/httpx",
          code: `import uuid
import httpx

async def get_payment_status(intent_id: str) -> dict:
    url = f"${safeBaseUrl}/api/v1/gateway/payments/{intent_id}"
    headers = {"X-API-Key": "${safeKey}"}
    async with httpx.AsyncClient() as client:
        res = await client.get(url, headers=headers)
        res.raise_for_status()
        return res.json()

async def refund_payment(intent_id: str, amount: float, reason: str = "customer_cancellation") -> dict:
    url = f"${safeBaseUrl}/api/v1/gateway/payments/{intent_id}/refund"
    idempotency_key = f"ref-idemp-{uuid.uuid4()}"
    headers = {
        "X-API-Key": "${safeKey}",
        "Idempotency-Key": idempotency_key,
        "Content-Type": "application/json"
    }
    payload = {"amount": amount, "reason": reason}

    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers)
        res.raise_for_status()
        return res.json()`,
          notes: "Query intent and execute idempotent refund with automatic exception handling.",
        };

      case "TypeScript":
        return {
          title: "paymentRefund.ts",
          badge: "TypeScript · Node.js",
          code: `import { randomUUID } from "crypto";

const BASE_URL = "${safeBaseUrl}";
const API_KEY = "${safeKey}";

export async function getPaymentStatus(intentId: string) {
  const response = await fetch(\`\${BASE_URL}/api/v1/gateway/payments/\${intentId}\`, {
    headers: { "X-API-Key": API_KEY, "Accept": "application/json" },
  });
  if (!response.ok) throw new Error(\`Failed to get payment: \${response.statusText}\`);
  return await response.json();
}

export async function refundPayment(intentId: string, amount: number, reason = "customer_cancellation") {
  const idempotencyKey = \`ref-idemp-\${randomUUID()}\`;
  const response = await fetch(\`\${BASE_URL}/api/v1/gateway/payments/\${intentId}/refund\`, {
    method: "POST",
    headers: {
      "X-API-Key": API_KEY,
      "Idempotency-Key": idempotencyKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ amount, reason }),
  });
  if (!response.ok) throw new Error(\`Refund failed: \${await response.text()}\`);
  return await response.json();
}`,
          notes: "TypeScript functions for checking payment status and initiating idempotent refunds.",
        };

      case "cURL":
      default:
        return {
          title: "refund_payment.sh",
          badge: "cURL · Shell",
          code: `INTENT_ID="pay_a1b2c3d4e5"
IDEMPOTENCY_KEY="ref-idemp-$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)"

# 1. Inspect Payment Intent Status
curl -i -X GET "${safeBaseUrl}/api/v1/gateway/payments/$INTENT_ID" \\
  -H "X-API-Key: ${safeKey}"

# 2. Issue Idempotent Refund
curl -i -X POST "${safeBaseUrl}/api/v1/gateway/payments/$INTENT_ID/refund" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${safeKey}" \\
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \\
  -d '{
    "amount": 1500.00,
    "reason": "customer_cancellation"
  }'`,
          notes: "Query intent status and issue idempotent refund using shell curl.",
        };
    }
  };

  // -------------------------------------------------------------
  // Workflow 6: Secure Webhook Receiver Server Snippets
  // -------------------------------------------------------------
  const getWebhookReceiverSnippet = (lang: SdkLanguage) => {
    switch (lang) {
      case "C# .NET":
        return {
          title: "NovaBankWebhookController.cs",
          badge: "C# · ASP.NET Core",
          code: `using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/webhooks/paymongo")]
public class NovaBankWebhookController : ControllerBase
{
    private const string WebhookSecret = "${safeSecret}";

    [HttpPost]
    public async Task<IActionResult> HandleWebhookAsync()
    {
        // 1. Read Raw Request Bytes (DO NOT parse JSON before signature check!)
        string rawBody;
        using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
        {
            rawBody = await reader.ReadToEndAsync();
        }

        // 2. Extract Signature Header (Format: t=<timestamp>,te=<test_hmac>,li=<live_hmac>)
        if (!Request.Headers.TryGetValue("Paymongo-Signature", out var signatureHeader))
        {
            return Unauthorized("Missing Paymongo-Signature header");
        }

        var (timestamp, expectedSignature) = ParseSignatureHeader(signatureHeader);
        if (string.IsNullOrEmpty(timestamp) || string.IsNullOrEmpty(expectedSignature))
        {
            return Unauthorized("Malformed Paymongo-Signature header");
        }

        // 3. Prevent Replay Attacks: Check timestamp tolerance (300 seconds / 5 minutes)
        if (!long.TryParse(timestamp, out var eventTime))
        {
            return BadRequest("Invalid timestamp in signature");
        }

        // Handle both epoch seconds (10 digits) and epoch milliseconds (13 digits)
        if (eventTime > 10_000_000_000L)
        {
            eventTime /= 1000L;
        }

        var currentTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        if (Math.Abs(currentTime - eventTime) > 300)
        {
            return BadRequest("Webhook timestamp expired (replay attack guard)");
        }

        // 4. Compute HMAC-SHA256 over: "{timestamp}.{rawBody}"
        var signedPayload = $"{timestamp}.{rawBody}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(WebhookSecret));
        var computedHashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(signedPayload));
        var computedHmacHex = Convert.ToHexString(computedHashBytes).ToLowerInvariant();

        // 5. Constant-Time Equality Comparison to defeat timing attacks
        var computedBytes = Encoding.UTF8.GetBytes(computedHmacHex);
        var expectedBytes = Encoding.UTF8.GetBytes(expectedSignature.ToLowerInvariant());

        if (!CryptographicOperations.FixedTimeEquals(computedBytes, expectedBytes))
        {
            return Unauthorized("Invalid webhook signature HMAC");
        }

        // 6. Signature Verified! Now safely parse the JSON payload
        using var jsonDoc = JsonDocument.Parse(rawBody);
        var root = jsonDoc.RootElement;
        var eventId = root.GetProperty("data").GetProperty("id").GetString();
        var eventType = root.GetProperty("data").GetProperty("attributes").GetProperty("type").GetString();

        // 7. Idempotency Check in Database (Prevents duplicate balance crediting)
        if (await IsEventAlreadyProcessedAsync(eventId))
        {
            // Silently acknowledge duplicate events to stop delivery retries
            return Ok(new { status = "already_processed" });
        }

        // 8. Process business logic (e.g., mark invoice paid, credit ledger)
        await ProcessBusinessEventAsync(eventType, root);

        // Acknowledge within 5 seconds with HTTP 200 OK
        return Ok(new { status = "success" });
    }

    private (string timestamp, string signature) ParseSignatureHeader(string header)
    {
        string ts = null, sig = null;
        foreach (var part in header.Split(','))
        {
            var kv = part.Trim().Split('=');
            if (kv.Length != 2) continue;
            if (kv[0] == "t") ts = kv[1];
            if (kv[0] == "te" || kv[0] == "li") sig = kv[1];
        }
        return (ts, sig);
    }

    private Task<bool> IsEventAlreadyProcessedAsync(string eventId) => Task.FromResult(false); // Query DB
    private Task ProcessBusinessEventAsync(string type, JsonElement data) => Task.CompletedTask;
}`,
          notes: "Full ASP.NET Core controller with raw stream reading, FixedTimeEquals timing protection, and replay guards.",
        };

      case "Java":
        return {
          title: "NovaBankWebhookController.java",
          badge: "Java · Spring Boot 3",
          code: `package com.merchant.webhook;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;

@RestController
@RequestMapping("/api/v1/webhooks/paymongo")
@Slf4j
public class NovaBankWebhookController {

    private static final String WEBHOOK_SECRET = "${safeSecret}";
    private static final long MAX_REPLAY_TOLERANCE_SECONDS = 300;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> handleInboundWebhook(
            @RequestHeader(value = "Paymongo-Signature", required = false) String signatureHeader,
            @RequestBody byte[] rawPayloadBytes // CRITICAL: Verbatim raw bytes — NEVER deserialize first!
    ) {
        if (signatureHeader == null || signatureHeader.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing Paymongo-Signature");
        }

        // 1. Parse Paymongo-Signature (t=<timestamp>,te=<test_hmac>,li=<live_hmac>)
        String timestamp = null;
        String signature = null;
        for (String part : signatureHeader.split(",")) {
            String[] kv = part.trim().split("=");
            if (kv.length == 2) {
                if ("t".equals(kv[0])) timestamp = kv[1];
                if ("te".equals(kv[0]) || "li".equals(kv[0])) signature = kv[1];
            }
        }

        if (timestamp == null || signature == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Malformed signature header");
        }

        // 2. Replay Attack Prevention (Normalize both epoch seconds and epoch milliseconds)
        long eventTime;
        try {
            eventTime = Long.parseLong(timestamp);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid timestamp in signature");
        }

        if (eventTime > 10_000_000_000L) {
            eventTime /= 1000L;
        }

        long now = Instant.now().getEpochSecond();
        if (Math.abs(now - eventTime) > MAX_REPLAY_TOLERANCE_SECONDS) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook timestamp expired");
        }

        // 3. Compute HMAC-SHA256 over: "{timestamp}.{rawBody}"
        String rawPayload = new String(rawPayloadBytes, StandardCharsets.UTF_8);
        String signedPayload = timestamp + "." + rawPayload;

        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac.init(keySpec);
            byte[] computedHash = hmac.doFinal(signedPayload.getBytes(StandardCharsets.UTF_8));
            String computedHex = HexFormat.of().formatHex(computedHash);

            // 4. Constant-Time Verification to defeat timing attacks (Case-Insensitive)
            byte[] computedBytes = computedHex.toLowerCase().getBytes(StandardCharsets.UTF_8);
            byte[] expectedBytes = signature.toLowerCase().getBytes(StandardCharsets.UTF_8);

            if (!MessageDigest.isEqual(computedBytes, expectedBytes)) {
                log.warn("[WEBHOOK SECURITY] HMAC signature mismatch.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid HMAC signature");
            }

            // 5. Signature Verified! Idempotent event handling
            log.info("[WEBHOOK] Verified payload received successfully. Dispatching to event pipeline...");
            return ResponseEntity.ok("{\\"status\\":\\"success\\"}");

        } catch (Exception e) {
            log.error("[WEBHOOK ERROR] Cryptographic failure", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Crypto error");
        }
    }
}`,
          notes: "Uses byte[] raw payload injection and MessageDigest.isEqual for timing-safe signature checking.",
        };

      case "Python":
        return {
          title: "webhook_server.py",
          badge: "Python · FastAPI",
          code: `import time
import hmac
import hashlib
import json
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse

app = FastAPI(title="Merchant Webhook Receiver")
WEBHOOK_SECRET = "${safeSecret}"
TOLERANCE_SECONDS = 300

@app.post("/api/v1/webhooks/paymongo")
async def handle_paymongo_webhook(request: Request):
    # 1. Extract Raw Bytes before any JSON parsing
    raw_body_bytes = await request.body()
    raw_body = raw_body_bytes.decode("utf-8")

    # 2. Extract Signature Header
    sig_header = request.headers.get("Paymongo-Signature")
    if not sig_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Paymongo-Signature")

    # Parse t=<timestamp>,te=<test_hmac>,li=<live_hmac>
    header_parts = dict(part.split("=") for part in sig_header.split(",") if "=" in part)
    timestamp = header_parts.get("t")
    received_hmac = header_parts.get("te") or header_parts.get("li")

    if not timestamp or not received_hmac:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed signature header")

    # 3. Replay Protection Window (Handle seconds and milliseconds)
    try:
        event_time = int(timestamp)
    except (ValueError, TypeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid timestamp in signature")

    if event_time > 10_000_000_000:
        event_time //= 1000

    current_time = int(time.time())
    if abs(current_time - event_time) > TOLERANCE_SECONDS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Webhook timestamp expired")

    # 4. Compute HMAC-SHA256
    signed_payload = f"{timestamp}.{raw_body}".encode("utf-8")
    computed_hmac = hmac.new(
        WEBHOOK_SECRET.encode("utf-8"),
        signed_payload,
        hashlib.sha256
    ).hexdigest()

    # 5. Timing-safe constant-time string comparison
    if not hmac.compare_digest(computed_hmac.lower(), received_hmac.lower()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid HMAC signature")

    # 6. Payload is authentic! Now parse JSON safely
    payload = json.loads(raw_body)
    event_id = payload.get("data", {}).get("id")
    event_type = payload.get("data", {}).get("attributes", {}).get("type")

    print(f"[VERIFIED WEBHOOK]: Event {event_id} ({event_type})")
    
    # 7. Deduplicate in database and return 200 OK
    return JSONResponse(status_code=200, content={"status": "success", "event_id": event_id})`,
          notes: "FastAPI endpoint using hmac.compare_digest and raw body byte inspection.",
        };

      case "TypeScript":
        return {
          title: "webhookReceiver.ts",
          badge: "TypeScript · Express.js",
          code: `import express, { Request, Response } from "express";
import crypto from "crypto";

const app = express();
const WEBHOOK_SECRET = "${safeSecret}";
const MAX_REPLAY_TOLERANCE_SECS = 300;

// CRITICAL: Preserve raw request body Buffer BEFORE global express.json()
// If using global express.json(), register this route BEFORE or use express.raw({ type: "*/*" })
app.post(
  "/api/v1/webhooks/paymongo",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response): void => {
    const signatureHeader = (req.headers["paymongo-signature"] as string) || "";
    if (!signatureHeader) {
      res.status(401).json({ error: "Missing Paymongo-Signature header" });
      return;
    }

    // 1. Parse t=<timestamp>,te=<test_hmac>,li=<live_hmac>
    const parts = signatureHeader.split(",").reduce((acc, curr) => {
      const [key, val] = curr.trim().split("=");
      if (key && val) acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    const timestamp = parts["t"];
    const expectedHmac = parts["te"] || parts["li"];

    if (!timestamp || !expectedHmac) {
      res.status(401).json({ error: "Malformed Paymongo-Signature header" });
      return;
    }

    // 2. Replay Attack Protection (Normalize seconds and milliseconds)
    let eventTime = parseInt(timestamp, 10);
    if (isNaN(eventTime)) {
      res.status(400).json({ error: "Invalid timestamp in signature header" });
      return;
    }
    if (eventTime > 10_000_000_000) {
      eventTime = Math.floor(eventTime / 1000);
    }

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - eventTime) > MAX_REPLAY_TOLERANCE_SECS) {
      res.status(400).json({ error: "Webhook timestamp expired (replay attack guard)" });
      return;
    }

    // 3. Compute HMAC-SHA256 on: \`\${timestamp}.\${rawBody}\`
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf-8") : String(req.body);
    const signedPayload = \`\${timestamp}.\${rawBody}\`;

    const computedHmac = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");

    // 4. Timing-Safe Constant-Time Comparison (Case-Insensitive)
    const computedBuffer = Buffer.from(computedHmac.toLowerCase(), "utf-8");
    const expectedBuffer = Buffer.from(expectedHmac.toLowerCase(), "utf-8");

    if (
      computedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(computedBuffer, expectedBuffer)
    ) {
      res.status(401).json({ error: "Invalid webhook HMAC signature" });
      return;
    }

    // 5. Signature valid! Parse JSON and handle idempotency
    const payload = JSON.parse(rawBody);
    console.log("[WEBHOOK VERIFIED]:", payload.data?.id, payload.data?.attributes?.type);

    res.status(200).json({ status: "acknowledged" });
  }
);

app.listen(4000, () => console.log("Webhook receiver listening on port 4000"));`,
          notes: "Express handler with express.raw middleware and crypto.timingSafeEqual comparison.",
        };

      case "cURL":
      default:
        return {
          title: "simulate_webhook.sh",
          badge: "cURL / OpenSSL",
          code: `WEBHOOK_SECRET="${safeSecret}"
WEBHOOK_RECEIVER_URL="http://localhost:4000/api/v1/webhooks/paymongo"
TIMESTAMP=$(date +%s)
EVENT_ID="evt_$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid | cut -d- -f1)"

# 1. Prepare JSON Body
PAYLOAD=$(cat <<EOF
{
  "data": {
    "id": "$EVENT_ID",
    "type": "event",
    "attributes": {
      "type": "payment.paid",
      "livemode": false,
      "data": {
        "id": "pay_test_12345",
        "type": "payment",
        "attributes": {
          "amount": 150000,
          "currency": "PHP",
          "status": "paid"
        }
      }
    }
  }
}
EOF
)

# 2. Compute HMAC-SHA256 Signature over: "$TIMESTAMP.$PAYLOAD"
SIGNED_PAYLOAD="$TIMESTAMP.$PAYLOAD"
HMAC=$(printf '%s' "$SIGNED_PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | sed 's/^.* //')

echo "Generated Timestamp: $TIMESTAMP"
echo "Generated HMAC: $HMAC"

# 3. Deliver Webhook with Paymongo-Signature header
curl -i -X POST "$WEBHOOK_RECEIVER_URL" \\
  -H "Content-Type: application/json" \\
  -H "Paymongo-Signature: t=$TIMESTAMP,te=$HMAC,li=$HMAC" \\
  -d "$PAYLOAD"`,
          notes: "Local shell test script computing HMAC-SHA256 via openssl to test your local receiver endpoint.",
        };
    }
  };

  // -------------------------------------------------------------
  // Workflow 7: Webhook Simulator & Testing Engine
  // -------------------------------------------------------------
  const getWebhookSimulateSnippet = (lang: SdkLanguage) => {
    switch (lang) {
      case "C# .NET":
        return {
          title: "WebhookSimulationTest.cs",
          badge: "C# · Testing",
          code: `using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

public class WebhookSimulatorTest
{
    private readonly HttpClient _client;

    public WebhookSimulatorTest(HttpClient client)
    {
        _client = client;
    }

    // Trigger NovaBank's built-in webhook simulator
    // Scenarios: VALID, INVALID_SIGNATURE, OLD_TIMESTAMP, DUPLICATE, WRONG_ENVIRONMENT
    public async Task RunSimulationAsync(string scenario = "VALID")
    {
        var payload = new
        {
            eventType = "payment.paid",
            eventId = $"evt_{Guid.NewGuid():N}",
            reference = "pay_test_99214b",
            scenario = scenario
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/v1/webhooks/simulate");
        request.Headers.Add("X-API-Key", "${safeKey}");
        request.Content = JsonContent.Create(payload);

        var response = await _client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var resultJson = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"[SIMULATION RESULT - {scenario}]: {resultJson}");
    }
}`,
          notes: "Triggers backend simulation engine to stress-test your receiver against real edge cases.",
        };

      case "Java":
        return {
          title: "WebhookSimulatorTest.java",
          badge: "Java · Spring Boot",
          code: `package com.merchant.test;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebhookSimulatorTest {

    private final RestClient novaBankRestClient;

    public Map<String, Object> triggerSimulation(String scenario) {
        Map<String, Object> payload = Map.of(
            "eventType", "payment.paid",
            "eventId", "evt_" + UUID.randomUUID(),
            "reference", "pay_test_99214b",
            "scenario", scenario // e.g. VALID, INVALID_SIGNATURE, OLD_TIMESTAMP
        );

        log.info("Firing simulated webhook scenario: {}", scenario);

        return novaBankRestClient.post()
                .uri("/api/v1/webhooks/simulate")
                .body(payload)
                .retrieve()
                .body(Map.class);
    }
}`,
          notes: "Invokes /api/v1/webhooks/simulate to verify your application's signature verification logic.",
        };

      case "Python":
        return {
          title: "test_webhook_simulator.py",
          badge: "Python · httpx",
          code: `import uuid
import httpx

SIMULATOR_URL = "${safeBaseUrl}/api/v1/webhooks/simulate"
API_KEY = "${safeKey}"

async def simulate_webhook_event(scenario: str = "VALID") -> dict:
    """
    Test scenarios supported by NovaBank Simulator:
    - VALID: Normal valid delivery with correct HMAC
    - INVALID_SIGNATURE: Deliberately tampered HMAC hash
    - OLD_TIMESTAMP: 24-hour old timestamp to test replay protection
    - MALFORMED_JSON: Truncated JSON syntax error
    """
    payload = {
        "eventType": "payment.paid",
        "eventId": f"evt_{uuid.uuid4().hex[:12]}",
        "reference": "pay_test_sim_01",
        "scenario": scenario
    }

    headers = {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(SIMULATOR_URL, json=payload, headers=headers)
        res.raise_for_status()
        result = res.json()
        print(f"Scenario [{scenario}] Result:", result)
        return result`,
          notes: "Calls simulator endpoint to verify that invalid signatures and replay attacks are rejected.",
        };

      case "TypeScript":
        return {
          title: "simulateWebhook.ts",
          badge: "TypeScript · Node.js",
          code: `import { randomUUID } from "crypto";

export type SimulationScenario = "VALID" | "INVALID_SIGNATURE" | "OLD_TIMESTAMP" | "MALFORMED_JSON";

export async function runWebhookSimulation(scenario: SimulationScenario = "VALID") {
  const url = "${safeBaseUrl}/api/v1/webhooks/simulate";

  const payload = {
    eventType: "payment.paid",
    eventId: \`evt_\${randomUUID().replace(/-/g, "").substring(0, 12)}\`,
    reference: "pay_test_99214b",
    scenario,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-Key": "${safeKey}",
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(\`Simulation failed: \${await response.text()}\`);
  }

  const data = await response.json();
  console.log(\`Simulation [\${scenario}] verified:\`, data);
  return data;
}`,
          notes: "Automated simulation script for CI/CD test runners to test webhook integrity.",
        };

      case "cURL":
      default:
        return {
          title: "trigger_simulation.sh",
          badge: "cURL · Shell",
          code: `# Test edge cases via NovaBank's built-in simulation API
# Scenarios: VALID | INVALID_SIGNATURE | OLD_TIMESTAMP | MALFORMED_JSON

curl -X POST "${safeBaseUrl}/api/v1/webhooks/simulate" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${safeKey}" \\
  -d '{
    "eventType": "payment.paid",
    "eventId": "evt_test_sim_001",
    "reference": "pay_test_ref_9912",
    "scenario": "VALID"
  }'`,
          notes: "Direct CLI invocation to verify that simulated webhooks pass or fail according to scenario.",
        };
    }
  };

  const currentSnippet = (() => {
    switch (activeWorkflow) {
      case "auth":
        return getAuthSnippet(selectedLanguage);
      case "checkout_session":
        return getCheckoutSessionSnippet(selectedLanguage);
      case "payment_intent":
        return getPaymentIntentSnippet(selectedLanguage);
      case "vam_transfer":
        return getVamTransferSnippet(selectedLanguage);
      case "refund":
        return getRefundSnippet(selectedLanguage);
      case "webhook_receiver":
        return getWebhookReceiverSnippet(selectedLanguage);
      case "webhook_simulate":
        return getWebhookSimulateSnippet(selectedLanguage);
    }
  })();

  const activeWorkflowObj = workflows.find((w) => w.id === activeWorkflow);

  return (
    <div className="min-h-screen bg-dominant text-accent font-sans selection:bg-secondary selection:text-accent pb-28">
      {/* Top Cross-Navigation Tabs */}
      <DeveloperNavTabs />

      {/* Header Banner */}
      <div className="bg-surface border-b border-secondary/30 pt-12 pb-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-black rounded-full uppercase tracking-wider border border-sky-200 shadow-xs">
              Codebase Integration Suite
            </span>
            <span className="text-xs font-bold text-accent/50 uppercase tracking-wider">
              5 Language Stacks · 7 Production Workflows
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-accent tracking-tight">
            Codebase Snippets &amp; Workflows
          </h1>
          <p className="text-accent/80 font-medium max-w-4xl text-base md:text-lg leading-relaxed">
            Copy-pasteable, production-hardened client and server implementations for{" "}
            <strong>C# .NET</strong>, <strong>Java Spring Boot</strong>, <strong>Python FastAPI</strong>,{" "}
            <strong>TypeScript</strong>, and <strong>cURL</strong>. Built to enforce core banking security invariants
            including idempotency, VAM boundaries, and constant-time webhook verification.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
      <div className="max-w-7xl mx-auto px-6 mt-8 flex flex-col gap-8">
        {/* Real Cryptographic Parity & Runtime Proof Banner */}
        <MultiStackVerificationProof />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Live Credential Injector & Workflow Menu */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Live Credential Injector */}
          <Card title="⚡ Live Credential Injector" className="bg-dominant border-secondary/30 shadow-md">
            <p className="text-xs text-accent/70 font-medium mb-4 leading-relaxed">
              Inject your credentials to dynamically update all code snippets in real time. Values remain local to your browser session.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                  <span>API Key (Header: X-API-Key)</span>
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk_test_..."
                  className="px-3 py-2 bg-surface border border-secondary/30 rounded-lg text-xs font-mono text-accent focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Webhook className="w-3.5 h-3.5 text-purple-600" />
                  <span>Webhook Secret (HMAC Signing)</span>
                </label>
                <input
                  type="text"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="whsec_..."
                  className="px-3 py-2 bg-surface border border-secondary/30 rounded-lg text-xs font-mono text-accent focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-600" />
                  <span>API Gateway Base URL</span>
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://api.novabank.ph"
                  className="px-3 py-2 bg-surface border border-secondary/30 rounded-lg text-xs font-mono text-accent focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-accent uppercase tracking-wider">
                    Source VAM Account
                  </label>
                  <input
                    type="text"
                    value={vamAccount}
                    onChange={(e) => setVamAccount(e.target.value)}
                    placeholder="4859220013371001"
                    className="px-2.5 py-1.5 bg-surface border border-secondary/30 rounded-lg text-xs font-mono text-accent focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-accent uppercase tracking-wider">
                    Destination Account
                  </label>
                  <input
                    type="text"
                    value={destAccount}
                    onChange={(e) => setDestAccount(e.target.value)}
                    placeholder="4859220013379999"
                    className="px-2.5 py-1.5 bg-surface border border-secondary/30 rounded-lg text-xs font-mono text-accent focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setApiKey("sk_test_novabank_99214b");
                  setWebhookSecret("whsec_test_secret_123456789");
                  setBaseUrl("https://api.novabank.ph");
                  setVamAccount("4859220013371001");
                  setDestAccount("4859220013379999");
                }}
                className="mt-1 flex items-center justify-center gap-1.5 text-[11px] font-bold text-accent/60 hover:text-accent py-1.5 rounded-lg border border-secondary/20 hover:bg-surface transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Reset to Sandbox Defaults</span>
              </button>
            </div>
          </Card>

          {/* Workflow Selector List */}
          <div className="flex flex-col gap-4">
            {/* Category: Gateway */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                <span>API Gateway Workflows</span>
              </span>
              {workflows
                .filter((wf) => wf.category === "gateway")
                .map((wf) => {
                  const Icon = wf.icon;
                  const isSelected = activeWorkflow === wf.id;
                  return (
                    <button
                      key={wf.id}
                      type="button"
                      onClick={() => setActiveWorkflow(wf.id)}
                      className={`flex flex-col p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent text-dominant border-accent shadow-md shadow-accent/15"
                          : "bg-dominant text-accent border-secondary/20 hover:border-secondary/50 hover:bg-surface/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected ? "bg-white/10 text-secondary" : "bg-surface text-accent/70"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-extrabold text-xs tracking-tight">{wf.label}</span>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-surface text-accent/50"
                          }`}
                        >
                          {wf.badge}
                        </span>
                      </div>
                      <p
                        className={`mt-1.5 text-[11px] font-medium leading-relaxed ${
                          isSelected ? "text-dominant/80" : "text-accent/65"
                        }`}
                      >
                        {wf.summary}
                      </p>
                    </button>
                  );
                })}
            </div>

            {/* Category: Webhooks */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Webhook className="w-3 h-3" />
                <span>Webhooks &amp; Events</span>
              </span>
              {workflows
                .filter((wf) => wf.category === "webhooks")
                .map((wf) => {
                  const Icon = wf.icon;
                  const isSelected = activeWorkflow === wf.id;
                  return (
                    <button
                      key={wf.id}
                      type="button"
                      onClick={() => setActiveWorkflow(wf.id)}
                      className={`flex flex-col p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent text-dominant border-accent shadow-md shadow-accent/15"
                          : "bg-dominant text-accent border-secondary/20 hover:border-secondary/50 hover:bg-surface/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected ? "bg-white/10 text-secondary" : "bg-surface text-accent/70"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-extrabold text-xs tracking-tight">{wf.label}</span>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-surface text-accent/50"
                          }`}
                        >
                          {wf.badge}
                        </span>
                      </div>
                      <p
                        className={`mt-1.5 text-[11px] font-medium leading-relaxed ${
                          isSelected ? "text-dominant/80" : "text-accent/65"
                        }`}
                      >
                        {wf.summary}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Hardened Invariants Mini-Card */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Invariant Directives</span>
            </div>
            <ul className="text-xs text-amber-900/80 font-medium space-y-1.5 pl-1">
              <li>• Always verify signatures on raw bytes before JSON deserialization.</li>
              <li>• Include unique UUIDv4 <code>Idempotency-Key</code> on all mutating requests.</li>
              <li>• Enforce 300-second replay attack protection window on incoming webhooks.</li>
              <li>• Use constant-time byte comparisons to defeat cryptographic timing attacks.</li>
              <li>• VAM sub-ledger debits are verified against API key account boundaries.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Language Switcher + Codeblock Display */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Language Selector Bar */}
          <div className="flex items-center justify-between bg-surface p-2 rounded-2xl border border-secondary/30 overflow-x-auto gap-2 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-[10px] font-bold text-accent/50 uppercase tracking-wider pl-3 pr-2 hidden sm:inline">
                Stack:
              </span>
              {languages.map((lang) => (
                <button
                  key={lang.name}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.name)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                    selectedLanguage === lang.name
                      ? "bg-accent text-dominant border-accent shadow-md shadow-accent/20"
                      : "bg-dominant text-accent/70 border-secondary/20 hover:text-accent hover:border-secondary/40"
                  }`}
                >
                  <span>{lang.name}</span>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                      selectedLanguage === lang.name ? "bg-white/20 text-white" : "bg-surface text-accent/50"
                    }`}
                  >
                    {lang.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Workflow Summary Banner */}
          <div className="p-6 rounded-2xl bg-dominant border border-secondary/30 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-accent">{activeWorkflowObj?.label}</h2>
            </div>
            <p className="text-sm text-accent/75 font-medium leading-relaxed">
              {activeWorkflowObj?.summary}
            </p>
          </div>

          {/* The Codeblock Viewer */}
          <CodeSnippetViewer
            title={currentSnippet.title}
            language={selectedLanguage}
            code={currentSnippet.code}
            badge={currentSnippet.badge}
            notes={currentSnippet.notes}
          />

          {/* Deep-Dive Architectural Explanations (Contextual) */}
          {(activeWorkflow === "webhook_receiver" || activeWorkflow === "webhook_simulate") && (
            <Card title="🛡️ Webhook Security & Verification Architecture" className="bg-surface border-secondary/30">
              <div className="flex flex-col gap-4 text-xs font-medium text-accent/80 leading-relaxed">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dominant rounded-xl border border-secondary/20 flex flex-col gap-1.5">
                    <span className="font-extrabold text-accent text-sm flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      1. Timing Attack Defense
                    </span>
                    <p>
                      Standard string equality operators (<code>===</code> or <code>==</code>) terminate on the first mismatched byte, leaking cryptographic duration to attackers. Always use constant-time primitives like <code>CryptographicOperations.FixedTimeEquals</code> (.NET), <code>MessageDigest.isEqual</code> (Java), <code>hmac.compare_digest</code> (Python), or <code>crypto.timingSafeEqual</code> (Node.js).
                    </p>
                  </div>

                  <div className="p-4 bg-dominant rounded-xl border border-secondary/20 flex flex-col gap-1.5">
                    <span className="font-extrabold text-accent text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      2. Raw Bytes Invariant
                    </span>
                    <p>
                      Never parse the JSON body into an object prior to calculating the HMAC signature. JSON deserializers alter key order, whitespace, and floating-point precision, resulting in signature mismatches even for valid deliveries.
                    </p>
                  </div>

                  <div className="p-4 bg-dominant rounded-xl border border-secondary/20 flex flex-col gap-1.5">
                    <span className="font-extrabold text-accent text-sm flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4 text-sky-600" />
                      3. Replay Protection Window
                    </span>
                    <p>
                      Check the <code>t=&lt;timestamp&gt;</code> component of the <code>Paymongo-Signature</code> header against your server clock. Reject any webhook timestamp older than 300 seconds (5 minutes) to defeat replay attacks.
                    </p>
                  </div>

                  <div className="p-4 bg-dominant rounded-xl border border-secondary/20 flex flex-col gap-1.5">
                    <span className="font-extrabold text-accent text-sm flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      4. Event Deduplication Idempotency
                    </span>
                    <p>
                      Store the <code>data.id</code> event identifier in an idempotent SQL table with a unique constraint. If a duplicate event arrives due to network retries, acknowledge with HTTP 200 OK immediately without re-crediting the balance.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeWorkflow === "vam_transfer" && (
            <Card title="🏢 Virtual Account Management (VAM) Boundaries" className="bg-surface border-secondary/30">
              <div className="flex flex-col gap-3 text-xs font-medium text-accent/80 leading-relaxed">
                <p>
                  NovaBank operates an isolated two-dimensional security model. Every corporate API key is bound to a specific root or child Virtual Account.
                </p>
                <div className="p-4 bg-dominant rounded-xl border border-secondary/20 flex flex-col gap-2">
                  <span className="font-bold text-accent">Enforcement Directives:</span>
                  <ul className="space-y-1 list-disc list-inside text-accent/75">
                    <li>The <code>sourceAccountNumber</code> in <code>/api/v1/transfers/internal</code> must belong to your VAM hierarchy.</li>
                    <li>Attempting to debit an account outside your VAM subtree yields <code>403 FORBIDDEN (VAM_BOUNDARY_VIOLATION)</code>.</li>
                    <li>Every transfer mutation acquires locks in deterministic lexicographical order to prevent database deadlocks under high concurrency.</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {(activeWorkflow === "payment_intent" || activeWorkflow === "checkout_session" || activeWorkflow === "refund") && (
            <Card title="🔒 Idempotency & Financial Invariants" className="bg-surface border-secondary/30">
              <div className="flex flex-col gap-3 text-xs font-medium text-accent/80 leading-relaxed">
                <p>
                  Every state-mutating request across the NovaBank Gateway requires a unique client-generated <code>Idempotency-Key</code> header (UUIDv4).
                </p>
                <div className="p-4 bg-dominant rounded-xl border border-secondary/20 flex flex-col gap-2">
                  <span className="font-bold text-accent">Core Ledger Directives:</span>
                  <ul className="space-y-1 list-disc list-inside text-accent/75">
                    <li><strong>Atomic Guarantee:</strong> If a network drop or timeout occurs, safe retries with the same <code>Idempotency-Key</code> will return the original transaction without duplicate debits.</li>
                    <li><strong>Conservation of Money:</strong> In every successful settlement or refund, systemic debits strictly equal systemic credits (<code>sum(Debits) == sum(Credits)</code>).</li>
                    <li><strong>State Machine Discipline:</strong> Payment intents progress strictly through <code>PENDING</code> → <code>COMPLETED</code> / <code>FAILED</code> → <code>REFUNDED</code>.</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}

          {activeWorkflow === "auth" && (
            <Card title="🛡️ Enterprise Gateway Perimeter &amp; CIDR Whitelisting" className="bg-surface border-secondary/30">
              <div className="flex flex-col gap-3 text-xs font-medium text-accent/80 leading-relaxed">
                <p>
                  External API requests pass through the Enterprise Gateway Filter Chain before reaching core business services.
                </p>
                <div className="p-4 bg-dominant rounded-xl border border-secondary/20 flex flex-col gap-2">
                  <span className="font-bold text-accent">Authentication Architecture:</span>
                  <ul className="space-y-1 list-disc list-inside text-accent/75">
                    <li><strong>SHA-256 Hashing:</strong> Raw API keys are never stored. The gateway hashes incoming keys with SHA-256 before database lookup.</li>
                    <li><strong>CIDR Restrictions:</strong> If configured on your API key, ingress IPs outside your whitelist are rejected with <code>403 IP_NOT_WHITELISTED</code>.</li>
                    <li><strong>Distributed MDC Tracing:</strong> The gateway stamps every request with an <code>X-Request-Id</code> and binds it to log MDC context for end-to-end auditability.</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
