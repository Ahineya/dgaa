import {useStoreSubscribe} from "@dgaa/use-store-subscribe";
import {mainStore} from "../../stores/main.store";
import {useEffect, useLayoutEffect, useRef, useState} from "react";

import * as twgl from 'twgl.js';

import './image-viewer.scss';


const vertextShader = `#version 300 es
in vec2 a_position;

out vec2 texCoord;

void main() {
  gl_Position = vec4(a_position, 0, 1);
  texCoord = a_position * 0.5 + 0.5;;
}
`;

// And here are shaders that can be used to render an image to a canvas:

const imageFragmentShader = `#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform float u_contrast;
uniform float u_brightness;

in vec2 texCoord;

out vec4 outColor;

void main() {
  vec4 texColor = texture(u_image, texCoord);
  texColor.rgb = ((texColor.rgb - 0.5) * max(u_contrast, 0.0)) + 0.5 + u_brightness;
  texColor.rgb = clamp(texColor.rgb, 0.0, 1.0);
  outColor = texColor;
}
`;

const blurFragmentShaderHorizontal = `#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform float u_pixelSize;

in vec2 texCoord;

out vec4 outColor;

void main() {
  float weightSum = 0.0;
  vec4 colorSum = vec4(0.0);
  for (int i = -4; i <= 4; i++) {
    float weight = exp(-float(i*i) / 16.0); // Assuming sigma=2
    vec4 color = texture(u_image, texCoord + vec2(u_pixelSize * float(i), 0.0));
    colorSum += color * weight;
    weightSum += weight;
  }
  outColor = colorSum / weightSum;
}
`;

const blurFragmentShaderVertical = `#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform float u_pixelSize;

in vec2 texCoord;

out vec4 outColor;

void main() {
  float weightSum = 0.0;
  vec4 colorSum = vec4(0.0);
  for (int i = -4; i <= 4; i++) {
    float weight = exp(-float(i*i) / 16.0); // Assuming sigma=2
    vec4 color = texture(u_image, texCoord + vec2(0.0, u_pixelSize * float(i)));
    colorSum += color * weight;
    weightSum += weight;
  }
  outColor = colorSum / weightSum;
}
`;

const clarityFragmentShader = `#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform float u_clarity;
uniform float u_contrast;
uniform float u_brightness;

in vec2 texCoord;

out vec4 outColor;

#define SHARPEN_FACTOR 4.0

vec4 sharpenMask (sampler2D tex, vec2 fragCoord)
{
    // Colors
    vec4 up = texture (tex, (fragCoord + vec2 (0, 1)) / 500.);
    vec4 left = texture (tex, (fragCoord + vec2 (-1, 0)/ 500.));
    vec4 center = texture (tex, fragCoord);
    vec4 right = texture (tex, (fragCoord + vec2 (1, 0)/ 500.));
    vec4 down = texture (tex, (fragCoord + vec2 (0, -1)/ 500.));

    // Return edge detection
    return (1.0 + 4.0*SHARPEN_FACTOR)*center -SHARPEN_FACTOR*(up + left + right + down);
}

void main() {
  vec4 original = texture(u_image, texCoord);
  original.rgb = ((original.rgb - 0.5) * max(u_contrast, 0.0)) + 0.5 + u_brightness;
  original.rgb = clamp(original.rgb, 0.0, 1.0);

  vec4 sharpened = mix(original, sharpenMask(u_image, texCoord), u_clarity);
  outColor =
}
`;

function useDebounce(clarity: number, number: number) {
  const [debouncedClarity, setDebouncedClarity] = useState(clarity);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedClarity(clarity);
    }, number);

    return () => clearTimeout(timeout);
  }, [clarity, number]);

  return debouncedClarity;
}

export const ImageViewer = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const image = useStoreSubscribe(mainStore.image);

  const state = useStoreSubscribe(mainStore.state);

  useLayoutEffect(() => {
    if (!image) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('webgl2');

    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 500 * dpr;
    canvas.height = 500 * dpr;

    const texture = twgl.createTexture(ctx, {src: image, flipY: 1});

    const clarityProgramInfo = twgl.createProgramInfo(ctx, [vertextShader, clarityFragmentShader]);

    const arrays = {
      a_position: {
        numComponents: 2, data: [
          -1, -1,
          -1, 1,
          1, -1,
          1, 1,
        ]
      },
      indices: [0, 1, 2, 3],
    };

    const bufferInfo = twgl.createBufferInfoFromArrays(ctx, arrays);

    ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);


    // clarity pass
    ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
    ctx.useProgram(clarityProgramInfo.program);
    twgl.setBuffersAndAttributes(ctx, clarityProgramInfo, bufferInfo);


    function render() {

      if (!ctx) {
        requestAnimationFrame(render);
        return;
      }

      twgl.setUniforms(clarityProgramInfo, {
        u_image: texture,
        u_clarity: mainStore.state.getValue().clarity, // Adjust this value to get the desired clarity
        u_contrast: mainStore.state.getValue().contrast, // Adjust this value to set the contrast
        u_brightness: mainStore.state.getValue().brightness, // Adjust this value to set the brightness
      });
      twgl.drawBufferInfo(ctx, bufferInfo, ctx.TRIANGLE_STRIP);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, [image]);

  return (
    <div className="image-viewer">
      <div className="image-controls">
        Contrast
        <input type="range" min="0" max="10" step="0.01" value={state.contrast}
               onChange={(e) => mainStore.setContrast(parseFloat(e.target.value))}/>
        Brightness
        <input type="range" min="-1" max="1" step="0.01" value={state.brightness}
               onChange={(e) => mainStore.setBrightness(parseFloat(e.target.value))}/>
        Clarity
        <input type="range" min="0" max="1" step="0.01" value={state.clarity}
               onChange={(e) => mainStore.setClarity(parseFloat(e.target.value))}/>
      </div>
      <canvas
        ref={canvasRef}
        style={{width: '500px', height: '500px'}}
      />
    </div>
  );
}
