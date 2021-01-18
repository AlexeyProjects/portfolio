<?php 

	include 'filetojson.php';

	$json = file_to_json("banners.txt");

	print($json);

 ?>