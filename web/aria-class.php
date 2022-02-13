<?php
if(isset($_POST['submit'])){
    
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];
    $database = $_POST['database'];
    $server = $_POST['server'];
    $num = $_POST['num'];


//  $user_name="iotuser";
//    $password="iot12345";
//    $database="iot";
//    $server="127.0.0.1";
    $conn = new mysqli($server,$user_name,$password,$database);
    if ($conn->connect_error){
        trigger_error('Database connection failed: ' . $conn-> connect_error, E_USER_ERROR);
      }
    $sql = 'select timestamp, temperature,humidity from thpTable order by timestamp desc limit 100';
    $rs = $conn->query($sql);
    if ($rs == false){
        trigger_error('Wrong SQL: ' .$sql . ' Error: ' . $conn->error , E_USER_ERROR);
     }
    else {
    $rows_returned = $rs->num_rows;
    $rs->data_seek(10);
    $result = array();
    $rows = array();
    $rows0 = array();
    $rows1 = array();
    $rows2 = array();
    $table = array();
    $flag = true;
    $temp = array();

    while($row = $rs->fetch_assoc()){
//        $result[array_shift($row)] = $row['temperature'];
 //     echo $result[array_shift($row)];
         $rows0[] = array((double)$row['temperature']);
         $rows1[] = array((double)$row['humidity']);
         $rows2[] = array((double)$row['timestamp']);
           }

$rows0 = json_encode($rows0);
$rows1 = json_encode($rows1);
$rows2 = json_encode($rows2);

}

}
?>
<html>
<head>

        <title>LALOLab plot</title>
   

<meta charset="UTF-8">
<script src="ml.js"> </script>   
 

<head>

<script>
//document.write("hello");
function myLALOLabScript() {
dt = new Regression(DecisionTree) ;
var t = JSON.parse('<?php echo json_encode($rows0); ?>');
     var h = JSON.parse('<?php echo json_encode($rows1); ?>');
     var ts =  JSON.parse('<?php echo json_encode($rows2); ?>');
   //var gamma = parseInt($_POST["num"].val());
     
     t = JSON.parse(t);
     h = JSON.parse(h);
     ts = JSON.parse(ts);
    
     var arrt = [];
     var arrh = [];
     var  arrts = [];
          
     for (prop in t){
        arrt.push(Number(t[prop]));
        }
      for (prop in h){
        arrh.push(Number(h[prop]));
        }
       for (prop in ts){
        arrts.push(Number(ts[prop]));
        }


X1 =add( 5 , randn(10,2)) ;
X2 =add(minus(3 ), randn(10,2)) ;
X = mat([X1,X2], true) ;
Y = zeros(20) ;
set( Y,range(0,10), 1 ) ;
set( Y,range(10,20), 2 ) ;

dt.train(X,Y) ;

plot(dt.predict(X),"_b","Decision tree predictions",Y,".r","true labels") ;


}

</script>
</head>

<form id="signup_form" method="post" class="form-horizontal" role="form" action="">  
    <input type="text" name="user_name" />
    <input type="password" name="password" />
    <input type="text" name = "database" />
    <input type="text" name = "server" />   
    <input type="submit" name="submit" /> 
    

</form>



<body onload="myLALOLabScript();">
<div style='font-size: 80%;' title='LALOLib output' id='LALOLibOutput'></div>
<div id="log"></div>




</body>
</html>



