<?php  

if(isset($_POST['submit'])){
    
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];
    $database = $_POST['database'];
    $server = $_POST['server'];
    $num = $_POST['num'];
//    $num-r = $_POST['num'];
    $table = $_POST['table'];
    $var1 = $_POST['var1'];
    $var2 = $_POST['var2'];
    $ml = $_POST['ml'];   
  $user_name="iotuser";
    $password="iot12345";
    $database="iot";
    $server="142.93.75.207";

    $conn = new mysqli($server,$user_name,$password,$database);
    
    if ($conn->connect_error){
        trigger_error('Database connection failed: ' . $conn-> connect_error, E_USER_ERROR);
       
   }
    
    $sql = "select {$var1},{$var2} from {$table} order by id asc limit 200";

   if ($table == "thpTable" || $table == "zlrTable"){
   $sql = "select {$var1},{$var2} from {$table} order by id desc limit 500 ";
   }

   $rs = $conn->query($sql);
   
    if ($rs == false){
        trigger_error('Wrong SQL: ' .$sql . ' Error: ' . $conn->error , E_USER_ERROR);
     }
    else {
    $rows_returned = $rs->num_rows;
    $rs->data_seek(100000);
    $result = array();
    $rows = array();
    $rows0 = array();
    $rows1 = array();
    $rows2 = array();
//    $table = array();
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
$table = json_encode($table);
$var1 = json_encode($var1);
$var2 = json_encode($var2);
//$num-r = json_encode($num);

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
    background-color: red;
    margin: 10px;   
    width: 800px;
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

//var lab = new MLlab();
var ml_name = <?php echo $ml; ?>;
var table_name = <?php echo $table; ?>;
var var1_name = <?php echo $var1; ?>;
var var2_name = <?php echo $var2; ?>;
//var num_name = <?php echo $num-r; ?>;



if (ml_name=='AutoReg')
{
r = new Regression() ;
}
if (ml_name=='LeastSquares')
{
r = new Regression(LeastSquares) ;
}
if (ml_name=='KNNreg')
{
r = new Regression(KNNreg) ;
}
if (ml_name=='RidgeRegression')
{
r = new Regression(RidgeRegression, {lambda: 0.1}) ;
}
if (ml_name=='MLPreg')
{
r = new Regression(MLPreg, {hidden: 15}) ;
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

   
if (ml_name=='AutoReg')
{
plot(var1,var2,".k",var1,r.predict(var1),"_b") ;
}
if (ml_name=='LeastSquares')
{
plot(var1,var2,".k",var1,r.predict(var1),"_b") ;
}
if (ml_name=='KNNreg')
{
plot(var1,var2,".k",range(0,10,0.1),r.predict(range(0,10,0.1)),"_b") ;
}
if (ml_name=='RidgeRegression')
{
plot(var1,var2,".k",var1,r.predict(var1),"_b") ;
}
if (ml_name=='MLPreg')
{
plot(var1,var2,".k",var1,r.predict(var1),"_b") ;
}



document.getElementById("rmse").innerHTML=r.test(var1,var2);
document.getElementById("info").innerHTML=r.predict(<?php echo $num ?>);
//document.getElementById("info").innerHTML=r.predict(num_name);
document.getElementById('ml').value=ml_name;
document.getElementById('table').value=table_name;
document.getElementById('var1').value=var1_name;
document.getElementById('var2').value=var2_name;
//document.getElementById('num').value=num_name;
document.getElementById("info1").innerHTML=r.info();


}

</script>

</head>
<b>********************** MACHINE LEARNING-REGRESSION **********************</b><br><br>
<b>*****************************Click Analysis Button*********************************</b><br><br><br>
<form name="machinelearning" method="post">
  <input type="hidden"/>
    <b>SERVER: </b> <select id="server" style="width:100px;" name= "server"  />
    <option value='142.93.75.20'>142.93.75.207</option>
   <option value = '142.93.75.207'>142.93.75.207</option>
   </select>
    <b>USER: </b><select id="user_name" style="width:100px;" name="user_name">
    <option>iotuser</option>
   <option>ariauser</option>
   </select>
   <b>PW: </b> <input type="password"  name="password" style="width:100px;"  value="iot12345"/><br><br>
   <b>DB: </b> <select id= "database" style="width:100px;" name="database" />
   <option>iot</option>
   <option>aria</option>
   </select>
   <b>TABLE: </b> <select id= "table" style="width:100px;" name="table" />
  
   <option>thpTable</option> 
   <option>lrTable</option>
   <option>mlpTable</option>   
  <option>zlrTable</option>
   </select><br><br>
   <b>VAR1: </b> <select id= "var1" style="width:100px;" name="var1" />
   <option>temperature</option>
   <option>humidity</option>
   <option>pressure</option>
   <option>var1</option>
   <option>var2</option>
   </select>
  <b>VAR2: </b> <select id= "var2" style="width:100px;" name="var2" />
   <option>humidity</option>
   <option>pressure</option>
   <option>temperature</option>
   <option>var2</option>
   <option>var1</option>
   </select><br><br>

  <b>ML: </b> <select id= "ml" style="width:100px;" name="ml" />
   <option>RidgeRegression</option>
   <option>LeastSquares</option>
   <option>AutoReg</option>
   <option>KNNreg</option>
   <option>MLPreg</option>
   </select>



    <b>Predictor</b><input type="number" step = "any" style="width:100px;" value="0" name = "num"/>   
    <input type="submit" style="width:100px;" name="submit" value="Analysis"/> 
    
</form>



<body onload="myLALOLabScript();">
<div class="container">
<h2><b>ML-REGRESSION</b></h2>
<h3><p><b> RMSE:</b></p></h3>
<div id="rmse"></div>
<h3><p><b> Target Value:</b></p></h3>
<div id="info"></div>

<center><div style="font-size: 100%;" title='LALOLib output' id='LALOLibOutput'></div></center>

<div id="info1"></div>

</div>



</body>
</html>



