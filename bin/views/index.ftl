<!DOCTYPE html>
<html lang="en">

<head>
    <title>Link State Routing | COMP4322</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css" />
</head>

<body>
    <!-- Header -->
    <div class="jsx-1000856051 sticky-top">
        <nav class="navbar navbar-expand navbar-dark bg-dark sticky-top">
            <span class="mr-auto navbar-brand">Link State Routing</span>
        </nav>
    </div>

    <!-- Main Layout -->
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <!-- // File upload -->
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Select LSA packet file (.lsa)</b>
                    </div>
                    <div class="card-body">
                        <div class="input-group mb-2">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" accept=".lsa" id="lsa_file" />
                                <label class="custom-file-label" for="lsa_file">Choose file</label>
                            </div>
                        </div>
                        <div>
                          <a href="/router.lsa" target="_blank">Download sample LSA file</a>
                        </div>
                    </div>
                </div>
                <!-- File upload // -->
                
                <!-- // Diagram -->
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Network graph</b> (scroll to zoom)
                    </div>
                    <div class="card-body p-0">
                        <div id="diagram" style="height:300px"></div>
                    </div>
                </div>
                <!-- Diagram // -->

                <!-- // Graph content -->
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Graph content</b>
                    </div>
                    <div class="card-body p-0">
                        <table class="table mb-0" id="GraphContentTable">
                            <thead>
                                <tr>
                                    <th scope="col" class="pl-4 align-middle">Node</th>
                                    <th scope="col" class="align-middle">Edges</th>
                                    <th scope="col" class="pr-4 text-right align-middle">
                                        <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#addNodePopup" data-mode="add">
                                            Add node
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- // Data template // --
                                <tr>
                                    <th scope="row" class="pl-4">t</th>
                                    <td>u:2 v:4 y:7</td>
                                    <td class="pr-4 text-right">
                                        <button type="button" class="btn btn-dark btn-sm" data-toggle="modal" data-target="#addNodePopup" data-whatever="----testing----data----">
                                            Edit
                                        </button>
                                        <button type="button" class="btn btn-danger btn-sm">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                -- // Data template // -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- Graph content // -->

                <!-- // Add node (popup) -->
                <div class="modal fade" id="addNodePopup" tabindex="-1" role="dialog" aria-labelledby="addNodePopupLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="addNodePopupLabel">Add node</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Node</span>
                                        </div>
                                        <input type="text" class="form-control name" placeholder="Enter node name" />
                                    </div>

                                    <table class="table mb-0">
                                        <thead>
                                            <tr>
                                                <th scope="col" class="pl-4 align-middle edge">Edge</th>
                                                <th scope="col" class="align-middle weight">Weight</th>
                                                <th scope="col" class="pr-4 text-right align-middle">
                                                    <button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-mode="add" data-target="#addEdgePopup">
                                                        Add edge
                                                    </button>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        </tbody>
                                    </table>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" onclick="addNode()">Add node</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Add node (popup) // -->

                <!-- // Add edge (popup) -->
                <div class="modal fade" id="addEdgePopup" tabindex="-1" role="dialog" aria-labelledby="addEdgePopupLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="addEdgePopupLabel" onclick="checkNode()">Add edge</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Edge</span>
                                        </div>
                                        <input type="text" class="form-control edge" placeholder="Enter edge name" />
                                    </div>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text" id="basic-addon1">Weight</span>
                                        </div>
                                        <input type="text" class="form-control weight" placeholder="Enter weight" />
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" onclick="addEdge()">Add edge</button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Add node (popup) // -->



            </div>
            <div class="col">
                <!-- // Calculation -->
                <div class="card mt-3">
                    <div class="card-header">
                        <b>Calculation</b>
                    </div>
                    <div class="card-body">
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Calculate now !
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item">Select LSA file / Add node first</a>
                                <!-- // Data template // --
                                <a class="dropdown-item" href="#">Compute All</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="#">Single step (Source: t)</a>
                                <a class="dropdown-item" href="#">Single step (Source: u)</a>
                                <a class="dropdown-item" href="#">Single step (Source: v)</a>
                                -- // Data template // -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Calculation // -->

                <!-- // Result -->
                <div class="card mt-3" id="resultCard">
                    <div class="card-header">
                        <b>Result</b>
                    </div>
                    <div class="card-body p-0" style="overflow-y: auto">
                        <table class="table mb-0" id="ResultTable">
                            <thead>
                                <tr>
                                    <th scope="col" class="pl-4 align-middle">Node</th>
                                    <th scope="col" class="align-middle">Shortest path</th>
                                    <th scope="col" class="pr-4 text-right align-middle">
                                        Cost
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- // Data template // --
                                <tr>
                                    <th scope="row" colspan="3" class="text-center pt-1 pb-1">
                                        Source A
                                    </th>
                                </tr>
                                <tr>
                                    <th scope="row" class="pl-4 pt-1 pb-1">t</th>
                                    <td class="pt-1 pb-1">a > z > x > v > t</td>
                                    <td class="pr-4 pt-1 pb-1 text-right">35</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="pl-4 pt-1 pb-1">u</th>
                                    <td class="pt-1 pb-1">a > z > x</td>
                                    <td class="pr-4 pt-1 pb-1 text-right">28</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="pl-4 pt-1 pb-1">v</th>
                                    <td class="pt-1 pb-1">a > z > x > w</td>
                                    <td class="pr-4 pt-1 pb-1 text-right">34</td>
                                </tr>
                                <tr>
                                    <th scope="row" colspan="3" class="text-center pt-1 pb-1">
                                        Source B
                                    </th>
                                </tr>
                                <tr>
                                    <th scope="row" class="pl-4 pt-1 pb-1">t</th>
                                    <td class="pt-1 pb-1">a > z > x > v > t</td>
                                    <td class="pr-4 pt-1 pb-1 text-right">35</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="pl-4 pt-1 pb-1">u</th>
                                    <td class="pt-1 pb-1">a > z > x</td>
                                    <td class="pr-4 pt-1 pb-1 text-right">28</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="pl-4 pt-1 pb-1">v</th>
                                    <td class="pt-1 pb-1">a > z > x > w</td>
                                    <td class="pr-4 pt-1 pb-1 text-right">34</td>
                                </tr>
                                -- // Data template // -->
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- Result // -->
            </div>
        </div>

        <!-- Javascript -->
        <script src="https://code.jquery.com/jquery-3.3.1.min.js" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>
        <script src="/index.js"></script>
</body>

</html>