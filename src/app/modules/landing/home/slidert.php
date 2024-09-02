  <!-- Favicons -->
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="assets/vendor/animate.css/animate.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
  <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
  <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

  <!-- Template Main CSS File -->
<link href="assets/css/style.css" rel="stylesheet">
<style>
   .slider-container {
    width: 100%;
    height: 41px;
    overflow: hidden;
    background: rgba(23, 26, 29, 0.9);
}

.slider {
    display: flex;
    transition: transform 0.5s ease;
}

.slider-item {
    width: 100%;
    flex: 0 0 auto;
    padding: 2px;
    
    text-align: center;
    /* background-color: #922121; */
    /* border: 1px solid #ccc; */
}
.contenedor-padre {
    display: flex;
    justify-content: center; /* Coloca los divs hijos a la derecha */
    width: 100%;
    height: 200px; /* Ajusta la altura según tu diseño */
    /* Añade un borde para visualizar mejor la división */
}

.contenedor-hijo {
    width: calc(30% - 10px); /* Calcula el 10% del ancho menos el margen entre los hijos */
    margin-left: 5px; /* Espacio entre los divs hijos */
    /* background-color: #f0f0f0; */
    /*border: 1px solid #999; /* Borde para cada div hijo */
    box-sizing: border-box; /* Incluye el borde en el cálculo del ancho */
}

  </style>
<div class="slider-container">
      <div class="slider">
          <div class="slider-item">
            <div class="contenedor-padre" id="divisas">
                     <?PHP
						
						$miArreglo2 = array("EURUSD","EURJPY","EURMXN","GBPUSD","EURCAD","EURAUD","CHFAUD","CHFCAD");

						
						for($s=0;$s<count($miArreglo2);$s++){
							
							
							$elemento=$miArreglo2[$s];
							$ss=$s+1;
							?>
						 <div class="contenedor-hijo">
                            <h6> <label class="text-warning" id="<?PHP echo $elemento;?>simbolo"></label> <label id="<?PHP echo $elemento;?>porcentaje">%</label><br>
                            <span class="badge bg-success" id="<?PHP echo $elemento;?>btnvender">.</span>
                            <span class="badge bg-danger" id="<?PHP echo $elemento;?>btncomprar" >.</span>
                            </h6>
                         </div>            
							
						  
							<?PHP
							//$ii++;
						}
						?>
            </div>
          </div>
          <div class="slider-item">
            <div class="contenedor-padre" id="divisas">
                     <?PHP
						
						$miArreglo2 = array("CHFGBP","EURSGD","GBPPLN","GBPNZD","CHFNOK","CHFMXN","ZAREUR");

						
						for($s=0;$s<count($miArreglo2);$s++){
							
							
							$elemento=$miArreglo2[$s];
							$ss=$s+1;
							?>
						 <div class="contenedor-hijo">
                            <h6> <label class="text-warning" id="<?PHP echo $elemento;?>simbolo"></label> <label id="<?PHP echo $elemento;?>porcentaje">%</label><br>
                            <span class="badge bg-success" id="<?PHP echo $elemento;?>btnvender">.</span>
                            <span class="badge bg-danger" id="<?PHP echo $elemento;?>btncomprar" >.</span>
                            </h6>
                         </div>            
							
						  
							<?PHP
							//$ii++;
						}
						?>
            </div>
          </div>
          <div class="slider-item">
            <div class="contenedor-padre" id="divisas">
                      <?PHP
              
              $miArreglo2 = array("btc", "eth","ltc","alpha","ada");
              
              for($s=0;$s<count($miArreglo2);$s++){
                
                
                $elemento=$miArreglo2[$s];
                $ss=$s+1;
                ?>
                          <div class="contenedor-hijo">
                              <h6> <label class="text-warning" id="<?PHP echo $elemento;?>simbolo"></label> <label id="<?PHP echo $elemento;?>porcentaje">%</label><br>
                              <span class="badge bg-success" id="<?PHP echo $elemento;?>btnvender">.</span>
                              <span class="badge bg-danger" id="<?PHP echo $elemento;?>btncomprar" >.</span>
                              </h6>
                          </div>            
                
                
                <?PHP
                //$ii++;
              }
              ?>
              </div>
             


          </div>

          <div class="slider-item">
            <div class="contenedor-padre" id="divisas">
                      <?PHP
              //materias
              $miArreglo2 = array("WTIUSD","XBRUSD","XAUUSD","XAGUSD");
              
              for($s=0;$s<count($miArreglo2);$s++){
                
                
                $elemento=$miArreglo2[$s];
                $ss=$s+1;
                ?>
                          <div class="contenedor-hijo">
                              <h6> <label class="text-warning" id="<?PHP echo $elemento;?>simbolo"></label> <label id="<?PHP echo $elemento;?>porcentaje">%</label><br>
                              <span class="badge bg-success" id="<?PHP echo $elemento;?>btnvender">.</span>
                              <span class="badge bg-danger" id="<?PHP echo $elemento;?>btncomprar" >.</span>
                              </h6>
                          </div>            
                
                
                <?PHP
                //$ii++;
              }
              ?>
              </div>
             


          </div>

<!--
          <div class="slider-item" >
            <div class="contenedor-padre" id="divisas">
                      <?PHP
              //acciones
              $miArreglo2 = array( "AMZN", "TSLA","MSFT","NVDA","AAPL","GOOG","META","LLY");

              for($s=0;$s<count($miArreglo2);$s++){
                
                
                $elemento=$miArreglo2[$s];
                $ss=$s+1;
                ?>
                          <div class="contenedor-hijo">
                              <h6> <label class="text-warning" id="<?PHP echo $elemento;?>simbolo"></label> <label id="<?PHP echo $elemento;?>porcentaje">%</label><br>
                              <span class="badge bg-success" id="<?PHP echo $elemento;?>btnvender">.</span>
                              <span class="badge bg-danger" id="<?PHP echo $elemento;?>btncomprar" >.</span>
                              </h6>
                          </div>            
                
                
                <?PHP
                //$ii++;
              }
              ?>
              </div>
             


          </div>
          <div class="slider-item" >
            <div class="contenedor-padre" id="divisas">
                      <?PHP
              //acciones
              $miArreglo2 = array( "JNJ","ORCL","ADBE","UBER","SBUX","MCD","KO","WMT","PFE");

              for($s=0;$s<count($miArreglo2);$s++){
                
                
                $elemento=$miArreglo2[$s];
                $ss=$s+1;
                ?>
                          <div class="contenedor-hijo">
                              <h6> <label class="text-warning" id="<?PHP echo $elemento;?>simbolo"></label> <label id="<?PHP echo $elemento;?>porcentaje">%</label><br>
                              <span class="badge bg-success" id="<?PHP echo $elemento;?>btnvender">.</span>
                              <span class="badge bg-danger" id="<?PHP echo $elemento;?>btncomprar" >.</span>
                              </h6>
                          </div>            
                
                
                <?PHP
                //$ii++;
              }
              ?>
              </div>
             


          </div>

-->
        
         
      </div>
  </div>
  

    <script>
   const slider = document.querySelector('.slider');
const sliderItems = document.querySelectorAll('.slider-item');
const sliderWidth = sliderItems[0].clientWidth;
let currentIndex = 0;

function moveSlider() {
    currentIndex++;
    if (currentIndex >= sliderItems.length) {
        currentIndex = 0;
    }
    const newPosition = -currentIndex * sliderWidth;
    slider.style.transform = `translateX(${newPosition}px)`;
}

setInterval(moveSlider, 3000); // Cambia de slide cada 3 segundos (ajusta el tiempo según desees)

      </script>



                       


			
<script>


// Método 1: Usando un bucle for

 console.log("Recorriendo con bucle for:");

		let lastprice=null;
       let lastventa=null;
    //   let varia=miArreglo[i];

        const socketS = new WebSocket('wss://ws.eodhistoricaldata.com/ws/forex?api_token=65c96d6c9276a3.24274288');

        // Connection opened -> Subscribe
        socketS.addEventListener('open', function (event) {
          socketS.send(JSON.stringify({"action": "subscribe", "symbols": "EURUSD,EURJPY,EURMXN,GBPUSD,EURCAD,EURAUD,CHFAUD,CHFCAD,CHFGBP,EURSGD,GBPPLN,GBPNZD,CHFNOK,CHFMXN,ZAREUR,WTIUSD,XBRUSD,XAUUSD,XAGUSD"}))
          // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
          // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))  ,GBPNZD,CHFNOK,CHFMXN,PLNEUR"
        });

        // Listen for messages
        socketS.addEventListener('message', function (event) {

          const data = JSON.parse(event.data);
            console.log('Message from server ', event.data);
            console.log( 'simbolo',data.s);


                let stocsimbolo=document.getElementById(data.s+"simbolo");
            
            let porcentaje=document.getElementById(data.s+"porcentaje");
          

            let btnvender=document.getElementById(data.s+"btnvender");

            let btncomprar=document.getElementById(data.s+"btncomprar");

       
                //console.log(event.data);
                      //  const data = JSON.parse(event.data);
                        const symbol = data.s;
                        const maximo = parseFloat(data.b).toFixed(2);
                        const porce = parseFloat(data.dc).toFixed(2);
                        const price = parseFloat(data.a).toFixed(2);
                        const venta = parseFloat(data.b).toFixed(2);
                      stocsimbolo.innerHTML=symbol;

                      


                      porcentaje.innerText=""+porce+"%";
                      porcentaje.className =!porce || porce>0 ? 'text-success' : 'text-danger';
                        //compra
                    // stocprice.innerText=price;
                    // stocprice.style.color= !lastprice || lastprice===price ? 'black' : price > lastprice ? 'green':'red';
                    //botoncomprar    /btn btn-outline-danger   btn btn-outline-success   class="btn btn-outline-dark"
                    btncomprar.innerText ="C $"+price;
                    btncomprar.className =!lastprice || lastprice===price ? 'badge bg-dark' : price > lastprice ? 'badge bg-success':'badge bg-danger';
                    lastprice=price;


                        //venta
                    // stocventa.innerText=venta;
                    // stocventa.style.color= !lastventa || lastventa===venta ? 'black' : venta > lastventa ? 'green':'red';

                    btnvender.innerText ="V $"+venta;
                    btnvender.className = !lastventa || lastventa===venta ? 'badge bg-dark' : venta > lastventa ? 'badge bg-success':'badge bg-danger';
                          
                    lastventa=venta;





        });

        // Unsubscribe
        var unsubscribe = function(symbol) {
            socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
        }

  
        
        //cripto

        // let miArreglo = ["btc", "eth"];
 
  let miArreglo = ["btc", "eth","ltc","alpha","ada"];

// Método 1: Usando un bucle for
console.log("Recorriendo con bucle for:");
for (let i = 0; i < miArreglo.length; i++) {
    console.log(miArreglo[i]);
		let stocsimbolocripto=document.getElementById(miArreglo[i]+"simbolo");
        
        let porcentajecripto=document.getElementById(miArreglo[i]+"porcentaje");
       
        let btnvender=document.getElementById(miArreglo[i]+"btnvender");

        let btncomprar=document.getElementById(miArreglo[i]+"btncomprar");

        let lastpricecripto=null;
        let lastventacripto=null;
        const socket = new WebSocket("wss://stream.binance.com:9443/ws/"+miArreglo[i]+"usdt@ticker");

        socket.onmessage = function(event) {

            console.log(event.data);
            const datacripto = JSON.parse(event.data);
            const symbolcripto = datacripto.s;
           
            const porcecripto = parseFloat(datacripto.P).toFixed(2);
            const pricecripto = parseFloat(datacripto.c).toFixed(2);
           // const venta = parseFloat(data.l).toFixed(2);
            const ventacripto = parseFloat(datacripto.w).toFixed(2);
            stocsimbolocripto.innerHTML=symbolcripto.replace("USDT", "");



          porcentajecripto.innerText=""+porcecripto+"%";
          porcentajecripto.className =!porcecripto || porcecripto>0 ? 'text-success' : 'text-danger';
            //compra
        // stocprice.innerText=price;
        // stocprice.style.color= !lastprice || lastprice===price ? 'black' : price > lastprice ? 'green':'red';
        //botoncomprar    /btn btn-outline-danger   btn btn-outline-success   class="btn btn-outline-dark"
        btncomprar.innerText ="C "+pricecripto;
        btncomprar.className =!lastpricecripto || lastpricecripto===pricecripto ? 'badge bg-dark' : pricecripto > lastpricecripto ? 'badge bg-success':'badge bg-danger';
        lastpricecripto=pricecripto;



        btnvender.innerText ="V "+ventacripto;
        btnvender.className = !lastventacripto || lastventacripto===ventacripto ? 'badge bg-dark' : ventacripto > lastventacripto ? 'badge bg-success':'badge bg-danger';
              
        lastventacripto=ventacripto;
        };
}

     

//cripto


//acciones

const socketSS = new WebSocket('wss://ws.eodhistoricaldata.com/ws/us-quote?api_token=65c96d6c9276a3.24274288');

// Connection opened -> Subscribe
socketSS.addEventListener('open', function (event) {
  socketSS.send(JSON.stringify({"action": "subscribe", "symbols": "AMZN,TSLA,MSFT,NVDA,AAPL,GOOG,META,LLY,JNJ,ORCL,ADBE,UBER,SBUX,MCD,KO,WMT,PFE,AZN,BABA,PEP,BBVA,MA,INTC"})) 
  // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
  // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))  ,GBPNZD,CHFNOK,CHFMXN,PLNEUR"
});

// Listen for messages
socketSS.addEventListener('message', function (event) {

    const data = JSON.parse(event.data);
      console.log('Message from server acciones', event.data);
      console.log( 'simbolo',data.s);


    let stocsimbolo=document.getElementById(data.s+"simbolo");

  let porcentaje=document.getElementById(data.s+"porcentaje");


  let btnvender=document.getElementById(data.s+"btnvender");

  let btncomprar=document.getElementById(data.s+"btncomprar");





    

          //console.log(event.data);
                //  const data = JSON.parse(event.data);
                  const symbol = data.s;
                  const maximo = parseFloat(data.ap).toFixed(4);
                  const porce = parseFloat(data.ap).toFixed(4);
                  const price = parseFloat(data.ap).toFixed(4);
                  const venta = parseFloat(data.bp).toFixed(4);
                stocsimbolo.innerHTML=symbol;

                // //barra
                // valmin.innerText=venta;
                // valmax.innerText=maximo;
                // rango.min=venta;
                // rango.max=maximo;
                // rango.value=price;


                porcentaje.innerText=""+porce+"%";
                porcentaje.className =!porce || porce>0 ? 'text-success' : 'text-danger';
                  //compra
              // stocprice.innerText=price;
              // stocprice.style.color= !lastprice || lastprice===price ? 'black' : price > lastprice ? 'green':'red';
              //botoncomprar    /btn btn-outline-danger   btn btn-outline-success   class="btn btn-outline-dark"
              btncomprar.innerText ="C "+price;
              btncomprar.className =!lastprice || lastprice===price ? 'badge bg-dark' : price > lastprice ? 'badge bg-success':'badge bg-danger';
              lastprice=price;


                  //venta
              // stocventa.innerText=venta;
              // stocventa.style.color= !lastventa || lastventa===venta ? 'black' : venta > lastventa ? 'green':'red';

              btnvender.innerText ="V "+venta;
              btnvender.className = !lastventa || lastventa===venta ? 'badge bg-dark' : venta > lastventa ? 'badge bg-success':'badge bg-danger';
                    
              lastventa=venta;





});

// Unsubscribe
var unsubscribe = function(symbol) {
  socketSS.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
}

//acciones



</script>
