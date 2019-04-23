var _data = {};
var _backupData = {};
var _tempNewEdge = {};

$(document).ready(function() {
  $("input#lsa_file").change(handleSelectFile);

  $('.dropdown-item').click(function(e){
    $('#lsa_file').trigger("click");
  });

  $('#resultCard > .card-body').height(window.innerHeight - 300);
});

function handleSelectFile() {
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert("Unsupported browser! Please use Google Chrome!");
    return;
  }

  input = this;
  if (!input || !input.files) {
    alert("Unsupported browser! Please use Google Chrome!");
  } else if (!input.files[0]) {
    alert("Please select a vaild LSA (.lsa) file");
  } else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = function() {
      var data = parseLsaSyntax(fr.result);
      updateData(data);
    };
    fr.readAsText(file);
  }
}

function parseLsaSyntax(syntax) {
    var obj = {};

    syntax.split(/\r|\n/).map(function(line){
        line = line.trim();
        var node = line.substring(0, line.indexOf(":")).trim();
        if(!node){
            return;
        }
        obj[node] = {};
        line.substring(line.indexOf(":")+1).trim().split(" ").map(function(edges){
            var edge = edges.trim().split(":");
            if(!edge || !edge[0] || !edge[1]){
                return;
            }
            obj[node][edge[0].trim()] = edge[1].trim();
        });
    })

    return obj;
}

function getNewNodeName(){
  var modal = $("#addNodePopup");
  var name = $(modal).find(".name").val().trim();
  return name;
}

function checkNode(){
  var name = getNewNodeName();
  return checkNodeByName(name);
}

function checkNodeByName(name){
  if (name.length == 0) {
    alert("Please enter the node name");
    return false;
  }
  if (_data.hasOwnProperty(name)) {
    alert("Node "+name+" already exists");
    return false;
  }
  return true;
}

function addNode(){
  var modal = $("#addNodePopup");
  var name = getNewNodeName();
  console.log(name);

  if (checkNodeByName(name)) {
    if ($.isEmptyObject(_tempNewEdge)) {
      alert("No edge");
      return false;
    }
    if (_tempNewEdge.hasOwnProperty(name)) {
      alert("The node and the edge ("+name+") cannot be the same.");
      return false;
    }
    _data[name] = _tempNewEdge;

    $(modal).modal('hide');

    _tempNewEdge = {};

    updateData(_data);
    renderAddNodePopupAfteraddEdgePopup(_tempNewEdge);
  }
};

function editNode(){
  var modal = $("#addNodePopup");
  var node = $(modal).find(".name").val();

  if (_data.hasOwnProperty(node)) {
    _data[node] = _tempNewEdge;
    console.log(_tempNewEdge);

    if (_tempNewEdge.hasOwnProperty(node)) {
      alert("The node and the edge ("+node+") cannot be the same.");
      return false;
    }

    $(modal).modal('hide');

    _tempNewEdge = {};

    updateData(_data);
    renderAddNodePopupAfteraddEdgePopup(_tempNewEdge);
  }
}

function deleteNode(node) {
  console.log(node)
  var r = confirm("Do you confirm delete the node("+node+") ?");
  if (r) {
    delete _data[node];
    console.log(_data)
    updateData(_data);
  }
}

function addEdge(){
  updateEdge("add");
}
function editEdge(selectedEdge){
  updateEdge("edit", selectedEdge);
}
function updateEdge(action="add", selectedEdge=""){
  var modal = $("#addEdgePopup");
  var edge = $(modal).find(".edge").val().trim();
  var weight = $(modal).find(".weight").val().trim();
  if (edge.length == 0) {
    alert("Please enter the edge name");
    return false;
  }
  if (weight.length == 0 || !(Math.floor(weight) == weight && $.isNumeric(weight) && weight > 0)) {
    alert("Please enter an integer weight greater than zero");
    return false;
  }

  var node = $("#addNodePopup").find(".name").val();
  if (node && node.length > 0 && node == edge) {
    alert("The node and the edge ("+node+") cannot be the same.");
    return false;
  }

  if (action == "edit" && selectedEdge != "" && selectedEdge != edge) {
    var temp = {};
    $.each(_tempNewEdge, function(key, value){
      if (key == selectedEdge) {
        temp[edge] = weight;
      } else {
        temp[key] = value;
      }
    });
    _tempNewEdge = temp;
  }

  _tempNewEdge[edge] = weight;
  console.log(_tempNewEdge);

  $(modal).modal('hide');

  renderAddNodePopupAfteraddEdgePopup(_tempNewEdge);
}

function deleteEdge(edge) {
  console.log(edge)
  var r = confirm("Do you confirm delete the edge("+edge+") ?");
  if (r) {
    delete _tempNewEdge[edge];
    console.log(_tempNewEdge)
    renderAddNodePopupAfteraddEdgePopup(_tempNewEdge);
  }
}

function renderAddNodePopupAfteraddEdgePopup(data) {
  $("#addNodePopup").find("tbody").html("");

  for(var edge in data){
    if (data.hasOwnProperty(edge)) {
      $("#addNodePopup").find("tbody").append(' \
          <tr> \
              <th scope="row" class="pl-4">' + edge + '</th> \
              <td>' + data[edge] + '</td> \
              <td class="pr-4 text-right"> \
                  <button type="button" class="btn btn-dark btn-sm" data-toggle="modal" data-target="#addEdgePopup" data-mode="edit" data-edge="' + edge + '" data-weight="' + data[edge] + '">Edit</button> \
                  <button type="button" class="btn btn-danger btn-sm" onclick="deleteEdge(\''+edge+'\')">Delete</button> \
              </td> \
          </tr> \
      ');
    }
  }
}

$('#addNodePopup').on('show.bs.modal', function (e) {
  var mode = $(e.relatedTarget).data("mode");
  console.log(mode);

  var edges = {};
  if (mode == "edit") {
    $(this).find(".modal-title").html("Edit node");
    $(this).find(".modal-footer").html('<button type="button" class="btn btn-primary" onclick="editNode()">Edit node</button>');

    var node = $(e.relatedTarget).data("node");
    $(this).find(".name").val(node).prop("readonly",true);


    edges = $(e.relatedTarget).data("edges");
    edges = edges === undefined ? {} : edges;
    console.log("date-edges", edges);
  } else {
    $(this).find(".modal-title").html("Add node");
    $(this).find(".modal-footer").html('<button type="button" class="btn btn-primary" onclick="addNode()">Add node</button>');

    $(this).find(".name").val("").prop("readonly",false);
  }

  _tempNewEdge = edges;
  renderAddNodePopupAfteraddEdgePopup(_tempNewEdge);
});


$('#addEdgePopup').on('show.bs.modal', function (e) {
  var mode = $(e.relatedTarget).data("mode");
  console.log(mode);
  if (mode == "edit") {
    var selectedEdge = $(e.relatedTarget).data("edge");
    $(this).find(".modal-title").html("Edit edge");
    $(this).find(".modal-footer").html('<button type="button" class="btn btn-primary" onclick="editEdge(\''+selectedEdge+'\')">Edit edge</button>');

    var edge = $(e.relatedTarget).data("edge");
    var weight = $(e.relatedTarget).data("weight");
    $(this).find(".edge").val(edge);
    $(this).find(".weight").val(weight);
  } else {
    $(this).find(".modal-title").html("Add edge");
    $(this).find(".modal-footer").html('<button type="button" class="btn btn-primary" onclick="addEdge()">Add edge</button>');

    $(this).find(".edge").val("");
    $(this).find(".weight").val("");
  }
})

function updateData(data){
  // handle add / edit
  var diff = getChanges(_backupData, data);
  console.log(diff);

  $.each(diff, function(key){
    $.each(diff[key], function(key2, val2){
      if (data.hasOwnProperty(key2)) {
        data[key2][key] = val2;
      }
    });
  });

  // handle delete
  var diff = getChanges(data, _backupData);
  console.log(diff);

  $.each(diff, function(key){
    $.each(diff[key], function(key2){
      if (data.hasOwnProperty(key2)) {
        delete data[key2][key];
      }
    });
  });

  // replace
  _data = data;
  // backup
  _backupData = jQuery.extend(true, {}, data);
  // render
  renderGraphContentTable(data);
  renderCalculateDropdown(data);
  renderDiagram(data);
}

function getChanges(prev, now)
{
  // sanity checks, now and prev must be an objects
  if (typeof now !== "object")
      now = {};
  if (typeof prev !== "object")
      return now;

  var changes = {};
  for (var prop in now) {
        // if prop is new in now, add it to changes
      if (!prev || !prev.hasOwnProperty(prop) ) {
          changes[prop] = now[prop];
          continue;
      }
      // if prop has another type or value (different object or literal)
      if (prev[prop] !== now[prop]) {
          if (typeof now[prop] === "object") {
              // prop is an object, do recursion
              var c = getChanges(prev[prop], now[prop]);
              if (!$.isEmptyObject(c))
                  changes[prop] = c;
          } else {
              // now[prop] has different but literal value
              changes[prop] = now[prop];
          }
      }
  }

  // returns empty object on none change
  return changes;
}

function renderGraphContentTable(data){
    $("#GraphContentTable > tbody").html("");

    for(node in data){
        var edges = [];
        var all_nodes = [];
        for(edge in data[node]){
            edges.push(edge + ":" + data[node][edge]);
            all_nodes.push(edge);
        }
        all_nodes.push(node);

        var dataEdges = JSON.stringify(data[node]);

        $("#GraphContentTable > tbody").append(' \
            <tr class="dataRow" data-nodes="' + all_nodes.join(",") + '"> \
                <th scope="row" class="pl-4">' + node + '</th> \
                <td>' + edges.join(" ") + '</td> \
                <td class="pr-4 text-right"> \
                    <button type="button" class="btn btn-dark btn-sm" data-toggle="modal" data-target="#addNodePopup" data-mode="edit" data-node="' + node + '" data-edges=\'' + dataEdges + '\'>Edit</button> \
                    <button type="button" class="btn btn-danger btn-sm" onclick="deleteNode(\''+node+'\')">Delete</button> \
                </td> \
            </tr> \
        ');
    }

    $("#GraphContentTable tr.dataRow").mouseover(function(e){
    	renderDiagram(data, $(this).attr("data-nodes").split(","));
    });
}

function renderCalculateDropdown(data){
    $(".dropdown > .dropdown-menu").html("");
    $(".dropdown > .dropdown-menu").append('<a class="dropdown-item" href="#" data-node="">Compute All</a>');
    $(".dropdown > .dropdown-menu").append('<div class="dropdown-divider"></div>');
    for(node in data){
        $(".dropdown > .dropdown-menu").append('<a class="dropdown-item" href="#" data-node="' + node + '">Single step (Source: ' + node + ')</a>');
    }

    $('.dropdown-item').off("click");
    $('.dropdown-item').click(function(e){
        callCalculateApi(data, $(e.target).attr("data-node"));
    });
}

function callCalculateApi(data, source_node){
    $.ajax('/calculate?source_node=' + source_node,{
        'data': JSON.stringify(data),
        'type': 'POST',
        'processData': false,
        'contentType': 'application/json',
        'success': function(result){
            renderResultTable(JSON.parse(result));
        }
    });
}

function renderResultTable(data){
    $("#ResultTable > tbody").html("");

    for(source in data){
        $("#ResultTable > tbody").append(' \
            <tr> \
                <th scope="row" colspan="3" class="text-center pt-1 pb-1">Source ' + source + '</th> \
            </tr> \
        ');
        for(node in data[source]){
        	var all_nodes = [node];
        	all_nodes = all_nodes.concat(data[source][node].path);

            $("#ResultTable > tbody").append(' \
                <tr class="dataRow" data-nodes="' + all_nodes.join(",") + '"> \
                    <th scope="row" class="pl-4 pt-1 pb-1">' + node + '</th> \
                    <td class="pt-1 pb-1">' + data[source][node].path.join(" > ") + '</td> \
                    <td class="pr-4 pt-1 pb-1 text-right">' + data[source][node].cost + '</td> \
                </tr> \
            ');
        }
    }

    $("#ResultTable tr.dataRow").mouseover(function(e){
    	renderDiagram(_data, $(this).attr("data-nodes").split(","));
    });
}

function renderDiagram(data, highlightDiagramEdges = []){
	var nodeIndex = [];
	var nodeDataset = [];
	var edgeDataset = [];
	var relationships = [];

	//Node ID assign
	var i = 1;
	for(node in data){
		nodeIndex[node] = i;
		nodeDataset.push({id: i, label: node});
		i++;
	}

	//Build relationships (single direction)
	for(node in data){
		for(edge in data[node]){

			if((relationships[node] && relationships[node][edge]) || (relationships[edge] && relationships[edge][node])){
				continue;
			}

			if(!relationships[node]){
				relationships[node] = [];
			}
			relationships[node][edge] = data[node][edge];
		}
	}
	//console.log(relationships);

	//Edges dataset
	for(node in relationships){
		for(edge in relationships[node]){
			var option = {from: nodeIndex[node], to: nodeIndex[edge], label: relationships[node][edge]};
			if(highlightDiagramEdges.indexOf(node) !== -1 && highlightDiagramEdges.indexOf(edge) !== -1){
				option.width = 3;
				option.color = {color: 'red'};
				option.font = {color: 'red', strokeWidth: 3, size: 18};
			}
			edgeDataset.push(option);
		}
	}

    // provide the data in the vis format
    var data = {
        nodes: new vis.DataSet(nodeDataset),
        edges: new vis.DataSet(edgeDataset)
    };

    // initialize diagram
    var network = new vis.Network($('#diagram')[0], data, {
	  layout: {
	    randomSeed: 3
	  }
	});
}
