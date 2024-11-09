import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type ManagerConfig = {
    taskCounter: number;
    adaptersDict: Cell | null;
    ownerAddress: Address;
};

export function managerConfigToCell(config: ManagerConfig): Cell {
    return beginCell()
        .storeUint(config.taskCounter, 64)
        .storeMaybeRef(config.adaptersDict)
        .storeAddress(config.ownerAddress)
        .endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
};

export class Manager implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Manager(address);
    }

    static createFromConfig(config: ManagerConfig, code: Cell, workchain = 0) {
        const data = managerConfigToCell(config);
        const init = { code, data };
        return new Manager(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}
