package com.company.banking.common.mapper;

import java.util.List;
import java.util.stream.Collectors;

public interface BaseMapper<D, E> {
    
    D toDto(E entity);
    
    E toEntity(D dto);
    
    default List<D> toDtoList(List<E> entityList) {
        if (entityList == null) return null;
        return entityList.stream().map(this::toDto).collect(Collectors.toList());
    }
    
    default List<E> toEntityList(List<D> dtoList) {
        if (dtoList == null) return null;
        return dtoList.stream().map(this::toEntity).collect(Collectors.toList());
    }
}
