package models;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class LsaData {

	private List<Edge> lsaData;

	public LsaData() {
		lsaData = new ArrayList<>();
	}

	public List<Edge> getData() {
		return lsaData;
	}

	public void setFromJson(String json) {
		JsonObject nodes = new Gson().fromJson(json, JsonObject.class);
		for (Map.Entry<String, JsonElement> node : nodes.entrySet()) {
			//System.out.println(node.getKey());
			Edge edge_data = new Edge(node.getKey());
			JsonObject edges = node.getValue().getAsJsonObject();
			for (Map.Entry<String, JsonElement> edge : edges.entrySet()) {
				//System.out.println(edge.getKey());
				//System.out.println(edge.getValue().getAsInt());
				edge_data.add(edge.getKey(), edge.getValue().getAsInt());
			}
			lsaData.add(edge_data);
		}
	}
}
