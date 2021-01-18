<?php 


// $data - данные из базы данных, $name - массив нужных имен
function formingJSON($data, $name) 
{
	$bdData = $data;
	$names = $name;
	$nj = "{ \"data\": [";
	foreach ($bdData as $k => $v) 
	{
		$nj.= "[ \"";
		foreach ($names as $k2 => $v2) 
		{
			$nj.= $v[$v2];
			if ($v2 == end($names))
			{
				$nj.= "\"]";
			}
			else
			{
				$nj.= "\", \"";
			}
		}
		if($v !== end($bdData)) 
		{
			$nj.=',';	
  		}
		
	}
	$nj.= "]}";
	return $nj;
}

 ?>