package com.lonskaya.service.dto;


import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the SkyTicket entity.
 */
public class SkyTicketDTO implements Serializable {

    private Long id;

    @NotNull
    private String detailsJson;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SkyTicketDTO skyTicketDTO = (SkyTicketDTO) o;
        if(skyTicketDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), skyTicketDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SkyTicketDTO{" +
            "id=" + getId() +
            ", detailsJson='" + getDetailsJson() + "'" +
            "}";
    }
}
