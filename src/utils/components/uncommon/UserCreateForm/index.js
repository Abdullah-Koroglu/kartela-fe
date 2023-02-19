import { Formik, Field, Form } from "formik";
import { useEffect, useState } from "react";
import CSS from "./index.module.css"
import DatePicker, {registerLocale} from "react-datepicker";
import axios from "axios";
import { DatePickerField } from "../../FormikDatePicker";

function UserForm({done}) {
  const genders = [
    {value : 'Boş'},
    {value : 'Erkek'},
    {value : 'Kadın'},
  ]
  const [birthDate, setBirthDate] = useState();

  const registerUser = async ({name,gender,birthDate}) => {
    try {
      const response = await axios.post('clients', {data: {
        name,
        gender,
        birth_date: birthDate
      }})

      if (response.data) done ()

    } catch (error) {
      // toast.error (error?.message ?? 'error')
      console.log (error)
    }
  }
  return <div className={CSS["main-container"]}>
    <Formik
        initialValues={{
          // customerId: '',
          // password: '',
        }}
        // validationSchema={FormSchema}
        onSubmit={(values) => {
          registerUser (values)
          // const {customerId, password} = values
          // login (customerId, password)
        }}
      >
        {({ errors }) => (
          <Form>
            <div className={CSS["form-element"]}>
              <label>
                İsim
              </label>
              <div className={CSS["row"]}>
                <Field className={CSS["form-field"]} name="name">
                </Field>
              </div>
            </div>
            <div className={CSS["form-element"]}>
              <label>
                Cinsiyet
              </label>
              <Field className={CSS["form-field"]} as="select" name="gender">
                  {genders?.map (gender => <option value={gender.value}>{gender.value}</option>)}
              </Field>
            </div>
            <div className={`${CSS["text-field"]} ${CSS["form-element"]}`}>
              <label>
                Doğum Tarihi
              </label>
              <DatePickerField
                name="birthDate"
                className={CSS["form-field"]}
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                // timeClassName={handleColor}
              />
              {/* {errors.password && <p>{errors.password}</p>} */}
            </div>
            <button className={CSS["form-submit"]} type="submit">KAYDET</button>
          </Form>
        )}
      </Formik>
    </div>;
}
export default UserForm;