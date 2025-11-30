export async function fetcher<T = any>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    const res = await fetch(input, init)

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'An error occurred while fetching the data.')
    }

    return res.json()
}
