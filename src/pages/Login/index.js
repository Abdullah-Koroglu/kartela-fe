import { useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate ()

  const login = async (CustomerId, Password) => {
    try {
      const response = await axios.post('auth/local', {
        identifier: CustomerId,
        password: Password
      })

      if (response?.jwt) {
        localStorage.setItem("user", JSON.stringify(response?.user))
        localStorage.setItem("jwt", response?.jwt)
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.jwt}`;
        navigate ('/')
      } else {
        toast.error ('error')
      }

    } catch (error) {
      toast.error (error?.message ?? 'error')
      console.log (error)
    }
  }

  useEffect (() => {
    // toast ('naber')
  }, [])

  const FormSchema = yup.object().shape({
    pass: yup
      .string()
      .min(8, 'Password must be 8 characters long')
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol'),
    confirm: yup
      .string()
      .oneOf([yup.ref('pass'), null], 'Must match "password" field value'),
  });

  return <>
    <Formik
      initialValues={{
        customerId: '',
        password: '',
      }}
      validationSchema={FormSchema}
      onSubmit={(values) => {
        const {customerId, password} = values
        login (customerId, password)
      }}
    >
      {({ errors }) => (
        <Form>
          <div>
            <label>
              Kullanıcı Adı
              <Field name="customerId"/>
            </label>
            {errors.customerId && <p>{errors.customerId}</p>}
          </div>
          <div>
            <label>
              Şifre
              <Field type="password" name="password" />
            </label>
            {errors.password && <p>{errors.password}</p>}
          </div>
          <button type="submit">Giriş Yap</button>
        </Form>
      )}
    </Formik>
  </>;
}

export default Login