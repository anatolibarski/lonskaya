package com.lonskaya.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lonskaya.domain.SalesforceContact;

import com.lonskaya.repository.SalesforceContactRepository;
import com.lonskaya.repository.search.SalesforceContactSearchRepository;
import com.lonskaya.web.rest.errors.BadRequestAlertException;
import com.lonskaya.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SalesforceContact.
 */
@RestController
@RequestMapping("/api")
public class SalesforceContactResource {

    private final Logger log = LoggerFactory.getLogger(SalesforceContactResource.class);

    private static final String ENTITY_NAME = "salesforceContact";

    private final SalesforceContactRepository salesforceContactRepository;

    private final SalesforceContactSearchRepository salesforceContactSearchRepository;

    public SalesforceContactResource(SalesforceContactRepository salesforceContactRepository, SalesforceContactSearchRepository salesforceContactSearchRepository) {
        this.salesforceContactRepository = salesforceContactRepository;
        this.salesforceContactSearchRepository = salesforceContactSearchRepository;
    }

    /**
     * POST  /salesforce-contacts : Create a new salesforceContact.
     *
     * @param salesforceContact the salesforceContact to create
     * @return the ResponseEntity with status 201 (Created) and with body the new salesforceContact, or with status 400 (Bad Request) if the salesforceContact has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/salesforce-contacts")
    @Timed
    public ResponseEntity<SalesforceContact> createSalesforceContact(@Valid @RequestBody SalesforceContact salesforceContact) throws URISyntaxException {
        log.debug("REST request to save SalesforceContact : {}", salesforceContact);
        if (salesforceContact.getId() != null) {
            throw new BadRequestAlertException("A new salesforceContact cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SalesforceContact result = salesforceContactRepository.save(salesforceContact);
        salesforceContactSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/salesforce-contacts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /salesforce-contacts : Updates an existing salesforceContact.
     *
     * @param salesforceContact the salesforceContact to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated salesforceContact,
     * or with status 400 (Bad Request) if the salesforceContact is not valid,
     * or with status 500 (Internal Server Error) if the salesforceContact couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/salesforce-contacts")
    @Timed
    public ResponseEntity<SalesforceContact> updateSalesforceContact(@Valid @RequestBody SalesforceContact salesforceContact) throws URISyntaxException {
        log.debug("REST request to update SalesforceContact : {}", salesforceContact);
        if (salesforceContact.getId() == null) {
            return createSalesforceContact(salesforceContact);
        }
        SalesforceContact result = salesforceContactRepository.save(salesforceContact);
        salesforceContactSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, salesforceContact.getId().toString()))
            .body(result);
    }

    /**
     * GET  /salesforce-contacts : get all the salesforceContacts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of salesforceContacts in body
     */
    @GetMapping("/salesforce-contacts")
    @Timed
    public List<SalesforceContact> getAllSalesforceContacts() {
        log.debug("REST request to get all SalesforceContacts");
        return salesforceContactRepository.findAll();
        }

    /**
     * GET  /salesforce-contacts/:id : get the "id" salesforceContact.
     *
     * @param id the id of the salesforceContact to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the salesforceContact, or with status 404 (Not Found)
     */
    @GetMapping("/salesforce-contacts/{id}")
    @Timed
    public ResponseEntity<SalesforceContact> getSalesforceContact(@PathVariable Long id) {
        log.debug("REST request to get SalesforceContact : {}", id);
        SalesforceContact salesforceContact = salesforceContactRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(salesforceContact));
    }

    /**
     * DELETE  /salesforce-contacts/:id : delete the "id" salesforceContact.
     *
     * @param id the id of the salesforceContact to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/salesforce-contacts/{id}")
    @Timed
    public ResponseEntity<Void> deleteSalesforceContact(@PathVariable Long id) {
        log.debug("REST request to delete SalesforceContact : {}", id);
        salesforceContactRepository.delete(id);
        salesforceContactSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/salesforce-contacts?query=:query : search for the salesforceContact corresponding
     * to the query.
     *
     * @param query the query of the salesforceContact search
     * @return the result of the search
     */
    @GetMapping("/_search/salesforce-contacts")
    @Timed
    public List<SalesforceContact> searchSalesforceContacts(@RequestParam String query) {
        log.debug("REST request to search SalesforceContacts for query {}", query);
        return StreamSupport
            .stream(salesforceContactSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
