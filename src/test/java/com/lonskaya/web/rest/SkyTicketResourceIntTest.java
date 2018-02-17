package com.lonskaya.web.rest;

import com.lonskaya.LonskayaApp;

import com.lonskaya.domain.SkyTicket;
import com.lonskaya.repository.SkyTicketRepository;
import com.lonskaya.service.SkyTicketService;
import com.lonskaya.repository.search.SkyTicketSearchRepository;
import com.lonskaya.service.dto.SkyTicketDTO;
import com.lonskaya.service.mapper.SkyTicketMapper;
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
 * Test class for the SkyTicketResource REST controller.
 *
 * @see SkyTicketResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LonskayaApp.class)
public class SkyTicketResourceIntTest {

    private static final String DEFAULT_DETAILS_JSON = "AAAAAAAAAA";
    private static final String UPDATED_DETAILS_JSON = "BBBBBBBBBB";

    @Autowired
    private SkyTicketRepository skyTicketRepository;

    @Autowired
    private SkyTicketMapper skyTicketMapper;

    @Autowired
    private SkyTicketService skyTicketService;

    @Autowired
    private SkyTicketSearchRepository skyTicketSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSkyTicketMockMvc;

    private SkyTicket skyTicket;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SkyTicketResource skyTicketResource = new SkyTicketResource(skyTicketService);
        this.restSkyTicketMockMvc = MockMvcBuilders.standaloneSetup(skyTicketResource)
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
    public static SkyTicket createEntity(EntityManager em) {
        SkyTicket skyTicket = new SkyTicket()
            .detailsJson(DEFAULT_DETAILS_JSON);
        return skyTicket;
    }

    @Before
    public void initTest() {
        skyTicketSearchRepository.deleteAll();
        skyTicket = createEntity(em);
    }

    @Test
    @Transactional
    public void createSkyTicket() throws Exception {
        int databaseSizeBeforeCreate = skyTicketRepository.findAll().size();

        // Create the SkyTicket
        SkyTicketDTO skyTicketDTO = skyTicketMapper.toDto(skyTicket);
        restSkyTicketMockMvc.perform(post("/api/sky-tickets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skyTicketDTO)))
            .andExpect(status().isCreated());

        // Validate the SkyTicket in the database
        List<SkyTicket> skyTicketList = skyTicketRepository.findAll();
        assertThat(skyTicketList).hasSize(databaseSizeBeforeCreate + 1);
        SkyTicket testSkyTicket = skyTicketList.get(skyTicketList.size() - 1);
        assertThat(testSkyTicket.getDetailsJson()).isEqualTo(DEFAULT_DETAILS_JSON);

        // Validate the SkyTicket in Elasticsearch
        SkyTicket skyTicketEs = skyTicketSearchRepository.findOne(testSkyTicket.getId());
        assertThat(skyTicketEs).isEqualToIgnoringGivenFields(testSkyTicket);
    }

    @Test
    @Transactional
    public void createSkyTicketWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = skyTicketRepository.findAll().size();

        // Create the SkyTicket with an existing ID
        skyTicket.setId(1L);
        SkyTicketDTO skyTicketDTO = skyTicketMapper.toDto(skyTicket);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSkyTicketMockMvc.perform(post("/api/sky-tickets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skyTicketDTO)))
            .andExpect(status().isBadRequest());

        // Validate the SkyTicket in the database
        List<SkyTicket> skyTicketList = skyTicketRepository.findAll();
        assertThat(skyTicketList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDetailsJsonIsRequired() throws Exception {
        int databaseSizeBeforeTest = skyTicketRepository.findAll().size();
        // set the field null
        skyTicket.setDetailsJson(null);

        // Create the SkyTicket, which fails.
        SkyTicketDTO skyTicketDTO = skyTicketMapper.toDto(skyTicket);

        restSkyTicketMockMvc.perform(post("/api/sky-tickets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skyTicketDTO)))
            .andExpect(status().isBadRequest());

        List<SkyTicket> skyTicketList = skyTicketRepository.findAll();
        assertThat(skyTicketList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSkyTickets() throws Exception {
        // Initialize the database
        skyTicketRepository.saveAndFlush(skyTicket);

        // Get all the skyTicketList
        restSkyTicketMockMvc.perform(get("/api/sky-tickets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(skyTicket.getId().intValue())))
            .andExpect(jsonPath("$.[*].detailsJson").value(hasItem(DEFAULT_DETAILS_JSON.toString())));
    }

    @Test
    @Transactional
    public void getSkyTicket() throws Exception {
        // Initialize the database
        skyTicketRepository.saveAndFlush(skyTicket);

        // Get the skyTicket
        restSkyTicketMockMvc.perform(get("/api/sky-tickets/{id}", skyTicket.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(skyTicket.getId().intValue()))
            .andExpect(jsonPath("$.detailsJson").value(DEFAULT_DETAILS_JSON.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSkyTicket() throws Exception {
        // Get the skyTicket
        restSkyTicketMockMvc.perform(get("/api/sky-tickets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSkyTicket() throws Exception {
        // Initialize the database
        skyTicketRepository.saveAndFlush(skyTicket);
        skyTicketSearchRepository.save(skyTicket);
        int databaseSizeBeforeUpdate = skyTicketRepository.findAll().size();

        // Update the skyTicket
        SkyTicket updatedSkyTicket = skyTicketRepository.findOne(skyTicket.getId());
        // Disconnect from session so that the updates on updatedSkyTicket are not directly saved in db
        em.detach(updatedSkyTicket);
        updatedSkyTicket
            .detailsJson(UPDATED_DETAILS_JSON);
        SkyTicketDTO skyTicketDTO = skyTicketMapper.toDto(updatedSkyTicket);

        restSkyTicketMockMvc.perform(put("/api/sky-tickets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skyTicketDTO)))
            .andExpect(status().isOk());

        // Validate the SkyTicket in the database
        List<SkyTicket> skyTicketList = skyTicketRepository.findAll();
        assertThat(skyTicketList).hasSize(databaseSizeBeforeUpdate);
        SkyTicket testSkyTicket = skyTicketList.get(skyTicketList.size() - 1);
        assertThat(testSkyTicket.getDetailsJson()).isEqualTo(UPDATED_DETAILS_JSON);

        // Validate the SkyTicket in Elasticsearch
        SkyTicket skyTicketEs = skyTicketSearchRepository.findOne(testSkyTicket.getId());
        assertThat(skyTicketEs).isEqualToIgnoringGivenFields(testSkyTicket);
    }

    @Test
    @Transactional
    public void updateNonExistingSkyTicket() throws Exception {
        int databaseSizeBeforeUpdate = skyTicketRepository.findAll().size();

        // Create the SkyTicket
        SkyTicketDTO skyTicketDTO = skyTicketMapper.toDto(skyTicket);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSkyTicketMockMvc.perform(put("/api/sky-tickets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(skyTicketDTO)))
            .andExpect(status().isCreated());

        // Validate the SkyTicket in the database
        List<SkyTicket> skyTicketList = skyTicketRepository.findAll();
        assertThat(skyTicketList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSkyTicket() throws Exception {
        // Initialize the database
        skyTicketRepository.saveAndFlush(skyTicket);
        skyTicketSearchRepository.save(skyTicket);
        int databaseSizeBeforeDelete = skyTicketRepository.findAll().size();

        // Get the skyTicket
        restSkyTicketMockMvc.perform(delete("/api/sky-tickets/{id}", skyTicket.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean skyTicketExistsInEs = skyTicketSearchRepository.exists(skyTicket.getId());
        assertThat(skyTicketExistsInEs).isFalse();

        // Validate the database is empty
        List<SkyTicket> skyTicketList = skyTicketRepository.findAll();
        assertThat(skyTicketList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSkyTicket() throws Exception {
        // Initialize the database
        skyTicketRepository.saveAndFlush(skyTicket);
        skyTicketSearchRepository.save(skyTicket);

        // Search the skyTicket
        restSkyTicketMockMvc.perform(get("/api/_search/sky-tickets?query=id:" + skyTicket.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(skyTicket.getId().intValue())))
            .andExpect(jsonPath("$.[*].detailsJson").value(hasItem(DEFAULT_DETAILS_JSON.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SkyTicket.class);
        SkyTicket skyTicket1 = new SkyTicket();
        skyTicket1.setId(1L);
        SkyTicket skyTicket2 = new SkyTicket();
        skyTicket2.setId(skyTicket1.getId());
        assertThat(skyTicket1).isEqualTo(skyTicket2);
        skyTicket2.setId(2L);
        assertThat(skyTicket1).isNotEqualTo(skyTicket2);
        skyTicket1.setId(null);
        assertThat(skyTicket1).isNotEqualTo(skyTicket2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SkyTicketDTO.class);
        SkyTicketDTO skyTicketDTO1 = new SkyTicketDTO();
        skyTicketDTO1.setId(1L);
        SkyTicketDTO skyTicketDTO2 = new SkyTicketDTO();
        assertThat(skyTicketDTO1).isNotEqualTo(skyTicketDTO2);
        skyTicketDTO2.setId(skyTicketDTO1.getId());
        assertThat(skyTicketDTO1).isEqualTo(skyTicketDTO2);
        skyTicketDTO2.setId(2L);
        assertThat(skyTicketDTO1).isNotEqualTo(skyTicketDTO2);
        skyTicketDTO1.setId(null);
        assertThat(skyTicketDTO1).isNotEqualTo(skyTicketDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(skyTicketMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(skyTicketMapper.fromId(null)).isNull();
    }
}
