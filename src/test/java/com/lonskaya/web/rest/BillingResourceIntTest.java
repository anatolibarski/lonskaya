package com.lonskaya.web.rest;

import com.lonskaya.LonskayaApp;

import com.lonskaya.domain.Billing;
import com.lonskaya.repository.BillingRepository;
import com.lonskaya.repository.search.BillingSearchRepository;
import com.lonskaya.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.lonskaya.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BillingResource REST controller.
 *
 * @see BillingResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LonskayaApp.class)
public class BillingResourceIntTest {

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DUE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DUE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_CLOSED = false;
    private static final Boolean UPDATED_CLOSED = true;

    @Autowired
    private BillingRepository billingRepository;

    @Autowired
    private BillingSearchRepository billingSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restBillingMockMvc;

    private Billing billing;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BillingResource billingResource = new BillingResource(billingRepository, billingSearchRepository);
        this.restBillingMockMvc = MockMvcBuilders.standaloneSetup(billingResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Billing createEntity(EntityManager em) {
        Billing billing = new Billing()
            .amount(DEFAULT_AMOUNT)
            .currency(DEFAULT_CURRENCY)
            .dueDate(DEFAULT_DUE_DATE)
            .closed(DEFAULT_CLOSED);
        return billing;
    }

    @Before
    public void initTest() {
        billingSearchRepository.deleteAll();
        billing = createEntity(em);
    }

    @Test
    @Transactional
    public void createBilling() throws Exception {
        int databaseSizeBeforeCreate = billingRepository.findAll().size();

        // Create the Billing
        restBillingMockMvc.perform(post("/api/billings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isCreated());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeCreate + 1);
        Billing testBilling = billingList.get(billingList.size() - 1);
        assertThat(testBilling.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testBilling.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testBilling.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
        assertThat(testBilling.isClosed()).isEqualTo(DEFAULT_CLOSED);

        // Validate the Billing in Elasticsearch
        Billing billingEs = billingSearchRepository.findOne(testBilling.getId());
        assertThat(billingEs).isEqualToIgnoringGivenFields(testBilling);
    }

    @Test
    @Transactional
    public void createBillingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = billingRepository.findAll().size();

        // Create the Billing with an existing ID
        billing.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBillingMockMvc.perform(post("/api/billings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = billingRepository.findAll().size();
        // set the field null
        billing.setAmount(null);

        // Create the Billing, which fails.

        restBillingMockMvc.perform(post("/api/billings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCurrencyIsRequired() throws Exception {
        int databaseSizeBeforeTest = billingRepository.findAll().size();
        // set the field null
        billing.setCurrency(null);

        // Create the Billing, which fails.

        restBillingMockMvc.perform(post("/api/billings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkClosedIsRequired() throws Exception {
        int databaseSizeBeforeTest = billingRepository.findAll().size();
        // set the field null
        billing.setClosed(null);

        // Create the Billing, which fails.

        restBillingMockMvc.perform(post("/api/billings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isBadRequest());

        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBillings() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        // Get all the billingList
        restBillingMockMvc.perform(get("/api/billings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(billing.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())))
            .andExpect(jsonPath("$.[*].closed").value(hasItem(DEFAULT_CLOSED.booleanValue())));
    }

    @Test
    @Transactional
    public void getBilling() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);

        // Get the billing
        restBillingMockMvc.perform(get("/api/billings/{id}", billing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(billing.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.dueDate").value(DEFAULT_DUE_DATE.toString()))
            .andExpect(jsonPath("$.closed").value(DEFAULT_CLOSED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBilling() throws Exception {
        // Get the billing
        restBillingMockMvc.perform(get("/api/billings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBilling() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);
        billingSearchRepository.save(billing);
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();

        // Update the billing
        Billing updatedBilling = billingRepository.findOne(billing.getId());
        // Disconnect from session so that the updates on updatedBilling are not directly saved in db
        em.detach(updatedBilling);
        updatedBilling
            .amount(UPDATED_AMOUNT)
            .currency(UPDATED_CURRENCY)
            .dueDate(UPDATED_DUE_DATE)
            .closed(UPDATED_CLOSED);

        restBillingMockMvc.perform(put("/api/billings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBilling)))
            .andExpect(status().isOk());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate);
        Billing testBilling = billingList.get(billingList.size() - 1);
        assertThat(testBilling.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testBilling.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testBilling.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
        assertThat(testBilling.isClosed()).isEqualTo(UPDATED_CLOSED);

        // Validate the Billing in Elasticsearch
        Billing billingEs = billingSearchRepository.findOne(testBilling.getId());
        assertThat(billingEs).isEqualToIgnoringGivenFields(testBilling);
    }

    @Test
    @Transactional
    public void updateNonExistingBilling() throws Exception {
        int databaseSizeBeforeUpdate = billingRepository.findAll().size();

        // Create the Billing

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restBillingMockMvc.perform(put("/api/billings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(billing)))
            .andExpect(status().isCreated());

        // Validate the Billing in the database
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteBilling() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);
        billingSearchRepository.save(billing);
        int databaseSizeBeforeDelete = billingRepository.findAll().size();

        // Get the billing
        restBillingMockMvc.perform(delete("/api/billings/{id}", billing.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean billingExistsInEs = billingSearchRepository.exists(billing.getId());
        assertThat(billingExistsInEs).isFalse();

        // Validate the database is empty
        List<Billing> billingList = billingRepository.findAll();
        assertThat(billingList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchBilling() throws Exception {
        // Initialize the database
        billingRepository.saveAndFlush(billing);
        billingSearchRepository.save(billing);

        // Search the billing
        restBillingMockMvc.perform(get("/api/_search/billings?query=id:" + billing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(billing.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(DEFAULT_DUE_DATE.toString())))
            .andExpect(jsonPath("$.[*].closed").value(hasItem(DEFAULT_CLOSED.booleanValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Billing.class);
        Billing billing1 = new Billing();
        billing1.setId(1L);
        Billing billing2 = new Billing();
        billing2.setId(billing1.getId());
        assertThat(billing1).isEqualTo(billing2);
        billing2.setId(2L);
        assertThat(billing1).isNotEqualTo(billing2);
        billing1.setId(null);
        assertThat(billing1).isNotEqualTo(billing2);
    }
}
