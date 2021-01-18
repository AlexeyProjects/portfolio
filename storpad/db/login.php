<?php

global $link, $db;
include_once("database.php");
define("salt","9F3xla");
$domain = "storpad.com";
$input_json= $_POST;
$login = $input_json['storpad_login'];
$password = md5($input_json['storpad_password']);
$hash =  /*salt.$password;*/ $password;

$tmp=rand(0,100000).time()."random string";
$tmp=md5($tmp); //just basic, hash and no ip and browser subhash


$sqlUpdate="update in_display_user set sess_id='$tmp' where login = '$login' and pass = '$hash'";
$update = db_query($sqlUpdate);
if($update){
    $query = "select sess_id as sess from in_display_user where login = '$login' and pass = '$hash' ";
    $sql = db_query($query);
    if (db_num_rows($sql)){
        $res = db_fetch_assoc($sql);
    }
    $time=time()+86400*3;
    setcookie("session",$res["sess"],$time,"/",$domain);

    header('Location: /ADM/index.html');
}


?>