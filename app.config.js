import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
  };
};
