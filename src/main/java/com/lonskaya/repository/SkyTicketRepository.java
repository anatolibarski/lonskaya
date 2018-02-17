package com.lonskaya.repository;

import com.lonskaya.domain.SkyTicket;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SkyTicket entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SkyTicketRepository extends JpaRepository<SkyTicket, Long> {

}
