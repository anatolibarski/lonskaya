package com.lonskaya.web.rest;

import com.lonskaya.LonskayaApp;

import com.lonskaya.domain.SkySubscription;
import com.lonskaya.repository.SkySubscriptionRepository;
import com.lonskaya.service.SkySubscriptionService;
import com.lonskaya.repository.search.SkySubscriptionSearchRepository;
import com.lonskaya.service.dto.SkySubscriptionDTO;
import com.lonskaya.service.mapper.SkySubscriptionMapper;
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
 * Test class for the SkySubscriptionResource REST controller.
 *
 * @see SkySubscriptionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LonskayaApp.class)
public class SkySubscriptionResourceIntTest {

    private static final String DEFAULT_DETAILS_JSON = "AAAAAAAAAA";
    private static final String UPDATED_DETAILS_JSON = "BBBBBBBBBB";

    @Autowired
    private SkySubscriptionRepository skySubscriptionRepository;

    @Autowired
    private SkySubscriptionMapper skySubscriptionMapper;

    @Autowired
    private SkySubscriptionService skySubscriptionService;

    @Autowired
    private SkySubscriptionSearchRepository skySubscriptionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSkySubscriptionMockMvc;

    private SkySubscription skySubscription;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SkySubscriptionResource skySubscriptionResource = new SkySubscriptionResource(skySubscriptionService);
        this.restSkySubscriptionMockMvc = MockMvcBuilders.standaloneSetup(skySubscriptionResource)
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
    public static SkySubscription createEntity(EntityManager em) {
        SkySubscription skySubscription = new SkySubscription()
            .detailsJson(DEFAULT_DETAILS_JSON);
        return skySubscription;
    }

    @Before
    public void initTest() {
        skySubscriptionSearchRepository.deleteAll();
        skySubscription = createEntity(em);
    }

    @Test
    @Transactional
    public void createSkySubscription() throws Exception {
        int databaseSizeBeforeCreate = skySubscriptionRepository.findAll().size();

        // Create the SkySubscription
        SkySubscriptionDTO skySubscriptionDTO = skySubscriptionMapper.toDto(skySubscription);
        restSkySubscriptionMockMvc.perform(post("/api/sky-subscriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skySubscriptionDTO)))
            .andExpect(status().isCreated());

        // Validate the SkySubscription in the database
        List<SkySubscription> skySubscriptionList = skySubscriptionRepository.findAll();
        assertThat(skySubscriptionList).hasSize(databaseSizeBeforeCreate + 1);
        SkySubscription testSkySubscription = skySubscriptionList.get(skySubscriptionList.size() - 1);
        assertThat(testSkySubscription.getDetailsJson()).isEqualTo(DEFAULT_DETAILS_JSON);

        // Validate the SkySubscription in Elasticsearch
        SkySubscription skySubscriptionEs = skySubscriptionSearchRepository.findOne(testSkySubscription.getId());
        assertThat(skySubscriptionEs).isEqualToIgnoringGivenFields(testSkySubscription);
    }

    @Test
    @Transactional
    public void createSkySubscriptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = skySubscriptionRepository.findAll().size();

        // Create the SkySubscription with an existing ID
        skySubscription.setId(1L);
        SkySubscriptionDTO skySubscriptionDTO = skySubscriptionMapper.toDto(skySubscription);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSkySubscriptionMockMvc.perform(post("/api/sky-subscriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skySubscriptionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the SkySubscription in the database
        List<SkySubscription> skySubscriptionList = skySubscriptionRepository.findAll();
        assertThat(skySubscriptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDetailsJsonIsRequired() throws Exception {
        int databaseSizeBeforeTest = skySubscriptionRepository.findAll().size();
        // set the field null
        skySubscription.setDetailsJson(null);

        // Create the SkySubscription, which fails.
        SkySubscriptionDTO skySubscriptionDTO = skySubscriptionMapper.toDto(skySubscription);

        restSkySubscriptionMockMvc.perform(post("/api/sky-subscriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skySubscriptionDTO)))
            .andExpect(status().isBadRequest());

        List<SkySubscription> skySubscriptionList = skySubscriptionRepository.findAll();
        assertThat(skySubscriptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSkySubscriptions() throws Exception {
        // Initialize the database
        skySubscriptionRepository.saveAndFlush(skySubscription);

        // Get all the skySubscriptionList
        restSkySubscriptionMockMvc.perform(get("/api/sky-subscriptions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(skySubscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].detailsJson").value(hasItem(DEFAULT_DETAILS_JSON.toString())));
    }

    @Test
    @Transactional
    public void getSkySubscription() throws Exception {
        // Initialize the database
        skySubscriptionRepository.saveAndFlush(skySubscription);

        // Get the skySubscription
        restSkySubscriptionMockMvc.perform(get("/api/sky-subscriptions/{id}", skySubscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(skySubscription.getId().intValue()))
            .andExpect(jsonPath("$.detailsJson").value(DEFAULT_DETAILS_JSON.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSkySubscription() throws Exception {
        // Get the skySubscription
        restSkySubscriptionMockMvc.perform(get("/api/sky-subscriptions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSkySubscription() throws Exception {
        // Initialize the database
        skySubscriptionRepository.saveAndFlush(skySubscription);
        skySubscriptionSearchRepository.save(skySubscription);
        int databaseSizeBeforeUpdate = skySubscriptionRepository.findAll().size();

        // Update the skySubscription
        SkySubscription updatedSkySubscription = skySubscriptionRepository.findOne(skySubscription.getId());
        // Disconnect from session so that the updates on updatedSkySubscription are not directly saved in db
        em.detach(updatedSkySubscription);
        updatedSkySubscription
            .detailsJson(UPDATED_DETAILS_JSON);
        SkySubscriptionDTO skySubscriptionDTO = skySubscriptionMapper.toDto(updatedSkySubscription);

        restSkySubscriptionMockMvc.perform(put("/api/sky-subscriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skySubscriptionDTO)))
            .andExpect(status().isOk());

        // Validate the SkySubscription in the database
        List<SkySubscription> skySubscriptionList = skySubscriptionRepository.findAll();
        assertThat(skySubscriptionList).hasSize(databaseSizeBeforeUpdate);
        SkySubscription testSkySubscription = skySubscriptionList.get(skySubscriptionList.size() - 1);
        assertThat(testSkySubscription.getDetailsJson()).isEqualTo(UPDATED_DETAILS_JSON);

        // Validate the SkySubscription in Elasticsearch
        SkySubscription skySubscriptionEs = skySubscriptionSearchRepository.findOne(testSkySubscription.getId());
        assertThat(skySubscriptionEs).isEqualToIgnoringGivenFields(testSkySubscription);
    }

    @Test
    @Transactional
    public void updateNonExistingSkySubscription() throws Exception {
        int databaseSizeBeforeUpdate = skySubscriptionRepository.findAll().size();

        // Create the SkySubscription
        SkySubscriptionDTO skySubscriptionDTO = skySubscriptionMapper.toDto(skySubscription);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSkySubscriptionMockMvc.perform(put("/api/sky-subscriptions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skySubscriptionDTO)))
            .andExpect(status().isCreated());

        // Validate the SkySubscription in the database
        List<SkySubscription> skySubscriptionList = skySubscriptionRepository.findAll();
        assertThat(skySubscriptionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSkySubscription() throws Exception {
        // Initialize the database
        skySubscriptionRepository.saveAndFlush(skySubscription);
        skySubscriptionSearchRepository.save(skySubscription);
        int databaseSizeBeforeDelete = skySubscriptionRepository.findAll().size();

        // Get the skySubscription
        restSkySubscriptionMockMvc.perform(delete("/api/sky-subscriptions/{id}", skySubscription.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean skySubscriptionExistsInEs = skySubscriptionSearchRepository.exists(skySubscription.getId());
        assertThat(skySubscriptionExistsInEs).isFalse();

        // Validate the database is empty
        List<SkySubscription> skySubscriptionList = skySubscriptionRepository.findAll();
        assertThat(skySubscriptionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSkySubscription() throws Exception {
        // Initialize the database
        skySubscriptionRepository.saveAndFlush(skySubscription);
        skySubscriptionSearchRepository.save(skySubscription);

        // Search the skySubscription
        restSkySubscriptionMockMvc.perform(get("/api/_search/sky-subscriptions?query=id:" + skySubscription.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(skySubscription.getId().intValue())))
            .andExpect(jsonPath("$.[*].detailsJson").value(hasItem(DEFAULT_DETAILS_JSON.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SkySubscription.class);
        SkySubscription skySubscription1 = new SkySubscription();
        skySubscription1.setId(1L);
        SkySubscription skySubscription2 = new SkySubscription();
        skySubscription2.setId(skySubscription1.getId());
        assertThat(skySubscription1).isEqualTo(skySubscription2);
        skySubscription2.setId(2L);
        assertThat(skySubscription1).isNotEqualTo(skySubscription2);
        skySubscription1.setId(null);
        assertThat(skySubscription1).isNotEqualTo(skySubscription2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SkySubscriptionDTO.class);
        SkySubscriptionDTO skySubscriptionDTO1 = new SkySubscriptionDTO();
        skySubscriptionDTO1.setId(1L);
        SkySubscriptionDTO skySubscriptionDTO2 = new SkySubscriptionDTO();
        assertThat(skySubscriptionDTO1).isNotEqualTo(skySubscriptionDTO2);
        skySubscriptionDTO2.setId(skySubscriptionDTO1.getId());
        assertThat(skySubscriptionDTO1).isEqualTo(skySubscriptionDTO2);
        skySubscriptionDTO2.setId(2L);
        assertThat(skySubscriptionDTO1).isNotEqualTo(skySubscriptionDTO2);
        skySubscriptionDTO1.setId(null);
        assertThat(skySubscriptionDTO1).isNotEqualTo(skySubscriptionDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(skySubscriptionMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(skySubscriptionMapper.fromId(null)).isNull();
    }
}
