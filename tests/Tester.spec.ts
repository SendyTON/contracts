import { compile } from '@ton/blueprint';
import { Cell, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Tester } from '../wrappers/Tester';

describe('Tester', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Tester');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tester: SandboxContract<Tester>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        tester = blockchain.openContract(
            Tester.createFromConfig(
                {
                    resultsDict: new Cell(),
                    managerAddress: deployer.address,
                },
                code,
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await tester.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tester.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tester are ready to use
    });

    // it('should increase counter', async () => {
    //     const increaseTimes = 3;
    //     for (let i = 0; i < increaseTimes; i++) {
    //         console.log(`increase ${i + 1}/${increaseTimes}`);

    //         const increaser = await blockchain.treasury('increaser' + i);

    //         const counterBefore = await tester.getCounter();

    //         console.log('counter before increasing', counterBefore);

    //         const increaseBy = Math.floor(Math.random() * 100);

    //         console.log('increasing by', increaseBy);

    //         const increaseResult = await tester.sendIncrease(increaser.getSender(), {
    //             increaseBy,
    //             value: toNano('0.05'),
    //         });

    //         expect(increaseResult.transactions).toHaveTransaction({
    //             from: increaser.address,
    //             to: tester.address,
    //             success: true,
    //         });

    //         const counterAfter = await tester.getCounter();

    //         console.log('counter after increasing', counterAfter);

    //         expect(counterAfter).toBe(counterBefore + increaseBy);
    //     }
    // });
});
