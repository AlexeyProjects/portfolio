<?php 

	$text = file_get_contents('dashboard_table.txt');

	$new = str_replace("\\", "", $text);

	print($new);

 ?>