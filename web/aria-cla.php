<?php  

if(isset($_POST['submit'])){
    
    $user_name = $_POST['user_name'];
    $password = $_POST['password'];
    $database = $_POST['database'];
    $server = $_POST['server'];
    $var3 = $_POST['var3'];
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
    
        $sql = "select {$var1},{$var2},{$var3} from {$table}";
 
    $rs = $conn->query($sql);
   
    if ($rs == false){
        trigger_error('Wrong SQL: ' .$sql . ' Error: ' . $conn->error , E_USER_ERROR);
     }
    else {
    $rows_returned = $rs->num_rows;
    $rs->data_seek(200);
    $result = array();
    $rows = array();
    $rows0 = array();
    $rows1 = array();
    $rows2 = array();
    $flag = true;
    $temp = array();

    while($row = $rs->fetch_assoc()){
//        $result[array_shift($row)] = $row['temperature'];
     
         $rows0[] = array((double)$row["{$var1}"]);
         $rows1[] = array((double)$row["{$var2}"]);
         $rows2[] = array((double)$row["{$var3}"]);
           }

$rows0 = json_encode($rows0);
$rows1 = json_encode($rows1);
$rows2 = json_encode($rows2);
$ml = json_encode($ml);
$table = json_encode($table); 

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
    background-color: blue;
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

if (ml_name=='KNN')
{
c = new Classifier(KNN);
}
if (ml_name=='LogReg')
{
c = new Classifier(LogReg);
}
if (ml_name=='Perceptron')
{
c = new Classifier(Perceptron);
}
if (ml_name=='MLP')
{
c = new Classifier(MLP) ;
}
if (ml_name=='DecisionTree')
{
c = new Classifier(DecisionTree) ;
}


     var xx = JSON.parse('<?php echo json_encode($rows0); ?>');
        var yy = JSON.parse('<?php echo json_encode($rows1); ?>');
        var zz = JSON.parse('<?php echo json_encode($rows2); ?>');

   //var gamma = parseInt($_POST["num"].val());
       xx = JSON.parse(xx);
     yy = JSON.parse(yy);
     zz = JSON.parse(zz);

    var res1 = [];
    var res2 = [];
    var X,X1,X2,X3; 
    var Y = [];


     for (prop in xx){
        res1.push(Number(xx[prop]));
        }
      for (prop in yy){
        res2.push(Number(yy[prop]));
        }
      for (prop in zz){
        Y.push(Number(zz[prop]));
        }

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
    
  if (table_name=="tripleTable"){


	  X3 = zeros(8, 2);
                for (var i=0; i< 8; i++) {
                        X3.val[i] = res1[i+20];
             }

            for (var i=8; i< 16; i++) {
                        X3.val[i] = res2[i+12];
             }
     X = mat([X1,X2,X3], true) ;
   } else {
       X = mat([X1,X2], true) ;
}
 

c.train(X,Y) ;
   
if (ml_name=='KNN')
{
plot(X1,".b", "Points of class 1", X2, ".g", "Points of class 2", X3, ".r", "Points of class 3") ;
//xy =add(minus(10),mul(20,rand(2000,2))) ;
//colorplot(xy, c.predict(xy), "KNN predictions") ;
}
if (ml_name=='LogReg')
{
xh=range(minus(10),10) ;
plot(X1,"b.","Points from class 1",X2,"r.","Points from class 2",xh,minus(entrywisediv((add(c.b,mul(get(c.w,0),xh))),get(c.w,1))),"_k","separating hyperplane") ;
}
if (ml_name=='Perceptron')
{
xh=range(minus(10),10) ;
plot(X1,"b.","Points from class 1",X2,"r.","Points from class 2",xh,minus(entrywisediv((add(c.b,mul(get(c.w,0),xh))),get(c.w,1))),"_k","separating hyperplane") ;
}
if (ml_name=='MLP')
{
plot(get(X,find(isEqual(c.predict(X),1)),range()),"b.","Points classified with label 1",get(X,find(isEqual(c.predict(X),2)),range()),"r.","Points classified with label 2") ;
}
if (ml_name=='DecisionTree')
{
plot(c.predict(X),"_b","Decision tree predictions",Y,".r","true labels") ;
}

document.getElementById("info").innerHTML=c.info();


}

</script>

</head>
<b>************************ MACHINE LEARNING-Classifier ************************</b><br><br>
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
   <option>tripleTable</option>
   <option>dtTable</option>
   <option>thpTable</option>
   </select><br><br>
   <b>VAR1: </b> <select id= "var1" style="width:100px;" name="var1" />
   <option>ind1</option>
   <option>ind2</option>
   <option>dep</option>
   <option>temperature</option>
   <option>humidity</option>
   <option>pressure</option>

  </select>
  <b>VAR2: </b> <select id= "var2" style="width:100px;" name="var2" />
   <option>ind2</option>
   <option>ind1</option>
   <option>dep</option>
   <option>temperature</option>                                                                                                                                      <option>humidity</option>
   <option>pressure</option>
   </select>

 <b>VAR3: </b> <select id= "var3" style="width:100px;" name="var3" />
   <option>dep</option>
   <option>ind1</option>
   <option>ind2</option>
   <option>temperature</option>                                                                                                                                      <option>humidity</option>
   <option>pressure</option>
   </select><br><br>

  <b>ML: </b> <select id= "ml" style="width:100px;" name="ml" />
   <option>KNN</option>
   <option>LogReg</option>
   <option>Perceptron</option>
   <option>MLP</option>
   <option>DecisionTree</option>
   </select>
   
    <input type="submit" style="width:100px;" name="submit" value="Analysis"/> 
    
</form>



<body onload="myLALOLabScript();">
<div class="container">
<center><div style="font-size: 100%;" title='LALOLib output' id='LALOLibOutput'></div></center>
<h2><b>ML-CLASSIFIER</b></h2>
<div id="info"></div>
</div>



</body>
</html>



