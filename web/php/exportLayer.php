<?php

require "DBOperator.php";

function addFileToZip($path,$zip){
    $handler=opendir($path);
    while(($filename=readdir($handler))!==false){
        if($filename != "." && $filename != ".."){
            if(is_dir($path."/".$filename)){
                addFileToZip($path."/".$filename, $zip);
            }else{
                $zip->addFile($path."/".$filename);
            }
        }
    }
    @closedir($path);
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

$path = $request->path;
$path = $path . "/" . $request->lyrName;

$mkDirResult = @mkdir($path, 0777, true);

if(!$mkDirResult){
    $response = array(
        "success" => false,
        "message" => "Cannot create new directory!",
    );
    echo json_encode($response);
    return;
}

$GBKLyrName = iconv("utf-8", "GBK", $request->lyrName);

$command = "pgsql2shp -f " . $path . "/". $GBKLyrName . ".shp ".
    "-h 127.0.0.1 -u postgres -P 123456 -p 5432 webgis ".
    "\"SELECT * from ". $GBKLyrName . "\";";
$exportResult = exec($command);
if(!$exportResult){
    $response = array(
        "success" => false,
        "message" => "Fail to export table"
    );
    echo json_encode($response);
    return;
}

$zip = new ZipArchive();
$zipCode = $zip->open($path.".zip", ZipArchive::CREATE);
if($zipCode === TRUE){
    addFileToZip($path, $zip);
    $zip->close();
    $response = array(
        "success" => true,
        "message" => "Success"
    );
}
else{
    $response = array(
        "success" => false,
        "message" => "Fail to compress files." + (string)$zipCode
    );
}

echo json_encode($response);
