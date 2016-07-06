package org.watte;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.StringReader;
import java.util.ArrayList;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.dllearner.cli.DocumentationGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.watte.datamodel.Component;
import org.watte.datamodel.Module;
import org.watte.datamodel.Option;

import com.google.gson.Gson;


@Path("/modules")
public class ModuleHandler {

	private static Logger logger = LoggerFactory.getLogger(ModuleHandler.class);
	
	public ArrayList<Module> modules;
	public String modulesJSON;

	public ModuleHandler() {
		logger.debug("Constructor MOduleHandler");
		DocumentationGenerator docGenerator = new DocumentationGenerator();

        // FileWriter fw;
        // BufferedWriter bw;
        // File file = new File("dlldoc.txt");
        // try {
        //     // write config content into confFile
        //     fw = new FileWriter(file);
        //     bw = new BufferedWriter(fw);

        //     bw.write(docGenerator.getConfigDocumentationString());
        //     bw.close();
            
        // } catch (Exception e) {
        //     logger.error("Unable to write doc to file.");
        // }

		modules = parseDocumentation(docGenerator.getConfigDocumentationString());

		Gson gson = new Gson();

		modulesJSON = gson.toJson(modules);
	}

	/**
	 * This function gets called by GET requests.
	 * It generates the DLLearner documentation by calling <code>DocumentationGenerator().getConfigDocumentationString()</code>.
	 * This documentation gets converted into a JSON by Google's Gson package and will be returned.
	 * @return String JSON-encoded Module presentation
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getModules() {
		
		//Initialize the DocumentGenerator from org.dllearner.cli
		//DocumentationGenerator docGenerator = new DocumentationGenerator();
		
		//parse the document.

		//ArrayList<Module> modules = readDummyDocumentation();
		//ArrayList<Module> modules = parseDocumentation(docGenerator.getConfigDocumentationString());

		//Gson gson = new Gson();
		
		//return gson.toJson(modules);
		
		return modulesJSON;
	}
	
	/**
	 * This method handles the document parsing.
	 * It will return an ArrayList of Module-Objects, containing meta informations and option objects.
	 * @param document
	 * @return
	 */
	private ArrayList<Module> parseDocumentation(String document) {
		//arraylist containing a list of modules (e.g. Knowledge Source, Reasoner...)
		ArrayList<Module> modules = new ArrayList<Module>();
		//Initialize a StringReader, so the "read line" functionality of BufferedReader can be used furthermore.
		StringReader stringReader = new StringReader(document);
        BufferedReader br;
        //gets true once a new component is reached.
        //the term "conf file usage" appears twice. once in an option,
        //once for a component. this boolean states at which state of parsing
        //we are.
        boolean componentUsageIncoming = false;

        try {
            br = new BufferedReader(stringReader);

            String line;
            Module module = null;
            Component component = null;
            Option option = null;

            while( (line = br.readLine()) != null) {
                    //start of new module. take its name
                    if (line.indexOf("* ") != -1) {
                        if (module != null) {
                        	//add the module to list, if its not null.
                        	//module is not null, when a section is parsed.
                            modules.add(module);
                        }
                        
                        //(re) initialize module. take its name
                        module = new Module();
                        module.setModuleName(line.substring(2, line.length() - 2));
                    }

                    //component-section is reached.
                    if (line.indexOf("component: ") == 0) {

                        component = new Component();
                        component.setComponentName(line.substring(11));
                        module.addModuleComponents(component);
                        option = new Option();
                    }

                    //in component section, a component name followed by a line of "=" will appear.
                    if (line.indexOf("======") != -1) {
                        componentUsageIncoming = true;
                    }

                    //if we reach "conf file usage" and we know, that the usage for a component is
                    //scheduled next, we'll take it.
                    if (line.indexOf("conf file usage: ") == 0 && componentUsageIncoming) {
                        componentUsageIncoming = false;
                        if (component != null) {
                            component.setComponentUsage(line.substring(17));
                        }
                    }

                    if (line.indexOf("option name: ") == 0) {
                        option = new Option();
                        option.setOptionName(line.substring(13));
                    }

                    if (line.indexOf("description: ") == 0) {
                        option.setOptionDescription(line.substring(13));
                    }

                    if (line.indexOf("required: ") == 0) {
                    	option.setOptionRequired(line.substring(10));
                    }
                    
                    if (line.indexOf("type: ") == 0) {
                        option.setOptionType(line.substring(6));
                    }

                    if (line.indexOf("default value: ") == 0) {
                        option.setOptionDefaultValue(line.substring(15));
                    }

                    if (line.indexOf("conf file usage: ") == 0 && !componentUsageIncoming) {
                        option.setOptionUsage(line.substring(17));
                        if(option.getOptionName() != null)
                            component.addComponentOptions(option);
                    }

            }

            modules.add(module);

            br.close();


        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return modules;
	}
}
