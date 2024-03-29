(function(){
	
	function chrono(){
		setTimeout(function(){	
			if(stopTr) {return;}	// Si stop tri (stopTr) alors on arrête le chrono	
			end = new Date();
			diff = end - start;
			diff = new Date(diff);
			let msec = diff.getMilliseconds();
			let sec = diff.getSeconds();
			let min = diff.getMinutes();
			let hr = diff.getHours()-1;
			if (min < 10){
			  min = "0" + min;
			}
			if (sec < 10){
			  sec = "0" + sec;
			}
			if(msec < 10){
			  msec = "00" +msec;
			}
			else if(msec < 100){
			  msec = "0" +msec;
			}
			// Il recupère l'élément HTML du chrono et affiche le chronometre sur la page
			document.getElementById("chronotime").innerHTML = min + ":" + sec + ":" + msec;
			//On rappel cette fonction si le chrono est toujours start (=vrai)
			if(chronoStart) {
				chrono();
			}
		}, 10)
	}
	
 
	function dynamicAnimation(index) {
		//creer une animation dynamique pour l'élement à caser;

		let style = document.createElement('style');
		style.type = 'text/css';
		let keyFrames = '\
		.move_place {\
		  animation: anim_left 0.5s;\
		  animation-fill-mode: forwards;\
		}\
		  \
		@keyframes anim_left {\
			0% {\
				transform: translateX(0px) translateY(0px);\
			}\
			20% {\
				transform: translateX(0px) translateY(-25px);\
			}\
			60% {\
				transform: translateX(DYNC_VAL) translateY(-25px);\
			}\
			100% {\
				transform: translateX(DYNC_VAL) translateY(0px);\
			}\
		}\
		';
		style.innerHTML = keyFrames.replace(/DYNC_VAL/g, "-"+(index*50)+"px");
		document.getElementsByTagName('head')[0].appendChild(style);
	
		return "move_place";
	  }
 
	/*

		TRI INSERTION

	*/


	function secondloop(){
		return setTimeout(function(){
			if(stopTr) {return;}
			console.log("   j:"+j);
			if(j>=0){
				if(liste[j] > iTemp)
					lis[j].classList.add("reverse");
				lis[j+1].classList.remove("reverse");
			}	
			if(j >=0 && liste[j] > iTemp){
				liste[j+1] = liste[j];
				j--;
				secondloop();
			}else if(deplacement){
				//dernier tour de boucle. on clear les animations et on change le html
				for(let m=0; m<lis.length; m++){
					lis[m].classList.remove("simpleright");
					lis[m].classList.remove("move_place");
					lis[m].classList.remove("current_position");
					lis[m].classList.remove("reverse");
				}
				console.log("debug: jPos:", jPos)
				const jText = lis[i].innerText;
				for(let n=i-1; n>jPos-1; n--){
					lis[n+1].innerText = lis[n].innerText
				}
				lis[jPos].innerText = jText;
				i++;
				deplacement = false;

				//ne pas attendre pour la prochaine boucle; -- ne fonctionne pas
				clearTimeout(ftimeout);
				ftimeout  = firstloop();
				return;
			} 
			else if( j === -1 || liste[j] <= iTemp) {
				console.log("ne doit s'afficher qu'une seul fois");
				//tri
				liste[j+1] = iTemp;
				jPos = j+1;
				const index = i - (j+1);

				//l'élement est deja a la bonne position
				if(index === 0){

				}
				else {
					// on anime le déplacement 
					const anim = dynamicAnimation( index );
					lis[i].classList.add(anim);
					for(let k=i-1; k>=j+1; k--){
						lis[k].classList.add("simpleright");
					}
				}
				//i++;
				j--;
				deplacement = true;
				secondloop();
			}
		}, 600)
	}
  
	function firstloop(){
	  return setTimeout(function(){
		if(stopTr) {return;}
		if(i >= liste.length){
			//terminé
			chronoStart = false;
			console.log('terminé');
			console.log(liste);
			document.getElementById("fin").innerText="Terminé";
			return;
		}

		console.log(liste);
		
		iTemp = liste[i];
		j = i-1;

		console.log('i:', i, " iTemp:", iTemp);

		lis[i].classList.add("current_position")

		clearTimeout(stimeout);
		stimeout = secondloop();
		
	  }, 100);
	}
  

	
	function loadListe() {	
		let listForm = document.getElementById("formListe").getElementsByTagName("input");
		let ulListe = document.getElementById("tablist");
		lis = document.getElementById("tablist").getElementsByTagName("li");
		liste = [];
		ulListe.innerHTML=""		
		//Récupération de la liste UL pour le traitement
		let valeur;
		 for (let a = 0; a<listForm.length; a++){
			valeur = listForm[a].value;
			liste.push(parseInt(valeur));
			let el = document.createElement("li");
			el.innerHTML = valeur;	
			ulListe.appendChild(el);
		}
		lis = document.getElementById("tablist").getElementsByTagName("li");
		
		console.log(liste);
		console.log(lis);	
	}

	let i = 1;
	let j = 0;
	let jPos = -1;
	let ftimeout, stimeout;
	let iTemp = -1;
	let deplacement = false;
	let startTime = 0;
	let start = 0;
	let end = 0;
	let diff = 0;
	let timerID = 0;
	let chronoStart=true;
	let liste = []	
	let lis;

	document.getElementById('startButton').onclick = function startTri(){
		i = 1;		
		j = 0;
		jPos = -1;
		iTemp = -1;		
		deplacement = false;				
		start = new Date();
		stopTr = false;
		chronoStart = true;
		chrono();		
		loadListe();
		iMax = liste.length-1;
		ftimeout = firstloop();
	}

	document.getElementById('stopButton').onclick = function stopTri(){		
		stopTr = true;
	}

})();