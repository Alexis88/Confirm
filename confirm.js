/**
 * CUADRO DE CONFIRMACIÓN PERSONALIZADO
 *
 * Este script genera un cuadro emergente que emula al cuadro de confirmación del método window.confirm()
 *
 * MODO DE USO: Confirm.go({Opciones de configuración});
 *
 * Se empleó el archivo notification.js: https://github.com/Alexis88/Notification
 *
 * @author		Alexis López Espinoza
 * @version		2.0
 * @param		options				Plain Object
 */

"use strict";

let Confirm = {
	state: true, //Comodín que controla la creación de cuadros de confirmación
	go: function(
		options
		/*** OPCIONES DE CONFIGURACIÓN ***
		 * 
		 * options.pregunta: Texto de la pregunta a mostrar
		 * options.callback: Llamada de retorno a ejecutarse luego de pulsar el botón de envío
		 * options.content: Objeto con propiedades CSS para personalizar los elementos del cuadro
		 */
	){
		//Si no se ha recibido el objeto con las opciones de configuración, se aborta la ejecución
		if (!arguments.length || {}.toString.call(arguments[0]) !== "[object Object]") return;

		//Se almacenan la pregunta y la llamada de retorno
		Confirm.pregunta = String(options.pregunta);
		Confirm.callback = options.callback || null;
		Confirm.content = options.content || null;

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
		Confirm.back.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
		Confirm.back.style.top = 0;
		Confirm.back.style.left = 0;
		Confirm.back.style.margin = 0;
		Confirm.back.style.position = "fixed";		
		Confirm.back.style.display = "flex";
		Confirm.back.style.alignItems = "center";
		Confirm.back.style.justifyContent = "center";
		Confirm.back.style.transition = "all ease .15s";
		Confirm.back.style.zIndex = "9999";

		//Animación para mostrar el cuadro de confirmación
		Confirm.back.animate([{
			opacity: 0
		}, {
			opacity: 1
		}], {
			duration: 400
		});

		//Cuadro de la pregunta
		Confirm.front = document.createElement("div");
		Confirm.front.style.width = Confirm.width();
		Confirm.front.style.backgroundColor = Confirm.content?.front?.backgroundColor?.length ? Confirm.content.front.backgroundColor : "#FFFFEF";
		Confirm.front.style.boxShadow = "0 3px 10px rgb(0 0 0 / 0.2)";
		Confirm.front.style.border = Confirm.content?.front?.border?.length ? Confirm.content.front.border : "";
		Confirm.front.style.borderRadius = Confirm.content?.front?.borderRadius?.length ? Confirm.content.front.borderRadius : "5px";
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
		Confirm.question.style.color = Confirm.content?.question?.color?.length ? Confirm.content.question.color : "#1a1a1a";
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

		//Animación para mostrar el contenido central
		Confirm.front.animate([{
			transform: "scaleY(0)",
			opacity: 0
		}, {
			transform: "scaleY(1)",
			opacity: 1
		}], {
			duration: 400
		});

		//Se adhiere el fondo al documento
		document.body.appendChild(Confirm.back);

		//Se retiran las barras de desplazamiento del documento
		document.body.style.overflow = "hidden";

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
		//Se oculta el cuadro de confirmación con un efecto de animación
		Confirm.back.animate([{
			opacity: 1
		}, {
			opacity: 0
		}], {
			duration: 400
		});

		//Se oculta el contenido central
		Confirm.front.animate([{
			transform: "scaleY(1)",
			opacity: 1
		}, {
			transform: "scaleY(0)",
			opacity: 0
		}], {
			duration: 400
		});

		//Se oculta el cuadro de confirmación del todo (para evitar el problema del parpadeo)
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
		button.style.color = "#FFFFEF";
		button.style.fontWeight = "bold";
		button.style.cursor = "pointer";
		button.style.userSelect = "none";
		button.style.display = "inline-block";
		button.style.marginRight = "5px";
		button.style.paddingTop = "7.5px";
		button.style.paddingBottom = "7.5px";
		button.style.paddingRight = "20px";
		button.style.paddingLeft = "20px";
		button.style.border = ".1rem solid #FFFFEF";
		button.style.borderRadius = "5px";
		button.textContent = text;		

		button.addEventListener("mouseover", _ => button.style.backgroundColor = "#191919", false);
		button.addEventListener("mouseout", _ => button.style.backgroundColor = "#305165", false);		

		return button;
	}
};
