package org.watte;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import javax.ws.rs.Path;
import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

@Path("/angular")
public class AngularTest {

	@Context
	private ServletContext context;
	
	@GET
	@Produces(MediaType.TEXT_HTML)
	/**
	 * Method is called from Jersey when calling url [...]/welcome.
	 * Calls <code>readHTML()</code> which reads the content of <code>welcome.html</code>
	 * and returns it as String. 
	 * @return
	 */
	public String welcome() {
		
		
		return readHTML();
	}
	
	private String readHTML() {

		String fileContent = "";
		StringBuilder sb = new StringBuilder();

		// Location of welcome.html file to read out of
		File file = new File(context.getRealPath("/HTML/angular.html"));
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
