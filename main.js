mapboxgl.accessToken = 'pk.eyJ1IjoiYnJhbmRwaW5ndSIsImEiOiJja2gyZHVsenYwMG1xMnZvNHlwaGplc3U4In0.RxD6xt-IussbHBnjQJ24RQ';
const spreadSheetId = '1lk6UaqJEHJf_u7CMvOvfFYCVSUyZRQxbrKAhV8i3OQs';
const url = `https://script.google.com/macros/s/AKfycbw_8waQ6ZMQDpjnSF_GsrdIaVncOVKBr9Ld23O2p3_PYncFaIvR/exec?spreadsheetId=${spreadSheetId}&sheet=marcadores`;

let marcadores = [];
let btnsFiltros = document.getElementsByClassName('filtro');
let cortina = document.getElementById('cortina');
let cartaInfo = document.getElementById('carta-info');
let imgCarta = document.getElementById('carta-info__img');
let btnRegresar = document.getElementById('btn-regresar');
let btnTodos = document.getElementById('todos');

const coloresMarcadores = [
	{ ods: 'Fin de la pobreza', img: 'assets/MApa ODS-03.png' },
	{ ods: 'Hambre cero', img: 'assets/MApa ODS-04.png' },
	{ ods: 'Salud y bienestar', img: 'assets/MApa ODS-05.png' },
	{ ods: 'Educación de calidad', img: 'assets/MApa ODS-06.png' },
	{ ods: 'Igualdad de género', img: 'assets/MApa ODS-07.png' },
	{ ods: 'Agua limpia y saneamiento', img: 'assets/MApa ODS-08.png' },
	{ ods: 'Energía asequible y no contaminante', img: 'assets/MApa ODS-09.png' },
	{ ods: 'Trabajo decente y crecimiento económico', img: 'assets/MApa ODS-10.png' },
	{ ods: 'Industria, inovación e infraestructura', img: 'assets/MApa ODS-11.png' },
	{ ods: 'Reducción de las desigualdades', img: 'assets/MApa ODS-12.png' },
	{ ods: 'Ciudades y comunidades sostenibles', img: 'assets/MApa ODS-13.png' },
	{ ods: 'Producción, consumo y responsabilidades', img: 'assets/MApa ODS-14.png' },
	{ ods: 'Acción por el clima', img: 'assets/MApa ODS-15.png' },
	{ ods: 'Vida submarina', img: 'assets/MApa ODS-16.png' },
	{ ods: 'Vida de ecosistemas terrestres', img: 'assets/MApa ODS-17.png' },
	{ ods: 'Paz, justicia e instituciones sólidas', img: 'assets/MApa ODS-18.png' },
	{ ods: 'Alianzas para presentar los objetivos', img: 'assets/MApa ODS-19.png' }];

let map = new mapboxgl.Map({
	// configuracion del mapa
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-99.104542, 19.628777],
	zoom: 15
});
map.addControl(new mapboxgl.NavigationControl(), 'top-right');


for (let btn of btnsFiltros) {
	btn.addEventListener('click', () => {
		let btnId = btn.id.substring(1, 3);
		let texto = coloresMarcadores[btnId].ods;
		mostrarTodosLosMarcadores(texto);

		cortina.style.animation = 'slide .7s ease 1';
		cortina.style.top = '-110%';

		cartaInfo.style.animation = 'aparecer 1s linear 1';
		cartaInfo.style.opacity = '1';

		imgCarta.setAttribute('src', btn.getAttribute('src'));
	});
}

btnRegresar.addEventListener('click', () => {
	cortina.style.animation = 'slide2 .7s ease-out 1';
	cortina.style.top = '0%';

	cartaInfo.style.animation = 'desAparecer 1s linear 1';
	cartaInfo.style.opacity = '0';
	eliminarTodosMarcadores();
});

const agregarMarcador = (cord1, cord2, ods, fecha) => {
	let element = document.createElement('div');
	let puntero;
	element.className = 'marker';
	for (let c of coloresMarcadores) {
		if (c.ods == ods) {
			puntero = c.img;
		}
	}
	element.style.background = `url('${puntero}')`;
	element.style.backgroundSize = 'cover';
	marcadores.push(element);

	let marker = new mapboxgl.Marker(element).setLngLat({
		lng: cord1,
		lat: cord2
	});

	let pop = new mapboxgl.Popup({
		closeButton: false,
		className: 'popUp',
		maxWidth: '500px'
	}).setHTML(`<h5>${ods}</h5><p>fecha: ${fecha}<br>dercripcion: </p>`);

	marker.setPopup(pop) // add popup
	marker.addTo(map);
}

const eliminarTodosMarcadores = () => {
	for (let element of marcadores) {
		let padre = element.parentNode;
		padre.removeChild(element);
	}
	marcadores = [];
}

const mostrarTodosLosMarcadores = (filtro) => {
	fetch(url)
		.then(res => {
			return res.json()
		})
		.then(data => {
			for (let dato in data) {
				if (filtro == undefined) {
					agregarMarcador(data[dato]["Latitud"], data[dato]["Longitud"], data[dato]["ODS"], data[dato]["fecha"]);
				} else if (data[dato]["ODS"] == filtro) {
					agregarMarcador(data[dato]["Latitud"], data[dato]["Longitud"], data[dato]["ODS"], data[dato]["fecha"]);
				}
			}
		});
}

btnTodos.addEventListener('click', () => {
	mostrarTodosLosMarcadores();

	cortina.style.animation = 'slide .7s ease 1';
	cortina.style.top = '-110%';

	cartaInfo.style.animation = 'aparecer 1s linear 1';
	cartaInfo.style.opacity = '1';

	imgCarta.setAttribute('src', 'S-SDG-logo-with-UN-Emblem_Square_WEB_transparent-800x635.png');
});