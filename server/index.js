//const produce = require("./producer");
const express = require("express");
const https = require('https');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');

// the client ID lets kafka know who's producing the messages
const clientId = "my-app"
// we can define the list of brokers in the cluster
const brokers = ["localhost:9092"]
// this is the topic to which we want to write messages
const topic = "scores"

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// game logic
var Team1Score = 0;
var Team2Score = 0;

setInterval(()=>{

    function shoot(team){
        let pPoints = [0, 2, 3];
        let points = pPoints[Math.floor(Math.random()*pPoints.length)];

        if(team == 0){
            Team1Score+=points;
        }else{
            Team2Score+=points;
        }
    }

    let team = Math.floor(Math.random()*2);
    if(team==0){
        shoot(0);
    }else{
        shoot(1);
    }

}, 3000);

// we define an async function that writes a new message each second
const produce = async () => {
	await producer.connect()
	let i = 0

	// after the produce has connected, we start an interval timer
	setInterval(async () => {
		try {
			// send a message to the configured topic with
			// the key and value formed from the current value of `i`
			await producer.send({
				topic,
				messages: [
					{
						key: "game",
						value: "Team1:"+Team1Score+" Team2:"+Team2Score
					}, 
				],
			})

			// if the message is written successfully, log it and increment `i`
			console.log("writes: Team1:", Team1Score, " Team 2:", Team2Score);
			i++
		} catch (err) {
			console.error("could not write message " + err)
		}
	}, 1000)
}


const port = process.env.PORT ||  3005;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

//call the `produce` function and log an error if it occurs
produce().catch((err) => {
	console.error("error in producer: ", err)
})

// // start the consumer, and log any errors
// consume().catch((err) => {
// 	console.error("error in consumer: ", err)
// })