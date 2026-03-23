"use client";
import { useState, useEffect } from "react";

const Introduction: React.FC = () => {
  const [content, setContent] = useState<{ text: string }>({ text: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/introduction`);
        if (!response.ok) throw new Error("Failed to fetch content");
        const data = await response.json();
        setContent(data[0] || { text: "" });
        setLoading(false);
      } catch (err) {
        setError("Error loading content");
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <section id="gioithieu" className="container">
      <div className="gioithieu">
        <div className="gioithieu_tittle">
          <p style={{ fontWeight: "bolder", fontSize: 50 }}>GIỚI THIỆU</p>
          <p className="gioithieu_p mt-10" style={{ fontSize: 20, fontStyle: "italic" }}>
            {content.text || "No content available"}
          </p>
        </div>
      </div>
    </section>
  );
};
export default Introduction;
// import React from "react";

// const Introduction: React.FC = () => {
//   return (
//     <section id="gioithieu" className="container">
//       <div className="gioithieu">
//         <div className="gioithieu_tittle">
//           <p style={{fontWeight:"bolder", fontSize:50}}>GIỚI THIỆU</p> 
//           <p className="gioithieu_p mt-10" style={{fontSize:20, fontStyle:"italic"}}>
//             Công ty TMAI SAIGON được thành lập vào ngày 25/02/2014, hoạt động trong nhiều lĩnh vực như truyền thông quảng cáo, phát triển phần mềm, 
//             xúc tiến thương mại, tổ chức sự kiện, và sản xuất chương trình truyền hình. Ngoài ra, TMAI SAIGON còn cung cấp dịch vụ ẩm thực, sản xuất 
//             quà tặng và nhiều dịch vụ khác. TMAI SAIGON luôn cam kết mang đến cho khách hàng dịch vụ chất lượng cao và trải nghiệm tuyệt vời nhất.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Introduction;
