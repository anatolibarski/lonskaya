package com.lonskaya.service.mapper;

import com.lonskaya.domain.*;
import com.lonskaya.service.dto.SkyTicketDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity SkyTicket and its DTO SkyTicketDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SkyTicketMapper extends EntityMapper<SkyTicketDTO, SkyTicket> {



    default SkyTicket fromId(Long id) {
        if (id == null) {
            return null;
        }
        SkyTicket skyTicket = new SkyTicket();
        skyTicket.setId(id);
        return skyTicket;
    }
}
