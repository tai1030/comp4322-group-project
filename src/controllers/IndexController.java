package controllers;

import static spark.Spark.*;

import java.util.HashMap;
import java.util.Map;

import spark.ModelAndView;

public class IndexController {

	public ModelAndView doGet() {
		Map<String, Object> attributes = new HashMap<>();
		//attributes.put("message", "Hello FreeMarker World");

		return modelAndView(attributes, "index.ftl");
	}

}
