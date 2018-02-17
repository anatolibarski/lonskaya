package com.lonskaya.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A PaymentDetails.
 */
@Entity
@Table(name = "payment_details")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "paymentdetails")
public class PaymentDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "invoice_url")
    private String invoiceUrl;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "details_json")
    private String detailsJson;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvoiceUrl() {
        return invoiceUrl;
    }

    public PaymentDetails invoiceUrl(String invoiceUrl) {
        this.invoiceUrl = invoiceUrl;
        return this;
    }

    public void setInvoiceUrl(String invoiceUrl) {
        this.invoiceUrl = invoiceUrl;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public PaymentDetails paymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getDetailsJson() {
        return detailsJson;
    }

    public PaymentDetails detailsJson(String detailsJson) {
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
        PaymentDetails paymentDetails = (PaymentDetails) o;
        if (paymentDetails.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paymentDetails.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaymentDetails{" +
            "id=" + getId() +
            ", invoiceUrl='" + getInvoiceUrl() + "'" +
            ", paymentMethod='" + getPaymentMethod() + "'" +
            ", detailsJson='" + getDetailsJson() + "'" +
            "}";
    }
}
