<?php
require "DBOperator.php";

// 删除文件夹及其内的子文件
//
// @param dir: 要删除的文件夹的路径
// @return: bool, true说明执行成功，false说明出错
function _deldir($dir) {
    $dh = opendir($dir);
    // 遍历所有子文件与子文件夹
    while ($file = readdir($dh)) {
        // 跳过文件夹 . 与 ..
        if($file != "." && $file != "..") {
            $fullpath = $dir."/".$file;
            // 如果不是文件夹，删除
            if(!is_dir($fullpath)) {
                unlink($fullpath);
            }
            // 是文件夹，递归调用该函数删除
            else {
                _deldir($fullpath);
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
    return;
}
// 根据请求参数构建删除表的查询
$request = json_decode($_REQUEST["lyrInfo"]);
$sql = "drop table " . $request->lyrName;

$result = $dbOperator->query($sql); // 执行查询

if(!$result){
    $response = array(
        "success" => false,
        "message" => pg_last_error($dbOperator->getConnection())
    );
}
else {
    $response = array(
        "success" => true,
        "message" => "successfully drop the table"
    );
}

@pg_close($dbOperator->getConnection());

// 如果存在存放该图层导出的shp文件的文件夹，则删除
$path = $request->path;
$path = $path . "/" . $request->lyrName;

if(is_dir($path)){ // 判断路径是否存在
    if(_deldir($path)){
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