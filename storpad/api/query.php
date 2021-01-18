<?php 


function query($sql, $needreturn = false, $returnall = true ,$getactive = false)
{
    if ($returnall)
    {
        $res = db_query($sql); 
    }
	else
    {
        $res = db_query($sql);
        //$res = db_fetch_entry($sql);
    }

    $data= db_fetch_all($res);

    

    if ($getactive)
    {
        foreach ($data as $k => &$v) 
        {
            $v["active"] = "2";
        }
    }

/*
    $names = array();
    foreach ($data[0] as $k => $v) 
    {
        $names[] = $k;
    }
        
    if ($data)
    {
        $nj = formingJSON($data, $names);
    }

     print($nj);
*/
    if ($needreturn)
    {
    	return $data;
    }
    else
    {
    	print(json_encode($data));
    }
    
}


 ?>