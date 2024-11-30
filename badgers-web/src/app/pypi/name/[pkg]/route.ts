import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import PyPI from '@/utils/PyPI'

interface Params {
    params: Promise<{
        pkg: string
    }>
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    const {
        pkg
    } = params;

    const data = await PyPI.getPackage(pkg, 'latest')
    if (data === null) return await Badge.error(request, 'pypi')
    return await Badge.generate(request, 'pypi', `${data.name}`)
}

export const runtime = 'edge'
