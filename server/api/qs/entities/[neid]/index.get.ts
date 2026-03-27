export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const neid = getRouterParam(event, 'neid');

    if (!neid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'NEID is required',
        });
    }

    const gatewayUrl = config.public.gatewayUrl;
    const orgId = config.public.tenantOrgId;
    const apiKey = config.qsApiKey;

    if (!gatewayUrl || !orgId || !apiKey) {
        throw createError({
            statusCode: 503,
            statusMessage: 'Query Server not configured',
        });
    }

    try {
        const response = await $fetch(`${gatewayUrl}/api/qs/${orgId}/entities/${neid}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
            },
        });

        return response;
    } catch (error: any) {
        console.error('Query Server proxy error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Query Server request failed',
        });
    }
});
