package org.watte;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/hello")
public class Hello {

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String boo() {
		return "aasda��������asdsd";
	}
	
}