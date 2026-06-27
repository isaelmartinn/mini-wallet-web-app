interface MockConfig {
  delays: {
    max: number;
    min: number;
  };
  errorRates: {
    transfers: {
      confirmTransfer: {
        INSUFFICIENT_FUNDS: number;
        NETWORK_ERROR: number;
        SUCCESS: number;
        TIMEOUT: number;
        UNKNOWN_ERROR: number;
      };
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
      confirmTransfer: {
        INSUFFICIENT_FUNDS: 0.1,
        NETWORK_ERROR: 0.15,
        SUCCESS: 0.6,
        TIMEOUT: 0.1,
        UNKNOWN_ERROR: 0.05,
      },
      getTransfers: {
        ERROR: 0.15,
        SUCCESS: 0.85,
      },
    },
  },
};
