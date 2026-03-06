import init, { greet, burn } from "../rust-wasm-demo/pkg/rust_wasm_demo.js"

const out = document.getElementById("out")

function log(msg) {
  out.textContent += `\n${msg}`
}

async function run() {
  await init()

  out.textContent = "Wasm initialized ✅"
  log(greet("CEH seminar"))

  document.getElementById("btnGreet").addEventListener("click", () => {
    log(greet("Student"))
  })

  document.getElementById("btnBurn").addEventListener("click", () => {
    out.textContent =
      "Running burn()... (watch CPU in Task Manager / Activity Monitor)"
    const iterations = 4_294_967_295
    const result = burn(iterations)
    log(`burn(${iterations}) result = ${result}`)
    log("Done.")
  })

  document
    .getElementById("btnBurnParallel")
    .addEventListener("click", async () => {
      const cores = navigator.hardwareConcurrency || 4
      const workerCount = Math.min(cores, 16)

      const iterationsPerWorker = 4_294_967_295

      out.textContent =
        `Running burn() in parallel...\nWorkers: ${workerCount}\n` +
        `Iterations per worker: ${iterationsPerWorker}\n` +
        `Open Task Manager/Activity Monitor to see multiple cores active.`

      const workers = []
      const promises = []

      const t0 = performance.now()

      for (let i = 0; i < workerCount; i++) {
        const w = new Worker("./worker.js", { type: "module" })
        workers.push(w)

        promises.push(
          new Promise((resolve, reject) => {
            w.onmessage = (e) => resolve(e.data.result)
            w.onerror = reject
            w.postMessage({ iterations: iterationsPerWorker })
          }),
        )
      }

      let results = []
      try {
        results = await Promise.all(promises)
      } finally {
        workers.forEach((w) => w.terminate())
      }

      const t1 = performance.now()
      const checksum = results.reduce((a, b) => a ^ b, 0)

      out.textContent =
        `Parallel run finished ✅\nWorkers: ${workerCount}\n` +
        `Checksum (XOR of results): ${checksum}\n` +
        `Elapsed: ${(t1 - t0).toFixed(1)} ms\n\n`
    })
}

run().catch((e) => {
  out.textContent = "Error initializing Wasm:\n" + e
})
