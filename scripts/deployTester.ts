import { toNano } from '@ton/core';
import { Tester } from '../wrappers/Tester';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tester = provider.open(
        Tester.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Tester')
        )
    );

    await tester.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(tester.address);

    console.log('ID', await tester.getID());
}
