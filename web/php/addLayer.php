<?php
require "DBOperator.php";

// 实例化数据库操作嘞
$dbOperator = new DBOperator();
$dbOperator->connect(); // 连接数据库
// 连接失败报错
if(!$dbOperator->getConnection()){
    $response = array(
        "success" => false,
        "message" => "Cannot connect to db server!"
    );
    echo json_encode($response);
    return;
}
// 从请求中获取参数并创建图层对应的表
$request = json_decode($_REQUEST["lyrInfo"]);
$sql = "create table " . $request->lyrName .
       "(
            ID serial PRIMARY KEY,
            geom geometry(" . $request->lyrType . ", 3857)
        )";

$result = $dbOperator->query($sql);

// 根据查询是否成功构建结果消息
if(!$result){
    $response = array(
        "success" => false,
        "message" => pg_last_error($dbOperator->getConnection())
    );

} else {
    $response = array(
        "success" => true,
        "message" => "successfully add table to db"
    );
}

@pg_close($dbOperator->getConnection());

echo json_encode($response);
