const entityNames = new Map<any, string>();

export const getEntityContainer = (type: any) => {
  const name = entityNames.get(type);
  if (!name)
    throw new Error(
      `Entity of type ${type} has not been assigned a container!`
    );
  return name;
};

export default function entity(containerName: string) {
  return (target: any) => {
    entityNames.set(target, containerName);
    return target;
  };
}
