<?php
//Autor: edwin velasquez jimenez
//validacion del lado del servidor con la llave secreta
//print_r($_POST);
$cu = curl_init();
$valores = array(
    'secret' => 'keySecret',
    'response' => $_POST['response']
);

curl_setopt($cu, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
curl_setopt($cu, CURLOPT_POST, 1);
curl_setopt($cu, CURLOPT_POSTFIELDS, http_build_query($valores));
curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($cu);

curl_close($cu);

echo $response;
?>