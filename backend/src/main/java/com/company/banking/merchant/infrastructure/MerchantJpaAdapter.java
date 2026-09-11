package com.company.banking.merchant.infrastructure;

import com.company.banking.merchant.application.port.out.MerchantPersistencePort;
import com.company.banking.merchant.domain.Merchant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class MerchantJpaAdapter implements MerchantPersistencePort {

    private final MerchantJpaRepository repository;

    @Override
    public Merchant save(Merchant merchant) {
        return repository.save(merchant);
    }

    @Override
    public Optional<Merchant> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Merchant> findByOwnerId(Long ownerId) {
        return repository.findByOwnerId(ownerId);
    }

    @Override
    public Optional<Merchant> findByIdAndOwnerId(Long id, Long ownerId) {
        return repository.findByIdAndOwnerId(id, ownerId);
    }

    @Override
    public Optional<Merchant> findByBusinessRegistrationNumber(String brn) {
        return repository.findByBusinessRegistrationNumber(brn);
    }

    @Override
    public Optional<Merchant> findByMerchantCode(String merchantCode) {
        return repository.findByMerchantCode(merchantCode);
    }
}

