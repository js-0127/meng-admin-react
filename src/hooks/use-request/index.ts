import { useCallback, useEffect, useRef, useState } from "react";
import { Response } from "~/request";

interface RequesetOptions {
    manual?: boolean;
    defaultParams?: any[]
}

interface RequesetResponse<T>{
    error: boolean | undefined;
    data: T | undefined;
    loading: boolean
    run(...params: any) :void
    runAsync(...params: any): Response<T>
    refresh(): void;
}

export function useRequest<T>(
    serviceMethod: (...args: any) => Response<T>,
    options?: RequesetOptions
): RequesetResponse<T> {
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<T>()
    const [error, setError] = useState<boolean>()

    const paramsRef = useRef<any[]>([]);

    const resolveData = useCallback(async () => {
        setLoading(true)
        const [error, requestdata] = await serviceMethod(...(options?.defaultParams || []))
        setLoading(false)
        setData(requestdata)
        setError(error)
    }, [serviceMethod, options])


    const runAsync = useCallback(async (...params: any) => {
        paramsRef.current = params;
         setLoading(true)
         const res = await serviceMethod(...params)
         const [err, data] = res
         setError(err)
         setLoading(false)
         setData(data)
         return res
    }, [serviceMethod])

    const run = useCallback(async (...params: any) => {
        await runAsync(...params)
    }, [serviceMethod])
    
    const refresh = useCallback(async() => {
         runAsync(...paramsRef.current)
    }, [runAsync])

    useEffect(() => {
        if(!options?.manual) {
            resolveData()
        }
    }, [options])

    return {
        loading,
        error,
        data,
        run,
        runAsync,
        refresh
    }
}