package core;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFileLocation;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import controllers.CalculateController;
import controllers.IndexController;

public class Main {

	public static void main(String[] arg) {
		final int port = 8080;
		
		port(port);
		staticFileLocation("/public");

		// Index
		get("/", (request, response) -> {
			IndexController indexController = new IndexController();
			return indexController.doGet();
		}, new FreeMarkerTemplateEngine());

		// Calculation Endpoint
		post("/calculate", (request, response) -> {
			CalculateController calculateController = new CalculateController();
			return calculateController.doPost(request.body(), request.queryParams("source_node"));
		}, new JsonTransformer());

		System.out.println("Please open browser, go to [http://127.0.0.1:" + port + "]");
		Main.openBrowser("http://127.0.0.1:" + port);
	}

	private static void openBrowser(String url) {
		if (Desktop.isDesktopSupported()) {
			Desktop desktop = Desktop.getDesktop();
			try {
				desktop.browse(new URI(url));
			} catch (IOException | URISyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			Runtime runtime = Runtime.getRuntime();
			try {
				runtime.exec("xdg-open " + url);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

}
