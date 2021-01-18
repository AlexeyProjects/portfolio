<?php 

/*----УДАЛЕНИЕ ВСЕХ ИСТЕКШИХ СЕССИЙ ИЗ БАЗЫ----*/
function check_other_connect()
{
	$sid = $seller_id;
	$sql = "SELECT date_start, sess_id
			FROM sess_at_moment";
	$res = db_query($sql);
	$data = db_fetch_all($res);

	if ($data)
	{
		$deadsess = [];
		$curtime = time();
		foreach ($data as $k => $v) 
		{
			$dif = $curtime - $v["date_start"];
			if ($dif >= (86400*90))
			{
				$deadsess[] = $v["sess_id"];
			}
		}
		$deadsess = implode(',', $deadsess);
		$sql = "DELETE FROM sess_at_moment
				WHERE sess_id in ('$deadsess')";
		$res = db_query($sql);
	}
}

 ?>