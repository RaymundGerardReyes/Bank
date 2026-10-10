package com.company.banking.security.auth.crypto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Base64;

@Component
@Slf4j
public class DeviceSignatureVerifier {

    /**
     * Verifies that the signature matches the canonical message using the stored public key.
     *
     * @param publicKeyBase64 Base64-encoded X.509 SubjectPublicKeyInfo
     * @param algorithm       Algorithm name (e.g. SHA256withECDSA, SHA256withRSA, or ES256)
     * @param canonicalData   Domain-separated canonical message
     * @param signatureBase64 Base64-encoded digital signature
     * @return true if signature is valid; false otherwise
     */
    public boolean verify(String publicKeyBase64, String algorithm, String canonicalData, String signatureBase64) {
        if (publicKeyBase64 == null || algorithm == null || canonicalData == null || signatureBase64 == null) {
            return false;
        }

        try {
            byte[] keyBytes = Base64.getDecoder().decode(publicKeyBase64.trim());
            byte[] sigBytes = Base64.getDecoder().decode(signatureBase64.trim());
            byte[] dataBytes = canonicalData.getBytes(StandardCharsets.UTF_8);

            String standardAlgorithm = normalizeAlgorithm(algorithm);
            String keyAlgorithm = standardAlgorithm.contains("ECDSA") ? "EC" : "RSA";

            KeyFactory keyFactory = KeyFactory.getInstance(keyAlgorithm);
            PublicKey publicKey = keyFactory.generatePublic(new X509EncodedKeySpec(keyBytes));

            // 1. Try standard verification
            Signature signature = Signature.getInstance(standardAlgorithm);
            signature.initVerify(publicKey);
            signature.update(dataBytes);

            try {
                if (signature.verify(sigBytes)) {
                    return true;
                }
            } catch (Exception e) {
                log.debug("Standard signature verification failed, testing alternative encodings: {}", e.getMessage());
            }

            // 2. If ECDSA and length is exactly 64 bytes (WebCrypto IEEE P1363 raw r||s), convert to DER ASN.1
            if (standardAlgorithm.contains("ECDSA") && sigBytes.length == 64) {
                byte[] derSig = convertP1363ToDer(sigBytes);
                if (derSig != null) {
                    Signature derVerifier = Signature.getInstance("SHA256withECDSA");
                    derVerifier.initVerify(publicKey);
                    derVerifier.update(dataBytes);
                    if (derVerifier.verify(derSig)) {
                        return true;
                    }
                }
            }

            return false;
        } catch (Exception e) {
            log.warn("Cryptographic signature verification encountered error: {}", e.getMessage());
            return false;
        }
    }

    private String normalizeAlgorithm(String algorithm) {
        String clean = algorithm.trim();
        if ("ES256".equalsIgnoreCase(clean) || "ECDSA".equalsIgnoreCase(clean) || "SHA256withECDSA".equalsIgnoreCase(clean)) {
            return "SHA256withECDSA";
        }
        if ("RS256".equalsIgnoreCase(clean) || "RSA".equalsIgnoreCase(clean) || "SHA256withRSA".equalsIgnoreCase(clean)) {
            return "SHA256withRSA";
        }
        return clean;
    }

    /**
     * Converts raw 64-byte IEEE P1363 signature (r [32 bytes] + s [32 bytes]) to ASN.1 DER SEQUENCE.
     */
    private byte[] convertP1363ToDer(byte[] p1363) {
        try {
            byte[] rBytes = Arrays.copyOfRange(p1363, 0, 32);
            byte[] sBytes = Arrays.copyOfRange(p1363, 32, 64);

            BigInteger r = new BigInteger(1, rBytes);
            BigInteger s = new BigInteger(1, sBytes);

            byte[] rDer = encodeDerInteger(r);
            byte[] sDer = encodeDerInteger(s);

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            out.write(0x30); // SEQUENCE
            int totalLen = rDer.length + sDer.length;
            out.write(totalLen);
            out.write(rDer);
            out.write(sDer);
            return out.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }

    private byte[] encodeDerInteger(BigInteger val) {
        byte[] raw = val.toByteArray(); // Includes leading 0x00 if sign bit was set
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        out.write(0x02); // INTEGER
        out.write(raw.length);
        out.write(raw, 0, raw.length);
        return out.toByteArray();
    }
}

