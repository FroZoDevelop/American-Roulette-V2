// Подключаем библиотеки
// -- express для сервера
// -- web3 для эфира
// -- body-parser для преобразования данных в JSON
var express = require( "express" );
var Web3 = require( "web3" );
// var sqlite3 = require( "sqlite3" );
var bodyToJson = require( "body-parser" );

// Создаём объекты express и web3
var server = express();
var web3 = new Web3();
/*var database = new sqlite3.Database( "database.db" );

database.exec( "create table users( login )" );
stmt = database.prepare( "insert into users( login ) values( ? )" );
stmt.run( "FroZo" );
stmt.finalize();*/

/*app.use(function (req, res, next) {
    var origins = [
        'http://localhost:3000',
    ];

    for(var i = 0; i < origins.length; i++){
        var origin = origins[i];

        if(req.headers.origin.indexOf(origin) > -1){
            res.header('Access-Control-Allow-Origin', req.headers.origin);
        }
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/

// Формирование ответа сервера
// -- tp: success/error
// -- message: сообщение
function getResponse( tp, message ){
  return { "type" : tp, "message" : message };
}

// Точка входа
function initialization(){
  // Подключаем преобразование данных в JSON
  // Подключаемся к провайдеру ethereum в локальной сети
  server.use( bodyToJson.json() );
  web3.setProvider( new web3.providers.HttpProvider( "http://localhost:8545" ) );
  
  // Обработчик POST запроса
  server.post( "/", function( req, res, next ){
    var response;
    
    console.log( req.body );
    
    // Проверяем, есть ли "event" в данных
    try{
      evnt = req.body[ "event" ];
      
      console.log( evnt );
      
      // На разный "event" разный ответ
      switch( evnt ){
        // Получить баланс пользователя в сети ethereum
        // через хэш аккаунта
        case "get balance":
          console.log( "get balance" );
          
          try{
            response = getResponse( "success", web3.eth.getBalance( req.body[ "account" ] ).c[0] );
          } catch( err ){ response = getResponse( "error", "Invalid account address" ); };
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
  server.listen( 8020, "192.168.10.208", function() {
    console.log( "Our server on 8020 port" );
  } );
}

 // Запускаем "точку входа"
initialization();