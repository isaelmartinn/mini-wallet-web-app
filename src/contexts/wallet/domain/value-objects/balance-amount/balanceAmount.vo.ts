import { BaseAmount } from "#shared/domain/value-objects/amount/baseAmount.vo";
import { BalanceCannotBeNegativeError } from "#wallet/domain/errors";

import { BalanceAmount as BalanceAmountInterface } from "./balanceAmount.interface";

export class BalanceAmount
  extends BaseAmount
  implements BalanceAmountInterface
{
  private constructor(value: number) {
    super(value);
  }

  static create(value: number): BalanceAmount {
    BaseAmount.validateNumber(value);

    if (value < 0) {
      throw new BalanceCannotBeNegativeError();
    }

    const roundedValue = BaseAmount.roundValue(value);

    return new BalanceAmount(roundedValue);
  }

  static rehydrate(value: number): BalanceAmount {
    return new BalanceAmount(value);
  }

  add(other: BalanceAmount): BalanceAmount {
    return BalanceAmount.create(this.value + other.getValue());
  }

  subtract(other: BalanceAmount): BalanceAmount {
    return BalanceAmount.create(this.value - other.getValue());
  }
}
