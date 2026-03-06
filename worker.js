import init, { burn } from "../rust-wasm-demo/pkg/rust_wasm_demo.js"

let ready = false

self.onmessage = async (e) => {
  const { iterations } = e.data

  if (!ready) {
    await init()
    ready = true
  }

  const result = burn(iterations)
  self.postMessage({ result })
}
