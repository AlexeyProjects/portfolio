<?php 


function file_to_json($filename)
{
	$json = file_get_contents("api/json/".$filename);

	return $json;
}

 ?>