<?php

require "DBOperator.php";

// 将指定文件夹压缩为zip
//
// @param path: 要压缩的文件夹的路径
//        zip: 压缩工具对象
function _addFileToZip($path, $zip){
    $handler=opendir($path);
    while(($filename=readdir($handler))!==false){
        if($filename != "." && $filename != ".."){
            if(is_dir($path."/".$filename)){
                _addFileToZip($path."/".$filename, $zip);
            }else{
                $zip->addFile($path."/".$filename);
            }
        }
    }
    @closedir($path);
}


$dbOperator = new DBOperator();

$request = json_decode($_REQUEST["lyrInfo"]);

// 以图层英文名创建文件夹以存放导出的shp文件
$path = $request->path;
$path = $path . "/" . $request->lyrName;

if(!is_dir($path)) {
    $mkDirResult = @mkdir($path, 0777, true); // 新建文件夹
    // 判断新建文件夹是否成功
    if (!$mkDirResult) {
        $response = array(
            "success" => false,
            "message" => "Cannot create new directory!",
        );
        echo json_encode($response);
        return;
    }
    chmod($path, 0777);
}

// 构建导出shp命令并执行
$lyrName = $request->lyrName;
$command = "pgsql2shp -f " . $path . "/" . $lyrName . ".shp ".
    " -h " . $dbOperator->getHost() . " -u " . $dbOperator->getUser().
    " -P " . $dbOperator->getPassword() . " -p " . $dbOperator->getPort().
    " " . $dbOperator->getDbName() . " ".
    "\"SELECT * from ". $lyrName . "\"";
exec($command, $output, $code);

// 判断执行结果
if($code){
    $response = array(
        "success" => false,
        "message" => "Fail to export table"
    );
    echo json_encode($response);
    return;
}

// 对导出的文件进行压缩，方便下载
$zip = new ZipArchive(); // 实例化压缩工具
$zipCode = $zip->open($path.".zip", ZipArchive::CREATE);
if($zipCode === TRUE){
    _addFileToZip($path, $zip);
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
