package org.watte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

@Path("/welcome")
public class Frontend {

	@Context
	private ServletContext context;
	
	@GET
	@Produces(MediaType.TEXT_HTML)
	/**
	 * Method is called from Jersey when calling url [...]/welcome.
	 * Calls <code>readHTML()</code> which reads the content of <code>dllearner.html</code>
	 * and returns it as String. 
	 * @return
	 */
	public String welcome() {
		
		//start check for an existing "log/error.log" path
		//CLI will write into this file (just relative declaration).
		//Not quite sure, how to handle this, so I'll just create the desired file.
		//CLI throws an Exception, when the file/directory not exist.
		File errorLog = new File("log/error.log");
		if(!errorLog.exists())
			errorLog.getParentFile().mkdirs();
		
		return readHTML("/views/dllearner.html");
	}
	
	/**
	 * Reads file content of the welcome page, located in dllearner.html
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
	
}
