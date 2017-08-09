/**
 * Created by Denis on 29.07.2017.
 */


const myForm = {
	submit: () => {
		// Определяем переменные в коде
		let resultValidObj = myForm.validate();
		let inputFio = document.querySelector('input[name="fio"');
		let inputEmail = document.querySelector('input[name="email"');
		let inputPhone = document.querySelector('input[name="phone"');
		let containerInfoOutput = document.querySelector('#resultContainer');
		let buttonSubmit = document.querySelector('#submitButton');


		// Удаляем у всех инпутов класс 'error' (чистим 'старые' ошибки валидации)
		let allInputsErrors = document.querySelectorAll('.error');
		for (inputError of allInputsErrors) {
			inputError.classList.remove('error');
		}


		// Формируем запрос,который будем отправлять
		function sendQuery() {
			let requestAdress = document.querySelector('#myForm').getAttribute('action');
			fetch(requestAdress)
				.then((response) => {
					if (response.status === 200) {
						return response.json()
					}
					throw new Error('Network response was not ok.')
				})
				.then( processResponse )
				.catch((err) => console.error(err.message))
		}



		// Для каждого ответа с сервера вызываем свой callback
		function processResponse(response) {
			switch (response.status) {
				case "success":
					requestResponseFunctionSuccess();
					break;
				case "error":
					requestResponseFunctionError(response.reason);
					break;
				case "progress":
					requestResponseFunctionProgress(response.timeout);
					break;
			}
		}


		// Функция,которая сначала удаляет все классы,а затем выставляет нужный
		function updateClassListContainer(pluginClass) {
			containerInfoOutput.classList.remove('success', 'error', 'progress');
			containerInfoOutput.classList.add(pluginClass);
		}

		// Определяем функции,которые будут вызываться в зависимости от того, какой придет ответ на ajax-запрос
		function requestResponseFunctionSuccess() {
			updateClassListContainer('success');
			containerInfoOutput.innerText = 'Success';
		}

		function requestResponseFunctionError(reason) {
			updateClassListContainer('error');
			containerInfoOutput.innerText = reason;
		}

		function requestResponseFunctionProgress(timeout) {
			updateClassListContainer('progress');
			setTimeout(sendQuery, timeout)
		}



		// Если валидация неуспешна, то выставляем класс 'error' тем инпутам,которые не прошли валидацию
		// Если все валидации были успешны, то отправляем запрос и делаем кнопку отправки запроса неактивной
		if ( !resultValidObj.isValid ) {
			for ( let count = 0, len = resultValidObj.errorFields.length; count < len; count++ ) {
				let errorName = resultValidObj.errorFields[count];
				if ( errorName === 'fio') inputFio.classList.add('error');
				if ( errorName === 'email') inputEmail.classList.add('error');
				if ( errorName === 'phone') inputPhone.classList.add('error');
			}
		}
		else if ( resultValidObj.isValid ) {
			buttonSubmit.setAttribute('disabled', 'disabled');
			sendQuery();
		}
	},

	validate:  () => {
		let inputFio = document.querySelector('input[name="fio"');
		let inputEmail = document.querySelector('input[name="email"');
		let inputPhone = document.querySelector('input[name="phone"');
		let nameFieldFio = inputFio.getAttribute('name');
		let nameFieldEmail = inputEmail.getAttribute('name');
		let nameFieldPhone = inputPhone.getAttribute('name');


		// Фукнция валидации первого инпута ( ФИО )
		function checkValidFio() {
			return (/^\s*\w+\s+\w+\s+\w+\s*$/gi.test(inputFio.value));
		}

		// Функция валидации второго инпута ( EMAIL )
		function checkValidMail() {
			let emailValidate = false;
			let validDomain = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
			let value = inputEmail.value;
			if (/^\s*\w+([\.-]?\w+)*@{1}\w+([\.-]?\w+)*(\.\w{2,3})+\s*$/gi.test(value)) {
				let domain = value.split('@')[1];
				if ( validDomain.indexOf(domain) !== -1	 ) emailValidate = true;
			}
			return emailValidate;
		}


		// Функция валидации третьего инпута ( PHONE )
		function checkValidPhone() {
			let phoneValidate = false;
			let value = inputPhone.value;
			if (/^\s*\+{1}7{1}\({1}\d{3}\){1}\d{3}\-{1}\d{2}\-{1}\d{2}\s*$/gi.test(value)) {
				let validNum = value.replace(/\D+/g, "");
				let arrNumber = validNum.split('');
				let sumNumber = arrNumber.reduce((a, b) => {
					return (+a) + (+b);
				}, 0);
				if ( sumNumber <= 30 ) phoneValidate = true
			}
			return phoneValidate;
		}


		// формируем объект,который должен вернуться в результате вызова метода validate
		let flagGeneralValid = true;
		let errorFields = [];
		if ( !(checkValidFio() && checkValidMail() && checkValidPhone() ) ) {
			flagGeneralValid = false;
			if ( !checkValidFio() )   errorFields.push(nameFieldFio);
			if ( !checkValidMail() )  errorFields.push(nameFieldEmail);
			if ( !checkValidPhone() ) errorFields.push(nameFieldPhone);
		}
		return  {'isValid': flagGeneralValid, 'errorFields': errorFields};
	},

	getData: () => {
		function getValue(name) {
			return document.querySelector(`input[name="${name}"`).value;
		}
		// Возвращаем объект с данными формы
		return dataInputsObj = {
			'fio': getValue('fio'),
			'email': getValue('email'),
			'phone': getValue('phone'),
		};
	},

	setData: (data) => {
		// Этот метод устанавливает полученные данные, как значения инпутов
		let fioInputValue = data['fio'];
		let emailInputValue = data['email'];
		let phoneInputValue = data['phone'];

		function setValue(name,valueInput) {
			document.querySelector(`input[name="${name}"`).value = valueInput
		}
		setValue('fio', fioInputValue);
		setValue('email', emailInputValue);
		setValue('phone', phoneInputValue);
	}
};


//Описываем взаимодействие с глобальным объектом myForm
let submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', callSubmitMethod);

function callSubmitMethod(event) {
	event.preventDefault();
	myForm.submit();
	myForm.getData();
	myForm.setData({'fio':53, 'email': 123, 'phone': '+7(111)222-33-11'})
}
