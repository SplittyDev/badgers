import { NextRequest } from "next/server"

import { Badge, GitHub } from '@/utils'

interface Params {
    params: {
        owner: string
        repo: string
    }
}

export async function GET(request: NextRequest, { params: { owner, repo } }: Params) {
    const resp = await GitHub.wrapRequest(
        octokit => octokit.issues.listForRepo({ owner, repo, state: 'closed' })
    )
    const issues = resp.data?.filter(issue => issue.pull_request === undefined)
    return Badge.generate('Closed Issues', issues?.length?.toString() ?? 'None', {
        color: issues?.length === 0 ? 'green' : 'orange'
    })
}
