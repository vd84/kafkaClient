const express = require("express");
const app = express();
const port = 3000;

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["my-cluster-kafka-bootstrap:9092"],
});

const producer = kafka.producer();

const start = async () => {
  await producer.connect();
  await producer.send({
    topic: "my-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });

  // const consumer = kafka.consumer({ groupId: "test-group" });

  // // await consumer.connect();
  // // await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  // // await consumer.run({
  // //   eachMessage: async ({ topic, partition, message }) => {
  // //     console.log({
  // //       value: message.value.toString(),
  // //     });
  // //   },
  // // });
  await producer.disconnect();
};

start();
