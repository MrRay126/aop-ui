module.exports = {
  plugins: [
    {
      name: "removeUselessDefs",
      params: true,
    },
    {
      name: "removeStyleElement",
      params: true,
    },
    {
      name: "removeDoctype",
      params: true,
    },
    {
      name: "removeComments",
      params: true,
    },
    {
      name: "cleanupAttrs",
      params: true,
    },
    {
      name: "removeTitle",
      params: true,
    },
    {
      name: "removeDesc",
      params: true,
    },
    {
      name: "cleanupIDs",
      params: true,
    },
    {
      name: "removeEmptyAttrs",
      params: true,
    },
    {
      name: "removeEmptyText",
      params: true,
    },
    {
      name: "removeUselessDefs",
      params: true,
    },
    {
      name: "removeDimensions",
      params: true,
    },
    {
      name: "removeXMLProcInst",
      params: true,
    },
    {
      name: "removeUnknownsAndDefaults",
      params: true,
    },
    {
      name: "removeUnusedNS",
      params: true,
    },
    {
      name: "removeAttrs",
      params: {
        attrs: "(fill|fill-rule|class|version)",
      },
    },
  ],
};
