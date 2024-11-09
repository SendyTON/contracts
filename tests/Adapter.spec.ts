import { compile } from '@ton/blueprint';
import { Cell, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Adapter } from '../wrappers/Adapter';

describe('Adapter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Adapter');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let adapter: SandboxContract<Adapter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        adapter = blockchain.openContract(
            Adapter.createFromConfig(
                {
                    tasksDict: new Cell(),
                    managerAddress: deployer.address,
                },
                code,
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await adapter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: adapter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and adapter are ready to use
    });

    // it('should increase counter', async () => {
    //     const increaseTimes = 3;
    //     for (let i = 0; i < increaseTimes; i++) {
    //         console.log(`increase ${i + 1}/${increaseTimes}`);

    //         const increaser = await blockchain.treasury('increaser' + i);

    //         const counterBefore = await adapter.getCounter();

    //         console.log('counter before increasing', counterBefore);

    //         const increaseBy = Math.floor(Math.random() * 100);

    //         console.log('increasing by', increaseBy);

    //         const increaseResult = await adapter.sendIncrease(increaser.getSender(), {
    //             increaseBy,
    //             value: toNano('0.05'),
    //         });

    //         expect(increaseResult.transactions).toHaveTransaction({
    //             from: increaser.address,
    //             to: adapter.address,
    //             success: true,
    //         });

    //         const counterAfter = await adapter.getCounter();

    //         console.log('counter after increasing', counterAfter);

    //         expect(counterAfter).toBe(counterBefore + increaseBy);
    //     }
    // });
});
