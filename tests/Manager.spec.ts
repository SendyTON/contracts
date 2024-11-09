import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Manager } from '../wrappers/Manager';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Manager', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Manager');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let manager: SandboxContract<Manager>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        manager = blockchain.openContract(
            Manager.createFromConfig(
                {
                    taskCounter: 0,
                    adaptersDict: new Cell(),
                    ownerAddress: deployer.address,
                },
                code,
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await manager.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: manager.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and manager are ready to use
    });

    // it('should increase counter', async () => {
    //     const increaseTimes = 3;
    //     for (let i = 0; i < increaseTimes; i++) {
    //         console.log(`increase ${i + 1}/${increaseTimes}`);

    //         const increaser = await blockchain.treasury('increaser' + i);

    //         const counterBefore = await manager.getCounter();

    //         console.log('counter before increasing', counterBefore);

    //         const increaseBy = Math.floor(Math.random() * 100);

    //         console.log('increasing by', increaseBy);

    //         const increaseResult = await manager.sendIncrease(increaser.getSender(), {
    //             increaseBy,
    //             value: toNano('0.05'),
    //         });

    //         expect(increaseResult.transactions).toHaveTransaction({
    //             from: increaser.address,
    //             to: manager.address,
    //             success: true,
    //         });

    //         const counterAfter = await manager.getCounter();

    //         console.log('counter after increasing', counterAfter);

    //         expect(counterAfter).toBe(counterBefore + increaseBy);
    //     }
    // });
});
