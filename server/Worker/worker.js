import fetch from 'node-fetch';
import axios from 'axios';

async function Worker(arg) {
    try {
        await axios.post("http://dotnet:80/Worker");
    } catch (error) {
        console.log(error)
    }
}

setInterval(Worker, 5000);