
var canvas;
var context;
var images = {};
     
var numFramesDrawn = 0;
var curFPS = 0;

var oyunu_bitir; // her seferinde resimler bastan yüklenmesin diye kullanilacak !!!

function Samurai ( life ) // samurai classi
{
    var x;
	var genislik;
    var sword_begin_x;
	var sword_end_x;
	var y;
	this.life = life;	
}

function Janissary ( life ) // janissary classi
{
    var x;
	var genislik;
    var sword_begin_x;
	var sword_end_x;
	var y ;
	this.life = life ;
}

var janissary = new Janissary ( '100' ); // life = 100
var samurai = new Samurai ( '100' ) ; // life = 100

    function updateFPS() 
	{
	curFPS = numFramesDrawn;
	numFramesDrawn = 0;
    }		
	function CanvasHazirla(canvasDiv, canvasWidth, canvasHeight)
    {
	  // Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	
	if(typeof G_vmlCanvasManager != 'undefined') 
	{
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
     context = document.getElementById('canvas').getContext("2d"); // html5 canvasi icin
	//  loadImage("janissary");
	  loadImage("ninja3");
	  loadImage("ninja3_kilic");
	  loadImage("ninja3_kilic_attack");
	  loadImage("ninja1_dead");
	  
	  loadImage("janissary10_beden");
	  loadImage("janissary10_kol_1");
	  loadImage("janissary10_kilic");
	  loadImage("attacking_kol");
	  loadImage("attacking_sword");
      loadImage("janissary10_dead");
	  
	}
	
	function loadImage(name) // resimleri yuklemek icin method
	{

			images[name] = new Image();
			images[name].onload = function()
					{
				resourceLoaded(); // her sekli sürekli cizdiren bir method
					}
			images[name].src = "images/" + name + ".png";
	}
	
	var totalResources = 10; // bir sekili yukarida yukledigim icin
    var numResourcesLoaded = 0;
    var fps = 30;

	function resourceLoaded() 
	{
	
			numResourcesLoaded += 1;
			if(numResourcesLoaded === totalResources) 
			{
					oyunu_bitir = setInterval(redraw, 1000 / fps); // redraw fonksiyonunu saniyede 30 kere çagiriyor yani bir cesit timer
			}
	}
	
//var context = document.getElementById('canvas').getContext("2d"); // html5 canvasi icin

	var charX = 245;
	var charY = 260;


	var maxEye_r = 5; // gozun acik haldeki yaricapi
	var goz_yaricapi = maxEye_r; 
	var eyeOpenTime = 0; // son goz kirpmadan onceki zaman
	var timeBtwBlinks = 4000; // iki goz kırpma arasındaki zaman yani acik kalacagi sure
	var blinkUpdateTime = 200; // kac saniyede bir kirpacagi
	var blinkTimer = setInterval(updateBlink, blinkUpdateTime); // timeri cagiriyoruz updateBlink fonksiyonunu blinkUpdateTime kadarda bir cagiriyoruz

	var mov_distance_janissary = 0 ; // bu degerin artis ve azalisina gore janissary hareket eder
	var mov_distance_samurai = 0; // bu degerin artis ve azalisina gore samuray hareket eder

	function redraw() { // pozisyona gore yuklenen resimleri ve kendi sekillerimizi cizdirmek icin
            var samurai_kazandi = 0; // eger samuray kazandiysa tekrar janissary i cizdirmemesi icin flag olarak kullaniliyor
			var x = charX;
			var y = charY;
			var color_type ;

		canvas.width = canvas.width; // canvas i temizlemek icin
  
	//	context.drawImage(images["janissary"],x,y);
		
		context.drawImage(images["ninja3"],x-50+mov_distance_samurai,y+45); // lokasyonlarını vererek çizdiriyoruz
		if(!attacking_samurai) // eğer samuray saldirmiyorsa
		{
		context.drawImage(images["ninja3_kilic"],x+57+mov_distance_samurai,y+47); // lokasyonlarını vererek çizdiriyoruz
			samurai.x= x-50+mov_distance_samurai;
			samurai.genislik = x+mov_distance_samurai; 
			samurai.y = y + 47 ;
		}
		else // eger samuray saldiri durumundaysa
		{
		     context.drawImage(images["ninja3_kilic_attack"],x+55+mov_distance_samurai,y+137);
			samurai.sword_begin_x = x+50+mov_distance_samurai;
			samurai.sword_end_x = x+75+mov_distance_samurai; // kilicin uzunlugunun yarisi
		    samurai.y = y + 137 ;
			var kazandimi = getPoint_Samurai1();
			
			if(kazandimi == 1)  // eger samuray oyunu kazandiysa diye
			{

			finish_cizimi_Samurai(x,y);
			var samurai_kazandi = 1 ;
			}
			
		}
		
		
		if(samurai_kazandi == 0 ) // eger oyun hala daha bitmediyse     cizdiriyoruz
		{
		context.drawImage(images["janissary10_beden"],x+mov_distance_janissary+200,y+45);
		
		if(!attacking_janissary) // eger janissary saldirmiyorsa
		{
		context.drawImage(images["janissary10_kol_1"],x+mov_distance_janissary+271,y+125);
		context.drawImage(images["janissary10_kilic"],x+mov_distance_janissary+200,y+105);
			janissary.x = x + mov_distance_janissary + 271 ;
			janissary.genislik = x+mov_distance_janissary+231;
			janissary.y = y + mov_distance_janissary + 125 ;
        }
        else // eger janissary saldiri durumdaysa
        {
        context.drawImage(images["attacking_kol"],x+mov_distance_janissary+243,y+125);
        context.drawImage(images["attacking_sword"],x+mov_distance_janissary+135,y+125);	
			janissary.sword_begin_x = x + mov_distance_janissary + 243 ;
			janissary.sword_end_x   = x + mov_distance_janissary + 183 ;
			janissary.y = y + mov_distance_janissary + 125 ;
			var kazandimi = getPoint_Janissary1();
			
			if(kazandimi == 1) // eger janissary oyunu kazandiysa
			{
		/*	  */
			finish_cizimi_Janissary(x,y);
			
			}
			
	     }
        }		
		
		Arkaplan_Sekilleri_Cizdir(x,y);
		
    }	

	function drawEye(x_loc_center,y_loc_center)
	{
	    context.fillStyle = "black"; // icini doldurdugumuzda siyah olacak
		context.beginPath();
		context.arc(x_loc_center,y_loc_center, goz_yaricapi, 0, 2*Math.PI);
		context.closePath();
		context.fill();	
	}
	
	function drawEllipse(centerX,centerY,width,height,color_type)
	{
	    context.fillStyle = color_type;
		context.beginPath();
  
		context.moveTo(centerX, centerY - height/2); // baslangic noktasi
  
		context.bezierCurveTo  // kontrol noktalari ve bitis noktasi
		(
		centerX + width/2, centerY - height/2,
		centerX + width/2, centerY + height/2,
		centerX, centerY + height/2
		);

		context.bezierCurveTo  // kontrol noktalari ve bitis noktasi
		(
		centerX - width/2, centerY + height/2,
		centerX - width/2, centerY - height/2,
		centerX, centerY - height/2
		);
	 
		
		context.fill();
		context.closePath();	
    }
	
	function draw_triangle(x1,y1,x2,y2,x3,y3,color_type)
	{
	    context.fillStyle = color_type; 
		context.beginPath();
		context.moveTo(x1,y1);
		context.lineTo(x2,y2);
		context.lineTo(x3,y3);
		context.fill();
    }
	
	function draw_wing(x1,y1,x2,y2,x3,y3,x4,y4,color_type)
	{
	    context.fillStyle = color_type;
		context.beginPath();
		context.moveTo(x1,y1);
		context.lineTo(x2,y2);
		context.lineTo(x3,y3);
		context.lineTo(x4,y4);
	    context.fill();
	
	}
	
	function updateBlink()
	{ 			
		eyeOpenTime += blinkUpdateTime;
	
		if(eyeOpenTime >= timeBtwBlinks) // son goz kirpmadan onceki zaman gozun acik kalmasi gereken sureden fazla ise kırpma zamanı gelmistir demek
		{
			blink();
		}
	}
	function blink()
	{

		goz_yaricapi -= 1;
		if (goz_yaricapi <= 0) // goz kapandı ise acmak goze acik haldeki yaricap degerini atiyoruz
		{
			eyeOpenTime = 0;
			goz_yaricapi = maxEye_r; 
		} 
		else 
		{
			setTimeout(blink, 12);
		}
	}
	
        
	 var moving = false; // normaldaki durum
	 var attacking_samurai = false // normaldaki durum
	 var attacking_janissary= false // normaldeki durum
	 
	 function move_right_janissary() // sag hareket etme durumu
	 {                 
		 if (!moving)
		 {
		   moving = true;
		   mov_distance_janissary = mov_distance_janissary + 50 ;
		   setTimeout(stable, 50); // sürekli kontrol icin  , deger 50 olunca daha hizli gitti
		 }
     }
	 function move_right_samurai() // sag hareket etme durumu
	 {                 
		 if (!moving)
		 {
		   moving = true;
		   mov_distance_samurai = mov_distance_samurai + 50 ;
		   setTimeout(stable, 50); // sürekli kontrol icin  , deger 50 olunca daha hizli gitti
		 }
     }
	 function move_left_janissary() // sola hareket etme durumu
	 {                 
		 if (!moving)
		 {
		   moving = true;
		   mov_distance_janissary = mov_distance_janissary - 50 ;
		   setTimeout(stable, 500); // sürekli kontrol icin , deger 500 daha yavas gidiyor
		 }
     }
	 function move_left_samurai() // sola hareket etme durumu
	 {                 
		 if (!moving)
		 {
		   moving = true;
		   mov_distance_samurai = mov_distance_samurai - 50 ;
		   setTimeout(stable, 500); // sürekli kontrol icin , deger 500 daha yavas gidiyor
		 }
     }
	 function stable() // durumun stabil olması
	{                    
       moving = false;
    }
	 
	 function attack_samurai()
	 {
	    if (!attacking_samurai)
		{
		  attacking_samurai = true ;
		  setTimeout(guard_samurai , 50 );
		}
	 }
	 function guard_samurai()
	 {
	     attacking_samurai = false;
	 }
	 
	 function attack_janissary()
	 {
	    if (!attacking_janissary)
		{
		  attacking_janissary = true ;
		  setTimeout(guard_janissary, 50 );
		}
	 }
	 function guard_janissary()
	 {
	     attacking_janissary = false;
	 }
	 
	 function getPoint_Samurai()
	 {
	   if( attacking_samurai)
	   {
	       if(samurai.sword_end_x < janissary.x && samurai.sword_end_x > janissary.x )
		   {
		   janissary.life = janissary.life - 10 ;
		   }
	   }
	 }
	 function getPoint_Samurai1()
	 {
	 var temp;
	 var flag = 0;
	    if(samurai.sword_begin_x <= janissary.x )
		{
			if(samurai.sword_end_x >= janissary.x)
			{
			janissary.life = janissary.life - 10 ;
			flag = 1;
			}
		}
		var kazandimi = Life_Control_Janissary();
		if(kazandimi == 1 )
		return 1;
	 }
	 
	 function getPoint_Janissary1()
	 {
	 var temp;
	 var flag = 0;
	    if(janissary.sword_begin_x >= samurai.x )
		{
		   if(janissary.sword_end_x <= samurai.x)
		   {
			samurai.life = samurai.life - 10 ;
	       }
		   else if( janissary.sword_end_x - 100 <= samurai.x)
		   {
		    samurai.life = samurai.life - 5 ;
		   }
		   else if(janissary.sword_end_x - 150 <= samurai.x)
		   {
		   samurai.life = samurai.life - 1 ;
		   }
		}
		var kazandimi = Life_Control_Samurai();
		if(kazandimi == 1 )
		return 1;
	 }
     
    function Life_Control_Janissary() // Janissary oldu mu ? Oyun bitti mi ?
    {
	 if( janissary.life <= 0 )
	 {
	 
	 window.removeEventListener('keydown', moveSomething, false);
	 
	  return 1; // samurai nin kazandigini belirtmek icin
     
	 }
	}
    function Life_Control_Samurai() // Samurai oldu mu ? Oyun bitti mi ?
    {
	 if ( samurai.life <= 0 )
	 {
	    	 
	    window.removeEventListener('keydown', moveSomething, false);
        
		return 1; // janissary nin kazandigini belirtmek icin
 		
		
	 }
	}
	
	
    function finish_cizimi_Janissary(x,y) // en son ekranin cizimi , ninjanin öldügu pozisyon
	{
	       context.clearRect ( 0 , 0 , canvas.width, canvas.height ); // once tum canvas i siliyoruz
		    
			//tek tek son durumdakilerin hepsini cizdiriyoruz tek degisiklik yerde yatan samuray !
			
			context.drawImage(images["janissary10_beden"],x+mov_distance_janissary+200,y+45);
	        context.drawImage(images["attacking_kol"],x+mov_distance_janissary+243,y+125);
            context.drawImage(images["attacking_sword"],x+mov_distance_janissary+135,y+125); 
			
	        context.drawImage(images["ninja1_dead"],x+mov_distance_samurai+55,y+140); // Samurai inin oldugu pozisyon 
			var snd = new Audio("Janissary_Song.mp3"); // buffers automatically when created
			snd.play();
			context.fillStyle = "RED";
			context.font = "100px Georgia" ;
			context.fillText("JANISSARY WINS !!!",100,100);
			would_u_like_to_play_again();
			clearInterval(oyunu_bitir); // timer i kapatıyoruz boylelikle diger sekiller tekrar cizdirilmiyor
			
	}
	
	function finish_cizimi_Samurai(x,y) // // en son ekranin cizimi , Janissarynin öldügu pozisyon 
	{
			context.clearRect ( 0 , 0 , canvas.width, canvas.height ); // once tum canvas i siliyoruz
			 
		    //tek tek son durumdakilerin hepsini cizdiriyoruz tek degisiklik yerde yatan janissary !
			context.drawImage(images["ninja3"],x-50+mov_distance_samurai,y+45); // lokasyonlarını vererek çizdiriyoruz
			context.drawImage(images["ninja3_kilic_attack"],x+55+mov_distance_samurai,y+137);
			 
			context.drawImage(images["janissary10_dead"],x+mov_distance_janissary+243,y+150) ; //  Janissary nin oldugu pozisyon 
			var snd = new Audio("Samurai_Song.mp3"); // buffers automatically when created
			snd.play();
			context.fillStyle = "RED";
			context.font = "100px Georgia" ;
			context.fillText("SAMURAI WINS !!!",100,100);
			would_u_like_to_play_again();
			clearInterval(oyunu_bitir); // timer i kapatıyoruz boylelikle diger sekiller tekrar cizdirilmiyor 
			
	}
	
	function Arkaplan_Sekilleri_Cizdir(x,y)
	{
	         color_type = "Black";
			drawEllipse(x + 100, y + 270, 200, 6,color_type); // elips seklinde golge yapmak icin
		
			color_type = "Sienna"; // acik kahve rengi ,  http://www.w3schools.com/html/html_colornames.asp
			drawEllipse(x + 660, y - 90, 53, 42,color_type);
		
			//gozler govdenin üzerine cizdirilecegi icin sonradan cizdiriliyor
		
			drawEye(x + 655, y - 90); // sol goz 
			drawEye(x + 665, y - 90); // sag goz
		
			color_type = "SaddleBrown" // biraz daha koyu kahve , http://www.w3schools.com/html/html_colornames.asp
			draw_triangle(x+645,y-118,x+660,y-106,x+645,y-106,color_type); // sol kulak - baykus
			draw_triangle(x+675,y-118,x+675,y-106,x+660,y-106,color_type); // sag kulak - baykus
			
			context.font = "20px Georgia";
			context.fillText("Janissary Life: " + janissary.life, 850, 32);
			context.fillText(" Samurai life : " + samurai.life , 100 , 32);
			
			color_type = "SaddleBrown";
			draw_wing(x+642,y-100,x+630,y-110,x+630,y-80,x+642,y-87,color_type); // daha sonra burada sekil üzeirinde calisilabilir
			draw_wing(x+691,y-110,x+679,y-100,x+679,y-87,x+691,y-80,color_type);
	        
	}
	
	function addButtons ()
	{
	        var button_yes = canvasDiv.appendChild(document.createElement("button")) // button ekleniyor
			button_yes.setAttribute("style","position: absolute; bottom: +125px; left: 400px;") // pozisyonu belirleniyor
			button_yes.setAttribute("onclick", "onclick")
			button_yes.appendChild(document.createTextNode("YES")) 

			button_yes.addEventListener('click', function(event) { // event i yaziliyor
            window.location.href='game.html';
            });
			
			var button_no = canvasDiv.appendChild(document.createElement("button"))         //button ekleniyor
			button_no.setAttribute("style","position: absolute; bottom: +125px; left: 600px;") // pozisyonu belirleniyor
			button_no.setAttribute("onclick","onclick") 
			button_no.appendChild(document.createTextNode("NO"))
			
			button_no.addEventListener('click', function(event) { // event i yaziliyor
            window.location.href="http://www.google.com";
            });
	}
	
	function would_u_like_to_play_again()
	{
	     context.fillStyle = "WHITE";
	     context.font = "100px Georgia" ;
		 context.fillText("WOULD YOU LIKE" ,100,200);
		 context.fillText("TO PLAY AGAIN ???",100,300);
	     addButtons ();
	}
	
	window.addEventListener("keydown", moveSomething, false); //tusa basınca calisacak event
	function moveSomething(e) {
    switch(e.keyCode) {
        case 37:
            // left key pressed
			move_left_janissary();
            break;
        case 80:
            // p harfine basilinca
			attack_janissary();
            break;
        case 39:
            // right key pressed
			move_right_janissary();
            break;
        case 82:
            // r harfine basilinca
			attack_samurai();
            break;  			
		case 65:
            // a harfine basilirsa
            move_left_samurai();
            break;			
        case 68:
	        // d harfine basilirsa	
		    move_right_samurai();
		    break; 
             		
    }   
} 
	
	