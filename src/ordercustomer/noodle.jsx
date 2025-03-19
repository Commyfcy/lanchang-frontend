import React, { useState, useEffect } from 'react';

function fetchNoodletype() {
  return fetch('http://localhost:3333/noodletypes')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network is not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('failed to fetch Noodletype', error);
      return [];
    });
}

function fetchSoup() {
  return fetch('http://localhost:3333/soups')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network is not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('failed to fetch Soup', error);
      return [];
    });
}

function fetchMeat() {
  return fetch('http://localhost:3333/meats')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network is not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('failed to fetch Meat', error);
      return [];
    });
}

function fetchSize() {
  return fetch('http://localhost:3333/sizes')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network is not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('failed to fetch Size', error);
      return [];
    });
}

function Noodle({ onSelect }) {
  const [noodletype, setNoodletype] = useState([]);
  const [soup, setSoup] = useState([]);
  const [meat, setMeat] = useState([]);
  const [size, setSize] = useState([]);
  const [noodleOptions, setNoodleOptions] = useState({
    soupType: '1',
    noodleType: '1',
    meatType: '1',
    size: '1'
  });
  const [QTY, setQTY] = useState(1);
  const [noodlePrice, setNoodleTypePrice] = useState(0)
  const [soupPrice, setSoupPrice] = useState(0)
  const [meatPrice, setMeatPrice] = useState(0)
  const [sizePrice, setSizePrice] = useState(19)
  const [additional, setAdditional] = useState('');
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [TotalPrice, setTotalPrice] = useState(null);



  useEffect(() => {
    setTotalPrice(noodlePrice + soupPrice + meatPrice + sizePrice);
    onSelect({
      NoodleComponent: noodleOptions,
      Qty: QTY,
      Additional: additional,
      HomeDelivery: homeDelivery,
      Price: TotalPrice
    });
  }, [noodleOptions, QTY, additional, homeDelivery, TotalPrice]);


  useEffect(() => {
    fetchNoodletype().then(data => setNoodletype(data));
    fetchSoup().then(data => setSoup(data));
    fetchMeat().then(data => setMeat(data));
    fetchSize().then(data => setSize(data));
  }, []);

  const handleNoodleOptionChange = (option, value) => {
    setNoodleOptions(prev => ({ ...prev, [option]: value }));
  };

  const renderNoodle = () => (
    <div className='noodlesearch' style={{ display: 'flex', flexDirection: "column" }}>
      <div className="noodle-customization" style={{ display: 'flex', flexDirection: "row", justifyContent: "space-around" }}>
        <div className='noodletype'>
          <div>เส้น</div>
          <select
            style={{
              padding: '3px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            value={noodleOptions.noodleType}
            onChange={(e) => {
              const NoodleTypeId = Number(e.target.value);
              handleNoodleOptionChange('noodleType', e.target.value);
              const selectednoodleType = noodletype.find(n => n.Noodle_type_id === NoodleTypeId);
              if (selectednoodleType) {
                setNoodleTypePrice(selectednoodleType.Noodle_type_price);
              }
            }}
          >
            {noodletype.map((n) => (
              <option key={n.Noodle_type_id} value={n.Noodle_type_id}>{n.Noodle_type_name}</option>
            ))}
          </select>
        </div>


        <div className='soup'>
          <div>น้ำซุป</div>
          <select
            style={{
              padding: '3px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            value={noodleOptions.soupType}
            onChange={(e) => {
              const SoupId = Number(e.target.value);
              handleNoodleOptionChange('soupType', e.target.value);
              const selectedSoup = soup.find(s => s.Soup_id === SoupId);
              if (selectedSoup) {
                setSoupPrice(selectedSoup.Soup_price);
              }
            }}
          >
            {soup.map((s) => (
              <option key={s.Soup_id} value={s.Soup_id}>{s.Soup_name}</option>
            ))}
          </select>
        </div>

        <div className='meat'>
          <div>เนื้อ</div>
          <select
            style={{
              padding: '3px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            value={noodleOptions.meatType}
            onChange={(e) => {
              const MeatId = Number(e.target.value);
              handleNoodleOptionChange('meatType', e.target.value);
              const selectedMeat = meat.find(m => m.Meat_id === MeatId);
              if (selectedMeat) {
                setMeatPrice(selectedMeat.Meat_price);
              }
            }}
          >
            {meat.map((m) => (
              <option key={m.Meat_id} value={m.Meat_id}>{m.Meat_name}</option>
            ))}
          </select>
        </div>

        <div className='size'>
          <div>ขนาด</div>
          <select
            style={{
              padding: '3px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            value={noodleOptions.size}
            onChange={(e) => {
              const SizeId = Number(e.target.value);
              handleNoodleOptionChange('size', SizeId);
              const selectedSize = size.find(s => s.Size_id === SizeId);
              if (selectedSize) {
                setSizePrice(selectedSize.Size_price);
              }
            }}
          >
            {size.map((s) => (
              <option key={s.Size_id} value={s.Size_id}>{s.Size_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: "center", padding: "15px 0px" }}>
        <label style={{ fontSize: "13px", padding: "5px" }}>
          จำนวน
        </label>
        <input

          style={{
            width: '10%', padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          type='number'
          placeholder='จำนวน'
          value={QTY}
          onChange={(e) => setQTY(e.target.value)} />


        <label style={{ padding: '5px', fontSize: "13px" }}>
          <input
            type="checkbox"
            checked={homeDelivery}
            onChange={(e) => setHomeDelivery(e.target.checked)}
          />
          รับกลับบ้าน
        </label>
      </div>



      <div style={{ display: 'flex', justifyContent: "center" }}>
        <textarea style={{
          width: "70%", padding: '6px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
          placeholder='เพิ่มเติม'
          value={additional}
          onChange={(e) => setAdditional(e.target.value)}
        />
      </div>

    </div>
  );

  return (
    <div style={{ fontSize: '10px', padding: '10px' }}>{renderNoodle()}</div>
  );
}

export default Noodle;
