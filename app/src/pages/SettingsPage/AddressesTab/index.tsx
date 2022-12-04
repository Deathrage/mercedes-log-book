import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { FC, useCallback, useState } from "react";
import AddressActions from "./AddressActions";
import AddFab from "../../../components/AddFab";
import CreateOrEditRow from "./CreateOrEditRow";
import { useAddresses } from "./hooks";

enum ModeType {
  CREATE = "CREATE",
  EDIT = "EDIT",
}

type Mode = { type: ModeType.CREATE } | { type: ModeType.EDIT; name: string };

const AddressesTab: FC = () => {
  const { data, save, saving } = useAddresses();

  const getWithout = useCallback(
    (name: string) => {
      if (!data) throw new Error("Addresses are not loaded!");

      const newAddresses = data.filter((item) => item.name !== name);
      return newAddresses;
    },
    [data]
  );

  const [createOrEdit, setCreateOrEdit] = useState<Mode>();

  return (
    <>
      <AddFab
        onClick={() => setCreateOrEdit({ type: ModeType.CREATE })}
        disabled={!!createOrEdit}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "20%" }}>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell sx={{ width: "8rem" }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {createOrEdit?.type === ModeType.CREATE && (
            <CreateOrEditRow
              disabled={saving}
              onCancel={() => setCreateOrEdit(undefined)}
              onSave={async (name, address) => {
                const newAddresses = [...getWithout(name), { name, address }];
                await save(newAddresses);
                setCreateOrEdit(undefined);
              }}
            />
          )}
          {!data ? (
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          ) : (
            data.map(({ name, address }) =>
              createOrEdit?.type === ModeType.EDIT &&
              createOrEdit.name === name ? (
                <CreateOrEditRow
                  initialValues={{ name, address }}
                  disabled={saving}
                  onCancel={() => setCreateOrEdit(undefined)}
                  onSave={async (name, address) => {
                    const newAddresses = [
                      ...getWithout(name),
                      { name, address },
                    ];
                    await save(newAddresses);
                    setCreateOrEdit(undefined);
                  }}
                />
              ) : (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{address}</TableCell>
                  <TableCell>
                    <AddressActions
                      name={name}
                      disabled={!!createOrEdit || saving}
                      onEdit={() =>
                        setCreateOrEdit({ type: ModeType.EDIT, name })
                      }
                      onDelete={() => void save(getWithout(name))}
                    />
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default AddressesTab;
