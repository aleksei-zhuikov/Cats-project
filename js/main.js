/** добавляем котов динамически */
let main = document.querySelector("main");

// cats.forEach(function (cat) {
// 	let card = `<div class="${cat.favourite ? "card like" : "card"
// 		}" style="background-image: url(${cat.img_link})">
// 	<span>${cat.name}</span>
// 	</div>`;
// 	main.innerHTML += card;
// });

/** Задаем ширину карточек */

// const cards = document.querySelectorAll(".card");

// for (let i = 0, cnt = cards.length; i < cnt; i++) {
// 	const width = cards[i].clientWidth;
// 	cards[i].style.height = width * 0.6 + "px";
// }

/** Делаем добавление котов через функцию  */

const updCards = function (data) {
	main.innerHTML = "";
	data.forEach(function (cat) {
		if (cat.id) {
			let card = `<div class="${cat.favourite ? "card like" : "card"}"
			style="background-image: url(${cat.img_link || "../../img/cats-default-2.jpeg"})">
				<span>${cat.name}</span>
				</div>`;
			main.innerHTML += card;
		}
	});

	let cards = document.getElementsByClassName("card");
	for (let i = 0, cnt = cards.length; i < cnt; i++) {
		const width = cards[i].offsetWidth;
		cards[i].style.height = width * 0.6 + "px";
	}

}
updCards(cats)




/** Открываем закрываем popup */

const addBtnEl = document.getElementById("add"),
	popupEL = document.querySelector(".popup"),
	closePopupFormEl = document.querySelector(".popup__close"),
	formBtnAddCat = document.querySelector(".form__btn");

addBtnEl.addEventListener("click", function (event) {
	event.preventDefault();

	if (!popupEL.classList.contains("popup_active")) {
		popupEL.classList.add("popup_active");
	}
});

closePopupFormEl.addEventListener("click", function (event) {
	popupEL.classList.remove("popup_active");
});


//

// const api = new Api("leksa"); // мое уникальное имя!! Использовать свое!
let form = document.querySelector('.form');
console.log(form)
form.img_link.addEventListener("change", (e) => {
	form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
form.img_link.addEventListener("input", (e) => {

	form.firstElementChild.style.backgroundImage = `url(${e.target.value})`
})
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
	console.log(body);
	// cats.push(body)
	console.log(cats)

})

