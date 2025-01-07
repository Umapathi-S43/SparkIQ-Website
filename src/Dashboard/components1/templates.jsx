import React from "react";
import { useNavigate } from "react-router-dom";

const sampleTemplates = [

  {
    id: "template1",
    name: "Serenity Spa Offer",
    thumbnail:
      "https://assets.predis.ai/predis-aigenimages/d90a2dc8-c1d0-4304-9344-8ad3922a0cf6.jpeg", // Thumbnail for display
    data: {
      // Complete JSON object provided


      "width": 1080,

      "height": 1080,

      "fonts": [

        {

          "fontFamily": "Montserrat",

          "url": "",

          "styles": [

            {

              "fontStyle": "normal",

              "fontWeight": "500",

              "src": "url(https://assets.predis.ai/predis-fonts/montserrat_medium.ttf)"

            },

            {

              "fontStyle": "normal",

              "fontWeight": "600",

              "src": "url(https://assets.predis.ai/predis-fonts/montserrat_semibold.ttf)"

            },

            {

              "fontStyle": "normal",

              "fontWeight": "700",

              "src": "url(https://assets.predis.ai/predis-fonts/montserrat_bold.ttf)"

            },

            {

              "fontStyle": "normal",

              "fontWeight": "800",

              "src": "url(https://assets.predis.ai/predis-fonts/montserrat_extrabold.ttf)"

            }

          ]

        }

      ],

      "pages": [

        {

          "id": "GHZtslU_8H",

          "children": [

            {

              "id": "e035a49b-750b-426f-b048-30dff82d5fd2",

              "type": "image",

              "name": "stock_image",

              "opacity": 1,

              "custom": {

                "asset_id": "d90a2dc8-c1d0-4304-9344-8ad3922a0cf6",

                "platform": "User_Selected",

                "is_premium": false,

                "isGif": false,

                "imgWidth": 1024,

                "imgHeight": 1024,

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "8075eed0-a1ad-4ea7-8019-3ed92b3dff08",

                "image_gen_prompt": "The stock image showcases a serene setting, featuring a relaxed White American female spa therapist gently applying a rejuvenating face mask on a peaceful client. The lush surroundings include soft towels, candles, and tranquil plants that enhance the atmosphere of calmness. The image emphasizes a soothing escape into wellness and self-care."

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": -18.314736617284098,

              "y": 32.21348517264032,

              "width": 1080,

              "height": 1080,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "https://assets.predis.ai/predis-aigenimages/d90a2dc8-c1d0-4304-9344-8ad3922a0cf6.jpeg",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "cornerRadius": 0,

              "flipX": false,

              "flipY": false,

              "clipSrc": "",

              "borderColor": "black",

              "borderSize": 0,

              "keepRatio": false

            },

            {

              "id": "00631a72-93cb-4a16-8539-8857f4f9b939",

              "type": "svg",

              "name": "overlay",

              "opacity": 0.77,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "e41618f0-3970-4e5c-9c35-6b72e30041f5"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 0.5682907918165938,

              "y": 1260.0723589789789,

              "width": 1316.6034263728307,

              "height": 1299.1790448254183,

              "rotation": -90.00000000000001,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": false,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 0,

              "colorsReplace": {

                "rgb(0, 161, 255)": "linear-gradient(267deg,rgba(0,181,174,0.49) 2.6936109138257573%,rgba(0,181,174,0.35) 25.028076171875004%,rgba(0,181,174,0.0) 72.90686405066288%)"

              }

            },

            {

              "id": "266ec70b-0ed3-4882-a2f4-024e3a6f25dc",

              "type": "image",

              "name": "logo",

              "opacity": 1,

              "custom": {

                "asset_id": "NA",

                "is_premium": false,

                "platform": "other",

                "imgWidth": 500,

                "imgHeight": 97,

                "predis_id": "ad25bb7a-99f3-4251-bb90-933efa3faf7d",

                "editable": true,

                "custom": true

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 794.685263382716,

              "y": 27.022332144150766,

              "width": 267,

              "height": 51.797999999999995,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "https://assets.predis.ai/samples/5d0c2a80_bce7_42b8_b6a0_be0bfda23fa3.png",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "cornerRadius": 0,

              "flipX": false,

              "flipY": false,

              "clipSrc": "",

              "borderColor": "black",

              "borderSize": 0,

              "keepRatio": false

            },

            {

              "id": "4e79afc0-bed9-4456-84dc-98e9df9a5d43",

              "type": "svg",

              "name": "shape",

              "opacity": 0.87,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "7f70d4dd-5cc2-4ed0-98d2-82cce53eb01e"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 606.612885322493,

              "y": 537.6578220032052,

              "width": 539.6780957927186,

              "height": 674.8938409581971,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": false,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 23,

              "colorsReplace": {

                "rgb(0, 161, 255)": "rgba(1,62,119,1.0)"

              }

            },

            {

              "id": "5681f186-6e2d-4da7-9f5c-a9cb7e26d78e",

              "type": "svg",

              "name": "shape",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "6b8d8730-ce08-476f-b6db-2dbd81475128"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 49.01244784396037,

              "y": 15.299908659843425,

              "width": 488.6245560191557,

              "height": 3.053903475119711,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxNjAgMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGxpbmUgeTE9IjAuNSIgeDI9IjE2MCIgeTI9IjAuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIi8+Cjwvc3ZnPgo=",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": true,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 0,

              "colorsReplace": {

                "black": "rgba(227,247,255,1.0)"

              }

            },

            {

              "id": "26608a82-8576-4a1d-90c5-305c54fde0c2",

              "type": "svg",

              "name": "shape",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "3d58d22b-4d23-4645-b246-b622bb824cc0"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 632.6595002082163,

              "y": 753.6787647670383,

              "width": 447.3421867954746,

              "height": 2.7958886674716785,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxNjAgMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGxpbmUgeTE9IjAuNSIgeDI9IjE2MCIgeTI9IjAuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIi8+Cjwvc3ZnPgo=",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": true,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 0,

              "colorsReplace": {

                "black": "rgba(227,247,255,1.0)"

              }

            },

            {

              "id": "cdf0075e-00e0-486b-bd7c-d5ee7b4569fc",

              "type": "text",

              "name": "generic",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "00072460-c99a-456b-95be-a7e19b7514f2"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 615.1578132045254,

              "y": 891.7750184928767,

              "width": 105,

              "height": 35,

              "rotation": -90.00000000000028,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 1.797902853047091,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "text": "UP TO",

              "placeholder": "",

              "fontSize": 28,

              "fontFamily": "Montserrat",

              "fontStyle": "normal",

              "fontWeight": "500",

              "textDecoration": "",

              "fill": "rgba(255,255,255,1.0)",

              "align": "center",

              "verticalAlign": "top",

              "strokeWidth": 0,

              "stroke": "black",

              "lineHeight": 1.2,

              "letterSpacing": 0,

              "backgroundEnabled": false,

              "backgroundColor": "#7ED321",

              "backgroundOpacity": 1,

              "backgroundCornerRadius": 0.5,

              "backgroundPadding": 0.5

            },

            {

              "id": "854d9e72-a17a-4d49-b577-c73b7a2fd9c5",

              "type": "svg",

              "name": "shape",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "93f6c022-be7b-4e54-93be-7c36e834c0ba"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 981.5629104331485,

              "y": 778.2826062714934,

              "width": 62.2547706547383,

              "height": 121.98482442276652,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": false,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 1,

              "colorsReplace": {

                "rgb(0, 161, 255)": "rgba(227,247,255,1.0)"

              }

            },

            {

              "id": "6ec9e79c-76e1-4205-8ea1-c4cd514ed535",

              "type": "text",

              "name": "offer-notlinked",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "1fa04730-07d7-45c1-ab55-bc24669f8e5d"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 646.7840562073744,

              "y": 756.7326682421589,

              "width": 334,

              "height": 177,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 9.64158528809892,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "text": "20%",

              "placeholder": "",

              "fontSize": 146,

              "fontFamily": "Montserrat",

              "fontStyle": "normal",

              "fontWeight": "800",

              "textDecoration": "",

              "fill": "rgba(255,255,255,1.0)",

              "align": "center",

              "verticalAlign": "top",

              "strokeWidth": 0,

              "stroke": "black",

              "lineHeight": 1.2,

              "letterSpacing": 0.01,

              "backgroundEnabled": false,

              "backgroundColor": "#7ED321",

              "backgroundOpacity": 1,

              "backgroundCornerRadius": 0.5,

              "backgroundPadding": 0.5

            },

            {

              "id": "f96d4d4f-f55b-4507-a22e-76faf66d7b64",

              "type": "text",

              "name": "generic",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "48363236-6f8f-48c1-b455-3fb404d28683"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 994.8176810878863,

              "y": 886.7750184928768,

              "width": 95,

              "height": 49,

              "rotation": -90.00000000000028,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 1.797902853047091,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "text": "OFF",

              "placeholder": "",

              "fontSize": 40,

              "fontFamily": "Montserrat",

              "fontStyle": "normal",

              "fontWeight": "700",

              "textDecoration": "",

              "fill": "rgba(38,39,17,1.0)",

              "align": "center",

              "verticalAlign": "top",

              "strokeWidth": 0,

              "stroke": "black",

              "lineHeight": 1.2,

              "letterSpacing": 0,

              "backgroundEnabled": false,

              "backgroundColor": "#7ED321",

              "backgroundOpacity": 1,

              "backgroundCornerRadius": 0.5,

              "backgroundPadding": 0.5

            },

            {

              "id": "87bbff9a-c8a1-4293-b8ab-e1fb3ba4e84c",

              "type": "text",

              "name": "generic",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "7118e149-9ba3-442e-bb62-c83a280123a7"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 632.6578132045253,

              "y": 933.7326682421589,

              "width": 471,

              "height": 41,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 2.937299174340155,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "text": "ON YOUR PURCHASE",

              "placeholder": "",

              "fontSize": 33,

              "fontFamily": "Montserrat",

              "fontStyle": "normal",

              "fontWeight": "600",

              "textDecoration": "",

              "fill": "rgba(255,255,255,1.0)",

              "align": "center",

              "verticalAlign": "top",

              "strokeWidth": 0,

              "stroke": "black",

              "lineHeight": 1.2,

              "letterSpacing": 0,

              "backgroundEnabled": false,

              "backgroundColor": "#7ED321",

              "backgroundOpacity": 1,

              "backgroundCornerRadius": 0.5,

              "backgroundPadding": 0.5

            },

            {

              "id": "343dcc3e-fb37-49f0-a287-8341fed7b76c",

              "type": "svg",

              "name": "shape",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "26348c3c-ae36-4acb-95dc-add1798f158e"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 665.1211512509035,

              "y": 1002.351939705315,

              "width": 481.16982986431384,

              "height": 77.64806029468498,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": false,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 5,

              "colorsReplace": {

                "rgb(0, 161, 255)": "rgba(227,247,255,1.0)"

              }

            },

            {

              "id": "80a89164-6026-4a13-a511-62165d964fbe",

              "type": "text",

              "name": "generic",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "19c0a4e4-5641-449b-bdc1-899c709a66d6"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 836.9999999799995,

              "y": 1040,

              "width": 243,

              "height": 40,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 1.7979028530470769,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "text": "NEWHABIT50",

              "placeholder": "",

              "fontSize": 32,

              "fontFamily": "Montserrat",

              "fontStyle": "normal",

              "fontWeight": "700",

              "textDecoration": "",

              "fill": "rgba(38,39,17,1.0)",

              "align": "left",

              "verticalAlign": "top",

              "strokeWidth": 0,

              "stroke": "black",

              "lineHeight": 1.2,

              "letterSpacing": 0,

              "backgroundEnabled": false,

              "backgroundColor": "#7ED321",

              "backgroundOpacity": 1,

              "backgroundCornerRadius": 0.5,

              "backgroundPadding": 0.5

            },

            {

              "id": "1bbd278c-6be0-439f-ae8a-2fbadf6bb8f8",

              "type": "text",

              "name": "generic",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "eb2cf9c2-1731-485f-890d-9d4a891c6a09"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 645.9999999599994,

              "y": 1040,

              "width": 191,

              "height": 40,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 1.7979028530470769,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "text": "USE CODE: ",

              "placeholder": "",

              "fontSize": 32,

              "fontFamily": "Montserrat",

              "fontStyle": "normal",

              "fontWeight": "600",

              "textDecoration": "",

              "fill": "rgba(38,39,17,1.0)",

              "align": "center",

              "verticalAlign": "top",

              "strokeWidth": 0,

              "stroke": "black",

              "lineHeight": 1.2,

              "letterSpacing": 0,

              "backgroundEnabled": false,

              "backgroundColor": "#7ED321",

              "backgroundOpacity": 1,

              "backgroundCornerRadius": 0.5,

              "backgroundPadding": 0.5

            },

            {

              "id": "083afce3-24db-4e19-adca-c940e3636dc7",

              "type": "svg",

              "name": "shape",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "d466c7cd-c6b3-4525-a62b-4bd170901b87"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 50.01244784396049,

              "y": 405.3044051892848,

              "width": 488.6245560191557,

              "height": 3.053903475119711,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxNjAgMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGxpbmUgeTE9IjAuNSIgeDI9IjE2MCIgeTI9IjAuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIi8+Cjwvc3ZnPgo=",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": true,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 0,

              "colorsReplace": {

                "black": "rgba(227,247,255,1.0)"

              }

            },

            {

              "id": "0c8ff3d3-2985-4fad-af0d-c5f7c7b56730",

              "type": "svg",

              "name": "shape",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "2f61924e-1adb-4eac-9f12-d55e2f336e4c"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "x": 645.9999999599995,

              "y": 974.732668242159,

              "width": 488.6245560191557,

              "height": 3.053903475119711,

              "rotation": 0,

              "animations": [



              ],

              "blurEnabled": false,

              "blurRadius": 10,

              "brightnessEnabled": false,

              "brightness": 0,

              "sepiaEnabled": false,

              "grayscaleEnabled": false,

              "shadowEnabled": false,

              "shadowBlur": 5,

              "shadowOffsetX": 0,

              "shadowOffsetY": 0,

              "shadowColor": "black",

              "shadowOpacity": 1,

              "draggable": true,

              "resizable": true,

              "contentEditable": true,

              "styleEditable": true,

              "src": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYwIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxNjAgMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGxpbmUgeTE9IjAuNSIgeDI9IjE2MCIgeTI9IjAuNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIi8+Cjwvc3ZnPgo=",

              "maskSrc": "",

              "cropX": 0,

              "cropY": 0,

              "cropWidth": 1,

              "cropHeight": 1,

              "keepRatio": true,

              "flipX": false,

              "flipY": false,

              "borderColor": "black",

              "borderSize": 0,

              "cornerRadius": 0,

              "colorsReplace": {

                "black": "rgba(227,247,255,1.0)"

              }

            },

            {

              "id": "b42d76be-6124-4f4d-8cfd-2a86f385617b",

              "type": "group",

              "name": "typography_h1",

              "opacity": 1,

              "custom": {

                "editable": true,

                "edited": true,

                "custom": true,

                "predis_id": "55cd967e-dee9-4dbf-8faa-2209d00d99a4"

              },

              "visible": true,

              "selectable": true,

              "removable": true,

              "alwaysOnTop": false,

              "showInExport": true,

              "children": [

                {

                  "id": "qjQpBlosKx",

                  "type": "text",

                  "name": "h1",

                  "opacity": 1,

                  "custom": {

                    "editable": true,

                    "edited": true,

                    "custom": true

                  },

                  "visible": true,

                  "selectable": true,

                  "removable": true,

                  "alwaysOnTop": false,

                  "showInExport": true,

                  "x": 650.2840562073744,

                  "y": 621.2287900697868,

                  "width": 471,

                  "height": 47,

                  "rotation": 0,

                  "animations": [



                  ],

                  "blurEnabled": false,

                  "blurRadius": 10,

                  "brightnessEnabled": false,

                  "brightness": 0,

                  "sepiaEnabled": false,

                  "grayscaleEnabled": false,

                  "shadowEnabled": false,

                  "shadowBlur": 2.937299174340155,

                  "shadowOffsetX": 0,

                  "shadowOffsetY": 0,

                  "shadowColor": "black",

                  "shadowOpacity": 1,

                  "draggable": true,

                  "resizable": true,

                  "contentEditable": true,

                  "styleEditable": true,

                  "text": "Indulge In Tranquility At",

                  "placeholder": "",

                  "fontSize": 38,

                  "fontFamily": "Montserrat",

                  "fontStyle": "normal",

                  "fontWeight": "500",

                  "textDecoration": "",

                  "fill": "rgba(255,255,255,1.0)",

                  "align": "center",

                  "verticalAlign": "top",

                  "strokeWidth": 0,

                  "stroke": "black",

                  "lineHeight": 1.2,

                  "letterSpacing": 0,

                  "backgroundEnabled": false,

                  "backgroundColor": "rgba(126,211,33,1.0)",

                  "backgroundOpacity": 1,

                  "backgroundCornerRadius": 0.5,

                  "backgroundPadding": 0.5

                },

                {

                  "id": "JNbXK19ert",

                  "type": "text",

                  "name": "h1",

                  "opacity": 1,

                  "custom": {

                    "editable": true,

                    "edited": true,

                    "custom": true,

                    "is_accented": true

                  },

                  "visible": true,

                  "selectable": true,

                  "removable": true,

                  "alwaysOnTop": false,

                  "showInExport": true,

                  "x": 646.7840562073743,

                  "y": 671.8287900697869,

                  "width": 478,

                  "height": 57,

                  "rotation": 0,

                  "animations": [



                  ],

                  "blurEnabled": false,

                  "blurRadius": 10,

                  "brightnessEnabled": false,

                  "brightness": 0,

                  "sepiaEnabled": false,

                  "grayscaleEnabled": false,

                  "shadowEnabled": false,

                  "shadowBlur": 3.126642948463493,

                  "shadowOffsetX": 0,

                  "shadowOffsetY": 0,

                  "shadowColor": "black",

                  "shadowOpacity": 1,

                  "draggable": true,

                  "resizable": true,

                  "contentEditable": true,

                  "styleEditable": true,

                  "text": "Serenity Spa Today!",

                  "placeholder": "",

                  "fontSize": 46,

                  "fontFamily": "Montserrat",

                  "fontStyle": "normal",

                  "fontWeight": "700",

                  "textDecoration": "",

                  "fill": "rgba(255,255,255,1.0)",

                  "align": "center",

                  "verticalAlign": "top",

                  "strokeWidth": 0,

                  "stroke": "black",

                  "lineHeight": 1.2,

                  "letterSpacing": 0,

                  "backgroundEnabled": false,

                  "backgroundColor": "rgba(126,211,33,1.0)",

                  "backgroundOpacity": 1,

                  "backgroundCornerRadius": 0.5,

                  "backgroundPadding": 0.5

                }

              ]

            }

          ],

          "width": "auto",

          "height": "auto",

          "background": "white",

          "bleed": 0,

          "custom": {

            "duration": 1

          },

          "duration": 5000

        }

      ],

      "audios": [



      ],

      "unit": "px",

      "dpi": 72,

      "custom": "65f521d01b8bc279c3723138"
    },
  },

  {
    id: "template2",
    name: "Serenity Spa Offer",
    thumbnail:
      "https://assets.predis.ai/predis-aigenimages/d90a2dc8-c1d0-4304-9344-8ad3922a0cf6.jpeg", // Thumbnail for display
    data:
    {
      "width": 1280,
      "height": 720,
      "fonts": [],
      "pages": [
        {
          "id": "hGcq5w-DlE",
          "children": [
            {
              "id": "tAQdANFFig",
              "type": "svg",
              "name": "",
              "opacity": 1,
              "visible": true,
              "selectable": true,
              "removable": true,
              "alwaysOnTop": false,
              "showInExport": true,
              "x": 627.2357760670193,
              "y": -2.2015295279636447e-13,
              "width": 652.7642239329798,
              "height": 735.300809298834,
              "rotation": 0,
              "animations": [],
              "blurEnabled": false,
              "blurRadius": 10,
              "brightnessEnabled": false,
              "brightness": 0,
              "sepiaEnabled": false,
              "grayscaleEnabled": false,
              "shadowEnabled": false,
              "shadowBlur": 5,
              "shadowOffsetX": 0,
              "shadowOffsetY": 0,
              "shadowColor": "black",
              "shadowOpacity": 1,
              "draggable": true,
              "resizable": true,
              "contentEditable": true,
              "styleEditable": true,
              "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJyZ2IoMCwgMTYxLCAyNTUpIiAvPjwvc3ZnPg==",
              "maskSrc": "",
              "cropX": 0,
              "cropY": 0,
              "cropWidth": 1,
              "cropHeight": 1,
              "keepRatio": false,
              "flipX": false,
              "flipY": false,
              "borderColor": "black",
              "borderSize": 0,
              "cornerRadius": 0,
              "colorsReplace": {
                "rgb(0, 161, 255)": "rgba(7,246,193,1)"
              }
            },
            {
              "id": "L1VElT4gfo",
              "type": "image",
              "name": "",
              "opacity": 1,
              "visible": true,
              "selectable": true,
              "removable": true,
              "alwaysOnTop": false,
              "showInExport": true,
              "x": 315.21258814433554,
              "y": 73.28257595599963,
              "width": 873.0122208042468,
              "height": 582.7356573868343,
              "rotation": 0,
              "animations": [],
              "blurEnabled": false,
              "blurRadius": 10,
              "brightnessEnabled": false,
              "brightness": 0,
              "sepiaEnabled": false,
              "grayscaleEnabled": true,
              "shadowEnabled": false,
              "shadowBlur": 5,
              "shadowOffsetX": 0,
              "shadowOffsetY": 0,
              "shadowColor": "black",
              "shadowOpacity": 1,
              "draggable": true,
              "resizable": true,
              "contentEditable": true,
              "styleEditable": true,
              "src": "https://images.unsplash.com/photo-1546817372-628669db4655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTY5OTZ8MHwxfHNlYXJjaHw0MXx8Z3ltfGVufDB8fHx8MTYzNTA2MTg3Mw&ixlib=rb-1.2.1&q=80&w=1080",
              "cropX": 0,
              "cropY": 0,
              "cropWidth": 0.9987515605493137,
              "cropHeight": 0.9999999999999996,
              "cornerRadius": 0,
              "flipX": false,
              "flipY": false,
              "clipSrc": "",
              "borderColor": "black",
              "borderSize": 0,
              "keepRatio": false
            },
            {
              "id": "2dgbIC-x5F",
              "type": "text",
              "name": "",
              "opacity": 1,
              "visible": true,
              "selectable": true,
              "removable": true,
              "alwaysOnTop": false,
              "showInExport": true,
              "x": 61.853658536585414,
              "y": 163.8000000000001,
              "width": 921,
              "height": 394,
              "rotation": 0,
              "animations": [],
              "blurEnabled": false,
              "blurRadius": 10,
              "brightnessEnabled": false,
              "brightness": 0,
              "sepiaEnabled": false,
              "grayscaleEnabled": false,
              "shadowEnabled": false,
              "shadowBlur": 5,
              "shadowOffsetX": 0,
              "shadowOffsetY": 0,
              "shadowColor": "black",
              "shadowOpacity": 1,
              "draggable": true,
              "resizable": true,
              "contentEditable": true,
              "styleEditable": true,
              "text": "MAKE A FITNESS HABIT",
              "placeholder": "",
              "fontSize": 109,
              "fontFamily": "Archivo Black",
              "fontStyle": "normal",
              "fontWeight": "normal",
              "textDecoration": " underline",
              "fill": "rgba(255,255,255,1)",
              "align": "left",
              "verticalAlign": "top",
              "strokeWidth": 0,
              "stroke": "black",
              "lineHeight": 1.2,
              "letterSpacing": 0,
              "backgroundEnabled": false,
              "backgroundColor": "#7ED321",
              "backgroundOpacity": 1,
              "backgroundCornerRadius": 0.5,
              "backgroundPadding": 0.5
            }
          ],
          "width": "auto",
          "height": "auto",
          "background": "rgba(0,0,0,1)",
          "bleed": 0,
          "duration": 5000
        }
      ],
      "audios": [],
      "unit": "px",
      "dpi": 72
    }
  },
  {
    "width": 1280,
    "height": 720,
    "fonts": [],
    "pages": [
      {
        "id": "Gn-o2D9Ffl",
        "children": [
          {
            "id": "UJ7xtMbq00",
            "type": "image",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 0,
            "y": 0,
            "width": 1280,
            "height": 720,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "src": "https://images.unsplash.com/photo-1603202662747-00e33e7d1468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTY5OTZ8MHwxfHNlYXJjaHw5fHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fHwxNjM1MDU0NTE2&ixlib=rb-1.2.1&q=80&w=1080",
            "cropX": 0,
            "cropY": 0,
            "cropWidth": 1,
            "cropHeight": 1,
            "cornerRadius": 0,
            "flipX": false,
            "flipY": false,
            "clipSrc": "",
            "borderColor": "black",
            "borderSize": 0,
            "keepRatio": false
          },
          {
            "id": "7-Jf0TEOg7",
            "type": "svg",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 87.34146341463286,
            "y": 73.70586330110392,
            "width": 572.5882733977918,
            "height": 572.5882733977921,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9InJnYigwLCAxNjEsIDI1NSkiIC8+PC9zdmc+",
            "maskSrc": "",
            "cropX": 0,
            "cropY": 0,
            "cropWidth": 1,
            "cropHeight": 1,
            "keepRatio": false,
            "flipX": false,
            "flipY": false,
            "borderColor": "black",
            "borderSize": 0,
            "cornerRadius": 0,
            "colorsReplace": {
              "rgb(0, 161, 255)": "rgba(253,187,4,1)"
            }
          },
          {
            "id": "RqI4a6DPwJ",
            "type": "text",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 143.63560011352865,
            "y": 286.4926829268293,
            "width": 455,
            "height": 173,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "text": "CUSTOMER SERVICE TRAINING SERIES",
            "placeholder": "",
            "fontSize": 52,
            "fontFamily": "Fredoka One",
            "fontStyle": "normal",
            "fontWeight": "normal",
            "textDecoration": "",
            "fill": "rgba(17,9,56,1)",
            "align": "center",
            "verticalAlign": "top",
            "strokeWidth": 0,
            "stroke": "black",
            "lineHeight": 1.1,
            "letterSpacing": 0,
            "backgroundEnabled": false,
            "backgroundColor": "#7ED321",
            "backgroundOpacity": 1,
            "backgroundCornerRadius": 0.5,
            "backgroundPadding": 0.5
          },
          {
            "id": "8PRZe6IaU4",
            "type": "text",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 141.1356001135286,
            "y": 472.1414634146339,
            "width": 460,
            "height": 41,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "text": "Steps for optimal sucess",
            "placeholder": "",
            "fontSize": 33,
            "fontFamily": "Roboto",
            "fontStyle": "normal",
            "fontWeight": "normal",
            "textDecoration": "",
            "fill": "black",
            "align": "center",
            "verticalAlign": "top",
            "strokeWidth": 0,
            "stroke": "black",
            "lineHeight": 1.2,
            "letterSpacing": 0,
            "backgroundEnabled": false,
            "backgroundColor": "#7ED321",
            "backgroundOpacity": 1,
            "backgroundCornerRadius": 0.5,
            "backgroundPadding": 0.5
          },
          {
            "id": "dz2x-U-y30",
            "type": "svg",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 23.92055084930682,
            "y": 30.131105446307487,
            "width": 187.87377260247288,
            "height": 187.87377260247288,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9InJnYigwLCAxNjEsIDI1NSkiIC8+PC9zdmc+",
            "maskSrc": "",
            "cropX": 0,
            "cropY": 0,
            "cropWidth": 1,
            "cropHeight": 1,
            "keepRatio": false,
            "flipX": false,
            "flipY": false,
            "borderColor": "black",
            "borderSize": 0,
            "cornerRadius": 0,
            "colorsReplace": {
              "rgb(0, 161, 255)": "rgba(17,9,56,1)"
            }
          },
          {
            "id": "-Weshpsi7F",
            "type": "svg",
            "name": "",
            "opacity": 1,
            "visible": true,
            "selectable": true,
            "removable": true,
            "alwaysOnTop": false,
            "showInExport": true,
            "x": 23.920550849306807,
            "y": 204.89915797448612,
            "width": 98.90572007429444,
            "height": 98.90572007429442,
            "rotation": 0,
            "animations": [],
            "blurEnabled": false,
            "blurRadius": 10,
            "brightnessEnabled": false,
            "brightness": 0,
            "sepiaEnabled": false,
            "grayscaleEnabled": false,
            "shadowEnabled": false,
            "shadowBlur": 5,
            "shadowOffsetX": 0,
            "shadowOffsetY": 0,
            "shadowColor": "black",
            "shadowOpacity": 1,
            "draggable": true,
            "resizable": true,
            "contentEditable": true,
            "styleEditable": true,
            "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCA2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9InJnYigwLCAxNjEsIDI1NSkiIC8+PC9zdmc+",
            "maskSrc": "",
            "cropX": 0,
            "cropY": 0,
            "cropWidth": 1,
            "cropHeight": 1,
            "keepRatio": false,
            "flipX": false,
            "flipY": false,
            "borderColor": "black",
            "borderSize": 0,
            "cornerRadius": 0,
            "colorsReplace": {
              "rgb(0, 161, 255)": "rgba(17,9,56,1)"
            }
          }
        ],
        "width": "auto",
        "height": "auto",
        "background": "white",
        "bleed": 0,
        "duration": 5000
      }
    ],
    "audios": [],
    "unit": "px",
    "dpi": 72
  },
  {
    id: "4",
    name: "Serenity Spa Template1",
    thumbnail: "https://assets.predis.ai/predis-aigenimages/d90a2dc8-c1d0-4304-9344-8ad3922a0cf6.jpeg", // Add a relevant thumbnail URL
    data: JSON.parse(`{
  "data": {\"width\":1080,\"height\":1080,\"fonts\":[{\"fontFamily\":\"Bebas Neue\",\"url\":\"\",\"styles\":[{\"fontStyle\":\"normal\",\"fontWeight\":\"400\",\"src\":\"url(https://assets.predis.ai/predis-fonts/bebas_neue.ttf)\"}]},{\"fontFamily\":\"Roboto\",\"url\":\"\",\"styles\":[{\"fontStyle\":\"normal\",\"fontWeight\":\"500\",\"src\":\"url(https://assets.predis.ai/predis-fonts/roboto_medium.ttf)\"}]},{\"fontFamily\":\"Figtree\",\"url\":\"\",\"styles\":[{\"fontStyle\":\"normal\",\"fontWeight\":\"500\",\"src\":\"url(https://assets.predis.ai/predis-fonts/figtree_medium.ttf)\"}]}],\"pages\":[{\"id\":\"gh8t4YN4p_\",\"children\":[{\"id\":\"bc631558-d30f-443f-bded-dea6331b622d\",\"type\":\"image\",\"name\":\"stock_image\",\"opacity\":1,\"custom\":{\"asset_id\":\"d90a2dc8-c1d0-4304-9344-8ad3922a0cf6\",\"platform\":\"User_Selected\",\"is_premium\":false,\"isGif\":false,\"imgWidth\":1024,\"imgHeight\":1024,\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"488e8f4a-a81d-441b-871d-29bb27820c91\",\"image_gen_prompt\":\"The stock image showcases a serene setting, featuring a relaxed White American female spa therapist gently applying a rejuvenating face mask on a peaceful client. The lush surroundings include soft towels, candles, and tranquil plants that enhance the atmosphere of calmness. The image emphasizes a soothing escape into wellness and self-care.\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":4.0981863520474963e-13,\"y\":1.5613664564399577e-14,\"width\":1080.0000000000007,\"height\":1080,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-aigenimages/d90a2dc8-c1d0-4304-9344-8ad3922a0cf6.jpeg\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"cornerRadius\":0,\"flipX\":false,\"flipY\":false,\"clipSrc\":\"\",\"borderColor\":\"black\",\"borderSize\":0,\"keepRatio\":false},{\"id\":\"b438b070-a5f5-4984-8779-d7ee1cadb441\",\"type\":\"svg\",\"name\":\"overlay\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"372361d9-cfac-4b42-985a-c6d8a7219291\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":772.5447315409571,\"y\":8.809675857741948e-14,\"width\":1080.0000000000002,\"height\":772.5447315409575,\"rotation\":90,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":0,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"linear-gradient(0deg,rgba(43,43,43,1.0) 0%,rgba(43,43,43,0.0) 100%)\"}},{\"id\":\"01d1d129-f397-4bca-9020-0f0336da3c26\",\"type\":\"text\",\"name\":\"h1\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"ee1f7d87-6ee4-4e62-8cad-50ca8cf78475\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":29.569519063066977,\"y\":37.77794959938361,\"width\":521,\"height\":401,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":8.730991365972782,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"text\":\"Indulge In Tranquility At Serenity Spa Today!\",\"placeholder\":\"\",\"fontSize\":100,\"fontFamily\":\"Bebas Neue\",\"fontStyle\":\"normal\",\"fontWeight\":\"400\",\"textDecoration\":\"\",\"fill\":\"rgba(255,255,255,1.0)\",\"align\":\"left\",\"verticalAlign\":\"top\",\"strokeWidth\":0,\"stroke\":\"black\",\"lineHeight\":1,\"letterSpacing\":0,\"backgroundEnabled\":false,\"backgroundColor\":\"rgba(126,211,33,1.0)\",\"backgroundOpacity\":1,\"backgroundCornerRadius\":0.5,\"backgroundPadding\":0.5},{\"id\":\"13826c23-2406-4fe8-9570-ede4e1b810c4\",\"type\":\"svg\",\"name\":\"shape\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"9e2c7e1a-1f68-4174-8100-91e2a58ec87e\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":29.569519063067062,\"y\":923.77355200661,\"width\":330.3335282954628,\"height\":88.16917290090016,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":55,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"rgba(227,247,255,1.0)\"}},{\"id\":\"b2eb6371-07a2-4c75-a4be-f19a7a35557a\",\"type\":\"text\",\"name\":\"cta\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"3365ff8a-1793-454b-bf90-a08baa3e2be5\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":74.69873772906082,\"y\":945.2,\"width\":242,\"height\":47,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":4.163859266770506,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"text\":\"Book Now!\",\"placeholder\":\"\",\"fontSize\":38,\"fontFamily\":\"Roboto\",\"fontStyle\":\"normal\",\"fontWeight\":\"500\",\"textDecoration\":\"\",\"fill\":\"rgba(43,43,43,1.0)\",\"align\":\"center\",\"verticalAlign\":\"top\",\"strokeWidth\":0,\"stroke\":\"black\",\"lineHeight\":1.2,\"letterSpacing\":0,\"backgroundEnabled\":false,\"backgroundColor\":\"rgba(126,211,33,1.0)\",\"backgroundOpacity\":1,\"backgroundCornerRadius\":0.5,\"backgroundPadding\":0.5},{\"id\":\"fde56f4b-f069-4701-849a-2b0b26de81f7\",\"type\":\"group\",\"name\":\"listicle\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"8096cc9e-1e44-4d51-9aec-02b501632225\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"children\":[{\"id\":\"fgCnOUwaHx\",\"type\":\"svg\",\"name\":\"shape\",\"opacity\":0.85,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":359.9030473585297,\"y\":478.76543150252706,\"width\":625.5674379617722,\"height\":122.4691369949465,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":61,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"rgba(227,247,255,1.0)\"}},{\"id\":\"7GUq-TJntW\",\"type\":\"svg\",\"name\":\"shape\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":867.711425488929,\"y\":487.7040906535118,\"width\":104.59181869297598,\"height\":104.59181869297602,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/85a6dbda-6f21-4ff8-8724-945e0aa24a4b.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":0,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"rgba(1,62,119,1.0)\"}},{\"id\":\"M4zpztdk9G\",\"type\":\"text\",\"name\":\"h1\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":451.61776618257363,\"y\":521.1073171874981,\"width\":384,\"height\":40,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":3.2171928280565654,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"text\":\"Serene Atmosphere\",\"placeholder\":\"\",\"fontSize\":39,\"fontFamily\":\"Figtree\",\"fontStyle\":\"normal\",\"fontWeight\":\"500\",\"textDecoration\":\"\",\"fill\":\"rgba(1,62,119,1.0)\",\"align\":\"left\",\"verticalAlign\":\"top\",\"strokeWidth\":0,\"stroke\":\"black\",\"lineHeight\":1,\"letterSpacing\":0,\"backgroundEnabled\":false,\"backgroundColor\":\"rgba(126,211,33,1.0)\",\"backgroundOpacity\":1,\"backgroundCornerRadius\":0.5,\"backgroundPadding\":0.5},{\"id\":\"Eou7OqCbS3\",\"type\":\"svg\",\"name\":\"icon\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"is_premium\":false,\"platform\":\"predis\",\"asset_id\":\"058d17c5-a579-49da-bf52-b50b2a5fe6c8\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":885.7015167624481,\"y\":505.6941819270312,\"width\":68.61163614593755,\"height\":68.61163614593742,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZmlsbDojZTNmN2ZmIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHg9IjBweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeT0iMHB4Ij4KIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICA8cGF0aCBkPSJNMTEuOSwxOC42Yy00LjQsMC04LjQtMi41LTEwLjQtNi41Yy0wLjEtMC4xLTAuMS0wLjMsMC0wLjRjMi00LDYtNi41LDEwLjQtNi41YzQuNSwwLDguNSwyLjUsMTAuNCw2LjUgICAgYzAuMSwwLjEsMC4xLDAuMywwLDAuNEMyMC40LDE2LjIsMTYuNCwxOC42LDExLjksMTguNnogTTIuNCwxMmMxLjksMy42LDUuNSw1LjgsOS41LDUuOGM0LDAsNy43LTIuMiw5LjUtNS44ICAgIGMtMS45LTMuNi01LjUtNS44LTkuNS01LjhDNy45LDYuMiw0LjMsOC40LDIuNCwxMnoiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICA8L2c+CiAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgIDxwYXRoIGQ9Ik0xMS45LDE2LjJjLTAuMywwLTAuNS0wLjEtMC43LTAuM2wtMi44LTMuM2MwLDAtMC4xLTAuMS0wLjEtMC4xQzgsMTIsNy45LDExLjYsNy45LDExLjFjMC0xLjMsMS4xLTIuMywyLjUtMi4zICAgIGMwLjYsMCwxLjEsMC4yLDEuNSwwLjVjMC40LTAuMywxLTAuNSwxLjYtMC41YzEuNCwwLDIuNSwxLDIuNSwyLjNjMCwwLjUtMC4yLDAuOS0wLjQsMS4zYzAsMC0wLjEsMC4xLTAuMSwwLjFsLTIuOCwzLjMgICAgQzEyLjUsMTYuMSwxMi4yLDE2LjIsMTEuOSwxNi4yeiBNOS4xLDExLjlDOS4xLDExLjksOS4xLDExLjksOS4xLDExLjlsMi45LDMuNGwwLDBjMCwwLDAsMCwwLDBsMi44LTMuNGMwLjItMC4zLDAuMy0wLjYsMC4zLTAuOCAgICBjMC0wLjgtMC43LTEuNC0xLjYtMS40Yy0wLjUsMC0wLjksMC4yLTEuMiwwLjVjLTAuMiwwLjItMC41LDAuMi0wLjcsMGMtMC4zLTAuMy0wLjctMC41LTEuMi0wLjVjLTAuOSwwLTEuNiwwLjYtMS42LDEuNCAgICBDOC44LDExLjQsOC45LDExLjYsOS4xLDExLjl6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgPC9nPgogIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICA8cGF0aCBkPSJNMTEuOSwxOC42Yy0zLjcsMC02LjctMy02LjctNi43YzAtMy43LDMtNi43LDYuNy02LjdjMy43LDAsNi43LDMsNi43LDYuN0MxOC42LDE1LjYsMTUuNiwxOC42LDExLjksMTguNnogTTExLjksNi4yICAgIGMtMy4yLDAtNS43LDIuNi01LjcsNS43YzAsMy4yLDIuNiw1LjgsNS43LDUuOGMzLjIsMCw1LjgtMi42LDUuOC01LjhDMTcuNyw4LjgsMTUuMSw2LjIsMTEuOSw2LjJ6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgPC9nPgogIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgIDxwYXRoIGQ9Ik0xMS45LDQuNmMtMC4yLDAtMC40LTAuMi0wLjQtMC41VjNjMC0wLjIsMC4yLTAuNCwwLjQtMC40YzAuMywwLDAuNSwwLjIsMC41LDAuNHYxLjFDMTIuNCw0LjQsMTIuMiw0LjYsMTEuOSw0LjZ6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgICA8L2c+CiAgICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgICA8cGF0aCBkPSJNMTEuOSwyMS40Yy0wLjIsMC0wLjQtMC4yLTAuNC0wLjV2LTEuMWMwLTAuMywwLjItMC41LDAuNC0wLjVjMC4zLDAsMC41LDAuMiwwLjUsMC41djEuMSAgICAgIEMxMi40LDIxLjIsMTIuMiwyMS40LDExLjksMjEuNHoiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICAgIDwvZz4KICAgPC9nPgogICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgIDxwYXRoIGQ9Ik0xNy41LDZjLTAuMSwwLTAuMiwwLTAuMy0wLjFjLTAuMi0wLjItMC4yLTAuNSwwLTAuNkwxOCw0LjRjMC4yLTAuMiwwLjUtMC4yLDAuNiwwYzAuMiwwLjIsMC4yLDAuNCwwLDAuNmwtMC44LDAuOCAgICAgIEMxNy43LDUuOSwxNy42LDYsMTcuNSw2eiIgc3R5bGU9ImZpbGw6I2UzZjdmZiIvPgogICAgPC9nPgogICAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgICAgPHBhdGggZD0iTTUuNiwxOS43Yy0wLjEsMC0wLjIsMC0wLjMtMC4xYy0wLjItMC4yLTAuMi0wLjUsMC0wLjZsMC44LTAuOGMwLjItMC4yLDAuNS0wLjIsMC42LDBjMC4yLDAuMiwwLjIsMC41LDAsMC42bC0wLjgsMC44ICAgICAgQzUuOCwxOS42LDUuNywxOS43LDUuNiwxOS43eiIgc3R5bGU9ImZpbGw6I2UzZjdmZiIvPgogICAgPC9nPgogICA8L2c+CiAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgICAgPHBhdGggZD0iTTE4LjMsMTkuN2MtMC4xLDAtMC4yLDAtMC4zLTAuMWwtMC44LTAuOGMtMC4yLTAuMi0wLjItMC41LDAtMC42YzAuMi0wLjIsMC40LTAuMiwwLjYsMGwwLjgsMC44YzAuMiwwLjIsMC4yLDAuNSwwLDAuNiAgICAgIEMxOC41LDE5LjYsMTguNCwxOS43LDE4LjMsMTkuN3oiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICAgIDwvZz4KICAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgIDxwYXRoIGQ9Ik02LjQsNmMtMC4xLDAtMC4yLDAtMC4zLTAuMUw1LjMsNWMtMC4yLTAuMi0wLjItMC41LDAtMC42YzAuMi0wLjIsMC41LTAuMiwwLjYsMGwwLjgsMC44YzAuMiwwLjIsMC4yLDAuNCwwLDAuNiAgICAgIEM2LjYsNS45LDYuNSw2LDYuNCw2eiIgc3R5bGU9ImZpbGw6I2UzZjdmZiIvPgogICAgPC9nPgogICA8L2c+CiAgPC9nPgogPC9nPgo8L3N2Zz4K\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":0,\"colorsReplace\":{}}]},{\"id\":\"d033e1fa-9bc1-4d9b-b9ec-b3e54bf3b68f\",\"type\":\"group\",\"name\":\"listicle\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"f5ba55ad-f8a1-4c33-985d-fbcb4c6d8f55\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"children\":[{\"id\":\"NVGp_RceRu\",\"type\":\"svg\",\"name\":\"shape\",\"opacity\":0.85,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":-22.714199907819307,\"y\":619.6227254100335,\"width\":625.5674379617723,\"height\":122.4691369949465,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":61,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"rgba(227,247,255,1.0)\"}},{\"id\":\"xSUOyu5UKM\",\"type\":\"svg\",\"name\":\"shape\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":485.09417822257933,\"y\":628.5613845610188,\"width\":104.59181869297598,\"height\":104.59181869297602,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/85a6dbda-6f21-4ff8-8724-945e0aa24a4b.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":0,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"rgba(1,62,119,1.0)\"}},{\"id\":\"pC6VwhwP26\",\"type\":\"text\",\"name\":\"h1\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":69.00051891622479,\"y\":661.4785691057323,\"width\":384,\"height\":40,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":3.2171928280565654,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"text\":\"Signature Treatments\",\"placeholder\":\"\",\"fontSize\":39,\"fontFamily\":\"Figtree\",\"fontStyle\":\"normal\",\"fontWeight\":\"500\",\"textDecoration\":\"\",\"fill\":\"rgba(1,62,119,1.0)\",\"align\":\"left\",\"verticalAlign\":\"top\",\"strokeWidth\":0,\"stroke\":\"black\",\"lineHeight\":1,\"letterSpacing\":0,\"backgroundEnabled\":false,\"backgroundColor\":\"rgba(126,211,33,1.0)\",\"backgroundOpacity\":1,\"backgroundCornerRadius\":0.5,\"backgroundPadding\":0.5},{\"id\":\"KEmFVCJgvX\",\"type\":\"svg\",\"name\":\"icon\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"is_premium\":false,\"platform\":\"predis\",\"asset_id\":\"ce965115-b9fe-4932-8342-0feea2a80e43\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":503.0842694960986,\"y\":648.5477647953267,\"width\":64.61905822436046,\"height\":64.61905822436053,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZmlsbDojZTNmN2ZmIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHg9IjBweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeT0iMHB4Ij4KIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgIDxwYXRoIGQ9Ik0xMiwyMy41Yy0zLjYsMC02LjUtNC45LTYuNS05YzAtNC4zLDMuMi00LjMsNi4zLTQuM2gwLjVjMy4xLDAsNi4zLDAsNi4zLDQuM0MxOC41LDE4LjYsMTUuNiwyMy41LDEyLDIzLjV6IE0xMS44LDExLjIgICAgIGMtMy41LDAtNS4zLDAuMS01LjMsMy4zYzAsMy42LDIuNiw4LDUuNSw4YzMsMCw1LjUtNC40LDUuNS04YzAtMy4xLTEuOC0zLjMtNS4zLTMuM0gxMS44eiIgc3R5bGU9ImZpbGw6I2UzZjdmZiIvPgogICA8L2c+CiAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgPHBhdGggZD0iTTE4LDE1LjdjLTAuMSwwLTAuMSwwLTAuMiwwYy0wLjItMC4xLTAuMy0wLjMtMC4zLTAuNWMwLTAuMiwwLTAuNCwwLTAuN2MwLTMuMS0xLjgtMy4zLTUuMy0zLjNoLTAuNSAgICAgYy0zLjUsMC01LjMsMC4xLTUuMywzLjNjMCwwLjIsMCwwLjQsMCwwLjdjMCwwLjItMC4xLDAuNC0wLjMsMC41Yy0wLjIsMC4xLTAuNCwwLTAuNi0wLjJjLTAuOS0xLjItMS40LTIuNy0xLjQtNC4yICAgICBDNC4yLDcuMyw3LjcsNCwxMiw0YzQuMywwLDcuOCwzLjMsNy44LDcuNGMwLDEuNS0wLjUsMi45LTEuNCw0LjJDMTguMywxNS42LDE4LjIsMTUuNywxOCwxNS43eiBNMTIuMiwxMC4yYzIuOCwwLDUuNywwLDYuMiwzLjEgICAgIGMwLjItMC42LDAuMy0xLjMsMC4zLTJjMC0zLjUtMy02LjQtNi44LTYuNGMtMy43LDAtNi44LDIuOS02LjgsNi40YzAsMC43LDAuMSwxLjQsMC4zLDJjMC41LTMuMSwzLjQtMy4xLDYuMi0zLjFIMTIuMnoiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICAgPC9nPgogICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgIDxwYXRoIGQ9Ik0xNi42LDYuNWMtMC4xLDAtMC4yLDAtMC4zLTAuMUMxNS4xLDUuNSwxMy42LDUsMTIsNWMtMS42LDAtMy4xLDAuNS00LjMsMS41QzcuNSw2LjUsNy4zLDYuNiw3LjIsNi41ICAgICBDNyw2LjQsNi45LDYuMyw2LjksNi4xYzAtMC4yLTAuMS0wLjUtMC4xLTAuN2MwLTIuNywyLjMtNC45LDUuMi00LjlzNS4yLDIuMiw1LjIsNC45YzAsMC4yLDAsMC41LTAuMSwwLjdjMCwwLjItMC4xLDAuMy0wLjMsMC40ICAgICBDMTYuOCw2LjUsMTYuNyw2LjUsMTYuNiw2LjV6IE0xMiwxLjVjLTIuMiwwLTQsMS42LTQuMiwzLjZjMi41LTEuNSw1LjktMS41LDguNCwwQzE2LDMuMSwxNC4yLDEuNSwxMiwxLjV6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgIDwvZz4KICA8L2c+CiAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgPHBhdGggZD0iTTkuNCwxNi43Yy0wLjUsMC0wLjktMC4yLTEuMy0wLjVsMC43LTAuN2MwLjMsMC4zLDAuOCwwLjMsMS4yLDBsMC43LDAuN0MxMC4zLDE2LjUsOS45LDE2LjcsOS40LDE2Ljd6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgIDwvZz4KICAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgICA8cGF0aCBkPSJNMTQuNiwxNi43Yy0wLjUsMC0wLjktMC4yLTEuMy0wLjVsMC43LTAuN2MwLjMsMC4zLDAuOCwwLjMsMS4yLDBsMC43LDAuN0MxNS41LDE2LjUsMTUuMSwxNi43LDE0LjYsMTYuN3oiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICAgPC9nPgogICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgIDxwYXRoIGQ9Ik0xMiwyMC40Yy0wLjUsMC0wLjktMC4yLTEuMy0wLjVsMC43LTAuN2MwLjMsMC4zLDAuOCwwLjMsMS4yLDBsMC43LDAuN0MxMi45LDIwLjIsMTIuNSwyMC40LDEyLDIwLjR6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgIDwvZz4KICA8L2c+CiAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgPHBhdGggZD0iTTUuNiwxOC4xYy0xLDAtMi0wLjctMi4yLTEuOGMtMC4xLTAuNiwwLTEuMiwwLjMtMS43YzAuMy0wLjUsMC44LTAuOSwxLjQtMWwwLjIsMWMtMC4zLDAuMS0wLjYsMC4zLTAuOCwwLjYgICAgIHMtMC4yLDAuNi0wLjIsMWMwLjIsMC43LDAuOCwxLjEsMS41LDFsMC4yLDFDNS45LDE4LjEsNS44LDE4LjEsNS42LDE4LjF6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgIDwvZz4KICAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgICA8cGF0aCBkPSJNMTguNCwxOC4xYy0wLjIsMC0wLjMsMC0wLjUtMC4xbDAuMi0xYzAuMywwLjEsMC43LDAsMS0wLjJzMC41LTAuNSwwLjYtMC44YzAuMS0wLjMsMC0wLjctMC4yLTEgICAgIGMtMC4yLTAuMy0wLjUtMC41LTAuOC0wLjZsMC4yLTFjMC42LDAuMSwxLjEsMC41LDEuNCwxczAuNCwxLjEsMC4zLDEuN2MtMC4xLDAuNi0wLjUsMS4xLTEsMS40QzE5LjIsMTgsMTguOCwxOC4xLDE4LjQsMTguMXoiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICAgPC9nPgogIDwvZz4KIDwvZz4KPC9zdmc+Cg==\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":0,\"colorsReplace\":{}}]},{\"id\":\"428bc96a-97e0-42af-a234-f1fe4000772c\",\"type\":\"group\",\"name\":\"listicle\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"predis_id\":\"6f4fa638-7a4d-458f-88a8-5ec2ede3de76\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"children\":[{\"id\":\"WUOKOC1o71\",\"type\":\"svg\",\"name\":\"shape\",\"opacity\":0.85,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":254.91960873957322,\"y\":771.6838598310189,\"width\":625.5674379617724,\"height\":122.4691369949465,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/46509543-0804-4f29-be64-6c7fea75705d.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":61,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"rgba(227,247,255,1.0)\"}},{\"id\":\"TR_Z1zSUBE\",\"type\":\"svg\",\"name\":\"shape\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":762.7279868699724,\"y\":780.6225189820044,\"width\":104.59181869297598,\"height\":104.59181869297602,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"https://assets.predis.ai/predis-editor-elements/85a6dbda-6f21-4ff8-8724-945e0aa24a4b.svg\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":0,\"colorsReplace\":{\"rgb(0, 161, 255)\":\"rgba(1,62,119,1.0)\"}},{\"id\":\"vuD3IJfwn7\",\"type\":\"text\",\"name\":\"h1\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":346.63432756361675,\"y\":814.0919974260387,\"width\":385,\"height\":40,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":3.2171928280565654,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"text\":\"Skilled Therapists\",\"placeholder\":\"\",\"fontSize\":39,\"fontFamily\":\"Figtree\",\"fontStyle\":\"normal\",\"fontWeight\":\"500\",\"textDecoration\":\"\",\"fill\":\"rgba(1,62,119,1.0)\",\"align\":\"left\",\"verticalAlign\":\"top\",\"strokeWidth\":0,\"stroke\":\"black\",\"lineHeight\":1,\"letterSpacing\":0,\"backgroundEnabled\":false,\"backgroundColor\":\"rgba(126,211,33,1.0)\",\"backgroundOpacity\":1,\"backgroundCornerRadius\":0.5,\"backgroundPadding\":0.5},{\"id\":\"8aGVBIKfml\",\"type\":\"svg\",\"name\":\"icon\",\"opacity\":1,\"custom\":{\"editable\":true,\"edited\":true,\"custom\":true,\"is_premium\":false,\"platform\":\"predis\",\"asset_id\":\"76d339bf-3de8-4ca3-aabf-7ee03933cbc2\"},\"visible\":true,\"selectable\":true,\"removable\":true,\"alwaysOnTop\":false,\"showInExport\":true,\"x\":781.1512061972869,\"y\":799.0457383093193,\"width\":67.74538003834734,\"height\":67.74538003834753,\"rotation\":0,\"animations\":[],\"blurEnabled\":false,\"blurRadius\":10,\"brightnessEnabled\":false,\"brightness\":0,\"sepiaEnabled\":false,\"grayscaleEnabled\":false,\"shadowEnabled\":false,\"shadowBlur\":5,\"shadowOffsetX\":0,\"shadowOffsetY\":0,\"shadowColor\":\"black\",\"shadowOpacity\":1,\"draggable\":true,\"resizable\":true,\"contentEditable\":true,\"styleEditable\":true,\"src\":\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZmlsbDojZTNmN2ZmIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIHg9IjBweCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeT0iMHB4Ij4KIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgIDxwYXRoIGQ9Ik0xNS40LDIyLjhIOS4zYy0wLjMsMC0wLjUtMC4yLTAuNS0wLjRWMTJjMC0wLjIsMC4xLTAuNCwwLjMtMC40bDYuMS0yYzAuMiwwLDAuMywwLDAuNCwwLjFjMC4xLDAuMSwwLjIsMC4yLDAuMiwwLjQgICAgIHYxMi4zQzE1LjgsMjIuNiwxNS42LDIyLjgsMTUuNCwyMi44eiBNOS43LDIyaDUuMlYxMC43bC01LjIsMS43VjIyeiIgc3R5bGU9ImZpbGw6I2UzZjdmZiIvPgogICA8L2c+CiAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgPHBhdGggZD0iTTkuMywxNS45Yy0wLjIsMC0wLjQtMC4xLTAuNC0wLjNjLTAuMS0wLjIsMC0wLjUsMC4zLTAuNmw2LjEtMmMwLjMtMC4xLDAuNSwwLjEsMC42LDAuM2MwLjEsMC4yLTAuMSwwLjUtMC4zLDAuNWwtNi4xLDIgICAgIEM5LjQsMTUuOSw5LjMsMTUuOSw5LjMsMTUuOXoiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICAgPC9nPgogICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgIDxwYXRoIGQ9Ik05LjMsMTkuNGMtMC4yLDAtMC40LTAuMS0wLjQtMC4zYy0wLjEtMC4zLDAtMC41LDAuMy0wLjZsNi4xLTJjMC4zLTAuMSwwLjUsMC4xLDAuNiwwLjNjMC4xLDAuMy0wLjEsMC41LTAuMywwLjZsLTYuMSwyICAgICBDOS40LDE5LjMsOS4zLDE5LjQsOS4zLDE5LjR6IiBzdHlsZT0iZmlsbDojZTNmN2ZmIi8+CiAgIDwvZz4KICAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgICA8cGF0aCBkPSJNOS4zLDIyLjhjLTAuMiwwLTAuNC0wLjEtMC40LTAuM2MtMC4xLTAuMiwwLTAuNSwwLjMtMC41bDYuMS0yYzAuMy0wLjEsMC41LDAsMC42LDAuM2MwLjEsMC4yLTAuMSwwLjUtMC4zLDAuNmwtNi4xLDIgICAgIEM5LjQsMjIuOCw5LjMsMjIuOCw5LjMsMjIuOHoiIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiLz4KICAgPC9nPgogIDwvZz4KICA8ZyBzdHlsZT0iZmlsbDojZTNmN2ZmIj4KICAgPGcgc3R5bGU9ImZpbGw6I2UzZjdmZiI+CiAgICA8cGF0aCBkPSJNMTIuMyw5LjhjLTAuMSwwLTAuMiwwLTAuMy0wLjFsLTAuNC0wLjNjLTEuMi0wLjktMi0xLjUtMi0zLjRjMC0xLjksMC45LTMuNywyLjQtNC44YzAuMS0wLjEsMC40LTAuMSwwLjUsMCAgICAgQzE0LjEsMi40LDE1LDQuMiwxNSw2LjFjMCwxLjktMC45LDIuNS0yLDMuNGwtMC40LDAuM0MxMi41LDkuOCwxMi40LDkuOCwxMi4zLDkuOHogTTEyLjMsMi4yYy0xLjEsMS0xLjgsMi40LTEuOCwzLjkgICAgIGMwLDEuNCwwLjUsMS44LDEuNiwyLjdsMC4xLDAuMWwwLjEtMC4xYzEuMS0wLjgsMS42LTEuMiwxLjYtMi43QzE0LjEsNC42LDEzLjQsMy4yLDEyLjMsMi4yeiIgc3R5bGU9ImZpbGw6I2UzZjdmZiIvPgogICA8L2c+CiAgIDxnIHN0eWxlPSJmaWxsOiNlM2Y3ZmYiPgogICAgPHBhdGggZD0iTTEyLjMsOS44Yy0wLjEsMC0wLjIsMC0wLjMtMC4xbC0wLjMtMC4yYy0wLjctMC41LTEuMi0xLTEuMi0yLjJjMC0xLjIsMC41LTIuMywxLjUtM2MwLjEtMC4xLDAuNC0wLjEsMC41LDAgICAgIGMwLjksMC43LDEuNSwxLjgsMS41LDNjMCwxLjItMC42LDEuNy0xLjMsMi4ybC0wLjIsMC4yQzEyLjUsOS44LDEyLjQsOS44LDEyLjMsOS44eiBNMTIuMyw1LjNjLTAuNSwwLjYtMC45LDEuMy0wLjksMi4xICAgICBjMCwwLjcsMC4zLDAuOSwwLjksMS40YzAuNi0wLjUsMC45LTAuNywwLjktMS40QzEzLjIsNi42LDEyLjksNS45LDEyLjMsNS4zeiIgc3R5bGU9ImZpbGw6I2UzZjdmZiIvPgogICA8L2c+CiAgPC9nPgogPC9nPgo8L3N2Zz4K\",\"maskSrc\":\"\",\"cropX\":0,\"cropY\":0,\"cropWidth\":1,\"cropHeight\":1,\"keepRatio\":false,\"flipX\":false,\"flipY\":false,\"borderColor\":\"black\",\"borderSize\":0,\"cornerRadius\":0,\"colorsReplace\":{}}]}],\"width\":\"auto\",\"height\":\"auto\",\"background\":\"white\",\"bleed\":0,\"duration\":5000}],\"audios\":[],\"unit\":\"px\",\"dpi\":72,\"custom\":\"\"}
 }`)
  }
  // Add more templates as needed
];

const Templates = () => {
  const navigate = useNavigate();

  const handleEdit = (template) => {
    console.log(template.data.data);
    navigate("/editor", { state: { templateData: template.data.data } });
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {sampleTemplates.map((template) => (
        <div
          key={template.id}
          style={{
            width: "300px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <img
            src={template.thumbnail}
            alt={template.name}
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />
          <div style={{ padding: "10px" }}>
            <h3 style={{ fontSize: "18px", margin: "0 0 10px" }}>
              {template.name}
            </h3>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={() => handleEdit(template)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Templates;
