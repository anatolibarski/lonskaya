package com.lonskaya.repository;

import com.lonskaya.domain.SkySubscription;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the SkySubscription entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SkySubscriptionRepository extends JpaRepository<SkySubscription, Long> {

    @Query("select sky_subscription from SkySubscription sky_subscription where sky_subscription.user.login = ?#{principal.username}")
    List<SkySubscription> findByUserIsCurrentUser();

}
