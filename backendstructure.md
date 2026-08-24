
# ==========================================================
# NOVABANK ENTERPRISE DEVELOPER GATEWAY CONFIGURATION
# ==========================================================
# Maps to configuration.GetSection("PaymentGateway")
PaymentGateway__SecretKey=sk_live_0fe4***********f302f35cc1ef8527ab9045c6ecb*********e1***********c5

# Update Webhook URL to drop the PayMongo path and use your standard domain
PaymentGateway__WebhookUrl=https://api.universityofirelanda.dev/api/v1/finance/webhooks/banking

# Redirect URLs for after checkout
PaymentGateway__SuccessUrl=https://applicant.universityofirelanda.dev/payment/success
PaymentGateway__CancelUrl=https://applicant.universityofirelanda.dev/payment/cancel

# Add this alongside your Webhook and Secret variables
PaymentGateway__BaseUrl=https://bank.developerphdev
