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
$sql = "drop table " . $request->lyrName;

$result = $dbOperator->query($sql);

if(!$result){
    $response = array(
        "success" => false,
        "message" => pg_last_error($dbOperator->getConnection())
    );

} else {
    $response = array(
        "success" => true,
        "message" => "successfully drop the table"
    );
}

@pg_close($dbOperator->getConnection());

echo json_encode($response);