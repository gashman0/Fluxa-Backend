import greenhouseClient from "./greenhouse-client.js";

export const getBoardJobs = async (boardToken) => {
    const { data } = await greenhouseClient.get(
        `/boards/${boardToken}/jobs`
    );

    return data.jobs;
}