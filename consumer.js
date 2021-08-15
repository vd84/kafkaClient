const express = require("express");
const { Pool, Client } = require("pg");
const { Kafka } = require("kafkajs");

const credentials = {
  user: "testdbuser",
  host: "postgres-db-lb.default.svc.cluster.local",
  database: "testdb",
  password: "testdbuserpassword",
  port: 5432,
};

const pool = new Pool(credentials);
const app = express();
const port = 3000;

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["my-cluster-kafka-bootstrap:9092"],
});

const insertText = async (i) => {
  console.log("querying!!!");
  const res = await pool.query(`INSERT INTO test (value) VALUES ('${i}');`);
};

// const producer = kafka.producer();

const start = async () => {
  //   await producer.connect();
  //   await producer.send({
  //     topic: "my-topic",
  //     messages: [{ value: "Hello KafkaJS user!" }],
  //   });

  const consumer = kafka.consumer({ groupId: "test-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "my-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      insertText(message.value.toString());
      console.log({
        value: message.value.toString(),
      });
    },
  });
  //await producer.disconnect();
};

start();
