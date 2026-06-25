export const boundariesSettings = {
  "import/resolver": {
    typescript: {
      alwaysTryTypes: true,
      project: "./tsconfig.json",
    },
    node: true,
  },
  "boundaries/elements": [
    {
      type: "shared",
      pattern: "src/shared/**",
      mode: "full",
    },
    {
      type: "domain",
      pattern: "src/contexts/*/domain/**",
      mode: "full",
      capture: ["context"],
    },
    {
      type: "application",
      pattern: "src/contexts/*/application/**",
      mode: "full",
      capture: ["context"],
    },
    {
      type: "infrastructure",
      pattern: "src/contexts/*/infrastructure/**",
      mode: "full",
      capture: ["context"],
    },
    {
      type: "app",
      pattern: "app/**",
      mode: "full",
    },
  ],
};

export const boundariesRules = {
  "boundaries/dependencies": [
    "error",
    {
      default: "disallow",
      rules: [
        {
          from: { type: "shared" },
          allow: {
            to: {
              type: "shared",
            },
          },
        },
        {
          from: { type: "domain" },
          allow: {
            to: [
              { type: "shared" },
              {
                type: "domain",
                captured: { context: "{{ from.context }}" },
              },
            ],
          },
        },
        {
          from: { type: "application" },
          allow: {
            to: [
              { type: "shared" },
              {
                type: "domain",
                captured: { context: "{{ from.context }}" },
              },
              {
                type: "application",
                captured: { context: "{{ from.context }}" },
              },
            ],
          },
        },
        {
          from: { type: "infrastructure" },
          allow: {
            to: [
              { type: "shared" },
              {
                type: "domain",
                captured: { context: "{{ from.context }}" },
              },
              {
                type: "application",
                captured: { context: "{{ from.context }}" },
              },
              {
                type: "infrastructure",
                captured: { context: "{{ from.context }}" },
              },
            ],
          },
        },
        {
          from: { type: "app" },
          allow: {
            to: {
              type: ["app", "infrastructure", "shared"],
            },
          },
        },
      ],
    },
  ],
};
