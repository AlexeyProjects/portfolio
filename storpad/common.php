<?php 

	include 'array_func.php';

	$content=datout("./templates/main.html");

	$common=datout("./templates/common.html");

	$out=str_replace("##content##",$content,$common);

	print($out);
 ?>