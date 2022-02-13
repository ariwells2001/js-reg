<?php  

if(isset($_POST['submit'])){
    
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];
    $database = $_POST['database'];
    $server = $_POST['server'];
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
    
        $sql = "select {$var1},{$var2} from {$table}";
    if ($var1 != $var2){
          $sql = "select {$var1},{$var2} from (select id, {$var1},{$var2} from {$table} order by rand() limit 1000) {$table} order by id ";
    }
    $rs = $conn->query($sql);
   
    if ($rs == false){
        trigger_error('Wrong SQL: ' .$sql . ' Error: ' . $conn->error , E_USER_ERROR);
     }
    else {
    $rows_returned = $rs->num_rows;
    $rs->data_seek(1000);
    $result = array();
    $rows = array();
    $rows0 = array();
    $rows1 = array();
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
    background-color: yellow;
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

var ml_name = <?php echo $ml; ?>;
var table_name = <?php echo $table; ?>;
var var1_name = <?php echo $var1; ?>;
var var2_name = <?php echo $var2; ?>;



     var xx = JSON.parse('<?php echo json_encode($rows0); ?>');
        var yy = JSON.parse('<?php echo json_encode($rows1); ?>');
        

   //var gamma = parseInt($_POST["num"].val());
       xx = JSON.parse(xx);
     yy = JSON.parse(yy);
     

    var res1 = [];
    var res2 = [];
    var X,X1,X2; 
    


     for (prop in xx){
        res1.push(Number(xx[prop]));
        }
      for (prop in yy){
        res2.push(Number(yy[prop]));
        }
      
if (table_name = "dtTable"){
  
     	  X1 = zeros(10, 2);
                for (var i=0; i< 10; i++) {
                        X1.val[i] = res1[i];
             }

           for (var i=10; i< 20; i++) {
                        X1.val[i] = res2[i-10];
             }


            X2 = zeros(10, 2);
                for (var i=0; i< 10; i++) {
                        X2.val[i] = res1[i+10];
             }

            for (var i=10; i< 20; i++) {
                        X2.val[i] = res2[i];
             }
    }

  if (table_name=="scTable"){

    X1 = zeros(50, 2);
                for (var i=0; i< 50; i++) {
                        X1.val[i] = res1[i];
             }

           for (var i=50; i< 100; i++) {
                        X1.val[i] = res2[i-50];
             }


            X2 = zeros(50, 2);
                for (var i=0; i< 50; i++) {
                        X2.val[i] = res1[i+50];
             }

            for (var i=50; i< 100; i++) {
                        X2.val[i] = res2[i];
             }

 }

 X = mat([X1,X2], true) ;


   
if (ml_name=='kmeans')
{
c = kmeans(X,2) ;
plot(get(X,find(isEqual(c.labels,0)),range()),".b","Points of group 0",get(X,find(isEqual(c.labels,1)),range()),".r","Points of group 1",c.centers,".g","Centers") ;
table_name = <?php echo $table; ?>;

}
if (ml_name=='spectralclustering')
{
lbls = spectralclustering(X,2,0.5) ;
plot(get(X,find(isEqual(lbls,0)),range()),".b","Points in group 1",get( X,find(isEqual(lbls,1)),range()),".r", "Points in group 2") ;
plot(lbls, "b","Sequence of labels") ;
table_name = <?php echo $table; ?>;

}


document.getElementById('ml').value=ml_name;
document.getElementById('table').value=table_name;
document.getElementById('var1').value=var1_name;
document.getElementById('var2').value=var2_name;


}

</script>

</head>
<b>************************ MACHINE LEARNING-Clustering ************************</b><br><br>
<b>*****************************Click Analysis Button*********************************</b><br><br><br>
<form name="machinelearning" method="post">  
    <b>SERVER: </b> <select id="server" style="width:100px;" name= "server"  />
    <option value='142.93.75.207'>142.93.75.207</option>
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
   <option>dtTable</option>
   <option>scTable</option>
   <option>thpTable</option>
   </select><br><br>
   <b>VAR1: </b> <select id= "var1" style="width:100px;" name="var1" />
   <option>ind1</option>
   <option>ind2</option>
   <option>temperature</option>
   <option>humidity</option>
   <option>pressure</option>
   </select>
  <b>VAR2: </b> <select id= "var2" style="width:100px;" name="var2" />
   <option>ind2</option>
   <option>ind1</option>
   <option>temperature</option>
   <option>humidity</option>
  <option>pressure</option>
  </select><br><br>
  <b>ML: </b> <select id= "ml" style="width:100px;" name="ml" />
   <option>kmeans</option>
   <option>spectralclustering</option>
   </select>
   
    <input type="submit" style="width:100px;" name="submit" value="Analysis"/> 
    
</form>



<body onload="myLALOLabScript();">
<div class="container">
<h2><b>ML-CLUSTERING</b></h2>
<div id="info"></div>
<center><div style="font-size: 100%;" title='LALOLib output' id='LALOLibOutput'></div></center>
</div>



</body>
</html>



