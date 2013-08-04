// Generated by CoffeeScript 1.6.2
(function() {
  var amqp, close, url, ws;

  ws = new (require('websocket')).client();

  url = 'amqp://fUsa0evs:EL1tZxzn1I77D5W_9m9p7Sr57h8CfEb7@brown-campion-5.bigwig.lshift.net:10648/wO-Fe7VUPSBf';

  amqp = new (require('amqp')).createConnection({
    url: url
  });

  close = function(connection) {
    var e;

    console.log('exiting gracefully');
    try {
      connection.sendUTF(JSON.stringify({
        action: 'remove',
        id: process.argv[2]
      }));
      connection.close();
    } catch (_error) {
      e = _error;
    }
    return process.exit(1);
  };

  amqp.on('ready', function() {
    return amqp.queue('potato', {
      passive: false,
      durable: true
    }, function(queue) {
      console.log('ready to play, connecting to the server');
      ws.connect('ws://hotpotatofb.nodejitsu.com:', 'papacaliente-client');
      return ws.on('connect', function(connection) {
        connection.on('message', function(message) {
          console.log('connected, waiting for the potato');
          return connection.sendUTF(JSON.stringify({
            action: 'insert',
            id: process.argv[2]
          }));
        });
        queue.subscribe(function(m) {
          m = m.data.toString();
          console.log('got the potato! ->', m);
          connection.sendUTF(JSON.stringify({
            action: 'potato',
            id: process.argv[2]
          }));
          return setTimeout(function() {
            return amqp.publish('potato', m);
          }, 300, amqp, m);
        });
        connection.on('close', function() {
          return close(connection);
        });
        amqp.on('error', function() {
          return close(connection);
        });
        return process.on('SIGINT', function() {
          return close(connection);
        });
      });
    });
  });

}).call(this);
