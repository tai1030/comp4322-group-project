package models;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResultData {

	Map<String, Object> resultData;
	
	public ResultData() {
		resultData = new HashMap<>();
	}
	
	public Map<String, Object> getData() {
		return resultData;
	}
	
	public void addNodeDataBySource(String source, String node, List<String> path, int cost) {
		Map<String, Object> nodeData = new HashMap<>();
		nodeData.put("path", path);
		nodeData.put("cost", cost);
		
		if(resultData.containsKey(source)) {
			@SuppressWarnings("unchecked")
			Map<String, Object> source_data = (Map<String, Object>) resultData.get(source);
			source_data.put(node, nodeData);
			resultData.replace(source, source_data);
		} else {
			Map<String, Object> source_data = new HashMap<>();
			source_data.put(node, nodeData);
			resultData.put(source, source_data);
		}
	}
	
	public void mergeResultData(ResultData addResultData) {
		Map<String, Object> newResultData = new HashMap<>();
		newResultData.putAll(this.resultData);
		newResultData.putAll(addResultData.getData());
		this.resultData = newResultData;
	}

}
