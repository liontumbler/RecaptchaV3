
/**
 * facil implementacion recaptchaV3
 * validarRV3L() valida recaptcha desde cliente (puede dar error de cors)
 * validarRV3S() valida recaptcha desde servidor con un archivo php (mejor opcion)
 * Autor: edwin velasquez jimenez
*/

function RecaptchaV3(element, keyPublic) {
    //action: "submitCaptchaV3"
    //challenge_ts: "2022-06-09T12:50:07Z"
    //hostname: "localhost"

    let script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=' + keyPublic

    element.append(script);
    
    this.validarRV3L = function(fn, keySecret) {
        grecaptcha.ready(function () {
            grecaptcha.execute(keyPublic, {
                action: 'submitCaptchaV3'
            }).then(function (token) {
                //console.log(token);

                let datos = new FormData();
                datos.append('secret', keySecret);
                datos.append('response', token);

                fetch('https://www.google.com/recaptcha/api/siteverify', {
                    method: 'POST',
                    body: datos,
                    //mode: 'no-cors',
                    mode: 'cors',
                    headers: {
                        'Origin': 'http://localhost'
                    },
                }).then(data => {
                    //console.log('then1', data);
                    if(!data.ok)
                        return data.ok;

                    return data.json();
                }).then(data => {
                    if(data){
                        //let resRecaptcha = JSON.parse(data);
                        let resRecaptcha = data;

                        let validador = validarResRecaptcha(resRecaptcha);

                        fn(validador);
                    }else{
                        console.error('errorRecaptcha', 'por permisos de CORS, servidor google no response');
                        fn(false);
                    }
                }).catch(error => {
                    console.error('errorRecaptcha', error);
                    fn(false);
                });
            });
        });
    }

    this.validarRV3S = function(fn, rutaServidor = 'scaptcha.php') {
        grecaptcha.ready(function () {
            grecaptcha.execute(keyPublic, {
                action: 'submitCaptchaV3'
            }).then(function (token) {
                //console.log(token);
                let datos = new FormData();
                datos.append('response', token);

                fetch(rutaServidor, {
                    method: 'POST',
                    body: datos,
                }).then(data => {
                    //console.log('then1', data);
                    if(!data.ok)
                        return data.ok;

                    return data.json();
                }).then(data => {
                    if(data){
                        let resRecaptcha = data;

                        let validador = validarResRecaptcha(resRecaptcha);

                        fn(validador);
                    }else{
                        console.error('errorRecaptcha', 'servidor google no response');
                        fn(false);
                    }
                }).catch(error => {
                    console.error('errorRecaptcha', error);
                    fn(false);
                });
            });
        });
    }

    function validarResRecaptcha(res) {
        let validador = false;
        if (res.score >= 0.5 && res.success)
            validador = true;

        return validador;
    }
}