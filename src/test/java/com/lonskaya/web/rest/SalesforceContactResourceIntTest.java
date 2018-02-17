package com.lonskaya.web.rest;

import com.lonskaya.LonskayaApp;

import com.lonskaya.domain.SalesforceContact;
import com.lonskaya.repository.SalesforceContactRepository;
import com.lonskaya.repository.search.SalesforceContactSearchRepository;
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
import java.util.List;

import static com.lonskaya.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SalesforceContactResource REST controller.
 *
 * @see SalesforceContactResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LonskayaApp.class)
public class SalesforceContactResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private SalesforceContactRepository salesforceContactRepository;

    @Autowired
    private SalesforceContactSearchRepository salesforceContactSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSalesforceContactMockMvc;

    private SalesforceContact salesforceContact;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SalesforceContactResource salesforceContactResource = new SalesforceContactResource(salesforceContactRepository, salesforceContactSearchRepository);
        this.restSalesforceContactMockMvc = MockMvcBuilders.standaloneSetup(salesforceContactResource)
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
    public static SalesforceContact createEntity(EntityManager em) {
        SalesforceContact salesforceContact = new SalesforceContact()
            .name(DEFAULT_NAME);
        return salesforceContact;
    }

    @Before
    public void initTest() {
        salesforceContactSearchRepository.deleteAll();
        salesforceContact = createEntity(em);
    }

    @Test
    @Transactional
    public void createSalesforceContact() throws Exception {
        int databaseSizeBeforeCreate = salesforceContactRepository.findAll().size();

        // Create the SalesforceContact
        restSalesforceContactMockMvc.perform(post("/api/salesforce-contacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(salesforceContact)))
            .andExpect(status().isCreated());

        // Validate the SalesforceContact in the database
        List<SalesforceContact> salesforceContactList = salesforceContactRepository.findAll();
        assertThat(salesforceContactList).hasSize(databaseSizeBeforeCreate + 1);
        SalesforceContact testSalesforceContact = salesforceContactList.get(salesforceContactList.size() - 1);
        assertThat(testSalesforceContact.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the SalesforceContact in Elasticsearch
        SalesforceContact salesforceContactEs = salesforceContactSearchRepository.findOne(testSalesforceContact.getId());
        assertThat(salesforceContactEs).isEqualToIgnoringGivenFields(testSalesforceContact);
    }

    @Test
    @Transactional
    public void createSalesforceContactWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = salesforceContactRepository.findAll().size();

        // Create the SalesforceContact with an existing ID
        salesforceContact.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSalesforceContactMockMvc.perform(post("/api/salesforce-contacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(salesforceContact)))
            .andExpect(status().isBadRequest());

        // Validate the SalesforceContact in the database
        List<SalesforceContact> salesforceContactList = salesforceContactRepository.findAll();
        assertThat(salesforceContactList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = salesforceContactRepository.findAll().size();
        // set the field null
        salesforceContact.setName(null);

        // Create the SalesforceContact, which fails.

        restSalesforceContactMockMvc.perform(post("/api/salesforce-contacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(salesforceContact)))
            .andExpect(status().isBadRequest());

        List<SalesforceContact> salesforceContactList = salesforceContactRepository.findAll();
        assertThat(salesforceContactList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSalesforceContacts() throws Exception {
        // Initialize the database
        salesforceContactRepository.saveAndFlush(salesforceContact);

        // Get all the salesforceContactList
        restSalesforceContactMockMvc.perform(get("/api/salesforce-contacts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salesforceContact.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getSalesforceContact() throws Exception {
        // Initialize the database
        salesforceContactRepository.saveAndFlush(salesforceContact);

        // Get the salesforceContact
        restSalesforceContactMockMvc.perform(get("/api/salesforce-contacts/{id}", salesforceContact.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(salesforceContact.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSalesforceContact() throws Exception {
        // Get the salesforceContact
        restSalesforceContactMockMvc.perform(get("/api/salesforce-contacts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSalesforceContact() throws Exception {
        // Initialize the database
        salesforceContactRepository.saveAndFlush(salesforceContact);
        salesforceContactSearchRepository.save(salesforceContact);
        int databaseSizeBeforeUpdate = salesforceContactRepository.findAll().size();

        // Update the salesforceContact
        SalesforceContact updatedSalesforceContact = salesforceContactRepository.findOne(salesforceContact.getId());
        // Disconnect from session so that the updates on updatedSalesforceContact are not directly saved in db
        em.detach(updatedSalesforceContact);
        updatedSalesforceContact
            .name(UPDATED_NAME);

        restSalesforceContactMockMvc.perform(put("/api/salesforce-contacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSalesforceContact)))
            .andExpect(status().isOk());

        // Validate the SalesforceContact in the database
        List<SalesforceContact> salesforceContactList = salesforceContactRepository.findAll();
        assertThat(salesforceContactList).hasSize(databaseSizeBeforeUpdate);
        SalesforceContact testSalesforceContact = salesforceContactList.get(salesforceContactList.size() - 1);
        assertThat(testSalesforceContact.getName()).isEqualTo(UPDATED_NAME);

        // Validate the SalesforceContact in Elasticsearch
        SalesforceContact salesforceContactEs = salesforceContactSearchRepository.findOne(testSalesforceContact.getId());
        assertThat(salesforceContactEs).isEqualToIgnoringGivenFields(testSalesforceContact);
    }

    @Test
    @Transactional
    public void updateNonExistingSalesforceContact() throws Exception {
        int databaseSizeBeforeUpdate = salesforceContactRepository.findAll().size();

        // Create the SalesforceContact

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSalesforceContactMockMvc.perform(put("/api/salesforce-contacts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(salesforceContact)))
            .andExpect(status().isCreated());

        // Validate the SalesforceContact in the database
        List<SalesforceContact> salesforceContactList = salesforceContactRepository.findAll();
        assertThat(salesforceContactList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSalesforceContact() throws Exception {
        // Initialize the database
        salesforceContactRepository.saveAndFlush(salesforceContact);
        salesforceContactSearchRepository.save(salesforceContact);
        int databaseSizeBeforeDelete = salesforceContactRepository.findAll().size();

        // Get the salesforceContact
        restSalesforceContactMockMvc.perform(delete("/api/salesforce-contacts/{id}", salesforceContact.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean salesforceContactExistsInEs = salesforceContactSearchRepository.exists(salesforceContact.getId());
        assertThat(salesforceContactExistsInEs).isFalse();

        // Validate the database is empty
        List<SalesforceContact> salesforceContactList = salesforceContactRepository.findAll();
        assertThat(salesforceContactList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSalesforceContact() throws Exception {
        // Initialize the database
        salesforceContactRepository.saveAndFlush(salesforceContact);
        salesforceContactSearchRepository.save(salesforceContact);

        // Search the salesforceContact
        restSalesforceContactMockMvc.perform(get("/api/_search/salesforce-contacts?query=id:" + salesforceContact.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(salesforceContact.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SalesforceContact.class);
        SalesforceContact salesforceContact1 = new SalesforceContact();
        salesforceContact1.setId(1L);
        SalesforceContact salesforceContact2 = new SalesforceContact();
        salesforceContact2.setId(salesforceContact1.getId());
        assertThat(salesforceContact1).isEqualTo(salesforceContact2);
        salesforceContact2.setId(2L);
        assertThat(salesforceContact1).isNotEqualTo(salesforceContact2);
        salesforceContact1.setId(null);
        assertThat(salesforceContact1).isNotEqualTo(salesforceContact2);
    }
}
