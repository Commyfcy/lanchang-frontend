import React, { useState, useEffect } from 'react';
import {
    Container,
    IconButton,
    Typography,
    Grid,
    Paper,
    AppBar,
    Toolbar,
    colors
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { red } from '@mui/material/colors';

const styles = {
    historyDetailPage: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
    },
    menuContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        padding: '1rem',
        width: '95%',
        maxWidth: '1200px',
        margin: '20px auto',
    },
    menuItem: {
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    menuImage: {
        width: '100px',
        height: '100px',
        borderRadius: '20px',
        objectFit: 'cover',
        padding: '10px',

    },
    menuInfo: {
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    menuInfoH3: {
        margin: '0 0 0.5rem 0',
        fontSize: '1.1rem',
    },
    menuInfoP: {
        margin: '0.25rem 0',
        fontSize: '0.9rem'

    },
    appBar: {
        position: 'static',
        backgroundColor: 'white',
        boxShadow: 'none',
    },
    toolbar: {
        paddingLeft: 0,
    },
    title: {
        flexGrow: 1,
        marginLeft: '20px',
        fontSize: 30
    },
};

function HistoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState([]);
    const [noodleMenu, setNoodleMenu] = useState([]);
    const [otherMenu, setOtherMenu] = useState([]);
    const [soups, setSoups] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [meats, setMeats] = useState([]);
    const [noodleTypes, setNoodleTypes] = useState([]);
    const [orders, setOrder] = useState([]);

    useEffect(() => {
        fetchOrderDetails();
        fetchMenus();
        fetchAllData();
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await fetch('http://localhost:3333/getorders');
            if (response) {
                const data = await response.json();
                setOrder(data);
            } else {
                console.log('fail to fetching order');
            }
        } catch (error) {
            console.log('error fetching order');
        }
    };

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3333/getorderdetail/${id}`);
            if (!response.ok) throw new Error('Failed to fetch order details');
            const data = await response.json();
            setOrderDetails(data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const fetchAllData = async () => {
        try {
            const [soupRes, sizeRes, meatRes, noodleTypeRes, noodleMenuRes] = await Promise.all([
                fetch('http://localhost:3333/soups'),
                fetch('http://localhost:3333/sizes'),
                fetch('http://localhost:3333/meats'),
                fetch('http://localhost:3333/noodletypes'),
                fetch('http://localhost:3333/getnoodlemenu')
            ]);
            const [soupData, sizeData, meatData, noodleTypeData, noodleMenuData] = await Promise.all([
                soupRes.json(),
                sizeRes.json(),
                meatRes.json(),
                noodleTypeRes.json(),
                noodleMenuRes.json()
            ]);
            setSoups(soupData);
            setSizes(sizeData);
            setMeats(meatData);
            setNoodleTypes(noodleTypeData);
            setNoodleMenu(noodleMenuData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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

    function getMenuName(noodleMenu) {
        if (!noodleMenu) return 'ไม่ระบุ';
        const noodle_type_name = getNoodleTypeName(noodleMenu.Noodle_type_id);
        const soup_name = getSoupName(noodleMenu.Soup_id);
        const meat_name = getMeatName(noodleMenu.Meat_id);
        const size_name = getSizeName(noodleMenu.Size_id);
        return `${noodle_type_name} ${soup_name} ${meat_name} (${size_name})`;
    }

    const fetchMenus = async () => {
        try {
            const otherRes = await (
                fetch('http://localhost:3333/getmenu')
            );
            const otherData = await otherRes.json();

            setOtherMenu(otherData);
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    const getItemDetails = (item) => {
        if (item.Noodle_menu_id) {
            const noodle = noodleMenu.find(n => n.Noodle_menu_id === item.Noodle_menu_id);
            return noodle ? {
                name: getMenuName(noodle),
                price: noodle.Noodle_menu_price,
                image: noodle.Noodle_menu_picture
            } : null;
        } else if (item.Menu_id) {
            const other = otherMenu.find(o => o.Menu_id === item.Menu_id);
            return other ? {
                name: other.Menu_name,
                price: other.Menu_price,
                image: other.Menu_picture
            } : null;
        }
        return null;
    };

    return (
        <Container maxWidth="lg" style={styles.historyDetailPage}>
            <AppBar position="static" color="default" style={styles.appBar}>
                <Toolbar style={styles.toolbar}>
                    <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" style={styles.title}>
                        รายละเอียดประวัติออเดอร์ที่ {orderDetails.find((item) => item)?.Order_id}
                    </Typography>
                </Toolbar>
            </AppBar>

            <div style={styles.menuContainer}>
                {orderDetails.map((item) => {
                    const itemDetails = getItemDetails(item);
                    return itemDetails ? (
                        <Paper key={item.Order_detail_id} style={styles.menuItem}>
                            <img
                                src={`data:image/jpeg;base64,${itemDetails.image}`}
                                style={styles.menuImage}
                            />
                            <div style={styles.menuInfo}>
                                <h3 style={styles.menuInfoH3}>{itemDetails.name}</h3>
                                <p style={styles.menuInfoP}>จำนวน: {item.Order_detail_quantity}</p>
                                <p style={styles.menuInfoP}>ราคา: {itemDetails.price} บาท</p>
                                <p style={styles.menuInfoP}>สถานะ: {item.status_id === 3 ? 'กำลังจัดเตรียม' : item.status_id === 4 ? 'เสิร์ฟแล้ว' : item.status_id === 5 ? 'รอชำระเงิน' : item.status_id === 6 ? 'ชำระเงินแล้ว' : item.status_id}</p>
                                {item.Order_detail_additional && (
                                    <p style={styles.menuInfoP}>เพิ่มเติม: {item.Order_detail_additional}</p>
                                )}
                                <p
                                    style={{
                                        fontFamily: "Sarabun",
                                        color: item.Order_detail_takehome ? "red" : "green",
                                    }}
                                >
                                    {item.Order_detail_takehome ? "รับกลับบ้าน" : "ทานที่ร้าน"}
                                </p>

                            </div>
                        </Paper>
                    ) : null;
                })}
            </div>
        </Container>
    );
}

export default HistoryDetail;
