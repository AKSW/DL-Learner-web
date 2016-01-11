package org.watte;
import java.io.BufferedReader;
import java.io.FileReader;
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

/**
 * This class will handle the request for a JSON formated list of avaiable modules/components.
 * Once DLLearner created the documentation, it will be parsed, converted into an object oriented structure
 * and returned as JSON.
 * @author Watte
 *
 */
@Path("/modules")
public class RetrieveModules {

	private static Logger logger = LoggerFactory.getLogger(RetrieveModules.class);
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getDocumentation() {
		
		//Initialize the DocumentGenerator from org.dllearner.cli
		DocumentationGenerator docGenerator = new DocumentationGenerator();
		
		//parse the document.
		//ArrayList<Module> modules = readDummyDocumentation();
		ArrayList<Module> modules = parseDocumentation(docGenerator.getConfigDocumentationString());

		Gson gson = new Gson();
		
		return gson.toJson(modules);
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
	
	/**
	 * Method exist for testing purposes.
	 */
	private ArrayList<Module> readDummyDocumentation() {
		
		FileReader fr;
		BufferedReader br;
		
		String document = "";
		String line = "";
		try {
			fr = new FileReader("D:\\documentation.dat");
			br = new BufferedReader(fr);
			
			while( (line = br.readLine()) != null) {
				document += line + "\n";
			}
			
			br.close();
			
		} catch(Exception ex) {
			logger.error("Error on reading dummy documentation", ex);
		} finally {
			
		}
		
		return parseDocumentation(document);
		
	}
}
