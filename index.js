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
		let resultContainer = document.querySelector('#resultContainer');
		let buttonSubmit = document.querySelector('#submitButton');


		// Удаляем у инпутов класс 'error',если такие есть (чистим 'старые' ошибки валидации)
		let allError = document.querySelectorAll('.error');
		allError.forEach((element) => element.classList.remove('error') );


		// Блок формирование самого ajax-запроса
		function callQuery() {
			let xhr = new XMLHttpRequest();
			let xhrAdress = document.querySelector('#myForm').getAttribute('action');
			xhr.open('GET', xhrAdress);
			xhr.send();
			xhr.addEventListener('load', onLoad.bind(null, xhr));
		}

		function onLoad(xhr) {
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

		// Определяем функции,которые будут выполняться в зависимости от того,Какой придет ответ на ajax-запрос
		function requestResponseFunctionSuccess() {
			resultContainer.classList.remove('success','error','progress');
			resultContainer.classList.add('success');
			resultContainer.innerText = 'Success';
		}

		function requestResponseFunctionError(reason) {
			resultContainer.classList.remove('success','error','progress');
			resultContainer.classList.add('error');
			resultContainer.innerText = reason;
		}

		function requestResponseFunctionProgress(timeout) {
			resultContainer.classList.remove('success','error','progress');
			resultContainer.classList.add('progress');
			setTimeout(callQuery, timeout)
		}


		// function callQuery() {
		// 	let requestAdress = document.querySelector('#myForm').getAttribute('action');
		// 	let querySettings = {
		// 		method: 'GET',
		// 		credentials: 'include'
		// 	};
		// 	fetch(requestAdress, querySettings).then( function (response) {
		// 		return response.json();
		// 	}).then(requestComplete);
		// }
		//
		//
		// // Блок формирование самого ajax-запроса
		// function requestComplete(response) {
		// 	if ( response.status === 200 ) {
		// 		requestResponse = response.responseText;
		//
		// 		switch (requestResponse.status) {
		// 			case "success":
		// 				requestResponseFunctionSuccess();
		// 				break;
		// 			case "error":
		// 				requestResponseFunctionError(requestResponse.reason);
		// 				break;
		// 			case "progress":
		// 				requestResponseFunctionProgress(requestResponse.timeout);
		// 				break;
		// 		}
		// 	}
		// }

		// Блок проверки на отправку запроса.Если все валидации были успешны,то отправляем запрос и делаем кнопку отправки запроса неактивной
		// Если валидация неуспешна,то выставляем класс 'error' тем инпутам,которые не прошли валидацию

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
			callQuery();
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
		// Фукнция проверки первого инпута ( ФИО )
		function checkValidFio() {
			return inputFio.value.split(' ').length === 3
		}

		// Функция для проверки второго инпута ( EMAIL )
		function checkValidMail() {
			let emailValidate = false;
			let validDomain = ['ya.ru','yandex.ru','yandex.ua','yandex.by','yandex.kz','yandex.com'];
			let value = inputEmail.value;
			let domain = value.split('@')[1];
			if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
				if ( validDomain.indexOf(domain) !== -1	 ) {
					emailValidate = true;
				}
			}
			return emailValidate;
		}


		// Функция для проверки третьего инпута ( PHONE )
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

		console.log('1');
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
		console.log(dataInputsObj);
		return dataInputsObj;
	},

	setData: (data) => {
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


//Блок кода,отвечающий за взаимоедйствие с глобальным объектом myForm
let submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', callSubmitMethod);

function callSubmitMethod(event) {
	event.preventDefault();
	myForm.submit();
	myForm.getData();
	myForm.setData({'fio':'123','email':'321','phone':'+7'})
}



