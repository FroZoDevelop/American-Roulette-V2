// Подключаем библиотеки
// -- express для сервера
// -- web3 для эфира
// -- body-parser для преобразования данных в JSON
var express = require( "express" );
var Web3 = require( "web3" );
var bodyToJson = require( "body-parser" );

// Создаём объекты express и web3
var server = express();
var web3 = new Web3();

var contract = require( "./contract.js" );
var TrashCoin = web3.eth.contract( contract.ABI ).at( contract.address );

// Формирование ответа сервера
// -- tp: success/error
// -- message: сообщение
function getResponse( tp, message ){
  return { "event" : tp, "message" : message };
}

// Точка входа
function initialization(){
  // Подключаем преобразование данных в JSON
  // Подключаемся к провайдеру ethereum в локальной сети
  server.use( bodyToJson.json() );
  server.use( bodyToJson.urlencoded( {
    extended : true
  } ) );
  
  web3.setProvider( new web3.providers.HttpProvider( "http://localhost:8545" ) );
  
  server.use(function (req, res, next) {
    /*var origins = [
        'http://localhost:3000'
    ];

    for(var i = 0; i < origins.length; i++){
        var origin = origins[i];

        if(req.headers.origin.indexOf(origin) > -1){
            res.header('Access-Control-Allow-Origin', req.headers.origin);
        }
    }*/
    
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  } );
  
  // Обработчик POST запроса
  server.post( "/", function( req, res, next ){
    var fl, response;
    
    fl = true;
    
    // Проверяем, есть ли "event" в данных
    try{
      evnt = req.body[ "event" ];
      
      // На разный "event" разный ответ
      switch( evnt ){
        // Получить баланс пользователя в сети ethereum
        // через хэш аккаунта
        case "get balance":
          console.log( req.body );
          
          try{
            web3.eth.getBalance( req.body[ "account" ] ).c[0];
            
            try{
              web3.personal.unlockAccount( req.body[ "account" ], req.body[ "password" ], 1000 );
              // response = getResponse( "success", TrashCoin.tokenName );
              response = getResponse( "Ты", "Приёмный" );
            } catch( err ) { response = getResponse( "error", "Invalid account password" ); }
          } catch( err ){ response = getResponse( "error", "Invalid account address" ); }
        break;
        
        // Если в "event" не содержится ничего, что можно обработать
        // отправляем "undefined event"
        default: response = getResponse( "error", "undefined event" ); break;
      }
      // Если "event" в данных нет, отправляем пустой ответ
    } catch( err ){ response = getResponse( "void", "void" ); };
    
    // Переводим ответ в JSON и отправляем
    res.end( JSON.stringify( response ) );
  } );
  
  // Запускаем сервер
  server.listen( 8020, function() {
    console.log( "Our server on 8020 port" );
  } );
}

 // Запускаем "точку входа"
initialization();