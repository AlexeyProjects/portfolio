<?php 

include 'db/database.php';
include 'api/vitrinsf.php';
include 'api/checkauth.php';

$user = checkauth();
$userid = vitrinsf($user['id']);

$data = json_decode(file_get_contents('php://input'), true);


$type = $data['type'];

if (isset($data["day"]))
{
    $day = $data["day"];
}

switch($type)
{
	case 'getallOrders':
		include "api/getorders.php";
		break;
	case 'getDisplays':
        include "api/getdisplays.php";
        break;
    case 'getallClients':
    	include "api/getclients.php";
    	break;
    case 'getEvents':
    	include "api/getevents.php";
    	break; 
    case 'getOrders':
        include "api/getordersmain.php";
        break;
    case 'getForDonut':
        include "api/forcharts/donat.php";
        break;
    case 'getForBar':
        include "api/forcharts/bar.php";
        break;
    case 'getForOrderAndPay':
        include "api/forcharts/orderandpay.php";
        break;
}







 ?>