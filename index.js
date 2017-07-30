/**
 * Created by Denis on 29.07.2017.
 */


const myForm = {
	submit: (e,objValidateResult) => {
		// переменная objValidateResult - Объект,который является результатом вызова метода  валидации у формы (  myForm.validate ) : validate() => { isValid: Boolean, errorFields: String[] }
		function submitMethodForm(e,objValidateResult) {
			// Определяем переменные в коде
			let validObj = objValidateResult;
			console.log(validObj);
			let inputFio = document.getElementsByName('fio')[0];
			let inputEmail = document.getElementsByName('email')[0];
			let inputPhone = document.getElementsByName('phone')[0];
			let resultContainer = document.querySelector('#resultContainer');
			let buttonSubmit = document.querySelector('#submitButton');
			let requestResponse;


			// Удаляем у инпутов класс 'error',если такие есть (чистим 'старые' ошибки валидации)
			let allError = document.querySelectorAll('.error');
			for ( error of allError ) error.classList.remove('error');


			// Определяем функции,которые будут выполняться в зависимости от того,Какой придет ответ на ajax-запрос
			function requestResponseFunctionSuccess() {
				resultContainer.classList.remove('success','error','progress');
				resultContainer.classList.add('success');
				resultContainer.innerText = 'Success';
			}

			function requestResponseFunctionError() {
				resultContainer.classList.remove('success','error','progress');
				resultContainer.classList.add('error');
				resultContainer.innerText = requestResponse.reason;
			}

			function requestResponseFunctionProgress() {
				resultContainer.classList.remove('success','error','progress');
				resultContainer.classList.add('progress');
				setTimeout(callQuery1(), requestResponse.timeout)
			}



			// Блок формирование самого ajax-запроса
			function onLoad(xhr) {
				if ( xhr.status === 200 ) {
					requestResponse = JSON.parse(xhr.responseText);

					switch (requestResponse.status) {
						case "success":
							requestResponseFunctionSuccess();
							break;
						case "error":
							requestResponseFunctionError();
							break;
						case "progress":
							requestResponseFunctionProgress();
							break;
					}
				}
			}



			function callQuery() {
				let xhr = new XMLHttpRequest();
				let xhrAdress = document.querySelector('#myForm').getAttribute('action');
				xhr.open('GET', xhrAdress);
				xhr.send();
				xhr.addEventListener('load', adapterFunction);
				function adapterFunction() {
					onLoad(xhr)
				}
			}

			// Блок имитации ответа от сервера,чтобы не поднимать сам сервер.Start

			let tmpArr = ['{"status":"progress","timeout":5000}','{"status":"error","reason":321}','{"status":"success"}'];


			function callQuery1() {
				setTimeout(() => onLoad({status: 200, responseText:`${tmpArr[(Math.random() * 3 | 0)]}`}), 500)
			}

			// Блок имитации ответа от сервера.End



			// Блок проверки на отправку запроса.Если все валидации успешны,то отправляем запрос и делаем кнопку отправки запроса неактивной
			// Если валидация неуспешна,то выставляем класс 'error' тем инпутам,которые не прошли валидацию
			if ( !validObj.isValid ) {
				for ( let count = 0; count < validObj.errorFields.length; count++ ) {
					let errorName =  'input' + validObj.errorFields[count];
					if ( errorName === 'inputfio') inputFio.classList.add('error');
					if ( errorName === 'inputemail') inputEmail.classList.add('error');
					if ( errorName === 'inputphone') inputPhone.classList.add('error');
				}
			}
			else if ( validObj.isValid ) {
				buttonSubmit.setAttribute('disabled','=disabled');
				callQuery1();
			}
		}
		// Всё,что было выше - определение функции submitMethodForm,на строчке ниже мы ее вызываем.
		submitMethodForm(e,objValidateResult);
	},
	validate: (e) => {
		function validateInputs(e) {
			let inputFio = document.getElementsByName('fio')[0];
			let inputEmail = document.getElementsByName('email')[0];
			let inputPhone = document.getElementsByName('phone')[0];
			let nameFieldFio = inputFio.getAttribute('name');
			let nameFieldEmail = inputEmail.getAttribute('name');
			let nameFieldPhone = inputPhone.getAttribute('name');
			// Определяем функции для валидации каждого инпута

			// Фукнция проверки первого инпута ( ФИО )
			function checkValidFio() {
				let fioValidate = false;
				let value = inputFio.value;
				if (value.split(' ').length === 3) {
					fioValidate = true;
				}
				console.log('fioValidate = ', fioValidate);
				return fioValidate
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
				console.log('emailValidate = ', emailValidate);
				return emailValidate;
			}


			// Функция для проверки третьего инпута ( PHONE )
			function checkValidPhone() {
				let phoneValidate = false;
				let value = inputPhone.value;
				if ( value[0] === '+' && value[2] === '(' && value[6] === ')' && value[10] === '-' && value[13] === '-') {
					let validNum = parseInt(value.replace(/\D+/g,""));
					let strNumber = String(validNum);
					let arrNumber = strNumber.split('');
					let sumNumber = arrNumber.reduce(function (a,b) {
						return (+a) + (+b);
					}, 0);
					if ( sumNumber <= 30 ) {
						phoneValidate = true
					}
				}
				console.log('phoneValidate = ', phoneValidate);
				return phoneValidate;
			}

			// формируем объект,который должен вернуться в результате вызова метода validate
			let flagValid = true;
			let errorFields = [];
			if ( !(checkValidFio() && checkValidMail() && checkValidPhone() ) ) {
				flagValid = false;
				if ( !checkValidFio() )   errorFields.push(nameFieldFio);
				if ( !checkValidMail() )  errorFields.push(nameFieldEmail);
				if ( !checkValidPhone() ) errorFields.push(nameFieldPhone);
			}

			let validObj = {'isValid': flagValid, 'errorFields': errorFields};
			console.log(validObj);
			return validObj;
		}
		 return validateInputs(e);
	},
	getData: (e) => {
		function getObj() {
			function getValue(name) {
				return document.querySelector(`input[name="${name}"`).value;
			}
			 let dataObj = {
				'fio': getValue('fio'),
				'email': getValue('email'),
				'phone': getValue('phone'),
			};
			console.log(dataObj);
			return dataObj
		}
		return getObj();
	},

	setData: (data) => {
		function setValue(data) {
			let fioValue   = data['fio'];
			let emailValue = data['email'];
			let phoneValue   = data['phone'];

			function setValue(name,valueInput) {
				document.querySelector(`input[name="${name}"`).value = valueInput
			}
			setValue('fio',fioValue);
			setValue('email',emailValue);
			setValue('phone',phoneValue);
		}
		setValue(data)
	}
};

//Блок кода,отвечающий за взаимоедйствие с глобальным объектом myForm


// Блок 1 - блок метода submit
let submitButton = document.querySelector('#submitButton');
submitButton.addEventListener('click', submitMethodForm);

function submitMethodForm(e) {
	e.preventDefault();
	let objValidateResult = myForm.validate(e);
	myForm.submit(e,objValidateResult);
}


// Блок 2 - блок метода validate
let testButtonValidateMethod = document.querySelector('#testButtonValidateMethod');
testButtonValidateMethod.addEventListener('click', testValidateMethod);

function testValidateMethod(e) {
	e.preventDefault();
	myForm.validate();
}


/////////////////////////////////////////////////// TEST START ///////////////////////////////////////////////



/////////////////////////////////////////////////// TEST END///////////////////////////////////////////////







/////////////////////////////////////////////// LAB //////////////////////////////











