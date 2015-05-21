package org.watte;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletContext;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.dllearner.cli.CLI;
import org.dllearner.confparser3.ParseException;
import org.dllearner.core.ReasoningMethodUnsupportedException;
import org.watte.model.ConfigModel;

import com.google.gson.Gson;

@Path("/welcome")
public class WelcomeResource {

	CLI cli = new CLI();

	@Context
	ServletContext context;

	@GET
	@Produces(MediaType.TEXT_HTML)
	public String welcome() {
		return readHTML();
	}

	@POST
	@Path("/config")
	@Produces(MediaType.TEXT_PLAIN)
	public String startCLI(@FormParam("config") String config) {

		Gson gson = new Gson();
		ConfigModel configModel;

		try {
			configModel = gson.fromJson(config, ConfigModel.class);

		} catch (Exception e) {
			System.out.println("Error parsing json from HTML form");
			return "Error";
		}

		File confFile = new File(context.getRealPath("/Config/father.conf"));
		File owlFile = new File(context.getRealPath("/Config/father.owl"));

		System.out.println(confFile.getAbsolutePath());

		FileWriter fw;
		BufferedWriter bw;

		try {
			fw = new FileWriter(confFile);
			bw = new BufferedWriter(fw);

			bw.write(configModel.getConfig());
			bw.close();

			fw = new FileWriter(owlFile);
			bw = new BufferedWriter(fw);

			bw.write(configModel.getOWL());
			bw.close();
		} catch (Exception e) {
			return "Error writing Files";
		}

		String[] args = new String[1];
		args[0] = confFile.getAbsolutePath();
		
		args[0] = "D:\\Dropbox\\JavaPlace 6.0\\dllearner-parent\\examples\\father.conf";
		
		try {
			cli.main(args);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ReasoningMethodUnsupportedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return "schukscheﬂ";
	}

	/**
	 * Reads file content of the welcome page, located in start.html
	 * 
	 * @return
	 */
	private String readHTML() {

		String fileContent = "";
		StringBuilder sb = new StringBuilder();

		InputStream fis = WelcomeResource.class.getResourceAsStream(context.getContextPath() + "/HTML/welcome.html");
		File file = new File(context.getRealPath("/HTML/welcome.html"));
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
			// TODO Auto-generated catch block
			System.out.println("Error loading html.");
			e.printStackTrace();
		}

		fileContent = sb.toString();

		return fileContent;
	}

}
