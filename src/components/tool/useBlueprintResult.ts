'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { generateCircle } from '@/lib/geometry/circle';
import { generateEllipse } from '@/lib/geometry/ellipse';
import type { BlueprintResult } from '@/lib/geometry/types';
import type { BuilderState } from './controlTypes';
import type { BlueprintWorkerRequest, BlueprintWorkerResponse } from '@/workers/blueprintWorker';

function isLayeredShape(shape: BuilderState['shape']) {
  return shape === 'sphere' || shape === 'dome';
}

function generateFlatBlueprint(state: BuilderState): BlueprintResult {
  if (state.shape === 'ellipse') {
    return generateEllipse({ width: state.width, height: state.height, fillMode: state.fillMode, thickness: state.thickness });
  }
  return generateCircle({
    inputMode: state.inputMode,
    diameter: state.diameter,
    radius: state.radius,
    fillMode: state.fillMode,
    thickness: state.thickness
  });
}

function workerSupported() {
  return typeof window !== 'undefined' && typeof Worker !== 'undefined';
}

export function useBlueprintResult(state: BuilderState, initialResult: BlueprintResult) {
  const workerRef = useRef<Worker | null>(null);
  const jobIdRef = useRef(0);
  const [workerResult, setWorkerResult] = useState<BlueprintResult | null>(() => (isLayeredShape(initialResult.shape) ? initialResult : null));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const flatResult = useMemo(() => {
    if (isLayeredShape(state.shape)) return null;
    return generateFlatBlueprint(state);
  }, [state]);

  useEffect(() => {
    if (!isLayeredShape(state.shape)) {
      setPending(false);
      setError('');
      return;
    }

    const jobId = jobIdRef.current + 1;
    jobIdRef.current = jobId;
    setPending(true);
    setError('');

    if (!workerSupported()) {
      setError('Background blueprint worker is unavailable in this browser.');
      setPending(false);
      return;
    }

    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../../workers/blueprintWorker.ts', import.meta.url), { type: 'module' });
    }

    const worker = workerRef.current;
    worker.onmessage = (event: MessageEvent<BlueprintWorkerResponse>) => {
      if (event.data.id !== jobIdRef.current) return;
      setPending(false);
      if (event.data.ok) {
        setWorkerResult(event.data.result);
        setError('');
      } else {
        setError(event.data.error);
      }
    };
    worker.onerror = () => {
      if (jobId !== jobIdRef.current) return;
      setPending(false);
      setError('Background blueprint worker failed. Try a smaller size or reload the page.');
    };

    worker.postMessage({ id: jobId, state } satisfies BlueprintWorkerRequest);
  }, [state]);

  useEffect(() => () => workerRef.current?.terminate(), []);

  return {
    result: flatResult || workerResult || initialResult,
    pending,
    error
  };
}
