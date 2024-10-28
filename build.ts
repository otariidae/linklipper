import * as esbuild from "npm:esbuild@0.24.0";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader@0.11.0";

await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["./popup.ts"],
  outfile: "./dist/popup.js",
  bundle: true,
  format: "iife",
});

esbuild.stop();
