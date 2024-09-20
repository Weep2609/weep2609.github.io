<?php
date_default_timezone_set('Asia/Kolkata'); //Change this if you need to

$date = date('Y-m-d H:i:s');


$ip_address = $_SERVER['REMOTE_ADDR'];

$user_agent = $_SERVER['HTTP_USER_AGENT'];

$endpoint = $_SERVER['REQUEST_URI'];

$log_message = "**Seems like you have a HIT**\n```Date: $date\t\nIP: $ip_address\t\nUser-Agent: $user_agent\t\nPath: $endpoint```\n";

// echo $log_message;
echo "<body><h1>Hit Me Harder :) </h1></body>";


$webhook_url = "https://discord.com/api/webhooks/10589949/E9uS3k9MxnI5CiIfmtmXHfornTObgZ_xl"; // replace with your webhook URL
$message = array("content" => "$log_message"); // the message you want to send

$ch = curl_init($webhook_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);

?>
