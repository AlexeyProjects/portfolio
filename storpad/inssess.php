<?php 

function insert_sess($selid, $dispid, $ip, $tstart, $br, $tmp)
{
	//include_once './mishaz/aleksey/yeti/'
	db_insert("sess_at_moment", array("seller_id" => $selid,
										"display_id" => $dispid,
										"ip" => $ip,
										"date_start" => $tstart,
										"browser" => $br,
										"sess_id" => $tmp), false);
}

 ?>