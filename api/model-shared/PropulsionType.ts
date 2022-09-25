import { z } from "zod";

enum PropulsionType {
  COMBUSTION = "COMBUSTION",
  ELECTRICITY = "ELECTRICITY",
  PLUGIN_HYBRID = "PLUGIN_HYBRID",
}

export default PropulsionType;
