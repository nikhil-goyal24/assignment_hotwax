const connection = require("./connection");
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var app = express();

app.use(bodyParser.json());

const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

app.get('/person', (req,res)=>{
    connection.query('SELECT * FROM person',(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.send(rows);
        }
    })
})

app.post('/create_order' , (req,res)=>{
    var data = req.body;
    var orderID = data.orderID;
    var orderName = data.orderName;
    var currencyUomId = data.currencyUomId;
    var salesChannelEnumId = data.salesChannelEnumId;
    var statusId = data.statusId;
    var productStoreId = data.productStoreId;
    var placedDate = data.placedDate;
    var approvedDate = data.approvedDate;
    var grandTotal = data.grandTotal;
    var completedDate = data.completedDate;
    var creditCard = hashPassword(data.creditCard);

    if(currencyUomId==""){
        currencyUomId = 'USD';
    }
    if(statusId==""){
        statusId = 'OrderPlaced';
    }

    var mydata = [orderID,orderName,currencyUomId,salesChannelEnumId,statusId,productStoreId,placedDate,approvedDate,grandTotal,completedDate,creditCard];

    if(orderName=="" || placedDate==""){
        res.send("Order name and placed date are compulsary.");
    }
    else{
        connection.query('insert into order_header(ORDER_ID,ORDER_NAME,CURRENCY_UOM_ID,SALES_CHANNEL_ENUM_ID,STATUS_ID,PRODUCT_STORE_ID,PLACED_DATE,APPROVED_DATE,GRAND_TOTAL,COMPLETED_DATE,CREDIT_CARD) values(?)',[mydata],(err,rows)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Order ID: "+orderID+ "   Successfully saved the data");
            }
        })  
    }
})

app.get('/getorder/:id', (req,res)=>{
    connection.query('SELECT * FROM order_header WHERE ORDER_ID=?',[req.params.id],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    })
})

app.get('/get_all_order', (req,res)=>{
    connection.query('SELECT * FROM order_header inner join order_part on order_header.ORDER_ID=order_part.ORDER_ID',(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.send(rows);
        }
    })
})

app.patch('/update_order', (req,res)=>{
    var data = req.body;
    connection.query('UPDATE order_header SET ORDER_NAME = ? WHERE ORDER_ID='+data.id,[data.name],(err,rows)=>{
        if(err){
            console.log(err);
        }else{ 
            connection.query('SELECT * FROM order_header WHERE ORDER_ID=?',[data.id],(err2,rows2)=>{
                if(err){
                    console.log(err2);
                }else{
                    res.send(rows2);
                }
            })
        }
    })
})


app.post('/add_order_item' , (req,res)=>{
    var data = req.body;
    var ORDER_ID = data.ORDER_ID;
    var ORDER_ITEM_SEQ_ID = data.ORDER_ITEM_SEQ_ID;
    var ORDER_PART_SEQ_ID = data.ORDER_PART_SEQ_ID;
    var PRODUCT_ID = data.PRODUCT_ID;
    var ITEM_DESCRIPTION = data.ITEM_DESCRIPTION;
    var QUANTITY = data.QUANTITY;
    var UNIT_AMOUNT = data.UNIT_AMOUNT;
    var ITEM_TYPE_ENUM_ID = data.ITEM_TYPE_ENUM_ID;
    var PARENT_ITEM_SEQ_ID = data.PARENT_ITEM_SEQ_ID;
    if(currencyUomId==""){
        currencyUomId = 'USD';
    }
    if(statusId==""){
        statusId = 'OrderPlaced';
    }

    var mydata = [ORDER_ID,ORDER_ITEM_SEQ_ID,ORDER_PART_SEQ_ID,PRODUCT_ID,ITEM_DESCRIPTION,QUANTITY,UNIT_AMOUNT,ITEM_TYPE_ENUM_ID,PARENT_ITEM_SEQ_ID];

    if(PRODUCT_ID=="" || QUANTITY=="" || UNIT_AMOUNT==NULL){
        res.send("Please fill all productID, quantity, unit_amount.");
    }
    else{
        connection.query('insert into order_header(ORDER_ID,ORDER_ITEM_SEQ_ID,ORDER_PART_SEQ_ID,PRODUCT_ID,ITEM_DESCRIPTION,QUANTITY,UNIT_AMOUNT,ITEM_TYPE_ENUM_ID,PARENT_ITEM_SEQ_ID) values(?)',[mydata],(err,rows)=>{
            if(err){
                console.log(err);
            }else{
                res.send("Order ID: "+orderID+ "   Successfully saved the data");
            }
        })  
    }
})


app.listen(3000, ()=>  console.log("Server is running on Port 3000..."));