import type { NextRequest } from 'next/server'

import Badge from '@/utils/Badge'
import GitHub from '@/utils/GitHub'

interface Params {
    params: Promise<{
        owner: string
        repo: string
        branch: string
    }>
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;

    const {
        owner,
        repo,
        branch
    } = params;

    // Fetch all checks for latest commit
    const allChecksData = await GitHub.wrapRequest(octokit =>
        octokit.checks.listForRef({ owner, repo, ref: branch }),
    )

    // Get all check results
    const checkResults = allChecksData.data?.check_runs.map(
        check => check.conclusion,
    )
    if (checkResults === undefined) return await Badge.error(request, 'github')

    // Combine check results
    const combinedConclusion = GitHub.getCombinedCheckConclusion(
        checkResults as string[],
    )

    return await Badge.generate(request, 'checks', combinedConclusion.status, {
        color: combinedConclusion.color,
    })
}
