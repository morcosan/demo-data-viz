import { ENV__BASE_PATH } from '@app/env'

interface WorkerPayload {
  type: string | number
  body: unknown
}

function runWebWorker<T>(workerPath: string, payload: WorkerPayload, transfer?: Transferable[]): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(ENV__BASE_PATH + workerPath, { type: 'module' })

    worker.onmessage = (event: MessageEvent<T>) => {
      resolve(event.data)
      worker.terminate()
    }
    worker.onerror = (error: ErrorEvent) => {
      reject(error)
      worker.terminate()
    }
    worker.onmessageerror = () => {
      reject(new Error(`Deserialization failed for "${workerPath}"`))
      worker.terminate()
    }
    worker.postMessage(payload, transfer || [])
  })
}

export { runWebWorker, type WorkerPayload }
