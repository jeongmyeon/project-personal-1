import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import createApi from "../../api/api";
import marketApi from "../../api/marketApi";




export default function MarketEdit(){
    const { id } = useParams();
    const [form, setForm] = useState({ title: '', content: '', price: '', imageFile: null });
    const [previewUrl, setPreviewUrl] = useState('');
    const api = createApi();
    const market = marketApi(api);
    const navigate = useNavigate();
    

    useEffect(() => {
        market.getMarketDetail(id).then(res => {
            if (res.data.success) {
                const { title, content, price, image } = res.data.market;
                setForm({ title, content, price, imageFile: null });
                setPreviewUrl(`http://localhost:8080${image}`);
            } else {
                alert("글 정보를 불러올 수 없습니다.");
                navigate(-1);
            }
        }).catch(err => {
            console.error(err);
            alert("서버 오류 발생");
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setForm(prev => ({ ...prev, imageFile: file }));
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("price", form.price);
        if (form.imageFile) {
            formData.append("image", form.imageFile);
        }

        market.updateMarket(id, formData)
            .then(res => {
                if (res.data.success) {
                    alert("수정 완료!");
                    navigate(`/market/${id}`);
                } else {
                    alert("수정 실패");
                }
            }).catch(err => {
                console.error(err);
                alert("수정 중 오류 발생");
            });
    };

    return (
        <div className="marketedit-main">
            <h2>마켓 글 수정</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="제목" required />
                <textarea name="content" value={form.content} onChange={handleChange} placeholder="내용" required />
                <input type="text" name="price" value={form.price} onChange={handleChange} placeholder="가격" required />
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {previewUrl && <img src={previewUrl} alt="미리보기" width="200" />}
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
}