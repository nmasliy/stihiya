<?php
$config = [
    'mailerName' => '', // Название в заголовке письма
    'mailerUsername' => '', // Логин почты
    'mailerPassword' => '', // Пароль почты 
    'mailerTo' => 'acoustics@fakultet.io', // Кому отправляем
    'mailerHost' => 'smtp.mail.ru',
    'mailerPort' => 465,
    'mailerSMTPSecure' => 'ssl'
];

require_once './PHPMailer/PHPMailerAutoload.php';

if($_POST['email'])
{  
    if($_FILES['audio']['type'] != 'audio/wav')
        die(json_decode(['error' => 'Ошибка! Неверный формат файла, файл должен быть в формате WAV.']));

    $upload_dir = './upload-wav';
    
    if(!is_dir($upload_dir)) mkdir($upload_dir, 0777);

    $done_files = [];
    $i = 0;
    foreach($_FILES as $file){
        if($i == 0)
        {
            $file_name = rand(1, 99999999999999).cyrillic_translit($file['name']);

            if(move_uploaded_file($file['tmp_name'], "$upload_dir/$file_name"))
            {
                $done_files[] = ["$upload_dir/$file_name", "$file_name"];
            }
            $i++;
        } 
        else 
        {
            die(json_decode(['error' => 'Ошибка! Отправлено может быть не более 1 аудиофайла формата WAV.']));
        }
    }

    $mailer = new Phpmailer();
    $mailer->IsHTML(true);
    $mailer->SMTPDebug = 0;
    $mailer->CharSet = "utf-8";
    $mailer->IsSMTP();
    $mailer->Host = $config['mailerHost'];
    $mailer->Port = $config['mailerPort'];
    $mailer->SMTPSecure = $config['mailerSMTPSecure'];
    $mailer->SMTPAuth = true;
    $mailer->Name = $config['mailerName'];
    $mailer->Username = $config['mailerUsername'];
    $mailer->Password = $config['mailerPassword'];
    $mailer->From = $mailer->Username;
    $mailer->FromName = $mailer->Name;
    $mailer->Sender = $mailer->Username;
    $mailer->addAttachment($done_files[0][0], $done_files[0][1]);
    $mailer->AddAddress($config['mailerTo']);
    $mailer->Subject = 'Новая заявка на участие в конкурсе от '.$_POST['name'];
    $mailer->Body = $_POST['name']." оставил заявку на участие в конкурсе с описанием: ".$_POST['desc'].", его почта: ".$_POST['email'];
    $mailer->Send();
    $mailer->clearAddresses();
    $mailer->clearAttachments();

    die('<script> window.onload = function() { alert("Заявка успешно оставлена."); location.href = "/"; }</script>');
}


function cyrillic_translit($title){
    $iso9_table = [
        'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Ѓ' => 'G',
        'Ґ' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'YO', 'Є' => 'YE',
        'Ж' => 'ZH', 'З' => 'Z', 'Ѕ' => 'Z', 'И' => 'I', 'Й' => 'J',
        'Ј' => 'J', 'І' => 'I', 'Ї' => 'YI', 'К' => 'K', 'Ќ' => 'K',
        'Л' => 'L', 'Љ' => 'L', 'М' => 'M', 'Н' => 'N', 'Њ' => 'N',
        'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
        'У' => 'U', 'Ў' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'TS',
        'Ч' => 'CH', 'Џ' => 'DH', 'Ш' => 'SH', 'Щ' => 'SHH', 'Ъ' => '',
        'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'YU', 'Я' => 'YA',
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'ѓ' => 'g',
        'ґ' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'є' => 'ye',
        'ж' => 'zh', 'з' => 'z', 'ѕ' => 'z', 'и' => 'i', 'й' => 'j',
        'ј' => 'j', 'і' => 'i', 'ї' => 'yi', 'к' => 'k', 'ќ' => 'k',
        'л' => 'l', 'љ' => 'l', 'м' => 'm', 'н' => 'n', 'њ' => 'n',
        'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
        'у' => 'u', 'ў' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'ts',
        'ч' => 'ch', 'џ' => 'dh', 'ш' => 'sh', 'щ' => 'shh', 'ъ' => '',
        'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu', 'я' => 'ya'
    ];

    $name = strtr($title, $iso9_table);
    $name = preg_replace('~[^A-Za-z0-9\'_\-\.]~', '-', $name);
    $name = preg_replace('~\-+~', '-', $name);
    $name = preg_replace('~^-+|-+$~', '', $name);

    return $name;
}