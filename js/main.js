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

/** Задаем ширину карточек */

const cards = document.querySelectorAll(".card");

for (let i = 0, cnt = cards.length; i < cnt; i++) {
	const width = cards[i].clientWidth;
	cards[i].style.height = width * 0.6 + "px";
}
