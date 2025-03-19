import React from 'react';
import { Navbarow } from "../owner/Navbarowcomponent/navbarow/index-ow";
import Newordercustomer from './newordercustomer';
import Existordercustomer from './existordercustomer';

const Ordercustomer = () => {
    return (
        <div>
            <Navbarow />
            <Newordercustomer />
            <Existordercustomer />
        </div>
    );
};

export default Ordercustomer;