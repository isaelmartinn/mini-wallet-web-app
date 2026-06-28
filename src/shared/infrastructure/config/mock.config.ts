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
        INSUFFICIENT_FUNDS: 0.0,
        NETWORK_ERROR: 0.0,
        SUCCESS: 0.0,
        TIMEOUT: 0.0,
        UNKNOWN_ERROR: 0.9,
      },
      getTransfers: {
        ERROR: 0.15,
        SUCCESS: 0.85,
      },
    },
  },
};
