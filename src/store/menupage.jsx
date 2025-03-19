import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
const styles = {
  basketpage: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },

  menuContainer: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    padding: '1rem',
    marginTop: '20px',
  },

  menuItem: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
    height: '120px',
  },

  cartesianMenuItem: {
    display: 'flex',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textDecoration: 'none',
    color: 'inherit',
    position: 'relative',
    height: '120px',
    border: '1px dashed #adb5bd',
  },

  menuImage: {
    width: '100px',
    height: '100%',
    objectFit: 'cover',
  },

  menuInfo: {
    flex: 1,
    padding: '0.5rem',
  },

  menuInfoH3: {
    margin: 0,
    fontSize: '1rem',
  },

  menuInfoP: {
    margin: '0.5rem 0 0',
    fontWeight: 'bold',
  },

  filters: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
    flexWrap: 'wrap',
    gap: '10px',
  },

  filterButton: {
    padding: '8px 16px',
    borderRadius: '20px',
  },

  activeFilter: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },

  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0 20px',
  },

  searchInput: {
    padding: '8px 12px',
    width: '300px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },

  placeholderImage: {
    width: '100px',
    height: '100%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },

  '@media (max-width: 600px)': {
    menuItem: {
      flexDirection: 'column',
      height: 'auto',
    },
    menuImage: {
      width: '100%',
      height: '150px',
    },
    cartesianMenuItem: {
      flexDirection: 'column',
      height: 'auto',
    },
  },
};

function AddMenuButton({ text, linkTo }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
      <Button
        variant="contained"
        component={Link}
        to={linkTo}
        startIcon={<AddIcon />}
        style={{ width: '300px' }}
      >
        {text}
      </Button>
    </div>
  );
}

function Basket() {
  const [menuItems, setMenuItems] = useState([]);
  const [noodleMenuItems, setNoodleMenuItems] = useState([]);
  const [soups, setSoups] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [meats, setMeats] = useState([]);
  const [noodleTypes, setNoodleTypes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [allPossibleMenus, setAllPossibleMenus] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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



  



  
  useEffect(() => {
    fetchAllData();
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:3333/getmenu');
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        console.error('Failed to fetch menu items');
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

 

  const handleDeleteClick = (item, isNoodleMenu) => {
    setItemToDelete({ ...item, isNoodleMenu });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint = itemToDelete.isNoodleMenu ?
        `http://localhost:3333/deletenoodlemenu/${itemToDelete.Noodle_menu_id}` :
        `http://localhost:3333/deletemenu/${itemToDelete.Menu_id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (itemToDelete.isNoodleMenu) {
          setNoodleMenuItems(prevItems => prevItems.filter(item => item.Noodle_menu_id !== itemToDelete.Noodle_menu_id));
        } else {
          setMenuItems(prevItems => prevItems.filter(item => item.Menu_id !== itemToDelete.Menu_id));
        }
        alert('ลบเมนูสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการลบเมนู');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('เกิดข้อผิดพลาดในการลบเมนู');
    }

    handleCloseDialog();
  };




  const getNoodleTypeName = (id) => {
    const noodle = noodleTypes.find(type => type.Noodle_type_id === id);
    return noodle ? noodle.Noodle_type_name : 'ไม่ระบุ';
  };

  const getSoupName = (id) => {
    const soup = soups.find(s => s.Soup_id === id);
    return soup ? soup.Soup_name : 'ไม่ระบุ';
  };

  const getMeatName = (id) => {
    const meat = meats.find(m => m.Meat_id === id);
    return meat ? meat.Meat_name : 'ไม่ระบุ';
  };

  const getSizeName = (id) => {
    const size = sizes.find(s => s.Size_id === id);
    return size ? size.Size_name : 'ไม่ระบุ';
  };

  function getMenuName(Noodle_type_id, soup_id, meat_id, size_id) {
    const noodle_type_name = getNoodleTypeName(Noodle_type_id);
    const soup_name = getSoupName(soup_id);
    const meat_name = getMeatName(meat_id);
    const size_name = getSizeName(size_id);

    return `${noodle_type_name} ${soup_name} ${meat_name} (${size_name})`;
  };

  const getTotalPrice = (sizeId, noodleTypeId , meatId) => {
    const size = sizes.find(s => s.Size_id === sizeId);
    const noodleType = noodleTypes.find(n => n.Noodle_type_id === noodleTypeId);
    const meat = meats.find(m => m.Meat_id === meatId);

    const sizePrice = size ? size.Size_price : 0;
    const noodleTypePrice = noodleType ? noodleType.Noodle_type_price : 0;
    const meatPrice = meat ? meat.Meat_price : 0;

    return sizePrice + noodleTypePrice + meatPrice;
  };


  const filterBySearch = (items) => {
    if (!searchTerm) return items;

    return items.filter(item => {
      const itemName = item.Menu_name || item.Noodle_menu_name ||
        getMenuName(item.Noodle_type_id, item.Soup_id, item.Meat_id, item.Size_id);
      return itemName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };


  const displayAllMenuItems = () => {
    let allItems = [];
    // เพิ่มเมนูทั่วไปที่มีอยู่แล้ว
    if (activeFilter === 'all' || activeFilter === 'existing') {
      allItems = [...allItems, ...menuItems.map(item => ({
        ...item,
        isNoodleMenu: false,
        isExisting: true
      }))];
    }
    // มเมนูก๋วยตีี๋ยว
    if (activeFilter === 'all' || activeFilter === 'cartesian') {
      allItems = [...allItems, ...allPossibleMenus];
    }
    //กรองตามการค้นหา
    allItems = filterBySearch(allItems);

    // เรียงลำดับเมนู: เมนูที่มีอยู่แล้วก่อน, ตามด้วย Cartesian product
    allItems.sort((a, b) => {
      if (a.isExisting && !b.isExisting) return -1;
      if (!a.isExisting && b.isExisting) return 1;
      return 0;
    });

    if (allItems.length === 0) {
      return <p style={{ textAlign: 'center', width: '100%' }}>ไม่พบเมนูที่ตรงกับการค้นหา</p>;
    }

    return (
      <Grid container spacing={2}>
        {allItems.map((item) => {
          const isCartesianItem = item.isCartesian;
          const menuName = item.Menu_name || item.Noodle_menu_name ||
            getMenuName(item.Noodle_type_id, item.Soup_id, item.Meat_id, item.Size_id);
          const price = item.Menu_price || item.Noodle_menu_price;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${item.isNoodleMenu ? 'noodle' : 'menu'}-${item.Noodle_menu_id || item.Menu_id || item.id}`}>
              <div style={isCartesianItem ? styles.cartesianMenuItem : styles.menuItem}>
                {!isCartesianItem ? (
                  <Link
                    to={item.isNoodleMenu ? `/noodledetail/${item.Noodle_menu_id}` : `/fooddetail/${item.Menu_id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}
                  >
                    {item.Noodle_menu_picture || item.Menu_picture ? (
                      <img
                        src={`data:image/jpeg;base64,${item.Noodle_menu_picture || item.Menu_picture}`}
                        alt={menuName}
                        style={styles.menuImage}
                      />
                    ) : (
                      <div style={styles.placeholderImage}>No Image</div>
                    )}
                    <div style={styles.menuInfo}>
                      <h3 style={styles.menuInfoH3}>{menuName}</h3>
                      <p style={styles.menuInfoP}>ราคา: {price} บาท</p>
                    </div>
                  </Link>
                ) : (
                  <>
                    
                     <div style={styles.placeholderImage}>
                      <RamenDiningIcon/>
                    </div>
                    
                   
                    <div style={styles.menuInfo}>
                      <h3 style={styles.menuInfoH3}>{menuName}</h3>
                      <p style={styles.menuInfoP}>
                        ราคา: {getTotalPrice(item.Size_id, item.Noodle_type_id , item.Meat_id)} บาท
                      </p>
                    </div>
                  </>
                )}
                {!isCartesianItem && (
                  <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteClick(item, item.isNoodleMenu)}
                  style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '4px 8px' }}
                  size="small"
                  color="error"
                >
                  ลบ
                </Button>
                )}
              </div>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // แสดงการโหลดหากข้อมูลยังไม่พร้อม
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div style={styles.basketpage}>
      <Navbarow />

      <AddMenuButton text="เพิ่มเมนูอื่นๆ" linkTo="/addmenu" />
      <AddMenuButton text="เพิ่มรายการก๋วยเตี๋ยว" linkTo="/Addex" />

      {/* ส่วนของการกรองและค้นหา */}
      <div style={styles.filters}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>      ทั้งหมด ({noodleMenuItems.length + menuItems.length + allPossibleMenus.length}) เมนู
        </div>
        {/* 
        <Button 
          variant={activeFilter === 'all' ? "contained" : "outlined"}
          onClick={() => setActiveFilter('all')}
          style={{...styles.filterButton, ...(activeFilter === 'all' ? styles.activeFilter : {})}}
        >
          ทั้งหมด ({noodleMenuItems.length + menuItems.length + allPossibleMenus.length})
        </Button>
        */}

        {/*
         <Button 
          variant={activeFilter === 'existing' ? "contained" : "outlined"}
          onClick={() => setActiveFilter('existing')}
          style={{...styles.filterButton, ...(activeFilter === 'existing' ? styles.activeFilter : {})}}
        >
          เมนูอื่น ({noodleMenuItems.length + menuItems.length})
        </Button>
        */ }

        {/*
         <Button 
          variant={activeFilter === 'cartesian' ? "contained" : "outlined"}
          onClick={() => setActiveFilter('cartesian')}
          style={{...styles.filterButton, ...(activeFilter === 'cartesian' ? styles.activeFilter : {})}}
        >
          เมนูก๋วยเตี๊ยว ({allPossibleMenus.length})
        </Button>
        */ }

      </div>
      
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="ค้นหาเมนู..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      



    
      <div className='listmenu' style={{ padding: '1rem' }}>
        {displayAllMenuItems()}
      </div>

      {/* Dialog ยืนยันการลบเมนู */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ยืนยันการลบเมนู"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            คุณแน่ใจหรือไม่ที่จะลบเมนูนี้?
            {itemToDelete && (
              <p>
                <strong>
                  {itemToDelete.isNoodleMenu
                    ? getMenuName(itemToDelete.Noodle_type_id, itemToDelete.Soup_id, itemToDelete.Meat_id, itemToDelete.Size_id)
                    : itemToDelete.Menu_name
                  }
                </strong>
              </p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ยกเลิก</Button>
          <Button onClick={handleConfirmDelete} color="error">
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Basket;