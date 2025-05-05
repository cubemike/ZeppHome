import { BaseSideService } from "@zeppos/zml/base-side";

async function test(res) {
  try {
    res(null, {
      status: 123,
    });
  } catch (error) {
    res(null, {
      result: "ERROR",
    });
  }
};

AppSideService(
  BaseSideService({
    onInit() {},

    onRequest(req, res) {
      console.log("=====>,", req.method);
      if (req.method === "TEST") {
        test(res);
      }
    },

    onRun() {},

    onDestroy() {},
  })
);
