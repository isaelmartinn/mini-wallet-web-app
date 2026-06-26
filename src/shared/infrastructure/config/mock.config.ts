interface MockConfig {
  delays: {
    max: number;
    min: number;
  };
  errorRates: {
    transfers: {
      getTransfers: {
        ERROR: number;
        SUCCESS: number;
      };
    };
  };
}

export const MOCK_CONFIG: MockConfig = {
  delays: {
    max: 1500,
    min: 500,
  },
  errorRates: {
    transfers: {
      getTransfers: {
        ERROR: 0.15,
        SUCCESS: 0.85,
      },
    },
  },
};
