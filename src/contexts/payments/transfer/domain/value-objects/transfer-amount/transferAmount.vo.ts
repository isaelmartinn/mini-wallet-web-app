import { TransferAmountMustBeGreaterThanZeroError } from "#payments/transfer/domain/errors";
import { BaseAmount } from "#shared/domain/value-objects/amount/baseAmount.vo";

import { TransferAmount as TransferAmountInterface } from "./transferAmount.interface";

export class TransferAmount
  extends BaseAmount
  implements TransferAmountInterface
{
  private constructor(value: number) {
    super(value);
  }

  static create(value: number): TransferAmount {
    BaseAmount.validateNumber(value);

    if (value <= 0) {
      throw new TransferAmountMustBeGreaterThanZeroError();
    }

    const roundedValue = BaseAmount.roundValue(value);

    return new TransferAmount(roundedValue);
  }

  static rehydrate(value: number): TransferAmount {
    return new TransferAmount(value);
  }

  add(other: TransferAmount): TransferAmount {
    return TransferAmount.create(this.value + other.getValue());
  }
}
