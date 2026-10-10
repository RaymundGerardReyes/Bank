package com.company.banking.transaction;

import com.company.banking.config.BaseIntegrationTest;
import com.company.banking.transaction.api.dto.InstitutionResponse;
import com.company.banking.transaction.application.port.in.GetPaymentParticipantsUseCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class InstitutionDirectoryIT extends BaseIntegrationTest {

    @Autowired
    private GetPaymentParticipantsUseCase institutionDirectoryUseCase;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should retrieve all active financial institutions across all payment rails")
    void shouldRetrieveAllActiveInstitutions() {
        List<InstitutionResponse> institutions = institutionDirectoryUseCase.getActiveInstitutions(null);

        assertThat(institutions).isNotEmpty();
        assertThat(institutions).extracting(InstitutionResponse::getName)
                .contains("Chase Bank", "Bank of America", "Wells Fargo", "Citibank N.A.", "BDO Unibank", "Metrobank");
    }

    @Test
    @DisplayName("Should filter institutions by FEDWIRE rail")
    void shouldFilterInstitutionsByFedwireRail() {
        List<InstitutionResponse> institutions = institutionDirectoryUseCase.getActiveInstitutions("FEDWIRE");

        assertThat(institutions).isNotEmpty();
        assertThat(institutions).allMatch(i -> i.getRail().contains("FEDWIRE"));
        assertThat(institutions).extracting(InstitutionResponse::getBic)
                .contains("021000021", "026009593");
    }

    @Test
    @DisplayName("Should filter institutions by INSTAPAY rail")
    void shouldFilterInstitutionsByInstaPayRail() {
        List<InstitutionResponse> institutions = institutionDirectoryUseCase.getActiveInstitutions("INSTAPAY");

        assertThat(institutions).isNotEmpty();
        assertThat(institutions).allMatch(i -> i.getRail().contains("INSTAPAY"));
        assertThat(institutions).extracting(InstitutionResponse::getName)
                .contains("BDO Unibank", "Metrobank", "Bank of the Philippine Islands", "UnionBank of the Philippines");
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    @DisplayName("Should expose GET /api/v1/transfers/institutions REST endpoint")
    void shouldExposeInstitutionsRestEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/transfers/institutions")
                        .param("rail", "FEDWIRE")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].routingCode").isNotEmpty())
                .andExpect(jsonPath("$.data[0].name").isNotEmpty());
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    @DisplayName("Should expose GET /api/v1/transfers/banks REST alias endpoint")
    void shouldExposeBanksAliasRestEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/transfers/banks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }
}
