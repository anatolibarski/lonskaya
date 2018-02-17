package com.lonskaya.service.mapper;

import com.lonskaya.domain.*;
import com.lonskaya.service.dto.SkySubscriptionDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity SkySubscription and its DTO SkySubscriptionDTO.
 */
@Mapper(componentModel = "spring", uses = {SkyTicketMapper.class, UserMapper.class})
public interface SkySubscriptionMapper extends EntityMapper<SkySubscriptionDTO, SkySubscription> {

    @Mapping(source = "ticket.id", target = "ticketId")
    @Mapping(source = "user.id", target = "userId")
    SkySubscriptionDTO toDto(SkySubscription skySubscription);

    @Mapping(source = "ticketId", target = "ticket")
    @Mapping(source = "userId", target = "user")
    SkySubscription toEntity(SkySubscriptionDTO skySubscriptionDTO);

    default SkySubscription fromId(Long id) {
        if (id == null) {
            return null;
        }
        SkySubscription skySubscription = new SkySubscription();
        skySubscription.setId(id);
        return skySubscription;
    }
}
