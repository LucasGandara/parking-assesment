export default {
  providers: [
    {
      // eslint-disable-next-line node/prefer-global/process
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
