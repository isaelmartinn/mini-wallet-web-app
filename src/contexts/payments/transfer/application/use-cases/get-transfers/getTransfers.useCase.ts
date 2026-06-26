import { GetTransfersUseCase as GetTransfersUseCaseInterface } from "#payments/transfer/application/use-cases/";
import { Transfer, TransferRepository } from "#payments/transfer/domain";

export class GetTransfersUseCase implements GetTransfersUseCaseInterface {
  constructor(private readonly transferRepository: TransferRepository) {}

  async execute(): Promise<Transfer[]> {
    const transfers = await this.transferRepository.findAll();

    return transfers.sort((a, b) => {
      const dateA = a.getDate().getValue().getTime();
      const dateB = b.getDate().getValue().getTime();
      return dateB - dateA;
    });
  }
}
