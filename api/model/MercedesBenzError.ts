import MercedesBenzErrorData, {
  MercedesBenzErrorType,
} from "../model-shared/MercedesBenzErrorData";

export default class MercedesBenzError
  extends Error
  implements MercedesBenzErrorData
{
  type: MercedesBenzErrorType;

  constructor(type: MercedesBenzErrorType, cause: Error) {
    super(cause.message, { cause });
    this.type = type;
    this.name = "MercedesBenzError";
  }
}
