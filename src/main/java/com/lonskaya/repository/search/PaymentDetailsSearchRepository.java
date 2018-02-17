package com.lonskaya.repository.search;

import com.lonskaya.domain.PaymentDetails;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PaymentDetails entity.
 */
public interface PaymentDetailsSearchRepository extends ElasticsearchRepository<PaymentDetails, Long> {
}
