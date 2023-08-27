import amqp from 'amqplib'

async function rabbitmq() {
  try {
    const connection = await amqp.connect({
      host: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
    })
    const channel = await connection.createChannel()

    process.once('SIGINT', async () => {
      await channel.close()
      await connection.close()
    })

    const queue = 'hello'

    await channel.assertQueue(queue, { durable: false })
    await channel.consume(
      queue,
      (message) => {
        if (message) {
          console.log(
            " [x] Received '%s'",
            JSON.parse(message.content.toString())
          )
        }
      },
      { noAck: true }
    )

    console.log(' [*] Waiting for messages. To exit press CTRL+C')
  } catch (err) {
    console.warn(err)
  }
}

rabbitmq()
