<?php

require "DBOperator.php";

$dbOperator = new DBOperator();
$dbOperator->connect();

if(!$dbOperator->getConnection()){
    $response = array(
        "success" => false,
        "message" => "Cannot connect to db server!"
    );
    echo json_encode($response);
}

$request = json_decode($_REQUEST["lyrInfo"]);
$sql = "insert into " . $request->layer . "(geom) values (st_geomfromtext($1, 3857))";

$result = $dbOperator->queryWithParam($sql, array(
    $request->wkt
));

if(!$result){
    $response = array(
        "success" => false,
        "message" => pg_last_error($dbOperator->getConnection())
    );

} else {
    $response = array(
        "success" => true,
        "message" => "successfully add a feature"
    );
}

@pg_close($dbOperator->getConnection());

echo json_encode($response);
