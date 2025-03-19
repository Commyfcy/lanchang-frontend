import React, { useState, useEffect } from 'react';

function NoodleMenuGenerator() {
  const [soups, setSoups] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [meats, setMeats] = useState([]);
  const [noodleTypes, setNoodleTypes] = useState([]);
  const [allPossibleMenus, setAllPossibleMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันเพื่อดึงข้อมูลประเภทต่างๆ จาก API
  const fetchAllData = async () => {
    try {
      const [soupRes, sizeRes, meatRes, noodleTypeRes] = await Promise.all([
        fetch('http://localhost:3333/soups'),
        fetch('http://localhost:3333/sizes'),
        fetch('http://localhost:3333/meats'),
        fetch('http://localhost:3333/noodletypes')
      ]);

      const [soupData, sizeData, meatData, noodleTypeData] = await Promise.all([
        soupRes.json(),
        sizeRes.json(),
        meatRes.json(),
        noodleTypeRes.json()
      ]);

      setSoups(soupData);
      setSizes(sizeData);
      setMeats(meatData);
      setNoodleTypes(noodleTypeData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // ฟังก์ชันสร้าง Cartesian product จากข้อมูลทั้งหมด
  const generateCartesianProduct = () => {
    if (!noodleTypes.length || !soups.length || !meats.length || !sizes.length) {
      return [];
    }

    const cartesianProduct = [];
    let menuId = 1;

    // วนลูปสร้าง Cartesian product จากทุกชนิดของข้อมูล
    for (const noodleType of noodleTypes) {
      for (const soup of soups) {
        for (const meat of meats) {
          for (const size of sizes) {
            // สร้างเมนูใหม่
            const newMenu = {
              id: menuId++,
              Noodle_menu_id: `N${menuId}`,
              Noodle_type_id: noodleType.Noodle_type_id,
              Noodle_type_name: noodleType.Noodle_type_name,
              Soup_id: soup.Soup_id,
              Soup_name: soup.Soup_name,
              Meat_id: meat.Meat_id,
              Meat_name: meat.Meat_name,
              Size_id: size.Size_id,
              Size_name: size.Size_name,
              // คำนวณราคาตามขนาดและส่วนประกอบ (นี่เป็นเพียงตัวอย่าง)
              Noodle_menu_price: calculatePrice(size, meat, soup),
              // สร้างชื่อเมนูจากส่วนประกอบต่างๆ
              Menu_name: `${noodleType.Noodle_type_name} ${soup.Soup_name} ${meat.Meat_name} (${size.Size_name})`
            };
            
            cartesianProduct.push(newMenu);
          }
        }
      }
    }
    
    return cartesianProduct;
  };

  // ฟังก์ชันคำนวณราคาตามส่วนประกอบ
  const calculatePrice = (size, meat, soup) => {
    // ตัวอย่างการคำนวณราคา: ราคาพื้นฐานตามขนาด + ราคาเนื้อสัตว์ + ราคาน้ำซุป
    let basePrice = 0;
    
    // กำหนดราคาตามขนาด
    if (size.Size_name === 'เล็ก') basePrice = 40;
    else if (size.Size_name === 'กลาง') basePrice = 50;
    else if (size.Size_name === 'ใหญ่') basePrice = 60;
    else basePrice = 45;
    
    // เพิ่มราคาตามชนิดเนื้อสัตว์
    let meatPrice = 0;
    if (meat.Meat_name.includes('พิเศษ')) meatPrice = 15;
    else if (meat.Meat_name.includes('รวมมิตร')) meatPrice = 20;
    else meatPrice = 10;
    
    // เพิ่มราคาตามชนิดน้ำซุป
    let soupPrice = 0;
    if (soup.Soup_name === 'ต้มยำ') soupPrice = 5;
    else if (soup.Soup_name === 'เย็นตาโฟ') soupPrice = 10;
    
    return basePrice + meatPrice + soupPrice;
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const menus = generateCartesianProduct();
      setAllPossibleMenus(menus);
    }
  }, [loading, soups, sizes, meats, noodleTypes]);

  // ฟังก์ชันแสดงรายการเมนูทั้งหมด
  const displayAllMenus = () => {
    return allPossibleMenus.map(menu => (
      <div key={menu.id} style={{
        border: '1px solid #ddd',
        margin: '10px',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>{menu.Menu_name}</h3>
        <p>รหัสเมนู: {menu.Noodle_menu_id}</p>
        <p>เส้น: {menu.Noodle_type_name}</p>
        <p>น้ำซุป: {menu.Soup_name}</p>
        <p>เนื้อสัตว์: {menu.Meat_name}</p>
        <p>ขนาด: {menu.Size_name}</p>
        <p>ราคา: {menu.Noodle_menu_price} บาท</p>
      </div>
    ));
  };

  // สำหรับการส่งข้อมูลเมนูที่สร้างขึ้นไปยัง API
  const saveAllMenus = async () => {
    try {
      // ตัวอย่างการส่ง batch request
      const response = await fetch('http://localhost:3333/addBulkNoodleMenus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ menus: allPossibleMenus })
      });
      
      if (response.ok) {
        alert('บันทึกเมนูทั้งหมดสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกเมนู');
      }
    } catch (error) {
      console.error('Error saving menus:', error);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับ API');
    }
  };

  return (
    <div>
      <h1>เมนูก๋วยเตี๋ยวทั้งหมดที่เป็นไปได้ ({allPossibleMenus.length} รายการ)</h1>
      
      {loading ? <p>กำลังโหลดข้อมูล...</p> : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
            <div>
              <h3>สรุปข้อมูล:</h3>
              <p>ประเภทเส้น: {noodleTypes.length} ชนิด</p>
              <p>ประเภทน้ำซุป: {soups.length} ชนิด</p>
              <p>ประเภทเนื้อสัตว์: {meats.length} ชนิด</p>
              <p>ขนาด: {sizes.length} ชนิด</p>
              <p>เมนูที่เป็นไปได้ทั้งหมด: {allPossibleMenus.length} รายการ</p>
            </div>
            <button 
              onClick={saveAllMenus}
              style={{
                padding: '10px 20px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                height: 'fit-content',
                marginTop: '20px'
              }}
            >
              บันทึกเมนูทั้งหมดลงฐานข้อมูล
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '15px' 
          }}>
            {displayAllMenus()}
          </div>
        </>
      )}
    </div>
  );
}

export default NoodleMenuGenerator;