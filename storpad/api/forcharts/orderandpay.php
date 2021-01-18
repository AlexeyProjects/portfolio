<?php 
		
	date_default_timezone_set('UTC');

	include 'api/formingJSON.php';
	include 'api/query.php';


	$sql = "SELECT summ_with_discount_vitrina, UNIX_TIMESTAMP(date_create) as dateunix, device_id
			FROM in_order io, in_display_user idu
			WHERE idu.id=io.source_id AND io.user_id in ('$userid') AND  io.date_create > date_add(curdate(),INTERVAL - ('$day') DAY) "; //AND io.order_status = 'Оплачен'

	$data = query($sql, true);

	foreach ($data as $k => &$v) 
	{
		$t = date('j M', $v["dateunix"]);
		$v["un"] = $t;
	}
	
	$json = [];
	foreach ($data as $k => $v) 
	{
		if (isset($json[$v["un"]]))
		{	
			$json[$v["un"]] += $v["summ_with_discount_vitrina"];
		}
		else
		{
			$json[$v["un"]] = (float)$v["summ_with_discount_vitrina"];
		}
	}

	/*---ДОБАВЛЕНИЕ ПРОМЕЖУТОЧНЫХ ДАТ---*/


	$dates = [];
	$dates[] = array($data[0]["un"], $json[$data[0]["un"]]);
	//$plusmonth = date('j M', strtotime($dates[0][0]."+1 month"));
	switch ($day) 
	{
		case '30':
			$plusperiod = date('j M', strtotime($dates[0][0]."+1 month"));
			break;
		case '7':
			$plusperiod = date('j M', strtotime($dates[0][0]."+7 day"));
			break;
		case '1':
			$plusperiod = date('j M', strtotime($dates[0][0]."+1 day"));
			break;
		default:
			$plusperiod = date('j M', strtotime($dates[0][0]."+1 month"));
			break;
	}
	$timedate = $dates[0][0];
	while ($timedate !== $plusperiod)
	{
		$have = false;
		$plusday = date('j M', strtotime($timedate."+1 day"));
		$summ = 0;
		foreach ($json as $k => $v) 
		{
			if ($k == $plusday)
			{
				$have = true;
				$summ = $v;
				break;
			}
		}

		$dates[] = array($plusday, $summ);
		$timedate = $plusday;
	}

	print(json_encode($dates));

 ?>