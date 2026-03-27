import { useElementalClient } from '@yottagraph-app/elemental-api/client';

interface Property {
    pid: number;
    name: string;
    type: string;
}

interface Flavor {
    fid: number;
    name: string;
}

let cachedSchema: {
    properties: Property[];
    flavors: Flavor[];
    propertyMap: Map<string, number>;
    flavorMap: Map<string, number>;
} | null = null;

export function useElementalSchema() {
    const client = useElementalClient();

    const schema = ref(cachedSchema);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    async function loadSchema() {
        if (cachedSchema) {
            schema.value = cachedSchema;
            return cachedSchema;
        }

        loading.value = true;
        error.value = null;

        try {
            const res = await client.getSchema();

            const properties = (res.schema?.properties ??
                (res as any).properties ??
                []) as Property[];
            const flavors = (res.schema?.flavors ?? (res as any).flavors ?? []) as Flavor[];

            const propertyMap = new Map<string, number>();
            properties.forEach((p) => propertyMap.set(p.name, p.pid));

            const flavorMap = new Map<string, number>();
            flavors.forEach((f) => flavorMap.set(f.name, f.fid));

            cachedSchema = { properties, flavors, propertyMap, flavorMap };
            schema.value = cachedSchema;

            return cachedSchema;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    function getPid(propertyName: string): number | undefined {
        return schema.value?.propertyMap.get(propertyName);
    }

    function getFid(flavorName: string): number | undefined {
        return schema.value?.flavorMap.get(flavorName);
    }

    return {
        schema: readonly(schema),
        loading: readonly(loading),
        error: readonly(error),
        loadSchema,
        getPid,
        getFid,
    };
}
