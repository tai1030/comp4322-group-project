package models;

import java.util.ArrayList;
import java.util.List;

public class Edge {

	private List<Edge> edgeList = null;
	private String name;
	private int weight;

	public Edge(String name) {
		this.edgeList = new ArrayList<>();
		this.name = name;
		this.weight = 0;
	}

	public Edge(String name, int weight) {
		this.edgeList = new ArrayList<>();
		this.name = name;
		this.weight = weight;
	}

	public boolean add(String name, int weight) {
		return this.edgeList.add(new Edge(name, weight));
	}

	public List<Edge> getEdgeList() {
		if (this.edgeList == null) {
			this.edgeList = new ArrayList<>();
		}
		return this.edgeList;
	}

	public String getName() {
		return name;
	}

	public int getWeight() {
		return weight;
	}
}
