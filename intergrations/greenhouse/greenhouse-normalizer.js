export const normalizeGreenhouseJob = (job) => {
  return {
    title: job.title,
    company: job.company_name,
    location: job.location?.name,
    url: job.absolute_url,
    source: "greenhouse",
    externalId: String(job.id),
    publishedAt: job.first_published,
    metadata: job,
  };
};