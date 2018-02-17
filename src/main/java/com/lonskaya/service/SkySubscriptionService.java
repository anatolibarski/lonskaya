package com.lonskaya.service;

import com.lonskaya.domain.SkySubscription;
import com.lonskaya.repository.SkySubscriptionRepository;
import com.lonskaya.repository.search.SkySubscriptionSearchRepository;
import com.lonskaya.service.dto.SkySubscriptionDTO;
import com.lonskaya.service.mapper.SkySubscriptionMapper;
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
 * Service Implementation for managing SkySubscription.
 */
@Service
@Transactional
public class SkySubscriptionService {

    private final Logger log = LoggerFactory.getLogger(SkySubscriptionService.class);

    private final SkySubscriptionRepository skySubscriptionRepository;

    private final SkySubscriptionMapper skySubscriptionMapper;

    private final SkySubscriptionSearchRepository skySubscriptionSearchRepository;

    public SkySubscriptionService(SkySubscriptionRepository skySubscriptionRepository, SkySubscriptionMapper skySubscriptionMapper, SkySubscriptionSearchRepository skySubscriptionSearchRepository) {
        this.skySubscriptionRepository = skySubscriptionRepository;
        this.skySubscriptionMapper = skySubscriptionMapper;
        this.skySubscriptionSearchRepository = skySubscriptionSearchRepository;
    }

    /**
     * Save a skySubscription.
     *
     * @param skySubscriptionDTO the entity to save
     * @return the persisted entity
     */
    public SkySubscriptionDTO save(SkySubscriptionDTO skySubscriptionDTO) {
        log.debug("Request to save SkySubscription : {}", skySubscriptionDTO);
        SkySubscription skySubscription = skySubscriptionMapper.toEntity(skySubscriptionDTO);
        skySubscription = skySubscriptionRepository.save(skySubscription);
        SkySubscriptionDTO result = skySubscriptionMapper.toDto(skySubscription);
        skySubscriptionSearchRepository.save(skySubscription);
        return result;
    }

    /**
     * Get all the skySubscriptions.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<SkySubscriptionDTO> findAll() {
        log.debug("Request to get all SkySubscriptions");
        return skySubscriptionRepository.findAll().stream()
            .map(skySubscriptionMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one skySubscription by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public SkySubscriptionDTO findOne(Long id) {
        log.debug("Request to get SkySubscription : {}", id);
        SkySubscription skySubscription = skySubscriptionRepository.findOne(id);
        return skySubscriptionMapper.toDto(skySubscription);
    }

    /**
     * Delete the skySubscription by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete SkySubscription : {}", id);
        skySubscriptionRepository.delete(id);
        skySubscriptionSearchRepository.delete(id);
    }

    /**
     * Search for the skySubscription corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<SkySubscriptionDTO> search(String query) {
        log.debug("Request to search SkySubscriptions for query {}", query);
        return StreamSupport
            .stream(skySubscriptionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .map(skySubscriptionMapper::toDto)
            .collect(Collectors.toList());
    }
}
