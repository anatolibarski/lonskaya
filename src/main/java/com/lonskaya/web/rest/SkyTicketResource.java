package com.lonskaya.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.lonskaya.service.SkyTicketService;
import com.lonskaya.web.rest.errors.BadRequestAlertException;
import com.lonskaya.web.rest.util.HeaderUtil;
import com.lonskaya.service.dto.SkyTicketDTO;
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
 * REST controller for managing SkyTicket.
 */
@RestController
@RequestMapping("/api")
public class SkyTicketResource {

    private final Logger log = LoggerFactory.getLogger(SkyTicketResource.class);

    private static final String ENTITY_NAME = "skyTicket";

    private final SkyTicketService skyTicketService;

    public SkyTicketResource(SkyTicketService skyTicketService) {
        this.skyTicketService = skyTicketService;
    }

    /**
     * POST  /sky-tickets : Create a new skyTicket.
     *
     * @param skyTicketDTO the skyTicketDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new skyTicketDTO, or with status 400 (Bad Request) if the skyTicket has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sky-tickets")
    @Timed
    public ResponseEntity<SkyTicketDTO> createSkyTicket(@Valid @RequestBody SkyTicketDTO skyTicketDTO) throws URISyntaxException {
        log.debug("REST request to save SkyTicket : {}", skyTicketDTO);
        if (skyTicketDTO.getId() != null) {
            throw new BadRequestAlertException("A new skyTicket cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SkyTicketDTO result = skyTicketService.save(skyTicketDTO);
        return ResponseEntity.created(new URI("/api/sky-tickets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sky-tickets : Updates an existing skyTicket.
     *
     * @param skyTicketDTO the skyTicketDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated skyTicketDTO,
     * or with status 400 (Bad Request) if the skyTicketDTO is not valid,
     * or with status 500 (Internal Server Error) if the skyTicketDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sky-tickets")
    @Timed
    public ResponseEntity<SkyTicketDTO> updateSkyTicket(@Valid @RequestBody SkyTicketDTO skyTicketDTO) throws URISyntaxException {
        log.debug("REST request to update SkyTicket : {}", skyTicketDTO);
        if (skyTicketDTO.getId() == null) {
            return createSkyTicket(skyTicketDTO);
        }
        SkyTicketDTO result = skyTicketService.save(skyTicketDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, skyTicketDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sky-tickets : get all the skyTickets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of skyTickets in body
     */
    @GetMapping("/sky-tickets")
    @Timed
    public List<SkyTicketDTO> getAllSkyTickets() {
        log.debug("REST request to get all SkyTickets");
        return skyTicketService.findAll();
        }

    /**
     * GET  /sky-tickets/:id : get the "id" skyTicket.
     *
     * @param id the id of the skyTicketDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the skyTicketDTO, or with status 404 (Not Found)
     */
    @GetMapping("/sky-tickets/{id}")
    @Timed
    public ResponseEntity<SkyTicketDTO> getSkyTicket(@PathVariable Long id) {
        log.debug("REST request to get SkyTicket : {}", id);
        SkyTicketDTO skyTicketDTO = skyTicketService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(skyTicketDTO));
    }

    /**
     * DELETE  /sky-tickets/:id : delete the "id" skyTicket.
     *
     * @param id the id of the skyTicketDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sky-tickets/{id}")
    @Timed
    public ResponseEntity<Void> deleteSkyTicket(@PathVariable Long id) {
        log.debug("REST request to delete SkyTicket : {}", id);
        skyTicketService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/sky-tickets?query=:query : search for the skyTicket corresponding
     * to the query.
     *
     * @param query the query of the skyTicket search
     * @return the result of the search
     */
    @GetMapping("/_search/sky-tickets")
    @Timed
    public List<SkyTicketDTO> searchSkyTickets(@RequestParam String query) {
        log.debug("REST request to search SkyTickets for query {}", query);
        return skyTicketService.search(query);
    }

}
