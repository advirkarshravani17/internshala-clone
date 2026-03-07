const UAParser = require("ua-parser-js");

exports.inspectRequest = (req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();

  const browser = result.browser.name || "Unknown";
  const os = result.os.name || "Unknown";
  const deviceType = result.device.type || "Desktop";

  const ipAddress =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  return {
    browser,
    os,
    deviceType,
    ipAddress
  };
};

exports.isMobileTimeAllowed = () => {
  const hour = new Date().getHours();
  return hour >= 10 && hour < 13;
};
