package com.lonskaya.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A SkyTicket.
 */
@Entity
@Table(name = "sky_ticket")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "skyticket")
public class SkyTicket implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "details_json", nullable = false)
    private String detailsJson;

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

    public SkyTicket detailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
        return this;
    }

    public void setDetailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
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
        SkyTicket skyTicket = (SkyTicket) o;
        if (skyTicket.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), skyTicket.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SkyTicket{" +
            "id=" + getId() +
            ", detailsJson='" + getDetailsJson() + "'" +
            "}";
    }
}
