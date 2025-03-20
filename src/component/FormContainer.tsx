import FormModal, { FormModalProps } from "./FormModal";

const FormContainer = async (
  { table, type, data, id }: FormModalProps
) => {
  let relatedData = {};

  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    </div>
  )
}

export default FormContainer;