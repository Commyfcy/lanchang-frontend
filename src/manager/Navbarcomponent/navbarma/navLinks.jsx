import React from "react";
import styled from "styled-components";
import { useAuth } from '../../../component/AuthenContext';




const NavLinksContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const LinksWrapper = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  list-style: none;
  flex-wrap: wrap: 
  justify-content: center;

`;

const LinkItem = styled.li`
  height: 100%;
  padding: 0 1.1em;
  color: #222;
  font-weight: 700
  font-size: 18x;
  color : white;
  align-items: center;
  justify-content: center;
  display: flex;
  white-space: flex;
  border-top: 2px solid transparent;
  transition: all 220ms ease-in-out;

  &:hover {
    border-top: 2px solid #2ecc71;
  }
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: inherit;
  font-color: white;
`;



export function NavLinks(props) {
  const { user } = useAuth();

  // Function to check if user can access a specific route
  const canAccess = (requiredRoles) => {
    if (!user || !requiredRoles) return false;
    return requiredRoles.includes(user.role);
  };
  return (


    <NavLinksContainer>
      <LinksWrapper>
        <LinkItem>
          <Link href="#">หน้าหลัก</Link>
        </LinkItem>
        <LinkItem>
          <Link href="./history">ประวัติออเดอร์</Link>
        </LinkItem>
        <LinkItem>
          <Link href="/checkbin">ชำระเงิน</Link>
        </LinkItem>
        <LinkItem>
          <Link href="./order">ดูรายการอาหารที่สั่ง</Link>
        </LinkItem>

        {canAccess(['owner', 'manager']) && (
          <LinkItem>
            <Link href="./dashboard">รายงาน</Link>
          </LinkItem>
        )}

        {canAccess(['owner', 'manager']) && (
          <LinkItem>
            <Link href="./menupage">รายการอาหาร</Link>
          </LinkItem>
        )}


        {canAccess(['owner']) && (
          <LinkItem>
            <Link href="/association">Association</Link>
          </LinkItem>
        )}
        {canAccess(['owner']) && (
          <LinkItem>
            <Link href="./employee">พนักงาน</Link>
          </LinkItem>
        )}

        {canAccess(['owner,manager,employee']) && (
          <LinkItem>
            <Link href="./table">โต๊ะ</Link>
          </LinkItem>
        )}

        {canAccess(['owner,manager,employee']) && (
          <LinkItem><Link href="./ordercustomer">สั่งอาหารให้ลูกค้า</Link></LinkItem>
        )}

      </LinksWrapper>
    </NavLinksContainer>
  );
}
