import { toNano } from '@ton/core';
import { Adapter } from '../wrappers/Adapter';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const adapter = provider.open(
        Adapter.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Adapter')
        )
    );

    await adapter.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(adapter.address);

    console.log('ID', await adapter.getID());
}
