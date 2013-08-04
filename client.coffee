ws = new (require 'websocket').client()
url = 'amqp://fUsa0evs:EL1tZxzn1I77D5W_9m9p7Sr57h8CfEb7@brown-campion-5.bigwig.lshift.net:10648/wO-Fe7VUPSBf'
amqp = new (require 'amqp').createConnection { url: url}

close = (connection) ->
  console.log 'exiting gracefully'
  try
    connection.sendUTF JSON.stringify {action: 'remove', id: process.argv[2]}
    connection.close()
  catch e
    #
  process.exit(1)

amqp.on 'ready', () ->
  amqp.queue 'potato', {passive: false, durable: true}, (queue) ->
    console.log 'ready to play, connecting to the server'
    ws.connect 'ws://hotpotatofb.nodejitsu.com:', 'papacaliente-client'
    ws.on 'connect', (connection) ->
      connection.on 'message', (message) ->
        console.log 'connected, waiting for the potato'
        connection.sendUTF JSON.stringify {action: 'insert', id: process.argv[2]}
      queue.subscribe (m) ->
        m = m.data.toString()
        console.log 'got the potato! ->', m
        connection.sendUTF JSON.stringify {action: 'potato', id: process.argv[2]}
        setTimeout () ->
          amqp.publish 'potato', m
        , 300, amqp, m

      connection.on 'close', () ->
        close(connection)
      amqp.on 'error', () ->
        close(connection)
      process.on 'SIGINT', () ->
        close(connection)
