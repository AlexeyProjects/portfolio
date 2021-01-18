<?php 

$data = json_decode(file_get_contents('php://input'), true);


switch ($data["type"]) 
{
	case 'orderslist':
		include 'api/orderslist.php';
		break;
	case 'deposits':
		include 'api/deposits.php';
		break;
	case 'recllist':
		include 'api/recllist.php';
		break;
	case 'getbanners':
		include 'api/getbanners.php';
		break;
}


 ?>