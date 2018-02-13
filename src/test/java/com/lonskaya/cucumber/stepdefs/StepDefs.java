package com.lonskaya.cucumber.stepdefs;

import com.lonskaya.LonskayaApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = LonskayaApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
