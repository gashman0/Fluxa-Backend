import greenhouseClient from "./greenhouse-client.js";

export const getBoardJobs = async (boardToken) => {
    const { data } = await greenhouseClient.get(
        `/boards/${boardToken}/jobs`
    );

    return data.jobs;
}

export const getJobDetails = async (boardToken, jobId) => {
    const { data } = await greenhouseClient.get(
        `/boards/${boardToken}/jobs/${jobId}`
    );

    return data
}