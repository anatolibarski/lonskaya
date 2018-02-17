package com.lonskaya.repository.search;

import com.lonskaya.domain.SalesforceContact;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SalesforceContact entity.
 */
public interface SalesforceContactSearchRepository extends ElasticsearchRepository<SalesforceContact, Long> {
}
