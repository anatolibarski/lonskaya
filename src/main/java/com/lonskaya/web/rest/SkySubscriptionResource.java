package com.lonskaya.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lonskaya.service.SkySubscriptionService;
import com.lonskaya.web.rest.errors.BadRequestAlertException;
import com.lonskaya.web.rest.util.HeaderUtil;
import com.lonskaya.service.dto.SkySubscriptionDTO;
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
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing SkySubscription.
 */
@RestController
@RequestMapping("/api")
public class SkySubscriptionResource {

    private final Logger log = LoggerFactory.getLogger(SkySubscriptionResource.class);

    private static final String ENTITY_NAME = "skySubscription";

    private final SkySubscriptionService skySubscriptionService;

    public SkySubscriptionResource(SkySubscriptionService skySubscriptionService) {
        this.skySubscriptionService = skySubscriptionService;
    }

    /**
     * POST  /sky-subscriptions : Create a new skySubscription.
     *
     * @param skySubscriptionDTO the skySubscriptionDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new skySubscriptionDTO, or with status 400 (Bad Request) if the skySubscription has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sky-subscriptions")
    @Timed
    public ResponseEntity<SkySubscriptionDTO> createSkySubscription(@Valid @RequestBody SkySubscriptionDTO skySubscriptionDTO) throws URISyntaxException {
        log.debug("REST request to save SkySubscription : {}", skySubscriptionDTO);
        if (skySubscriptionDTO.getId() != null) {
            throw new BadRequestAlertException("A new skySubscription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SkySubscriptionDTO result = skySubscriptionService.save(skySubscriptionDTO);
        return ResponseEntity.created(new URI("/api/sky-subscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sky-subscriptions : Updates an existing skySubscription.
     *
     * @param skySubscriptionDTO the skySubscriptionDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated skySubscriptionDTO,
     * or with status 400 (Bad Request) if the skySubscriptionDTO is not valid,
     * or with status 500 (Internal Server Error) if the skySubscriptionDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sky-subscriptions")
    @Timed
    public ResponseEntity<SkySubscriptionDTO> updateSkySubscription(@Valid @RequestBody SkySubscriptionDTO skySubscriptionDTO) throws URISyntaxException {
        log.debug("REST request to update SkySubscription : {}", skySubscriptionDTO);
        if (skySubscriptionDTO.getId() == null) {
            return createSkySubscription(skySubscriptionDTO);
        }
        SkySubscriptionDTO result = skySubscriptionService.save(skySubscriptionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, skySubscriptionDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sky-subscriptions : get all the skySubscriptions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of skySubscriptions in body
     */
    @GetMapping("/sky-subscriptions")
    @Timed
    public List<SkySubscriptionDTO> getAllSkySubscriptions() {
        log.debug("REST request to get all SkySubscriptions");
        return skySubscriptionService.findAll();
        }

    /**
     * GET  /sky-subscriptions/:id : get the "id" skySubscription.
     *
     * @param id the id of the skySubscriptionDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the skySubscriptionDTO, or with status 404 (Not Found)
     */
    @GetMapping("/sky-subscriptions/{id}")
    @Timed
    public ResponseEntity<SkySubscriptionDTO> getSkySubscription(@PathVariable Long id) {
        log.debug("REST request to get SkySubscription : {}", id);
        SkySubscriptionDTO skySubscriptionDTO = skySubscriptionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(skySubscriptionDTO));
    }

    /**
     * DELETE  /sky-subscriptions/:id : delete the "id" skySubscription.
     *
     * @param id the id of the skySubscriptionDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sky-subscriptions/{id}")
    @Timed
    public ResponseEntity<Void> deleteSkySubscription(@PathVariable Long id) {
        log.debug("REST request to delete SkySubscription : {}", id);
        skySubscriptionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/sky-subscriptions?query=:query : search for the skySubscription corresponding
     * to the query.
     *
     * @param query the query of the skySubscription search
     * @return the result of the search
     */
    @GetMapping("/_search/sky-subscriptions")
    @Timed
    public List<SkySubscriptionDTO> searchSkySubscriptions(@RequestParam String query) {
        log.debug("REST request to search SkySubscriptions for query {}", query);
        return skySubscriptionService.search(query);
    }

}
