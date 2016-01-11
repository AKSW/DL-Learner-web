package org.watte;

/**
 * Restful Resources
 * 
 * @author Patrick Watzlawik
 */

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.FileAppender;
import org.apache.log4j.Level;
import org.apache.log4j.PatternLayout;
import org.dllearner.cli.CLI;
import org.dllearner.confparser.ParseException;
import org.dllearner.core.ReasoningMethodUnsupportedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.watte.ConfigModel;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

@Path("/welcomeOLD")
public class WelcomeResource {

	// org.dllearner.interfaces.CLI Instance for solving
	private CLI cli = new CLI();
	private static Logger logger = LoggerFactory.getLogger(WelcomeResource.class);
	private FileAppender fileAppender;

	@Context
	private ServletContext context;

	
	public WelcomeResource() {
		//somtimes jersey wont recognize another package.
		//somtimes it does..
		
		//ResourceConfig resourceConfig = new ResourceConfig();
		//resourceConfig.packages("org.watte.datamodel");
		
	}
	
	@GET
	@Produces(MediaType.TEXT_HTML)
	/**
	 * Method is called from Jersey when calling url [...]/welcome.
	 * Calls <code>readHTML()</code> which reads the content of <code>welcome.html</code>
	 * and returns it as String. 
	 * @return
	 */
	public String welcome() {
		
		//start check for an existing "log/error.log" path
		//CLI will write into this file (just relative declaration).
		//Not quite sure, how to handle this, so I'll create the desired file.
		//CLI throws an Exception, when the file/directory not exist.
		File errorLog = new File("log/error.log");
		if(!errorLog.exists())
			errorLog.getParentFile().mkdirs();
		
		return readHTML("/views/dllearner.html");
	}

	@POST
	@Path("/config")
	@Produces(MediaType.TEXT_PLAIN)
	/**
	 * Gets called by an ajax-request from JavaScript.
	 * 
	 * Returns the dllearner results.
	 * @param config
	 * @return String dllearner results
	 */
	public String startCLI(String config) {

		//logger.info("Retrieved JSON:\n"+config);
		
		try {
			org.apache.log4j.Logger.getLogger("org.watte").setLevel(Level.toLevel("DEBUG"));
		} catch (Exception e) {
			logger.warn("Error setting log level to DEBUG");
		}

		logger.info("Starting CLI and parameter delivery.");

		ConfigModel configModel = convertJSONToConfigModel(config);
		if(configModel == null) {
			logger.error("Error converting JSON to ConfigModel");
			return "Error converting JSON to ConfigModel";
		}
		
		//create a sessionDir, which will be deleted afterwards
		File sessionDir = createSessionDir();

		// file to write in the config content
		File confFile = new File(sessionDir, Helper.getConfigurationName(config)+".conf");
		logger.debug("Configuration File name: "+confFile.getAbsolutePath());
		// file to write in the owl content
		File ksFile = new File(sessionDir, Helper.getKnowledgeFileName(config));
		logger.debug("KS File name: "+ksFile.getAbsolutePath());
		
		File file = new File(sessionDir, "options.dat");
		
		// file to write in the DLLearner results
		File dllResultFile = new File(sessionDir, "dll-log.log");
		if (dllResultFile.exists()) {
			dllResultFile.delete();
			logger.debug("dll_result_file deleted (" + dllResultFile.getAbsolutePath() + ").");
		}

		try {
			// format pattern for log4j log-file.
			PatternLayout layout = new PatternLayout("%d{ISO8601} %-5p [%t] %c: %m%n");

			fileAppender = new FileAppender(layout, dllResultFile.getAbsolutePath());
			fileAppender.setThreshold(Level.DEBUG);
			
			// append a file-logger to log4j, so we can read the dll-results
			org.apache.log4j.Logger.getLogger("org.dllearner").addAppender(fileAppender);
			
		} catch (IOException e1) {
			e1.printStackTrace();
		}

		FileWriter fw;
		BufferedWriter bw;

		try {
			// write config content into confFile
			fw = new FileWriter(confFile);
			bw = new BufferedWriter(fw);

			bw.write(configModel.getConfig());
			bw.close();

			// write owlFile content into owlFile
			fw = new FileWriter(ksFile);
			bw = new BufferedWriter(fw);

			bw.write(configModel.getKS());
			bw.close();

			/*
			fw = new FileWriter(file);
			bw = new BufferedWriter(fw);
			
			bw.write(docGen.getConfigDocumentationString());
			bw.close(); */
			
		} catch (Exception e) {
			logger.error("Unable to write config/owl content to file.");
			return "Unable to write config/owl content to file.";
		}

		String[] args = new String[1];
		args[0] = confFile.getAbsolutePath();

		try {
			cli.main(args);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ReasoningMethodUnsupportedException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		String dll_log = readDLL_Log(dllResultFile);
		
		//removeSessionDir(sessionDir);

		return dll_log;
	}

	@Path("/bla")
	public String bla() {
		String stacktraceFileName = "log/error.log";
		
		File sample = new File(stacktraceFileName);
		
		logger.info("File exists: "+sample.exists());
		logger.info(sample.getAbsolutePath());
		
		try {
			int[] array = new int[1];
			
			int baum = array[4];
			
		} catch (Exception e) {
		
			FileOutputStream fos;
			try {
				fos = new FileOutputStream(stacktraceFileName);
				PrintStream ps = new PrintStream(fos);
		        e.printStackTrace(ps);
			} catch (FileNotFoundException e1) {
				e1.printStackTrace();
			}
	        
		}
		return "";
	}
	
	/**
	 * Deletes the session directory.
	 * 
	 * Once the dl-learner came to an end, we read the results out of a previously added log file.
	 * We dont need the short-dated session directory any more. Delete it.
	 * @param sessionDir
	 */
	private void removeSessionDir(File sessionDir) {
		
		//Just removing our previously added FileAppend wont unlock dll-log.log
		//But removing all Appenders works.
		org.apache.log4j.Logger.getLogger("org.dllearner").removeAllAppenders();
		
		try {
			FileUtils.deleteDirectory(sessionDir);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}

	/**
	 * DL-Learner uses a Logger to control information output. We appended a File-Handler to this Logger
	 * to visualize the results on the front end. 
	 * 
	 * After DL-Learner finishes, we read out this specific log-file.
	 * @param resultFile File object of DL-Learner log-file
	 * @return String Content of DL-Learner log-file
	 */
	private String readDLL_Log(File resultFile) {

		//will contain the result content later.
		String resultContent = "";

		try {
			FileReader fr = new FileReader(resultFile);
			BufferedReader br = new BufferedReader(fr);

			String line = br.readLine();

			while (line != null) {
				resultContent += line +"\n";

				line = br.readLine();
			}

			br.close();
		} catch (Exception e) {
			logger.error("Unable to read DLL_Log File (" + resultFile.getAbsolutePath() + ").", e);

		}

		return resultContent;
	}

	/**
	 * Reads file content of the welcome page, located in start.html
	 * 
	 * @return String HTML of welcome.html
	 */
	private String readHTML(String path) {

		String fileContent = "";
		StringBuilder sb = new StringBuilder();

		// Location of welcome.html file to read out of
		File file = new File(context.getRealPath(path));
		FileReader fr;
		BufferedReader br;

		String line;
		try {
			fr = new FileReader(file);
			br = new BufferedReader(fr);
			line = br.readLine();

			while (line != null) {
				sb.append(line);
				line = br.readLine();
			}

			br.close();
		} catch (Exception e) {
			System.out.println("Error loading html.");
			e.printStackTrace();
		}

		fileContent = sb.toString();

		return fileContent;
	}

	
	/**
	 * The Frontend can be used in a multi-user environment. To avoid conflicts between 
	 * user submited configurations we create a random named, temporary folder for each session/submited config.
	 * 
	 * The system writes submited .conf and .owl data and DL-Learner .log files into above mentioned folder.
	 * Once the DL-Learner log file got read out, the session folder will be removed.
	 * 
	 * This methods handles creation of mentioned folder and returns the generated folder.
     *
	 * @return File sessions folder as file object
	 */
	private File createSessionDir() {
		//declaration of sessions folder file object
		File sessionDir;
		//randomize a session identifier
		String session = ""+ (int)(Math.random()*10000);
		//initiate a session folder file object
		sessionDir = new File(context.getRealPath("/SubmitedContent/"+session));
		
		//technically it is possible to create a same-titled session to a existing session 
		//(which maybe last an average of 10seconds)
		//To prevent conflicts we generate a new session folder as long as we find a not used name.
		//once in a million stuff.
		while(sessionDir.exists()) {
			session = ""+(int)(Math.random()*10000);
			sessionDir = new File(context.getRealPath("/SubmitedContent/"+session));
		}
		//create directory structure
		sessionDir.mkdirs();

		logger.info("Created sessionDir: "+sessionDir.getAbsolutePath());
		
		return sessionDir;
	}
	
	private ConfigModel convertJSONToConfigModel(String configJSON) {
		Gson gson = new Gson();
		
		ConfigModel configModel;
		
		try {
			configModel = gson.fromJson(configJSON, ConfigModel.class);
		} catch(JsonSyntaxException e) {
			logger.error("Unable to convert JSON into ConfigModel object.", e);
			return null;
		}
		
		return configModel;
	}
}
