import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import {withSwal} from "react-sweetalert2";
import Spinner from "@/components/Spinner";
import {prettyDate} from "@/lib/date";

function AdminsPage({swal}) {
  const [email,setEmail] = useState('');
  const [adminEmails,setAdminEmails] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  function addAdmin(ev){
    ev.preventDefault();
    axios.post('/api/admins', {email}).then(res => {
      console.log(res.data);
      swal.fire({
        title: 'Администратор создан',
        icon: 'success',
      });
      setEmail('');
      loadAdmins();
    }).catch(err => {
      swal.fire({
        title: 'Ошибка!',
        text: err.response.data.message,
        icon: 'error',
      });
    });
  }
  function deleteAdmin(_id, email) {
    swal.fire({
      title: 'Вы уверены?',
      text: `Вы действительно хотите удалить ${email}?`,
      showCancelButton: true,
      cancelButtonText: 'Отмена',
      confirmButtonText: 'Подтвердить!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        axios.delete('/api/admins?_id='+_id).then(() => {
          swal.fire({
            title: 'Администратор удален!',
            icon: 'success',
          });
          loadAdmins();
        });
      }
    });
  }
  function loadAdmins() {
    setIsLoading(true);
    axios.get('/api/admins').then(res => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  return (
    <Layout>
      <h1>Администраторы</h1>
      <h2>Добавить нового администратора</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="text"
            className="mb-0"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            placeholder="google email"/>
          <button
            type="submit"
            className="btn-primary py-1 whitespace-nowrap">
            Добавить администратора
          </button>
        </div>
      </form>

      <h2>Существующие администраторы</h2>
      <table className="basic">
        <thead>
          <tr>
            <th className="text-left">Google email администраторов</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 && adminEmails.map(adminEmail => (
            <tr>
              <td>{adminEmail.email}</td>
              <td>
                {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
              </td>
              <td>
                <button
                  onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} className="btn-red">Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}) => (
  <AdminsPage swal={swal} />
));