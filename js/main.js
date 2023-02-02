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
			style="background-image: url(${cat.img_link || "img/cats-default-2.jpeg"})" id="${cat.id}">
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

		// ====== Информация о коте popup =====

		cards[i].addEventListener('click', (e) => {
			const popupCard = document.querySelector('#popup-card');
			// console.log('cards[i] - id >>', cards[i].id)
			let kitty = catsData.filter((e) => { return e.id == cards[i].id })
			// console.log(kitty)

			if (!popupCard.classList.contains("popup_active")) {
				popupCard.classList.add("popup_active");

				popupCard.innerHTML = '';

				let popupCardInfoCat = `
				<div class="popup__container">
					<h2 class="popup__title">Информация о котике</h2>
					<button class="popup__close btn-cancel__infocat btn btn-reset btn-close">
						<i class="fa-solid fa-xmark"></i>
					</button>
					<div class="wrapper-info-cat">
						<div class="form-img">
							<img src="${kitty[0].img_link}" alt="cat">
						</div>
						<div class="cats-id">ID: ${kitty[0].id}</div>
						<div>Возраст: ${kitty[0].age}</div>
						<div>Имя: ${kitty[0].name}</div>
						<div>Рейтинг: ${kitty[0].rate}</div>
						<div>Описание: ${kitty[0].description}</div>
						<div>Любимчик: ${kitty[0].favourite}</div>
					</div>
					<div>
						<button class="delete-cat">удалить</button>
						<button>править</button>
					</div>
				</div>`;

				popupCard.innerHTML += popupCardInfoCat;

				//=====
				const btnDeleteCat = document.querySelector('.delete-cat')
				// console.log('кнопка удаления кота >>', btnDeleteCat)

				btnDeleteCat.addEventListener('click', function () {

					let resCatId = `${kitty[0].id}`
					api
						.delCat(resCatId)
						.then((res) => res.json())
						.then((data) => {
							// console.log(data.data)
							if (data.message === 'ok') {
								popupCard.classList.remove("popup_active")
								localStorage.clear()
								alert('вы удаляете кота')
								window.location.reload()
								api.getCat()
								getCats(api)


							};

						});

				})

			}

			const btnCancelinfoCat = document.querySelector('.btn-cancel__infocat');
			btnCancelinfoCat.addEventListener('click', () => {
				popupCard.classList.remove("popup_active")
			})

		});
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

/** Открываем форму входа */

const btnEnter = document.querySelector('#btn-enter');
const formLogin = document.querySelector('#form-login');
const closeFormLogin = document.querySelector('.btn-close_login')


btnEnter.addEventListener('click', function (evt) {
	// ищем ближайшего предка, подходящего под указанный CSS-селектор
	// и сохраняем его в переменную.
	const elPopup = formLogin.closest(".popup")

	if (!elPopup.classList.contains("popup_active")) {
		elPopup.classList.add("popup_active")
	}
})

/** закрываем форму входа */
closeFormLogin.addEventListener('click', function () {
	const elPopup = formLogin.closest(".popup")
	if (elPopup.classList.contains('popup_active')) {
		elPopup.classList.remove("popup_active")
	}
	formLogin.reset()
})


/** Работа с куки */

/** добавляем куки */

// const _isLogin = false;
const btnEntryFormLogin = document.querySelector('#btn-form-login');
const logOut = document.querySelector('.user__unlog');
let defaultHelloTxtEL = document.querySelector('.user__hello');
const defaultHello = 'Выполните вход';


defaultHelloTxtEL.innerHTML = defaultHello;
let userName = '';
let userEmail = '';

/** вешаем слушатель на форму входа по submit при нажатии кнопки войти */
formLogin.addEventListener('submit', function (evt) {
	evt.preventDefault()

	/** добавляем куки в переменные */
	userName = document.querySelector('input[name = "username"]').value;
	userEmail = document.querySelector('input[name = "email"]').value;

	document.cookie = `userName=${userName};max-age=86400;path=/`
	document.cookie = `userEmail=${userEmail};max-age=86400;path=/`

	/** проверяем установились ли куки с нужным значением */
	if (document.cookie.split(';').filter((item) => item.includes(`userName=${userName}`)).length) {
		console.log(`The cookie "reader" has ${userName} for value`)

		addBtnEl.classList.remove("visually-hidden")
		main.classList.add('pointer');
		helloUser(userName)

	}

})

/** выводим имя пользователя после авторизации */
function helloUser(name) {
	let helloUserName = document.querySelector('.user__hello');
	helloUserName.classList.remove('user__nolog');
	defaultHelloTxtEL.innerHTML = `Привет, ${name}`;

	btnEnter.classList.add('visually-hidden');
	logOut.classList.remove('visually-hidden');

	closeFormLogin.click()
	formLogin.reset()

}

/** удаляем имя пользователя после выхода */
function byeUser() {
	let helloUserName = document.querySelector('.user__hello');
	helloUserName.classList.add('user__nolog');
	defaultHelloTxtEL.innerHTML = defaultHello;
	btnEnter.classList.remove('visually-hidden');
	logOut.classList.add('visually-hidden');
	addBtnEl.classList.add("visually-hidden");
	main.classList.remove('pointer');

}

/** убираем кнопку вход и добавляем текст выход */
logOut.addEventListener('click', function () {

	document.cookie = `userName=;expires = ${new Date(0)};path=/`
	document.cookie = `userEmail=;expires = ${new Date(0)};path=/`

	if (document.cookie = 'userName' !== userName) {

		byeUser()
	}
	/** очищаем переменые в которых лежали значения передаваемые в куки */
	userName = '';
	userEmail = '';

})















