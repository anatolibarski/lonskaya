package com.lonskaya.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A SkySubscription.
 */
@Entity
@Table(name = "sky_subscription")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "skysubscription")
public class SkySubscription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "details_json", nullable = false)
    private String detailsJson;

    @OneToOne
    @JoinColumn(unique = true)
    private SkyTicket ticket;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDetailsJson() {
        return detailsJson;
    }

    public SkySubscription detailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
        return this;
    }

    public void setDetailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
    }

    public SkyTicket getTicket() {
        return ticket;
    }

    public SkySubscription ticket(SkyTicket skyTicket) {
        this.ticket = skyTicket;
        return this;
    }

    public void setTicket(SkyTicket skyTicket) {
        this.ticket = skyTicket;
    }

    public User getUser() {
        return user;
    }

    public SkySubscription user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SkySubscription skySubscription = (SkySubscription) o;
        if (skySubscription.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), skySubscription.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SkySubscription{" +
            "id=" + getId() +
            ", detailsJson='" + getDetailsJson() + "'" +
            "}";
    }
}
