package com.lonskaya.repository;

import com.lonskaya.domain.SalesforceContact;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the SalesforceContact entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SalesforceContactRepository extends JpaRepository<SalesforceContact, Long> {

}
