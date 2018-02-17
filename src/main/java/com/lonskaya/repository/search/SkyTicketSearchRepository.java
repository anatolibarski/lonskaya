package com.lonskaya.repository.search;

import com.lonskaya.domain.SkyTicket;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SkyTicket entity.
 */
public interface SkyTicketSearchRepository extends ElasticsearchRepository<SkyTicket, Long> {
}
