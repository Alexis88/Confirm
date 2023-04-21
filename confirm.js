/**
 * Confirm personalizado
 *
 * Este script genera un cuadro emergente que emula al cuadro de confirmación del método window.confirm()
 *
 * MODO DE USO: Confirm.go("La pregunta de confirmación", Una función de llamada de retorno (opcional));
 *
 * @author		Alexis López Espinoza
 * @version		1.0
 * @param		{pregunta}		String		La pregunta de confirmación
 * @param		{callback}		Function	Una función de llamada de retorno que se ejecutará si el usuario
 * 											pulsa el botón SÍ. En caso de no pasar una llamada de retorno, 
 *											se devolverá true. Esta llamada de retorno es opcional.
 */

"use strict";

let Confirm = {
	state: true, //Comodín que controla la creación de cuadros de confirmación
	go: (pregunta, callback) => {
		//Se almacenan la pregunta y la llamada de retorno
		Confirm.pregunta = String(pregunta);
		Confirm.callback = callback || null;

		//Si no hay otro cuadro de confirmación, se procede a mostrar uno nuevo
		if (Confirm.state){
			Confirm.show();
		}
		//Caso contrario, se le informa al usuario que tiene que resolver la confirmación pendiente
		else{
			Notification.msg("Resuelva la pregunta de confirmación pendiente");
		}
	},

	show: _ => {
		//Se almacena el valor actual de la propiedad overflow del document
		Confirm.overflow = getComputedStyle(document.body).overflow;

		//Fondo
		Confirm.back = document.createElement("div");
		Confirm.back.style.width = window.innerWidth + "px";
		Confirm.back.style.height = window.innerHeight + "px";
		Confirm.back.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
		Confirm.back.style.top = 0;
		Confirm.back.style.left = 0;
		Confirm.back.style.margin = 0;
		Confirm.back.style.position = "fixed";		
		Confirm.back.style.display = "flex";
		Confirm.back.style.alignItems = "center";
		Confirm.back.style.justifyContent = "center";
		Confirm.back.style.opacity = 0;
		Confirm.back.style.transition = "all ease .15s";
		Confirm.back.style.zIndex = "9999";

		//Cuadro de la pregunta
		Confirm.front = document.createElement("div");
		Confirm.front.style.width = Confirm.width();
		Confirm.front.style.backgroundColor = "snow";
		Confirm.front.style.borderRadius = "5px";
		Confirm.front.style.paddingTop = "1%";
		Confirm.front.style.paddingBottom = "1%";
		Confirm.front.style.paddingRight = "2.5%";
		Confirm.front.style.paddingLeft = "2.5%";
		Confirm.front.style.display = "flex";
		Confirm.front.style.alignItems = "center";
		Confirm.front.style.justifyContent = "center";
		Confirm.front.style.textAlign = "center";
		Confirm.front.style.flexDirection = "column";
		Confirm.front.style.transition = "all ease .15s";

		//Botón SÍ
		Confirm.yes = Confirm.buttons("Sí");

		//Botón NO
		Confirm.no = Confirm.buttons("No");

		//La pregunta
		Confirm.question = document.createElement("span");
		Confirm.question.style.display = "block";
		Confirm.question.style.margin = "0 auto";
		Confirm.question.style.marginBottom = "1%";
		Confirm.question.style.userSelect = "none";
		Confirm.question.style.fontWeight = "bold";
		Confirm.question.style.color = "#1a1a1a";
		Confirm.question.textContent = Confirm.pregunta;

		//Contenedor de los botones
		Confirm.container = document.createElement("p");
		Confirm.container.style.display = "flex";
		Confirm.container.style.alignItems = "center";
		Confirm.container.style.justifyContent = "center";
		Confirm.container.style.margin = "1px";	

		//Se adhieren los botones al contenedor
		Confirm.container.appendChild(Confirm.yes);
		Confirm.container.appendChild(Confirm.no);

		//Se adhiere la pregunta al cuadro de confirmación
		Confirm.front.appendChild(Confirm.question);

		//Se adhiere el contenedor de botones al cuadro de confirmación
		Confirm.front.appendChild(Confirm.container);		

		//Se adhiere el cuadro de confirmación al fondo
		Confirm.back.appendChild(Confirm.front);

		//Se adhiere el fondo al documento
		document.body.appendChild(Confirm.back);

		//Se retiran las barras de desplazamiento del documento
		document.body.style.overflow = "hidden";

		//Se da visibilidad al fondo y pregunta
		setTimeout(_ => Confirm.back.style.opacity = .95, 100);

		//Si se pulsa el botón SÍ, se ocultan el fondo y la pregunta y se ejecuta la llamada de retorno
		Confirm.yes.addEventListener("click", _ => {
			Confirm.hide();
			if (Confirm.callback && {}.toString.call(Confirm.callback) == "[object Function]") Confirm.callback();
			else return true;
		}, false);

		//Al girar el dispositivo, cambian las dimensiones del fondo
		window.addEventListener("orientationchange", Confirm.resize, false);
		window.addEventListener("resize", Confirm.resize, false);

		//Si se pulsa el botón NO, se cierran el fondo oscuro y el cuadro de confirmación
		Confirm.no.addEventListener("click", Confirm.hide, false);
	},

	hide: _ => {
		//Se desvanecen el fondo y su contenido
		Confirm.back.style.opacity = 0;

		//Se devuelve al documento sus barras de desplazamiento
		document.body.style.overflow = Confirm.overflow;

		//Luego de 200 milésimas de segundo, se eliminan el fondo y su contenido y el valor del comodín vuelve a true
		setTimeout(_ => {
			document.body.removeChild(Confirm.back);					
			Confirm.flag = true;
		}, 200);
	},

	width: _ => window.matchMedia("(min-width: 920px)").matches ? "350px" : "250px",

	resize: _ => {
		Confirm.back.style.width = window.innerWidth + "px";
		Confirm.back.style.height = window.innerHeight + "px";
		Confirm.front.style.width = Confirm.width();
		Confirm.back.style.top = 0;
	},

	buttons: text => {
		let button = document.createElement("b");
		
		button.style.backgroundColor = "#305165";
		button.style.color = "snow";
		button.style.fontWeight = "bold";
		button.style.cursor = "pointer";
		button.style.userSelect = "none";
		button.style.display = "inline-block";
		button.style.marginRight = "5px";
		button.style.paddingTop = "7.5px";
		button.style.paddingBottom = "7.5px";
		button.style.paddingRight = "12.5px";
		button.style.paddingLeft = "12.5px";
		button.style.borderRadius = "5px";
		button.textContent = text;		

		button.addEventListener("mouseover", _ => button.style.backgroundColor = "#191919", false);
		button.addEventListener("mouseout", _ => button.style.backgroundColor = "#305165", false);		

		return button;
	}
};
