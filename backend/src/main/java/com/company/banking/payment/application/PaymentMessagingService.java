package com.company.banking.payment.application;

import com.company.banking.common.audit.AuditEventPublisher;
import com.company.banking.common.exception.BusinessException;
import com.company.banking.common.exception.ErrorCode;
import com.company.banking.payment.domain.PaymentIntent;
import com.company.banking.payment.domain.PaymentMessage;
import com.company.banking.payment.domain.PaymentParticipant;
import com.company.banking.payment.infrastructure.PaymentMessageJpaRepository;
import com.company.banking.payment.infrastructure.PaymentParticipantJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentMessagingService {

    private final PaymentMessageJpaRepository paymentMessageJpaRepository;
    private final PaymentParticipantJpaRepository paymentParticipantJpaRepository;
    private final AuditEventPublisher auditEventPublisher;

    @Transactional
    public PaymentMessage generatePacs008(PaymentIntent intent, String senderBic, String receiverBic) {
        
        PaymentParticipant sender = paymentParticipantJpaRepository.findByBic(senderBic)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST, "Sender BIC not registered in Participant Directory"));
                
        PaymentParticipant receiver = paymentParticipantJpaRepository.findByBic(receiverBic)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST, "Receiver BIC not registered in Participant Directory"));

        if (!"ACTIVE".equals(receiver.getStatus()) || !"ONLINE".equals(receiver.getConnectivityStatus())) {
            throw new BusinessException(ErrorCode.SERVICE_UNAVAILABLE, "Receiver is currently OFFLINE or SUSPENDED from the network.");
        }

        String msgId = "MSG-" + UUID.randomUUID().toString().replace("-", "");
        
        // Mocking an ISO 20022 XML payload. In a real system, we'd use JAXB to serialize a formal pacs.008 object tree.
        String xmlPayload = String.format(
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<Document xmlns=\"urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08\">\n" +
            "  <FIToFICstmrCdtTrf>\n" +
            "    <GrpHdr>\n" +
            "      <MsgId>%s</MsgId>\n" +
            "      <CreDtTm>%s</CreDtTm>\n" +
            "    </GrpHdr>\n" +
            "    <CdtTrfTxInf>\n" +
            "      <PmtId><EndToEndId>%s</EndToEndId></PmtId>\n" +
            "      <IntrBkSttlmAmt Ccy=\"%s\">%.2f</IntrBkSttlmAmt>\n" +
            "    </CdtTrfTxInf>\n" +
            "  </FIToFICstmrCdtTrf>\n" +
            "</Document>",
            msgId, intent.getCreatedAt().toString(), intent.getIntentId(), intent.getCurrency(), intent.getAmount()
        );

        PaymentMessage message = PaymentMessage.builder()
                .messageId(msgId)
                .paymentIntentId(intent.getId())
                .messageType("pacs.008.001.08") // Customer Credit Transfer
                .version("08")
                .senderBic(senderBic)
                .receiverBic(receiverBic)
                .payloadXml(xmlPayload)
                .validationStatus("VALID")
                .build();

        PaymentMessage saved = paymentMessageJpaRepository.save(message);

        log.info("[ISO-20022] Generated pacs.008 message {} for Intent {}", msgId, intent.getIntentId());
        auditEventPublisher.publishEvent("ISO20022_MESSAGE_GENERATED", senderBic, 
                "Generated pacs.008 for " + receiverBic, msgId);

        return saved;
    }
}
