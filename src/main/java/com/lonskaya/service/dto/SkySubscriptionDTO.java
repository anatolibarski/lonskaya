package com.lonskaya.service.dto;


import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the SkySubscription entity.
 */
public class SkySubscriptionDTO implements Serializable {

    private Long id;

    @NotNull
    private String detailsJson;

    private Long ticketId;

    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDetailsJson() {
        return detailsJson;
    }

    public void setDetailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long skyTicketId) {
        this.ticketId = skyTicketId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SkySubscriptionDTO skySubscriptionDTO = (SkySubscriptionDTO) o;
        if(skySubscriptionDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), skySubscriptionDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SkySubscriptionDTO{" +
            "id=" + getId() +
            ", detailsJson='" + getDetailsJson() + "'" +
            "}";
    }
}
