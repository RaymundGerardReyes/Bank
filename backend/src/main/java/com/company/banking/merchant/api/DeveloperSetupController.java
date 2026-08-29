package com.company.banking.merchant.api;

import com.company.banking.merchant.api.dto.DeveloperOnboardingRequest;
import com.company.banking.merchant.api.dto.DeveloperOnboardingResponse;
import com.company.banking.merchant.application.DeveloperOnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/developer/setup")
@RequiredArgsConstructor
public class DeveloperSetupController {

    private final DeveloperOnboardingService onboardingService;

    @PostMapping("/onboard")
    @ResponseStatus(HttpStatus.CREATED)
    public DeveloperOnboardingResponse onboardNewDeveloper(@Valid @RequestBody DeveloperOnboardingRequest request) {
        return onboardingService.onboardDeveloper(request);
    }
}
