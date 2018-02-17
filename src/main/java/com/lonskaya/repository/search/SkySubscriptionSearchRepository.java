package com.lonskaya.repository.search;

import com.lonskaya.domain.SkySubscription;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the SkySubscription entity.
 */
public interface SkySubscriptionSearchRepository extends ElasticsearchRepository<SkySubscription, Long> {
}
