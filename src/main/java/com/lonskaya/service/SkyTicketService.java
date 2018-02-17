package com.lonskaya.service;

import com.lonskaya.domain.SkyTicket;
import com.lonskaya.repository.SkyTicketRepository;
import com.lonskaya.repository.search.SkyTicketSearchRepository;
import com.lonskaya.service.dto.SkyTicketDTO;
import com.lonskaya.service.mapper.SkyTicketMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing SkyTicket.
 */
@Service
@Transactional
public class SkyTicketService {

    private final Logger log = LoggerFactory.getLogger(SkyTicketService.class);

    private final SkyTicketRepository skyTicketRepository;

    private final SkyTicketMapper skyTicketMapper;

    private final SkyTicketSearchRepository skyTicketSearchRepository;

    public SkyTicketService(SkyTicketRepository skyTicketRepository, SkyTicketMapper skyTicketMapper, SkyTicketSearchRepository skyTicketSearchRepository) {
        this.skyTicketRepository = skyTicketRepository;
        this.skyTicketMapper = skyTicketMapper;
        this.skyTicketSearchRepository = skyTicketSearchRepository;
    }

    /**
     * Save a skyTicket.
     *
     * @param skyTicketDTO the entity to save
     * @return the persisted entity
     */
    public SkyTicketDTO save(SkyTicketDTO skyTicketDTO) {
        log.debug("Request to save SkyTicket : {}", skyTicketDTO);
        SkyTicket skyTicket = skyTicketMapper.toEntity(skyTicketDTO);
        skyTicket = skyTicketRepository.save(skyTicket);
        SkyTicketDTO result = skyTicketMapper.toDto(skyTicket);
        skyTicketSearchRepository.save(skyTicket);
        return result;
    }

    /**
     * Get all the skyTickets.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<SkyTicketDTO> findAll() {
        log.debug("Request to get all SkyTickets");
        return skyTicketRepository.findAll().stream()
            .map(skyTicketMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one skyTicket by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public SkyTicketDTO findOne(Long id) {
        log.debug("Request to get SkyTicket : {}", id);
        SkyTicket skyTicket = skyTicketRepository.findOne(id);
        return skyTicketMapper.toDto(skyTicket);
    }

    /**
     * Delete the skyTicket by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete SkyTicket : {}", id);
        skyTicketRepository.delete(id);
        skyTicketSearchRepository.delete(id);
    }

    /**
     * Search for the skyTicket corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<SkyTicketDTO> search(String query) {
        log.debug("Request to search SkyTickets for query {}", query);
        return StreamSupport
            .stream(skyTicketSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(skyTicketMapper::toDto)
            .collect(Collectors.toList());
    }
}
