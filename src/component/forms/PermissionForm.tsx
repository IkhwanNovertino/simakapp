import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { PermissionInputs, permissionSchema } from "@/lib/formValidationSchema";

interface PermissionFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "create" | "update";
  data?: any;
  relatedData?: any;
}

const PermissionForm = (
  { setOpen, type, data, relatedData }: PermissionFormProps
) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionInputs>({
    resolver: zodResolver(permissionSchema)
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data);

  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new permission" : "Update the permission"}</h1>
      <div className="flex justify-start flex-wrap gap-4">
        {data && (
          <InputField
            label="id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <InputField
          label="Hak Akses"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Deskripsi Hak Akses"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form >
  )
}

export default PermissionForm;