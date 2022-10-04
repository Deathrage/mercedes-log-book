import entity from "../decorators/entity";
import RideData from "../model-shared/RideData";
import TemplateData, { schema } from "../model-shared/TemplateData";
import extend from "just-extend";

@entity("Templates")
export default class Template implements TemplateData {
  id: string;
  name: string;
  description?: string;
  userId: string;
  ride: Omit<RideData, "id" | "vehicleId" | "departed"> & { departed?: Date };

  constructor(data?: TemplateData) {
    if (data) extend(this, schema.parse(data));
  }

  validate(): void {
    schema.parse(this);
  }
}
