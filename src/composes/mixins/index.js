export default {
  methods: {
    updateState(payload = {}) {
      Object.assign(this.$data, payload);
    },
    updateSecondState(payload = {}, key) {
      this[key] = { ...this[key], ...payload };
    },
    async callWithLoading(requestFn, data, loadingKey) {
      if (loadingKey) this.updateState({ [loadingKey]: true });

      try {
        const result = await requestFn(data);

        return result;
      } catch (e) {
        throw e;
      } finally {
        if (loadingKey) this.updateState({ [loadingKey]: false });
      }
    },
  },
};
