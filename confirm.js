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
 * @param		options			Plain Object
 */

"use strict";

const Confirm = {
	state: true, //Comodín que controla la creación de cuadros de confirmación
	go: options => {
		/*** OPCIONES DE CONFIGURACIÓN ***
		 * 
		 * options.pregunta: Texto de la pregunta a mostrar
		 * options.callback: Llamada de retorno a ejecutarse luego de pulsar el botón de envío
		 * options.content: Objeto con propiedades CSS para personalizar los elementos del cuadro
		 */

		//Si hay otro cuadro mostrándose, se le avisa al usuario que tiene que resolverlo
		if (!Confirm.state){
			Notification.msg("Resuelva la pregunta pendiente");
			return;
		}

		//Si no se ha recibido el objeto con las opciones de configuración, se aborta la ejecución
		if (!options || {}.toString.call(options) !== "[object Object]"){
			throw new Error("Tiene que añadir las opciones de configuración del cuadro");
		}

		//Se almacenan la pregunta y la llamada de retorno
		Confirm.pregunta = options.pregunta;
		Confirm.callback = options.callback && {}.toString.call(options.callback) === "[object Function]" ? options.callback : null;
		Confirm.content = options.content || null;

		//Se muestra el cuadro
		Confirm.show();
	},

	show: _ => {
		//Se almacena el valor actual de la propiedad overflow del document
		Confirm.overflow = getComputedStyle(document.body).overflow;

		//Fondo
		Confirm.createBack();

		//Cuadro de la pregunta
		Confirm.createFront();

		//Botón SÍ
		Confirm.yes = Confirm.buttons("Sí");

		//Botón NO
		Confirm.no = Confirm.buttons("No");

		//La pregunta
		Confirm.createQuestion();

		//Contenedor de los botones
		Confirm.createContainer();

		//Se adhieren los botones al contenedor
		Confirm.container.append(Confirm.yes, Confirm.no);

		//Se adhiere la pregunta y el contenedor de botones al cuadro de confirmación
		Confirm.front.append(Confirm.question, Confirm.container);

		//Se adhiere el cuadro de confirmación al fondo
		Confirm.back.appendChild(Confirm.front);

		//Animación para mostrar el contenido central
		Confirm.animateFront();

		//Se adhiere el fondo al documento
		document.body.appendChild(Confirm.back);

		//Se retiran las barras de desplazamiento del documento
		document.body.style.overflow = "hidden";

		//Se cambia el valor del comodín que verifica la existencia de un cuadro sin resolver
		Confirm.state = false;

		//Configuración de eventos
		Confirm.events();
	},

	events: _ => {
		//Si se pulsa el botón SÍ, se ocultan el fondo y la pregunta y se ejecuta la llamada de retorno
		Confirm.yes.addEventListener("click", _ => {
			Confirm.hide();
			if (Confirm.callback) Confirm.callback();
			else return true;
		}, false);

		//Si se pulsa el botón NO, se cierran el fondo oscuro y el cuadro de confirmación
		Confirm.no.addEventListener("click", Confirm.hide, false);

		//Al girar el dispositivo, cambian las dimensiones del fondo
		window.addEventListener("orientationchange", Confirm.resize, false);
		window.addEventListener("resize", Confirm.resize, false);		
	},

	createBack: _ => {
		Confirm.back = document.createElement("div");
		Confirm.back.style = `
			width: ${window.innerWidth}px;
			height: ${window.innerHeight}px;
			background-color: rgba(0, 0, 0, .6);
			top: 0;
			left: 0;
			margin: 0;
			position: fixed;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all ease .15s;
			z-index: 9999;
		`;

		//Animación para mostrar el cuadro de confirmación
		Confirm.back.animate([{
			opacity: 0
		}, {
			opacity: 1
		}], {
			duration: 400
		});
	},

	createFront: _ => {
		Confirm.front = document.createElement("div");
		Confirm.front.style = `
			width: ${Confirm.width()};
			background-color: ${Confirm.content?.front?.backgroundColor ?? "#FFFFEF"};
			box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
			border: ${Confirm.content?.front?.border ?? 0};
			border-radius: ${Confirm.content?.front?.borderRadius ?? "5px"};
			padding: 1% 2.5%;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			flex-direction: column;
			transition: all ease .15s;
		`;
	},

	animateFront: _ => {
		Confirm.front.animate([{
			transform: "scaleY(0)",
			opacity: 0
		}, {
			transform: "scaleY(1)",
			opacity: 1
		}], {
			duration: 400
		});
	},

	createQuestion: _ => {
		Confirm.question = document.createElement("span");
		Confirm.question.style = `
			display: block;
			margin: 0 auto;
			margin-bottom: 1%;
			user-select: none;
			font-weight: bold;
			color: ${Confirm.content?.question?.color ?? "#1a1a1a"};
		`;
		Confirm.question.textContent = Confirm.pregunta;
	},

	createContainer: _ => {
		Confirm.container = document.createElement("p");
		Confirm.container.style = `
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 1px;
		`;
	},

	hide: _ => {
		//Se oculta el cuadro de confirmación con un efecto de animación
		Confirm.back.animate([{
			opacity: 1
		}, {
			opacity: 0
		}], {
			duration: 400,
			fill: "forwards"
		});

		//Se oculta el contenido central
		Confirm.front.animate([{
			transform: "scaleY(1)",
			opacity: 1
		}, {
			transform: "scaleY(0)",
			opacity: 0
		}], {
			duration: 400,
			fill: "forwards"
		});

		//Se devuelve al documento sus barras de desplazamiento
		document.body.style.overflow = Confirm.overflow;

		//Se vuelve a permitir la creación de un nuevo cuadro
		Confirm.state = true;

		//Luego de 200 milésimas de segundo, se eliminan el fondo y su contenido y el valor del comodín vuelve a true
		setTimeout(_ => {
			Confirm.back && Confirm.back.remove();				
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
		const button = document.createElement("b");

		button.style = `
			background-color: #305165;
			color: #FFFFEF;
			font-weight: bold;
			cursor: pointer;
			user-select: none;
			display: inline-block;
			margin-right: 5px;
			padding: 7.5px 20px;
			border: .1rem solid #FFFFEF;
			border-radius: 5px;
		`;
		button.textContent = text;		

		button.addEventListener("mouseover", _ => button.style.backgroundColor = "#191919", false);
		button.addEventListener("mouseout", _ => button.style.backgroundColor = "#305165", false);		

		return button;
	}
};