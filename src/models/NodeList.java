package models;

import java.util.HashSet;
import java.util.Set;

public class NodeList {
	private Set<Node> nodes = new HashSet<>();

	public Set<Node> get() {
		return nodes;
	}

	public void set(Set<Node> nodes) {
		this.nodes = nodes;
	}

	public void add(Node node) {
		nodes.add(node);
	}
}
