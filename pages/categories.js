import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Spinner from "@/components/Spinner";

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties,setProperties] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        fetchCategories();
    },[])

    function fetchCategories() {
        setIsLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setCategories(result.data);
            setIsLoading(false);
    });
}

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
                name,
                values:values.join(',')
            }))
        );
    }

    function deleteCategory(category){
        swal.fire({
            title: 'Подтверждение удаления',
            text: `Вы действительно хотите удалить категорию: ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Отмена',
            confirmButtonText: 'Подтвердить',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties:properties.map(p => ({
                name:p.name,
                values:p.values.split(','),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'',values:''}];
        });
    }
    function handlePropertyNameChange(index,property,newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }
    function handlePropertyValuesChange(index,property,newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return(
        <Layout>
            <h1>Категории</h1>
            <label>
                {editedCategory
                    ? `Редактировать категорию ${editedCategory.name}`
                    : 'Новая категория'}

            </label>
            <form onSubmit={saveCategory} >
                <div className="flex gap-1">
                <input
                    type="text"
                    placeholder={'Название категории'}
                    onChange={ev=>setName(ev.target.value)}
                    value={name}
                />
                <select
                    onChange={ev => setParentCategory(ev.target.value)}
                    value = {parentCategory}
                >
                    <option value= "">Без родительской категории</option>
                    {categories.length > 0 && categories.map(category=>(
                        <option key = {category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                </div>
                <div className="mb-2">
                    <label className="block">Свойства</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-default text-sm mb-2">
                        Добавить новое свойство
                    </button>
                    {properties.length > 0 && properties.map((property,index) => (
                        <div  className="flex gap-1 mb-2">
                            <input type="text"
                                   value={property.name}
                                   className="mb-0"
                                   onChange={ev =>
                                       handlePropertyNameChange(index,property,ev.target.value)}
                                   placeholder="Название свойства"/>
                            <input type="text"
                                   className="mb-0"
                                   onChange={ev =>
                                       handlePropertyValuesChange(
                                           index,
                                           property,ev.target.value
                                       )}
                                   value={property.values}
                                   placeholder="Принимаемые значения(через запятую)"/>
                            <button
                                onClick={() => removeProperty(index)}
                                type="button"
                                className="btn-red">
                               Удалить
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-default">Отмена</button>
                    )}
                    <button
                        type="submit"
                        className="btn-primary py-1">
                        Сохранить
                    </button>
                </div>
            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                <tr>
                    <td>Название категории</td>
                    <td>Родительская категория</td>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                {isLoading && (
                    <tr>
                        <td colSpan={3}>
                            <div className="py-4">
                                <Spinner fullWidth={true} />
                            </div>
                        </td>
                    </tr>
                )}
                {categories.length > 0 && categories.map(category=>(
                    <tr>
                        <td> {category.name} </td>
                        <td> {category?.parent?.name} </td>
                        <td>
                            <button
                                onClick={() => editCategory(category)}
                                className="btn-default mr-1"
                            >Редактировать
                            </button>
                            <button
                                onClick={() => deleteCategory(category)}
                                className="btn-red"
                            >Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));