package com.lonskaya.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lonskaya.domain.Billing;

import com.lonskaya.repository.BillingRepository;
import com.lonskaya.repository.search.BillingSearchRepository;
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
 * REST controller for managing Billing.
 */
@RestController
@RequestMapping("/api")
public class BillingResource {

    private final Logger log = LoggerFactory.getLogger(BillingResource.class);

    private static final String ENTITY_NAME = "billing";

    private final BillingRepository billingRepository;

    private final BillingSearchRepository billingSearchRepository;

    public BillingResource(BillingRepository billingRepository, BillingSearchRepository billingSearchRepository) {
        this.billingRepository = billingRepository;
        this.billingSearchRepository = billingSearchRepository;
    }

    /**
     * POST  /billings : Create a new billing.
     *
     * @param billing the billing to create
     * @return the ResponseEntity with status 201 (Created) and with body the new billing, or with status 400 (Bad Request) if the billing has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/billings")
    @Timed
    public ResponseEntity<Billing> createBilling(@Valid @RequestBody Billing billing) throws URISyntaxException {
        log.debug("REST request to save Billing : {}", billing);
        if (billing.getId() != null) {
            throw new BadRequestAlertException("A new billing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Billing result = billingRepository.save(billing);
        billingSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/billings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /billings : Updates an existing billing.
     *
     * @param billing the billing to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated billing,
     * or with status 400 (Bad Request) if the billing is not valid,
     * or with status 500 (Internal Server Error) if the billing couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/billings")
    @Timed
    public ResponseEntity<Billing> updateBilling(@Valid @RequestBody Billing billing) throws URISyntaxException {
        log.debug("REST request to update Billing : {}", billing);
        if (billing.getId() == null) {
            return createBilling(billing);
        }
        Billing result = billingRepository.save(billing);
        billingSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, billing.getId().toString()))
            .body(result);
    }

    /**
     * GET  /billings : get all the billings.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of billings in body
     */
    @GetMapping("/billings")
    @Timed
    public List<Billing> getAllBillings() {
        log.debug("REST request to get all Billings");
        return billingRepository.findAll();
        }

    /**
     * GET  /billings/:id : get the "id" billing.
     *
     * @param id the id of the billing to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the billing, or with status 404 (Not Found)
     */
    @GetMapping("/billings/{id}")
    @Timed
    public ResponseEntity<Billing> getBilling(@PathVariable Long id) {
        log.debug("REST request to get Billing : {}", id);
        Billing billing = billingRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(billing));
    }

    /**
     * DELETE  /billings/:id : delete the "id" billing.
     *
     * @param id the id of the billing to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/billings/{id}")
    @Timed
    public ResponseEntity<Void> deleteBilling(@PathVariable Long id) {
        log.debug("REST request to delete Billing : {}", id);
        billingRepository.delete(id);
        billingSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/billings?query=:query : search for the billing corresponding
     * to the query.
     *
     * @param query the query of the billing search
     * @return the result of the search
     */
    @GetMapping("/_search/billings")
    @Timed
    public List<Billing> searchBillings(@RequestParam String query) {
        log.debug("REST request to search Billings for query {}", query);
        return StreamSupport
            .stream(billingSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
