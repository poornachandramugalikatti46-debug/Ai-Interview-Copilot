const { NodeVM } = require("vm2");

function runJavaScript(code, input) {
  try {
    const vm = new NodeVM({
      timeout: 1000,
      sandbox: {},
    });

    const wrappedCode = `
      const input = ${JSON.stringify(input)};
      ${code}
      module.exports = twoSum(input[0], input[1]);
    `;

    return vm.run(wrappedCode);
  } catch (err) {
    return "Runtime Error";
  }
}

module.exports = { runJavaScript };