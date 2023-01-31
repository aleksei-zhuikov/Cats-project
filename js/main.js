let main = document.querySelector("main");

/** создаем экземпляр класса */
const api = new Api("aleksei-zhuikov");

/** Добавляем динамически котов через функцию  */
const updCards = function (data) {
	main.innerHTML = "";
	data.forEach(function (cat) {
		// console.log('cat from updCards =>', cat)
		if (cat.id) {
			let card = `<div class="${cat.favourite ? "card like" : "card"}"
			style="background-image: url(${cat.img_link || "img/cats-default-2.jpeg"})">
				<span>${cat.name}</span>
				</div>`;
			main.innerHTML += card;
			// console.log('cat =>', cat)
		}
	});

	/** Задаем ширину карточек */
	let cards = document.getElementsByClassName("card");
	for (let i = 0, cnt = cards.length; i < cnt; i++) {
		const width = cards[i].offsetWidth;
		cards[i].style.height = width * 0.6 + "px";
	}

};

/** Проверяем LocalStorage и Добавляем котов из api   */

let catsData = localStorage.getItem('cats');
catsData = catsData ? JSON.parse(catsData) : [];
const getCats = function (api, store) {

	if (!store.length) { // если массив котов в LS пустой
		api							// делаем запрос на сервер
			.getCats()
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				if (data.message === 'ok') {  // если запрос с сервиса статус 'ok'
					localStorage.setItem('cats', JSON.stringify(data.data)); // записываем в LS полученных котов по ключу cats
					catsData = [...data.data]; // и полученный массив копируем в нашу переменную
					updCards(data.data)
				}
			});
	} else {
		updCards(store)
	}
}
getCats(api, catsData);

/** переменные */
const addBtnEl = document.getElementById("add");
const popupEL = document.querySelector(".popup");
const closePopupFormEl = document.querySelector(".popup__close");
const btnFormAddCat = document.querySelector(".form__btn");
let form = document.querySelector('.form');

/** берем форму добавления котиков работаем с полем адрес фото кота */

form.img_link.addEventListener("change", (e) => {
	form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.img_link.addEventListener("input", (e) => {

	form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})

/** hendler на форме popup добавления котов */
form.addEventListener("submit", e => {
	e.preventDefault();
	let body = {};
	for (let i = 0; i < form.elements.length; i++) {
		let inp = form.elements[i];
		if (inp.type === "checkbox") {
			body[inp.name] = inp.checked;
		} else if (inp.name && inp.value) {
			if (inp.type === "number") {
				body[inp.name] = +inp.value;
			} else {
				body[inp.name] = inp.value;
			}
		}
	}
	console.log('result body >>', body)

	/** Рбота с Api при добавлении*/
	api.addCat(body)
		.then(res => res.json())
		.then(data => {
			if (data.message === "ok") {
				form.reset();
				closePopupFormEl.click();
				api.getCat(body.id)
					.then(res => res.json())
					.then(cat => {
						if (cat.message === "ok") {
							catsData.push(cat.data);
							localStorage.setItem("cats", JSON.stringify(catsData));

							getCats(api, catsData);
						} else {
							console.log(cat);
						}
					})
			} else {
				console.log(data);
				api.getIds()
					.then(r => r.json())
					.then(d => console.log(d));
			}
		})
});

/** Открываем закрываем popup */

addBtnEl.addEventListener("click", function (event) {
	event.preventDefault();

	if (!popupEL.classList.contains("popup_active")) {
		popupEL.classList.add("popup_active");
	}
});

closePopupFormEl.addEventListener("click", function (event) {
	popupEL.classList.remove("popup_active");

});












