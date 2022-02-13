<?php  

if(isset($_POST['submit'])){
    
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];
    $database = $_POST['database'];
    $server = $_POST['server'];
    $num = $_POST['num'];
    $table = $_POST['table'];
    $var1 = $_POST['var1'];
    $var2 = $_POST['var2'];
    $ml = $_POST['ml'];   
//  $user_name="iotuser";
//    $password="iot12345";
//    $database="iot";
//    $server="127.0.0.1";
    $conn = new mysqli($server,$user_name,$password,$database);
    
    if ($conn->connect_error){
        trigger_error('Database connection failed: ' . $conn-> connect_error, E_USER_ERROR);
       
   }
    
    $sql = "select {$var1},{$var2} from {$table} order by id desc limit 20";
    $rs = $conn->query($sql);
   
    if ($rs == false){
        trigger_error('Wrong SQL: ' .$sql . ' Error: ' . $conn->error , E_USER_ERROR);
     }
    else {
    $rows_returned = $rs->num_rows;
    $rs->data_seek(20);
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
         $rows0[] = array((double)$row["{$var1}"]);
         $rows1[] = array((double)$row["{$var2}"]);
           }

$rows0 = json_encode($rows0);
$rows1 = json_encode($rows1);
$ml = json_encode($ml);
 
}

}
?>
<html>
<head>

        <title>LALOLab plot</title>
   

<meta charset="UTF-8">
<script src="ml.js"> </script>   
 <style>
div.container {
    background-color: purple;
    margin: 100px;   
    width: 512px;
   text-align:center;
}

div.LALOLibOutput {
    border: 1px solid black;
    float: left;
    width: 45%;
}

div.info {
    border: 1px solid red;
    float: left;
    width: 45%;
}

</style>


<head>

<script>

function myLALOLabScript() {

var ml_name = <?php echo $ml; ?>;
if (ml_name == "LeastSquares"){
r = new Regression(LeastSquares) ;
}   

if (ml_name == "AutoReg"){
r = new Regression() ;
}   

if (ml_name=='KNNreg')
{
r = new Regression(KNNreg) ;
}




     var x = JSON.parse('<?php echo json_encode($rows0); ?>');
     var y = JSON.parse('<?php echo json_encode($rows1); ?>');
     
   //var gamma = parseInt($_POST["num"].val());
     
     x = JSON.parse(x);
     y = JSON.parse(y);
    
     var var1 = [];
     var var2 = [];
               
     for (prop in x){
        var1.push(Number(x[prop]));
        }
      for (prop in y){
        var2.push(Number(y[prop]));
        }
     

r.train(var1,var2) ;
   

if (ml_name == "LeastSquares"){
plot(var1,var2,".k",var1,r.predict(var1),"_b") ;
}

if (ml_name == "AutoReg"){
plot(var1,var2,".k",var1,r.predict(var1),"_b") ;
}

if (ml_name=="KNNreg")
{
plot(var1,var2,".k",0:0.1:10,r.predict(0:0.1:10),"_b");
}


document.getElementById("info").innerHTML=r.predict(<?php echo $num ?>);

}

</script>

</head>

<form name="machinelearning" method="post">  
    <b>SERVER: </b> <select id="server" name= "server"  />
    <option value='127.0.0.1'>127.0.0.1</option>
   <option value = '128.199.226.46'>128.199.226.46</option>
   </select>
    <b>USER: </b><select id="user_name" name="user_name">
    <option>iotuser</option>
   <option>ariauser</option>
   </select>
   <b>PW: </b> <input type="password"  name="password" value="iot12345"/><br><br>
   <b>DB: </b> <select id= "database" name="database" />
   <option>iot</option>
   <option>aria</option>
   </select>
   <b>TABLE: </b> <select id= "table" name="table" />
   <option>lrTable</option>
   <option>temphumlightTable</option>
   </select>
   <b>VAR1: </b> <select id= "var1" name="var1" />
   <option>var1</option>
   <option>var2</option>
   <option>temperature</option>
   <option>humidity</option>
   <option>light</option>
   </select>
  <b>VAR2: </b> <select id= "var2" name="var2" />
   <option>var1</option>
   <option>var2</option>
   <option>temperature</option>
   <option>humidity</option>
   <option>light</option>
   </select><br><br>

  <b>ML: </b> <select id= "ml" name="ml" />
   <option>AutoReg</option>
   <option>LeastSquares</option>
   <option>KNNreg</option>
   <option>RidgeRegression</option>
   <option>MLPreg</option>
   </select>



    <b>Predictor</b><input type="number" step = "any" name = "num" value="33"/>   
    <input type="submit" name="submit" /> 
    
</form>



<body onload="myLALOLabScript();">
<div class="container">
<center><div style="font-size: 100%;" title='LALOLib output' id='LALOLibOutput'></div></center>

<h3><p><b> Target Value:</b></p></h3>
<div id="info"></div>
</div>



</body>
</html>



