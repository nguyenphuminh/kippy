import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    input: "src/index.ts",
    output: { file: "dist/bundle.min.js", format: "esm" },
    plugins: [
        typescript({ declaration: true, declarationDir: "dist/types" }),
        terser()
    ]
}
