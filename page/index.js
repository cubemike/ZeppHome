import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { BasePage } from "@zeppos/zml/base-page.debug";
import {
  FETCH_BUTTON,
  FETCH_RESULT_TEXT,
} from "zosLoader:./index.[pf].layout.js";

const logger = Logger.getLogger("fetch_api");

let textWidget;
Page(
  BasePage({
    state: {},
    build() {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        h: 100,
        y: 130,
        text: "Toggle Light",
        click_func: (button_widget) => {
          this.toggleLight();
        },
      });
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        h: 100,
        y: 250,

        text: "Toggle Blinds",
        click_func: (button_widget) => {
          this.toggleBlinds();
        },
      });
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        h: 50,
        y: 380,
        w: 200,
        x: 466/2-200/2,

        text: "Test",
        click_func: (button_widget) => {
          this.test();
        },
      });
    },
    toggleLight() {
      this.httpRequest({
        method: "POST",
        url: 'http://homeassistant.sphinx-city.ts.net:8123/api/services/light/toggle',
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YzlmNWQ2YWJkNDM0MjEwYjMxZDlkYThmNDg4OTI2ZCIsImlhdCI6MTc0MzczMDk2MywiZXhwIjoyMDU5MDkwOTYzfQ.FPJ0AU0wqHt6rPdMRXuaWRdMaihLtWec6nKt8-4006Q",
            "content-type": "application/json"
        },
        body: JSON.stringify({entity_id: "light.lamp"})
      })
        .then((result) => {
          logger.log("receive data");
          Object.keys(result).forEach((key) => {
              console.log(key)
          })
          console.log(JSON.stringify(result))
          console.log(result.status)
          hmUI.showToast({
            text: "Result: " + result.status
          })
        })
        .catch((res) => {});
    },
    toggleBlinds() {
      this.httpRequest({
        method: "POST",
        url: 'http://homeassistant.sphinx-city.ts.net:8123/api/services/cover/toggle',
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YzlmNWQ2YWJkNDM0MjEwYjMxZDlkYThmNDg4OTI2ZCIsImlhdCI6MTc0MzczMDk2MywiZXhwIjoyMDU5MDkwOTYzfQ.FPJ0AU0wqHt6rPdMRXuaWRdMaihLtWec6nKt8-4006Q",
            "content-type": "application/json"
        },
        body: JSON.stringify({entity_id: "cover.blinds_blinds"})
      })
        .then((result) => {
          logger.log("receive data");
          console.log(JSON.stringify(result.body))
          console.log(result.status)
          hmUI.showToast({
            text: "Result: " + result.status
          })
        })
        .catch((res) => {});
    },
    test() {
      this.request({
        method: "TEST",
      })
        .then((result) => {
          logger.log("receive data");
          console.log(JSON.stringify(result))
          console.log(result.status)
          hmUI.showToast({
            text: "Result: " + result.status
          })
        })
        .catch((res) => {});
    },
  })
);
