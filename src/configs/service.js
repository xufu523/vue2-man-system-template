import { getEnv } from '../utils/pub';

const serviceConfig = {
  localhost: {
    domain: '',
  },
  dev: {
    domain: '',
  },
  qa: {
    domain: '',
  },
  prod: {
    domain: '',
  },
};

const service = serviceConfig[getEnv()];

export default service;
