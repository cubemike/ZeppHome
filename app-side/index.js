import { BaseSideService } from "@zeppos/zml/base-side";

const headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YzlmNWQ2YWJkNDM0MjEwYjMxZDlkYThmNDg4OTI2ZCIsImlhdCI6MTc0MzczMDk2MywiZXhwIjoyMDU5MDkwOTYzfQ.FPJ0AU0wqHt6rPdMRXuaWRdMaihLtWec6nKt8-4006Q",
    "content-type": "application/json"
}

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

async function fetchEndpoint(endpoint) {
    let response;
    try {
        response = await fetch({
            method: "GET",
            url:  'http://homeassistant.sphinx-city.ts.net:8123/api/' + endpoint,
            headers: headers
        })
        const resBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        console.log(resBody)
        return resBody;
    } catch {
    }
}

async function fetchEndpoints(res, endpoints) {
    let response = {};
    try {
        for (endpointName in endpoints) {
            response[endpointName] = await fetchEndpoint(endpoints[endpointName]);
        }
        console.log(response)

        res(null, response);
    } catch {
    }
}

async function toggleEntity(res, entity) {
    let response;
    try {
        response = await fetch({
            method: "POST",
            url:  'http://homeassistant.sphinx-city.ts.net:8123/api/services/homeassistant/toggle',
            headers: headers,
            body: JSON.stringify({entity_id: entity})
        })
        const resBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        res(null, resBody);
    } catch {
    }
}


AppSideService(
  BaseSideService({
    onInit() {},

    onRequest(req, res) {
      console.log("=====>,", req.method);
      if (req.method === "TEST") {
        test(res);
      } else if (req.method == "FETCH_ENDPOINTS") {
        console.log(req.endpoints);
        fetchEndpoints(res, req.endpoints);
      } else if (req.method == "TOGGLE_ENTITY") {
        console.log(req.entity)
        toggleEntity(res, req.entity);
      }
    },

    onRun() {},

    onDestroy() {},
  })
);
