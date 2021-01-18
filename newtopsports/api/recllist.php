<?php 

	include 'filetojson.php';

	$json = file_to_json("reclamation.txt");

	print($json);
 ?>