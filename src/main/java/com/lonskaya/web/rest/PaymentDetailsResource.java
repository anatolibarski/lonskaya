package com.lonskaya.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lonskaya.domain.PaymentDetails;

import com.lonskaya.repository.PaymentDetailsRepository;
import com.lonskaya.repository.search.PaymentDetailsSearchRepository;
import com.lonskaya.web.rest.errors.BadRequestAlertException;
import com.lonskaya.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing PaymentDetails.
 */
@RestController
@RequestMapping("/api")
public class PaymentDetailsResource {

    private final Logger log = LoggerFactory.getLogger(PaymentDetailsResource.class);

    private static final String ENTITY_NAME = "paymentDetails";

    private final PaymentDetailsRepository paymentDetailsRepository;

    private final PaymentDetailsSearchRepository paymentDetailsSearchRepository;

    public PaymentDetailsResource(PaymentDetailsRepository paymentDetailsRepository, PaymentDetailsSearchRepository paymentDetailsSearchRepository) {
        this.paymentDetailsRepository = paymentDetailsRepository;
        this.paymentDetailsSearchRepository = paymentDetailsSearchRepository;
    }

    /**
     * POST  /payment-details : Create a new paymentDetails.
     *
     * @param paymentDetails the paymentDetails to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paymentDetails, or with status 400 (Bad Request) if the paymentDetails has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/payment-details")
    @Timed
    public ResponseEntity<PaymentDetails> createPaymentDetails(@RequestBody PaymentDetails paymentDetails) throws URISyntaxException {
        log.debug("REST request to save PaymentDetails : {}", paymentDetails);
        if (paymentDetails.getId() != null) {
            throw new BadRequestAlertException("A new paymentDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaymentDetails result = paymentDetailsRepository.save(paymentDetails);
        paymentDetailsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/payment-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /payment-details : Updates an existing paymentDetails.
     *
     * @param paymentDetails the paymentDetails to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paymentDetails,
     * or with status 400 (Bad Request) if the paymentDetails is not valid,
     * or with status 500 (Internal Server Error) if the paymentDetails couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/payment-details")
    @Timed
    public ResponseEntity<PaymentDetails> updatePaymentDetails(@RequestBody PaymentDetails paymentDetails) throws URISyntaxException {
        log.debug("REST request to update PaymentDetails : {}", paymentDetails);
        if (paymentDetails.getId() == null) {
            return createPaymentDetails(paymentDetails);
        }
        PaymentDetails result = paymentDetailsRepository.save(paymentDetails);
        paymentDetailsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paymentDetails.getId().toString()))
            .body(result);
    }

    /**
     * GET  /payment-details : get all the paymentDetails.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of paymentDetails in body
     */
    @GetMapping("/payment-details")
    @Timed
    public List<PaymentDetails> getAllPaymentDetails() {
        log.debug("REST request to get all PaymentDetails");
        return paymentDetailsRepository.findAll();
        }

    /**
     * GET  /payment-details/:id : get the "id" paymentDetails.
     *
     * @param id the id of the paymentDetails to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentDetails, or with status 404 (Not Found)
     */
    @GetMapping("/payment-details/{id}")
    @Timed
    public ResponseEntity<PaymentDetails> getPaymentDetails(@PathVariable Long id) {
        log.debug("REST request to get PaymentDetails : {}", id);
        PaymentDetails paymentDetails = paymentDetailsRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(paymentDetails));
    }

    /**
     * DELETE  /payment-details/:id : delete the "id" paymentDetails.
     *
     * @param id the id of the paymentDetails to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/payment-details/{id}")
    @Timed
    public ResponseEntity<Void> deletePaymentDetails(@PathVariable Long id) {
        log.debug("REST request to delete PaymentDetails : {}", id);
        paymentDetailsRepository.delete(id);
        paymentDetailsSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/payment-details?query=:query : search for the paymentDetails corresponding
     * to the query.
     *
     * @param query the query of the paymentDetails search
     * @return the result of the search
     */
    @GetMapping("/_search/payment-details")
    @Timed
    public List<PaymentDetails> searchPaymentDetails(@RequestParam String query) {
        log.debug("REST request to search PaymentDetails for query {}", query);
        return StreamSupport
            .stream(paymentDetailsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
