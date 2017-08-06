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
		let allInputsError = document.querySelectorAll('.error');
		for ( inputError of allInputsError) inputError.classList.remove('error');


		// Формируем ajax-запрос
		function sendQuery() {
			let xhr = new XMLHttpRequest();
			let xhrAdress = document.querySelector('#myForm').getAttribute('action');
			xhr.open('GET', xhrAdress);
			xhr.send();
			xhr.addEventListener('load', processResponse.bind(null, xhr));
		}

		// Для каждого ответа с сервера вызываем свой callback
		function processResponse(xhr) {
			if ( xhr.status === 200 ) {
				requestResponse = JSON.parse(xhr.responseText);

				switch (requestResponse.status) {
					case "success":
						requestResponseFunctionSuccess();
						break;
					case "error":
						requestResponseFunctionError(requestResponse.reason);
						break;
					case "progress":
						requestResponseFunctionProgress(requestResponse.timeout);
						break;
				}
			}
		}

		// Определяем функции,которые будут вызываться в зависимости от того, какой придет ответ на ajax-запрос
		function requestResponseFunctionSuccess() {
			containerInfoOutput.classList.remove('success','error','progress');
			containerInfoOutput.classList.add('success');
			containerInfoOutput.innerText = 'Success';
		}

		function requestResponseFunctionError(reason) {
			containerInfoOutput.classList.remove('success','error','progress');
			containerInfoOutput.classList.add('error');
			containerInfoOutput.innerText = reason;
		}

		function requestResponseFunctionProgress(timeout) {
			containerInfoOutput.classList.remove('success','error','progress');
			containerInfoOutput.classList.add('progress');
			setTimeout(sendQuery, timeout)
		}




		// Если все валидации были успешны, то отправляем запрос и делаем кнопку отправки запроса неактивной
		// Если валидация неуспешна, то выставляем класс 'error' тем инпутам,которые не прошли валидацию

		if ( !resultValidObj.isValid ) {
			for ( let count = 0, len = resultValidObj.errorFields.length; count < len; count++ ) {
				let errorName = resultValidObj.errorFields[count];
				if ( errorName === 'fio') inputFio.classList.add('error');
				if ( errorName === 'email') inputEmail.classList.add('error');
				if ( errorName === 'phone') inputPhone.classList.add('error');
			}
		}
		else if ( resultValidObj.isValid ) {
			buttonSubmit.setAttribute('disabled','disabled');
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

		// Определяем функции для валидации каждого инпута

		// Фукнция валидации первого инпута ( ФИО )
		function checkValidFio() {
			return inputFio.value.split(' ').length === 3
		}

		// Функция валидации второго инпута ( EMAIL )
		function checkValidMail() {
			let emailValidate = false;
			let validDomain = ['ya.ru','yandex.ru','yandex.ua','yandex.by','yandex.kz','yandex.com'];
			let value = inputEmail.value;
			let domain = value.split('@')[1];
			if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
				if ( validDomain.indexOf(domain) !== -1	 ) emailValidate = true;
			}
			return emailValidate;
		}


		// Функция валидации третьего инпута ( PHONE )
		function checkValidPhone() {
			let phoneValidate = false;
			let value = inputPhone.value;
			if ( value[0] === '+' && value[2] === '(' && value[6] === ')' && value[10] === '-' && value[13] === '-') {
				let validNum = parseInt(value.replace(/\D+/g, ""));
				let arrNumber = String(validNum).split('');
				let sumNumber = arrNumber.reduce(function (a, b) {
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
		let resultValidObj = {'isValid': flagGeneralValid, 'errorFields': errorFields};

		return resultValidObj;
	},

	getData: () => {
		function getValue(name) {
			return document.querySelector(`input[name="${name}"`).value;
		}
		let dataInputsObj = {
			'fio': getValue('fio'),
			'email': getValue('email'),
			'phone': getValue('phone'),
		};
		return dataInputsObj; // Возвращаем объект с данными формы
	},

	setData: (data) => {
		// Этот метод устанавливает полученные данные, как значение инпутов
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
}



