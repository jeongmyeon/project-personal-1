import { useEffect, useState } from "react";
import '../Market/marketform.css';
import createApi from "../../api/api";
import marketApi from "../../api/marketApi";
import { useNavigate } from "react-router-dom";



export default function MarketForm(){
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();
    const api = createApi();
    const market = marketApi(api);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if(userData){
            const userObj = JSON.parse(userData);
            setUserName(userObj.userName);
        }
    },[])
    
    const handleSubmit = (e) => {
        e.preventDefault();

        market.addMarket({title, content,price, imageFile})
            .then(response => {
                console.log(response.data);
                if(response.data.success){
                    alert('등록 완료');
                    navigate('/market')
                }else{
                    alert('등록 실패');
                }
            }).catch(() => {
                alert('등록 중 오류 발생');
            });
    }


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            }
            reader.readAsDataURL(file);
        }else{
            setImagePreview(null);
        }
    };

    


    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label>작성자 : </label>
                <span>{userName}</span>
            </div>

            <div>
                <label>제목 : </label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
                    required/>
            </div>

            <div>
                <label>가격 : </label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
                    required/>원
            </div>

            <div>
                <label>내용 : </label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)}
                 rows={5} required></textarea>
            </div>

            <div>
                <label>이미지 업로드</label>
                <input type="file" accept="image/*" onChange={handleImageChange}/>
                {imagePreview && (
                    <img src={imagePreview} alt="preview"/>
                )}
            </div>

            <button type="submit">등록</button>
        </form>
    )
}