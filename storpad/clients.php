<?php
	include 'array_func.php';
	
		$content=datout("./templates/clients.html");

		$common=datout("./templates/common.html");

		$out=str_replace("##content##",$content,$common);

		print($out);
?>