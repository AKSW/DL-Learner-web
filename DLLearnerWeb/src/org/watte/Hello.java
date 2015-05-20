package org.watte;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import org.dllearner.cli.CLI;

@Path("/hello")
public class Hello {

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String boo() {
		
		CLI cli = new CLI();
		
		return "aasdaüüüüüüüüasdsd";
	}
	
}
