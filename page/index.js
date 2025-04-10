import * as hmUI from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { BasePage } from "@zeppos/zml/base-page";
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
      this.fetchData()
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...FETCH_BUTTON,
        click_func: (button_widget) => {
          this.fetchData();
        },
      });
    },
    fetchData() {
      this.httpRequest({
        method: "POST",
        url: 'http://192.168.1.163:8123/api/services/light/toggle',
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3YzlmNWQ2YWJkNDM0MjEwYjMxZDlkYThmNDg4OTI2ZCIsImlhdCI6MTc0MzczMDk2MywiZXhwIjoyMDU5MDkwOTYzfQ.FPJ0AU0wqHt6rPdMRXuaWRdMaihLtWec6nKt8-4006Q",
            "content-type": "application/json"
        },
        body: JSON.stringify({entity_id: "light.lamp"})
      })
        .then((result) => {
          logger.log("receive data");
          console.log(JSON.stringify(result.body))
          console.log(result.status)
          hmUI.showToast({
            text: "Result: " + result.status
          })

          if (!textWidget) {
            textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
              ...FETCH_RESULT_TEXT,
              text,
            });
          } else {
            textWidget.setProperty(hmUI.prop.TEXT, text);
          }
        })
        .catch((res) => {});
    },
  })
);
