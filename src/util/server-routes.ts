import { join } from "path";
import * as restify from "restify";
import * as fs from "fs";

export const applyRoutes = (server, args) => {
  server.get(
    "/",
    restify.plugins.serveStatic({
      directory: args.assetPath,
      default: "/index.html"
    })
  );

  server.get("/favicon.png", (req, res, next) => {
    const faviconPath = join(args.assetPath, "favicon.png");
    fs.readFile(faviconPath, function(err, file) {
      if (err) {
        res.send(500);
        return next();
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "image/png");
      res.write(file);
      res.end();
      return next();
    });
  });

  server.get("/help", (req, res, next) => {
    res.send("hello @" + args.addr + ":" + args.port);
    next();
  });
};
