package com.lonskaya.repository.search;

import com.lonskaya.domain.Billing;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Billing entity.
 */
public interface BillingSearchRepository extends ElasticsearchRepository<Billing, Long> {
}
