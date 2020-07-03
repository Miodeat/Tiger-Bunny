<?php
require "DBOperator.php";

function deldir($dir) {
    $dh = opendir($dir);
    while ($file = readdir($dh)) {
        if($file != "." && $file != "..") {
            $fullpath = $dir."/".$file;
            if(!is_dir($fullpath)) {
                unlink($fullpath);
            }
            else {
                deldir($fullpath);
            }
        }
    }
    closedir($dh);
    if(rmdir($dir)) {
        return true;
    }
    else {
        return false;
    }
}

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
}

@pg_close($dbOperator->getConnection());

$path = $request->path;
$path = $path . "/" . $request->lyrName;

if(is_dir($path)){
    if(deldir($path)){
        $response = array(
            "success" => true,
            "message" => "successfully drop the table and dir"
        );
    }
    else {
        $response = array(
            "success" => false,
            "message" => "fail to delete dir"
        );
    }
}
echo json_encode($response);