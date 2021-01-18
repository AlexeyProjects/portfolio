<?php 

function vitrinsf($id){
    $vitrins = db_query("SELECT disp_id from all_disp_users_rel where user_id = '$id'");
    $vitrinsX = db_fetch_all($vitrins);
    $vitrinsIdArray = array_column($vitrinsX, "disp_id");
    $vitrinsId = implode("','", $vitrinsIdArray);
    if($vitrinsId){
        return $vitrinsId;
    }
    return false;
}

 ?>