<?php 
	
	include ("db/database.php");

	define('SOAP_1C_LOGIN','web_exchange');
	define('SOAP_1C_PASS','ueHr08');

	function init_1c_rest_client($url) {
		$curl = curl_init();
		//print_r("Processing $url");
		curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		//curl_setopt($curl, CURLOPT_VERBOSE, true);
		//curl_setopt($curl, CURLOPT_STDERR, fopen('php://stderr', 'w'));
		//curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/xml'));
		curl_setopt($curl, CURLOPT_HEADER, 0);
		//curl_setopt($curl, CURLOPT_HEADER, 1);
		curl_setopt($curl, CURLOPT_USERPWD, SOAP_1C_LOGIN.":".SOAP_1C_PASS);
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		$result = curl_exec($curl);
		
		//print("<hr>");
		//print_r($result); exit;
		
		$info = curl_getinfo($curl);
		curl_close($curl);
		
		//print_r($info);
		//return $result;
		
		$response = json_decode($result);
		
		//print_r($response);		exit;
		
		$vals=$response;
		//$vals = helper::object_to_array($response->value);
		return $vals;
	}

	//$clientid = "331c5064-07f5-11e8-8104-3ca82a9f50d9";
	$clientid = "01c136d1-07f5-11e8-8104-3ca82a9f50d9";
	$url = "https://1c.topsports.ru/ut_11/hs/partners/get?command=clients_contractors_contracts&client_id=".$clientid;

	$result=init_1c_rest_client($url);
	
	//print_r($result->clients[0]->calculations);
	
	$data = $result->clients[0]->calculations;
	$activekredit = 0;
	$activedep = 0;
	$debit = 0;
	$kredit = 0;
	foreach ($data as $k => $v) 
	{
		if ($v->type_calculation_object == "Заказ клиента")
		{
			$debit += $v->kredit;
			$activedep++;
		}
		else if ($v->type_calculation_object == "Договор с контрагентом")
		{
			$kredit += $v->kredit;
			$activekredit++;
		}
	}
	
	$dates = [];
	$i = -1;
	foreach ($data as $k => $v) 
	{
		if ($v->type_calculation_object == "Заказ клиента")
		{
			$i++;
			$dates[$i] = [];
			$dates[$i][] = $v->calculation_object_guid;
			if ($v->debit > 0)
			{
				$dates[$i][] = $v->debit;
			}
			if ($v->kredit > 0)
			{
				$dates[$i][] = -$v->kredit;
			}
			$dates[$i][] = strtotime($v->date_dolg);
		}
	}

	$db_name = "timetable";
	
/*	$sql = "TRUNCATE $db_name";
	db_query($sql);
	foreach ($dates as $k => $v) 
	{
		db_insert($db_name, array(
								"guid" => $v[0],
								"dk" => $v[1],
								"dt" => $v[2]), false);		
	}
*/
		
	$sql = "";
	foreach ($dates as $k => $v) 
	{
		$sql = "INSERT INTO $db_name 
				SET guid = '$v[0]', dk = $v[1], dt = '$v[2]' 
				ON DUPLICATE KEY UPDATE dk = dk, dt = dt;";
		db_query($sql);
	}


	$json["depos"] = $debit;
	$json["kredit"] = $kredit;
	$json["numdepos"] = $activedep;
	$json["numkredit"] = $activekredit;
	$json["residue"] = 0;
	$json["expired"] = false;
	$json["date_expired"] = "xx.xx.xxxx";
	print_r(json_encode($json));

 ?>