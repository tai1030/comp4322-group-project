package controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import core.Dijkstra;
import models.Edge;
import models.NodeList;
import models.LsaData;
import models.Node;
import models.ResultData;

public class CalculateController {

	public Object doPost(String data, String sourceNode) {
		LsaData lsaData = new LsaData();
		lsaData.setFromJson(data);

		ResultData resultData;

		if (sourceNode == null || sourceNode.length() == 0) { // Compute all
			resultData = new ResultData();
			for (Node node : this.processLsaData(lsaData).values()) {
				ResultData _resultData = calculateSingleStep(lsaData, node.getName());
				resultData.mergeResultData(_resultData);
			}
		} else { // Single step
			resultData = this.calculateSingleStep(lsaData, sourceNode);
		}

		return resultData.getData();
	}

	public HashMap<String, Node> processLsaData(LsaData lsaData) {
		HashMap<String, Node> nodes = new HashMap<>();
		List<Edge> edges = lsaData.getData();

		for (Edge edge : edges) {
			if (!nodes.containsKey(edge.getName())) {
				nodes.put(edge.getName(), new Node(edge.getName()));
			}
			for (Edge otherEdge : edge.getEdgeList()) {
				Node otherNode;
				if (!nodes.containsKey(otherEdge.getName())) {
					otherNode = new Node(otherEdge.getName());
					nodes.put(otherEdge.getName(), otherNode);
				} else {
					otherNode = nodes.get(otherEdge.getName());
				}
				nodes.get(edge.getName()).addDestination(otherNode, otherEdge.getWeight());
			}
		}

		return nodes;
	}

	private ResultData calculateSingleStep(LsaData lsaData, String sourceNode) {
		HashMap<String, Node> nodes = this.processLsaData(lsaData);

		NodeList nodeList = new NodeList();
		for (Node node : nodes.values()) {
			nodeList.add(node);
		}
		
		Dijkstra.calculateShortestPathFromSource(nodeList, nodes.get(sourceNode));

		ResultData resultData = new ResultData();

		String _source = nodes.get(sourceNode).getName();

		for (Node node : nodeList.get()) {
			if (!node.getName().equals(sourceNode)) {
				String _node = node.getName();
				int _cost = node.getDistance();

				// Prepare _path array
				List<String> _path = new ArrayList<>();
				for (Node routeNode : node.getShortestPath()) {
					_path.add(routeNode.getName());
				}
				_path.add(node.getName());

				// Add nodeData by source to resultData
				if(_cost < Integer.MAX_VALUE) {
					resultData.addNodeDataBySource(_source, _node, _path, _cost);
				}
			}
		}

		return resultData;
	}

}
