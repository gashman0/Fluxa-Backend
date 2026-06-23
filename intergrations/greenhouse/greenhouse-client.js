import axios from "axios";

const greenhouseClient = axios.create({
    baseURL: "https://boards-api.greenhouse.io/v1",
    timeout: 10000,
});

export default greenhouseClient;