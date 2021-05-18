const path = require("path");
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
var dateFormat = require('dateformat');
const multer = require("multer");
const fs = require('fs');
const cat = require('./category');
const app = express();
const compression = require('compression');
// app.use(compression());
app.use(compression({
  filter: function () {
    return true;
  }
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'hamza',
  database: 'ecomangular'
  // port:'3306'
})


connection.connect(function(err) {
  if(err) {
    console.log(err);
  };
  console.log('you are connected');
});
app.use('/images',express.static(path.join("Backend/images")));
const MIME_TYPE_MAPE ={
  "image/png":'png',
  "image/jpeg":'jpg',
  "image/jpg":'jpg'
}
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    const isVlide=MIME_TYPE_MAPE[file.mimetype];
    let error= new Error("ivalid mime type");
    if(isVlide){
      error=null;
    }
    cb(error,"Backend/images");
  },
  filename:(req,file,cb)=>{
    const name= file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAPE[file.mimetype];
    cb(null,name+ '-'+ Date.now() + '.' + ext);
  }
});

//

//CRUD PRODUITS
app.use((req,res,next)=>{
  // res.setHeader("Access-Control-Allow-Origin","*");
  // res.setHeader("Access-Control-Allow-Origin","http://chia.ma");
  res.setHeader("Access-Control-Allow-Origin","http://localhost:4200");
  res.setHeader("Access-Control-Allow-Headers"
    ,"Origin , X-Requested-With , Content-Type , Accept ,Authorization");
  res.setHeader("Access-Control-Allow-Header"
    ,"Origin , X-Requested-With , Content-Type , Accept ,Authorization");
  res.setHeader("Access-Control-Allow-Methods"
    ,"GET , POST , PATCH , DELETE, PUT , OPTIONS");
  // la kan my web site
  if(req.headers.origin == 'http://localhost:4200' || req.is('image/webp')) {

    console.log(req.is('image/*'));
    return next();
  }else {
    // si non err
    console.log('invalid domaine: '+ req.headers.origin);
    res.status(403).send({msg : "You can't access our api directly if you are junior :D"});
  }
  // next();
});

app.post('/api/fetchpoids', (req, res, next) => {

  const product_id = req.body.proId;
  const poids  = req.body.poids;
  connection.query('select * from manage_gramage where product_id = ? and poids = ?' , [product_id, poids], function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json(results);
  })
})
// check Admin Login
app.post('/api/login_admin',(req,res,next) => {

  const  email = req.body.email;
  const pass =req.body.password;
  connection.query('select * from manager where email = ? and password = ?', [email,pass], function (err,results) {
    if(err) {
      return  res.status(401).json({
        err: err
      });
    }
    if(!results){
      return  res.status(401).json({
        meesage:"auth field"
      });
    } else {
      return  res.status(200).json({
        message:"you are connected successfully",
        data: results
      });
    }
  })
});
// app.get('/api/get_al_image',(req,res,next) => {
//   connection.rollback();
//   connection.query('select product_id , image from products', [], function (err, data) {
//     if (err) {
//       res.status(500).json({err: err});
//     }
//     if(data) {
//       res.status(200).json({data: data});
//     }
//   })
//
// })
// app.put('/api/upimages', (req,res,next)=>{
//   const id = req.body.id;
//   const image = req.body.image;
//   connection.query('update products set image =? where product_id = ?', [image, id], function (err, data) {
//     if(err) {
//       res.status(500).json({err: err});
//     }
//     if(data) {
//       res.status(200).json({data:'updated'});
//     }
//   })
// })
// end Authentification
app.get('/fetch_product',(req,res,next)=>{
  var sql = "select * from products s inner join category g on (s.category_id = g.cat_id) ORDER BY created_at DESC";
  connection.query(sql,function(err,result){
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message:"your product fetshed successfully",
      products:result
    })
  });
});
//pagination

// end Authentification
app.get('/fetch_product/pagination',(req,res,next)=>{
  let limit = +req.query.limit;
  let page = +req.query.page;
  let ofssets = limit*(page -1 );
  var sql = "select count(*) as Lengthpro from products s inner join category g on (s.category_id = g.cat_id) ORDER BY created_at DESC";
  connection.query(sql,function(err,result){
    if(err) {
      res.status(500).json(err);
    };

  });
  if(limit && page ) {
    connection.query('select * from products s inner join category g on (s.category_id = g.cat_id) ORDER BY created_at DESC limit ? OFFSET ?', [limit, ofssets], function (err, data) {
      if(err) {
        return err;
      };
      res.status(200).json({
        message: "your product fetshed successfully",
        products: data
      });
    });
  }
});
//pagination
app.get('/pagination', (req, res, next) => {
  const pagesaze = +req.quer.pagesaze;
  const currentpage = +req.query.currentpage;
  if (pagesaze && currentpage) {
    connection.query("select * from products s inner join category g on (s.category_id = g.cat_id) ORDER BY p.quantity DESC limit (?,?)",
      [pagesaze * (currentpage - 1), pagesaze], function (err, result) {
        if(err) {
          res.status(500).json(err);
        };
        res.status(200).json({
          message: "your product fetshed successfully",
          products: result
        })
      });
  }
});
app.post("/api/add_product",multer({storage:storage}).single("image"),(req,res,next)=>{
  const url = req.protocol +'://' +req.get('host');
  var time = new Date();
  console.log(req.body.id_forni);
  const data ={
    category_id: +req.body.catid,
    title: req.body.title,
    title_arab: req.body.titlearab,
    title_eng: req.body.titleeng,
    descreption: req.body.descreption,
    image:  req.file.filename,
    price :+req.body.pricev?+req.body.pricev:null,
    priceAchette :+req.body.pricea?+req.body.pricea:null,
    pricePromo :+req.body.pricep?+req.body.pricep:null,
    poids: req.body.poids?req.body.poids:null,
    quantity : +req.body.quantity?+req.body.quantity:null,
    state: req.body.state,
    Ciel: +req.body.ciel,
    min: +req.body.min,
    id_forni: +req.body.id_forni,
    test_pro: +req.body.test_pro,
    defaults:1,
    created_at: time,
  };
  console.log(data.poids,'lll');

  connection.query("INSERT INTO products SET ?",data,function(err,result){
    if(err) { res.status(400).json({error: err})};
    if(result) {
      /*  connection.query('SELECT id_orders FROM `orders` order by id_orders DESC limit 1' , function (err, result1) {
   console.log(result1);
   id = result1[0]['id_orders'];*/
      connection.query('select product_id from products order by product_id DESC limit 1' , function (err, results) {
        const id = results[0]['product_id'];
        const datapoids = {
          product_id : id,
          poids: req.body.poids,
          pricepoids :+req.body.pricev,
          prixAchats :+req.body.pricea,
          prixPromo :+req.body.pricep?+req.body.pricep:null,
          qtypoids : +req.body.quantity,
          defaults : 1,
          created_at: new Date(),
          updated_at: new Date()
        }
        connection.query('insert into manage_gramage set ?',[datapoids],function (err, resultspoids) {
          if (err) {
            res.status(400).json({error: err});
          }
          if(resultspoids){
            res.status(201).json({
              message:"poroduct added successfully"
            });
          }
        })
      })
    }
  });
});
app.get('/api/all_banner_images',(req,res,next)=>{
  connection.query('select * from banner_images',function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    console.log(data);
    if(data){
      res.status(200).json({data:data});
    }
  })
})
app.get('/api/all_slider_images',(req,res,next)=>{
  connection.query('select * from slider_images',function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    console.log(data);
    if(data){
      res.status(200).json({data:data});
    }
  })
})
app.post('/api/bannerImages',multer({storage:storage}).single("image"),(req,res,next) => {
  const url = req.protocol +'://' +req.get('host');
  const data ={
    images:  req.file.filename,
    created_at: new Date(),
  };

  connection.query("INSERT INTO banner_images SET ?",data,function(err,result){
    if(err) {
      res.status(500).json({error: err});
    };
    res.status(200).json({
      message:"images added successfully"
    });

  });
});
app.post('/api/sliderImages',multer({storage:storage}).single("image"),(req,res,next) => {
  // const url = req.protocol +'://' +req.get('host');
  const data ={
    images:  req.file.filename,
    product_id: +req.body.id,
    cat_id: +req.body.catid,
    boutique_id: +req.body.bo_id,
    created_at: new Date(),
  };

  connection.query("INSERT INTO slider_images SET ?",data,function(err,result){
    if(err) {
      res.status(500).json({error: err});
    };
    res.status(200).json({
     data: 'saved'
    });

  });
});
app.post('/api/multi_pectures',multer({storage:storage}).single("image"),(req,res,next) => {
  const url = req.protocol +'://' +req.get('host');
  const data ={
    product_id: +req.body.proId,
    images: req.file.filename,
    created_at: new Date(),
  };

  connection.query("INSERT INTO products_images SET ?",data,function(err,result){
    if(err) {
      res.status(500).json({error: err});
    };
    res.status(200).json({
      message:"images added successfully"
    });

  });
});
//getting the single products
app.get('/api/all_products/:id',(req,res,next)=>{
  const id = req.params.id;
  connection.query('select count(*) from products s inner join category g on (s.category_id = g.cat_id)  inner join manage_gramage m on (s.product_id = m.product_id) where s.product_id = ?',[id],function (err, data) {
    if(err) {
      res.status(500).json(err);
    }
    console.log(data);
    if(data[0]['count(*)'] > 0 ) {
      connection.query("select * from products s inner join category g on (s.category_id = g.cat_id)  inner join manage_gramage m on (s.product_id = m.product_id)  where s.product_id = ? and m.defaults =1",id,function (err,data) {
        if(err) {
          res.status(500).json(err);
        };
        console.log(data,'hhhhh');
        res.status(200).json(data);
      })
    }else{
      connection.query("select * from products s inner join category g on (s.category_id = g.cat_id)  where s.product_id = ? ",id,function (err,data) {
        if(err) {
          res.status(500).json(err);
        };
        console.log(data);
        res.status(200).json(data,'mmmm');
      })
    }
  })

})

app.get('/api/all_products_forcart/:id/:poids',(req,res,next)=>{
  const id = req.params.id;
  const poids =  req.params.poids;
  if(poids == null){
    connection.query("select * from products s inner join category g on (s.category_id = g.cat_id)  inner join manage_gramage m on (s.product_id = m.product_id) where m.product_id = ? and m.poids = ?",[id,poids],function (err,data) {
      if(err) {
        res.status(500).json(err);
      };
      // console.log("this is our data single pro",data);
      res.status(200).json({
        message: 'all product',
        data: data
      });
    })
  } else {
    connection.query("select * from products s inner join category g on (s.category_id = g.cat_id)  inner join manage_gramage m on (s.product_id = m.product_id) where s.product_id = ? and m.poids= ?", [id, poids], function (err, data) {
      if (err) {
        res.status(500).json(err);
      }
      ;
      // console.log("this is our data single pro",data);
      res.status(200).json({
        message: 'all product',
        data: data
      });
    });
  }
});
app.put('/api/updating_product/:id',multer({storage:storage}).single("image"),(req,res,next)=>{
  let image=req.body.imagePath;
  let poidspro = req.body.poidspro;
  console.log(req.body);
  let data;
  if(req.file){
    image= req.file.filename;
    data = {
      category_id: +req.body.catid,
      title: req.body.title,
      title_arab: req.body.titlearab,
      title_eng: req.body.titleandg,
      descreption: req.body.descreption,
      image: image,
      price: +req.body.pricev,
      priceAchette: +req.body.pricea,
      pricePromo: +req.body.pricep?+req.body.pricep:null,
      poids: req.body.poids,
      quantity: +req.body.quantity,
      state: req.body.status,
      Ciel: +req.body.ciel,
      min: +req.body.min,
      id_forni: +req.body.id_forni,
      test_pro: +req.body.test_pro,
    };
  }else
  if(!req.file ){
    data = {
      category_id: +req.body.catid,
      title: req.body.title,
      title_arab: req.body.titlearab,
      title_eng: req.body.titleandg,
      descreption: req.body.descreption,
      price: +req.body.pricev,
      priceAchette: +req.body.pricea,
      pricePromo: +req.body.pricep?+req.body.pricep:null,
      poids: req.body.poids,
      quantity: +req.body.quantity,
      state: req.body.status,
      Ciel: +req.body.ciel,
      min: +req.body.min,
      id_forni: +req.body.id_forni
    };
  }
  const id = +req.params.id;
  connection.query('select * from products where product_id = ?',id, function (err, results) {
    if(err) {
      return err;
    };
    if (req.file) {
      theimage = results[0].image.slice(33, 1000);
      console.log(theimage,'chia.ma');
      try {
        fs.unlinkSync(theimage);
        console.log("the image was removed successfully");
      } catch (err) {
        console.log(err);
      }
    } else {
      next;
    }
  })
  const url ="update products Set ? where product_id = ?";
  connection.query(url,[data,id],function (err,data) {
    if(err) {
      res.status(500).json(err);
    };
    if(data){
      const dataup = {
        pricepoids: +req.body.pricev,
        prixAchats: +req.body.pricea,
        prixPromo: +req.body.pricep?+req.body.pricep:null,
        poids: req.body.poids,
        qtypoids: +req.body.quantity,
      };
      connection.query('update manage_gramage set ? where product_id = ? and poids = ?',[dataup,id, poidspro],function (err, datas) {
        if(err){
          res.status(500).json(err);
        }
        if(datas){
          res.status(200).json(datas);
        }
      })
    }
  })
})
// delete prouits
app.delete('/api/delete_banner_images/:id',(req,res,next) => {
  const id = req.params.id ;
  connection.query('select count(*) from banner_images where id_banner = ?',[id], function (err, data) {
    if(err){
      res.status(500).json({err:err});
    }
    const bannercount = data[0]['count(*)'];
    if(bannercount > 0) {
      connection.query('select images from banner_images where id_banner = ?', [id], function (err,datas) {
        if(err){
          res.status(500).json({err:err});
        }
        const numberimage = datas.length;
        for (let i = 0; i < datas.length; i++) {
          const url = req.protocol +'://' +req.get('host');

          if(err) {
            return err;
          };
          theimage =datas[i].images.slice(33,1000);
          try {
            fs.unlinkSync(theimage);
          } catch (err) {
            res.status(500).json(err);
          }
        }
        connection.query('delete from banner_images where id_banner = ? ', [id], function (err,deletedata) {
          if(err){
            res.status(500).json({err:err});
          }
          if(deletedata){
            res.status(200).json({data:deletedata});
          }
        })
      })
    }
  })
})

app.delete('/api/delete_slider_images/:id',(req,res,next) => {
  const id = req.params.id ;
  connection.query('select count(*) from slider_images where id_slider = ?',[id], function (err, data) {
    if(err){
      res.status(500).json({err:err});
    }
    const bannercount = data[0]['count(*)'];
    if(bannercount > 0) {
      connection.query('select images from slider_images where id_slider = ?', [id], function (err,datas) {
        if(err){
          res.status(500).json({err:err});
        }
        const numberimage = datas.length;
        for (let i = 0; i < datas.length; i++) {
          const url = req.protocol +'://' +req.get('host');

          if(err) {
            return err;
          };
          theimage =datas[i].images.slice(33,1000);
          try {
            fs.unlinkSync('../Backend/images/' + theimage);
          } catch (err) {
            console.log(err);
          }
        }
        connection.query('delete from slider_images where id_slider = ? ', [id], function (err,deletedata) {
          if(err){
            res.status(500).json({err:err});
          }
          if(deletedata){
            res.status(200).json({data:deletedata});
          }
        })
      })
    }
  })
})

app.delete('/api/delete_produit/:id/:image',(req,res,next)=>{
  const id = req.params.id;
  console.log(req.params.image, 'hahahhaha hamza');
   connection.query('delete from manage_gramage where product_id  = ? ' , [id], (err, data) => {
     if(err) {
       res.status(500).json({data: data});
     } else {
       connection.query('delete from products where product_id  = ?', [id], (err, data) => {
         err ?  res.status(500).json(err) : res.status(200).json({data:data});
       })
     }
   })
})

//get all gramage
app.get('/api/all_gramage',(req,res,next)=>{
  connection.query('select * from gramage',function (err,result) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message:"all gramage fetched successfully",
      data: result
    })
  })
})
// end all gramage
//get all litreage
app.get('/api/all_litrage',(req,res,next)=>{
  connection.query('select * from literage',function (err,result) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message:"all literage fetched successfully",
      data: result
    })
  })
})
// end all litrage
// manage Poids
app.post('/api/add_poids',(req,res,next) => {
  var time = new Date();

  const Poids = {
    product_id: req.body.idpro,
    poids: req.body.poids,
    pricepoids: req.body.pricev,
    prixAchats: req.body.pricea,
    prixPromo: req.body.pricep?req.body.pricep : null,
    qtypoids: req.body.qtypoids,
    created_at: time,
    updated_at:time
  };
  console.log(Poids.poids, req.body.poids);
  if(Poids.poids != 'null') {
    connection.query('INSERT INTO manage_gramage SET ?', Poids, function (err, results) {
      if (err) {
        res.status(500).json({error: err});
      }
      ;
      res.status(200).json({
        message: "this poids add successfuly",
        data: results
      })
    })
  }
})
// end manage poids
// add client

app.post('/api/new_clients', (req,res,next) => {
  const client = {
    Full_Name: req.body.Full_name,
    email: req.body.email,
    adress: req.body.adress,
    pays: req.body.pays,
    ville: req.body.ville,
    codepostale: req.body.codepostal,
    telephone: req.body.telephone,
    created_at: new Date()
  }
  const email = req.body.email;
  const tele = req.body.telephone;
  connection.query('select count(*) from clients where email = ? or telephone =?',[email, tele],function (err, results) {
    if(err) {
      res.status(500).json(err);
    };

    if (results[0]['count(*)'] == 0 ) {
      connection.query('insert into clients set ?' , client , function (err, responce) {
        if(err) {
          res.status(500).json({err: err});
        };
        if(responce) {
          connection.query('select * from clients where telephone = ?', [tele], function (err, results) {
            if(err) {
              res.status(500).json({err: err});
            };

            res.status(200).json({
              message: 'this client already in base donnee',
              clients: results
            })
          })
        }
      })
    } else {
      connection.query('select * from clients where telephone = ?' , [tele] , function (err, results) {
        if(err) {
          res.status(500).json({err: err});
        };
        res.status(200).json({
          message: 'this client already in base donnee',
          clients: results
        })
      })
    }
  })
});
app.post('/api/rapide_client',(req, res , next) => {
  const client = {
    Full_Name: req.body.Full_name,
    adress: req.body.adress,
    telephone: req.body.telephone,
    created_at: new Date()
  };
  const tele = req.body.telephone;

  connection.query('select count(*) from clients where telephone = ?',tele , function (err, mydata) {
    if(err){
      res.status(500).json(err);
    }
    if(mydata[0]['count(*)'] == 0) {
      connection.query('insert into clients set ?', client, function (err ,data) {
        if(err) {
          res.status(500).json(err);
        }
        if (data) {
          connection.query('select * from clients where telephone = ?' , tele, function (err, result) {
            if(err) {
              res.status(500).json(err);
            }
            res.status(200).json({data: result});
          })
        }
      })
    } else {
      connection.query('select * from clients where telephone = ?' , tele, function (err, result) {
        if(err) {
          res.status(500).json(err);
        }
        res.status(200).json({data: result});
      })
    }
  })

})
// get all clinet
app.get('/api/all_client',(req,res,next)=> {
  connection.query('select * from clients', function (err, results) {
    if(err) {
      return err;
    };
    res.status(200).json({
      message: 'here all clients',
      data: results
    })
  })
})
app.get('/api/dtaippoidsproduct/:id', (req,res,next) => {
  const id = req.params.id;
  connection.query('select * from manage_gramage where product_id = ?' , [id] , function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message: 'detail poids getting succeffyly',
      data: results
    })
  })
})
app.post('/api/allcatdetpoi',(req,res,next)=> {
  const  catid = req.body.catId;
  const  proid = +req.body.proid;
  connection.query('select * from products where category_id = ? and product_id != ?',[catid , proid], function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({message:'success !', data: results});
  })
})
// edit cart getting all poids and price
app.get('/api/edit_Orders/:id', (req, res, next) => {
  const idpro = req.params.id;
  connection.query('select * from manage_gramage where product_id = ?' ,[idpro], function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({data: results});
  })
})

app.post('/api/update_orders', (req,res, next)=> {
  var currentpoids;
  var currentprice;
  const price = req.body.priceo;
  const pricechange = req.body.poidsprice;
  const poids = req.body.poid;
  const poidsChange = req.body.poidchange;
  if (poidsChange !=null) {
    currentpoids = poidsChange;
  }else {
    currentpoids = poids;
  }
  if( pricechange != null) {
    currentprice = pricechange;
  }else {
    currentprice = price;
  }
  const id = req.body.ido;
  const data = {
    qte_produits: req.body.qtec,
    poidsord: currentpoids,
    priceord: currentprice,
  }
  connection.query('update orders set ? where id_orders = ?', [data, id], function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message:'update  succesfully'
    })
  })
})
app.get('/api/order_detail/:id', (req, res, next) =>{
  const id = req.params.id;
  console.log(id,'ssss');
  connection.query('select * from detail_orders o inner join orders s on(s.id_orders = o.id_Orders) inner join products p on(o.id_product = p.product_id)  where s.id_orders = ?',[id] , function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    console.log('mmmm', results);
    res.status(200).json({results:results});
  })
})
// get all Order
app.get('/api/all_Orders',(req,res,next) => {
  connection.query('select * from orders order by created_atord  desc ', function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message: 'this all Orders ',
      data: results
    })
  })
});
app.post('/api/add_orders',(req,res,next) => {
  const date = new Date();
  const second = dateFormat(date, "yyyy-mm-dd");
  const prix1 = +req.body.prixL;
  const prix2 = +req.body.total;
  const prix3 = prix2 - prix1;
  var CodeCmd = req.body.codecmd;
  const cmddate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const Orders = {
    id_orders:+req.body.id_orders,
    telephone: req.body.tele,
    count_pro: req.body.count,
    Full_name: req.body.nom,
    adress: req.body.adress,
    Ville: req.body.ville,
    regions: req.body.region,
    prixLevrison:prix1,
    total_whit_prix_livreson: prix2,
    total_whitout_prix_levrison: prix3,
    total_prixachats: req.body.toprixachats,
    charge_livraison: req.body.charge_livraison,
    frais_levrison: req.body.frais_levrison,
    la_marge: req.body.lamarge,
    CodeCMD: 'CMD'+req.body.id_orders,
    valueStatus: 1,
    textstatus: 'Commandée',
    status: 'Commandée',
    created_atord: cmddate,
    datecmd:cmddate
  }

  var id;
  var produit = [];
  produit = req.body.produits;
  connection.query('insert into orders set ?' , Orders, function(err, data){
    if(err) {
      res.status(500).json({error: err});
    }
    if(data){
      var wedone = produit.length;
      var index = 0;
      // console.log(produit,'hamza hamz azabi hada malo');
      for(let pro of produit) {
        index++;
        const produits1 = {
          id_Orders:+req.body.id_orders,
          id_product: pro.product_id,
          qtycomonde: pro.qtyPanier,
          poidscomonde: pro.poids,
          totalcomonde: (pro.pricepoids ? pro.pricepoids : pro.price) * pro.qtyPanier,
          to_prixAchat: pro.prixAchats * pro.qtyPanier,
          created_at: new Date()
        }
        connection.query('insert into detail_orders set ?',[produits1], function (err, data) {
          console.log(data);
          if (err) {
            console.log(err);
          }
        });
      }
      if(data) {
        if(produit.length == index){
          console.log(produit.length, index);
          res.status(200).json({data:'we done'});
        }
      }
    }
  });
});
app.post('/api/gere_Orders', (req,res,next) => {
  const valueStatus = req.body.valstatus;
  const textstatus = req.body.statusOrdres;
  const affstatus = req.body.affstatus;
  const id = req.body.idO;
  connection.query('update orders set valueStatus = ? , textstatus = ? , status = ? where id_orders = ? ',[valueStatus,textstatus,affstatus,id], function( err ,results) {
    if(err) {
      return err;
    };
    res.status(200).json({message:'status'})
  })
});
app.post('/api/get_Client', (req,res,next)=> {
  const email = req.body.email;
  const telephone = '0'+req.body.tele;
  connection.query('select * from clients where email = ? or telephone = ?',[email,telephone], function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message: 'client getting successfully',
      clients: results
    })
  });
})

app.post('/api/add_category',multer({storage:storage}).single("image"),(req,res,next) => {
  const url = req.protocol +'://' +req.get('host');
  const category = {
    id_boutique: req.body.id_boutique,
    titleFr: req.body.titleFr,
    titleAng: req.body.titleAng,
    titleArab: req.body.titleArab,
    imagecat: req.file.filename,
    published_at: new Date()
  };
  connection.query('INSERT INTO category SET ?',category,function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message: 'your category was added succeffully !',
      data: results
    })
  })
});
// and add category
// getting category with id
app.get('/api/get_category/:id',(req,res,next) => {

  const id = +req.params.id;
  connection.query("select * from category where cat_id = ?",id,function (err,data) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json(data);
  })

});
// end getting category
// updated category
app.put('/api/update_cat/:id',multer({storage:storage}).single("image"),(req,res,next) => {
  let data;
  const url = req.protocol +'://' +req.get('host');
  const id = +req.params.id;
  let image;
  // console.log(url , id, req.file);
  if (!req.file) {
    image = null;
  }else{
    image = req.file.filename;
  }
  if(image != null) {
    data = {
      id_boutique: +req.body.id_boutique,
      titleFr: req.body.titleFr,
      titleAng: req.body.titleAng,
      titleArab: req.body.titleArab,
      imagecat: image,
      published_at: new Date(),
    }
  }else {
    data = {
      id_boutique: +req.body.id_boutique,
      titleFr: req.body.titleFr,
      titleAng: req.body.titleAng,
      titleArab: req.body.titleArab,
      published_at: new Date(),
    }
  }
  connection.query('SELECT * FROM category where cat_id= ?', id, function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    if(results[0].imagecat && image != null ) {
      theimage = results[0].imagecat.slice(33, 1000);
      try {
        fs.unlinkSync(theimage);
        console.log("the image was removed successfully");
      } catch (err) {
        res.status(500).json(err);
      }
    }else {
      next;
    }
  })
  connection.query('update category SET ? where cat_id = ? ',[data,id],function (err , results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message: ' your category was updated successfuly',
      data: results
    })
  })
});
//end updated category
//delete category
app.delete('/api/delete_cat/:id',(req,res,next) => {
  const id = +req.params.id;
  connection.query('select imagecat from category where cat_id= ?',id,function (err,data) {
    if(err) {
      return err;
    };
    theimage = data[0].imagecat.slice(33,1000);
    try {
      fs.unlinkSync(theimage);
      console.log("the image was removed successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  })
  connection.query('select count(*) from products where category_id = ?' ,[id] , function (err, result) {
    if(err) {
      return err;
    };
    const count = result[0]['count(*)'] ;
    if(count > 0) {
      connection.query('delete from products where category_id = ?',[id], function (err, data) {
        if(err) {
          return err;
        };
        if(data) {
          connection.query('delete from category WHERE cat_id = ?',id, function (err, results) {
            if(err) {
              return err;
            };

            res.status(200).json({
              message:"your category was deleted successfully"
            })
          })
        }
      })
    }else{
      connection.query('delete from category WHERE cat_id = ?',id,function (err,results) {
        if(err) {
          return err;
        };

        res.status(200).json({
          message:"your category was deleted successfully"
        })
      })
    }
  })
});

// end delete category
// search category
app.get('/api/search_cat/:key',(req,res,next) =>{
  const keysearch = req.params.key;
  const query ="select * from category where Libele like ?";
  connection.query(query,'%'+keysearch+'%',function (err,results) {
    if(err) {
      return err;
    };
    res.status(200).json({
      message:'your search data get back ...',
      data: results
    })
  });
});
// end search category
//*****************
app.get('/api/all_category',(req,res,nxt)=>{
  var sql="select * from category ORDER BY published_at desc ";
  var catid;
  connection.query(sql,function (err,results) {
    for(let i=0; i<results.length ; i++){
      catid= results[i].cat_id;
    }
    if(err) {
      return err;
    };
    res.status(201).json({
      message:"your categories fettched successfuly",
      CatData:results
    });
  })
});
// END CRUD CATEGORY

// our site
// get all nouveau produits when the date between date tame and 7 days left
//select (DATE_FORMAT(created_at, '%m')) FROM products WHERE (DATE_FORMAT(now(), '%m')) -  (DATE_FORMAT(created_at, '%m')) <=0;
app.get('/api/site/new_products',(req,res,next) => {
  const query="select * FROM products WHERE (DATE_FORMAT(now(), '%d')) - (DATE_FORMAT(created_at, '%d')) <=7 limit 12";
  connection.query(query, function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message:"les nouveau produits fetching succefully",
      data: results
    });
  })
});
// geting pro detail poids
app.get('/api/products_gl/:id',(req,res,next) => {
  const id = +req.params.id;
  connection.query('select * from products p inner join  manage_gramage g on(p.product_id = g.product_id) WHERE g.product_id = ?',id,function (err,results) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json({
      message:'this is th poids',
      data:results
    });
  });

});
app.get('/api/cat_produits_all/:id',(req,res,next) => {
  const id = +req.params.id;
  connection.query('select * from products p INNER JOIN category g ON(p.category_id = g.cat_id) WHERE p.category_id = ?',id,function (err,results) {
    if(err) {
      return err;
    };
    res.status(200).json({
      results: results
    });
  })
});
app.get('/api/ipaadress', (req, res, next)=>{
  var ip = (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress).split(",")[0];

  res.status(200).json(ip);

});
app.post('/api/addtocart',(req,res,next) => {
  const proid = +req.body.idc;
  const ipadd = req.body.ipc;
  connection.query('select count(*) from cart where product_id = ? and ip_address = ?',[proid,ipadd], function (err , results) {
    if(err) {
      res.status(500).json(err);
    };
    if(results[0]['count(*)'] > 0 ) {
      res.status(200).json({
        message: 'this product alerady in the cart'
      })
    }else {
      const cartdata = {ip_address: ipadd, product_id: proid};
      connection.query('insert into cart set ?',cartdata,function (err, data) {
        if(err) {
          res.status(500).json(err);
        };
        res.status(200).json({
          message:'added to cart and base donne',
          data: data
        })
      })
    }
  })
})
app.get('/api/totalitem/:id',(req,res,next)=> {
  const ipAddress = req.params.id;
  connection.query('select count(*) from cart where ip_address = ?' , [ipAddress], function (err , data) {
    if(err) {
      res.status(500).json(err);
    };
    res.status(200).json(data[0]['count(*)']);
  })

})
app.get('/api/cartItem/:id',(req,res,next)=> {
  const ipAddress = req.params.id;
  connection.query('select * from cart c inner join products p on(c.product_id = p.product_id) where c.ip_address = ?' , [ipAddress], function (err , data) {
    if(err) {
      res.status(500).json(err);
    };
    // res.send(data);
    res.status(200).json({
      message: 'your cart item fettched successfully',
      data: data
    });
  })
})
// get products images
app.get('/api/product_images/:id',(req,res,next)=> {
  const id= +req.params.id;
  connection.query('select * from products_images where product_id = ?',[id],function (err,results) {
    if(err) {
      return err;
    };
    res.status(200).json({
      message:'this is the images',
      data: results
    })
  })
});
// increase qty
app.post('/api/increase',(req,res,next)=>{
  const id = req.body.id;
  const qty = req.body.qtyperpoids;
  // const qtyperpoids = req.body.qtyperpoids;
  const poids = req.body.poids;
  console.log(id,qty, poids);
  const sql1 ='select count(*) from products p inner join manage_gramage g on (p.product_id = g.product_id) where p.product_id = ? and g.poids = ?';
  const sql2 = 'select g.qtypoids, p.quantity from products p inner join manage_gramage g on (p.product_id = g.product_id) where p.product_id = ? and g.poids = ?'
  const sql3 = 'select quantity from products where  product_id = ? and poids = ?';
  const sql4 = 'update products set quantity = ?  where product_id = ? and poids = ?';
  const sql5 = 'update manage_gramage set qtypoids = ?  where product_id = ? and poids = ?';
  connection.query(sql1, [id,poids], function (err, data) {
    console.log(data[0]['count(*)']);
    if(data[0]['count(*)'] > 0) {
      connection.query(sql2, [id, poids], function (err, datas) {
        if(err) {
          res.status(500).json({err: err});
        }else if(datas) {
          connection.query(sql4, [datas[0].quantity - qty, id,poids], function (err, res1) {
            if(err) {
              res.status(500).json({err: err});
            }else if(res1){
              connection.query(sql5, [datas[0].qtypoids - qty,id,poids], function (err, res2) {
                if(err) {
                  res.status(500).json({err: err});
                }else if (res2) {
                  res.status(200).json({data:'done__qty'});
                }
              })
            }
          })
        }
      })
    }else {
      connection.query(sql3, data[id,poids], function (err, dataf) {
        if(err) {
          res.status(500).json({err: err});
        }else{
         connection.query(sql4, [dataf[0].quantity - qty, id, poids], function (err, res3) {
           if(err) {
             res.status(500).json({err: err});
           }else if(res3) {
             res.status(200).json({data:'done__qty'});
           }
         })
        }
      })
    }
  });
});
// update faris Livarison;
app.put('/api/update_fraisl', (req,res,next) => {
  console.log(req.body);
  const frais_livraison = +req.body.fraisL;
  const id = req.body.id;
  const com = req.body.comm;
  const code = req.body.code;
  const charge = req.body.charge;
  var data = req.body;

  connection.query('update orders set  ? where id_orders = ?', [data, req.body.id_orders], function (err, data) {
    if(err){
      res.status(500).json(err);
    }
    res.status(200).json(data);
  })
})
app.get('/api/getqty', (req,res,next) => {
  connection.query('select product_id , qtypoids , poids  from manage_gramage ',function (err, data) {
    if(err) {
      res.status(500).json(err);
    }
    res.status(200).json({qty: data});
  })
});
app.delete('/api/deletesubcommande/:id/:id2/:prix/:prixa',(req,res,next)=>{
  const id = req.params.id;
  const id2 = req.params.id2;
  const prix = req.params.prix;
  const prixa = req.params.prixa;
  connection.query('delete from detail_orders where id_detail = ? ', [id] ,function (err,mydata) {
    if(err){
      res.status(400).json(err);
    }
    if(mydata){
      connection.query('select count_pro FROM orders WHERE id_orders = ? ', [id2] , function (err, myupdata) {
        if (err){
          res.status(400).json(err);
        }
        if(myupdata) {
          const upcount = myupdata-1;
          console.log(myupdata[0]['count_pro']);
          const newqty = myupdata[0]['count_pro']-1;
          console.log(newqty);
          connection.query('update orders set count_pro = ? , total_whit_prix_livreson = ? ,  total_prixachats =? where id_orders = ?',[newqty,prix,prixa, id2], function (err,datas) {
            if(err){
              res.status(400).json(err);

            }
            console.log(datas);
            if(datas){
              res.status(200).json({data:'deleted'});
            }
          });
        }
        // if (myupdata){

        // }
      })
    }
  })
});

// auth yahya
app.post('/api/authYahya',(req,res,next)=>{
  console.log(req.body);
  const nom = req.body.nom;
  const pass = req.body.pass;
  const mydata = {
    Nom: req.body.nom,
    password: req.body.pass
  }
  console.log(nom, pass);
  connection.query('select count(*) from Auth', function (err, data) {
    if(err){
      res.status(500).json({err:'E'});
    }
    const countdata = data[0]['count(*)'];
    if(countdata <= 0){
      console.log(data, countdata);
      connection.query('insert into Auth  set ?' ,[mydata], function (err, results) {
        if(err){
          res.status(500).json({err:'E'});
        }
        console.log(results);
        if(results) {
          res.status(200).json({data: 'D'});
        }
      });
    }else{
      connection.query('select * from Auth where Nom = ? and password = ?',[nom,pass], function (err, datarep) {
        if(err){
          res.status(500).json({err:'E'});
        }
        console.log(datarep);
        if(datarep.length > 0){
          res.status(200).json({data:'D'});
        }else{
          res.status(200).json({data:'N'});
        }
      })
    }
  })
});
app.get('/api/all_commande_Cloturee', (req,res,next) => {
  const status = 'Clôturée';
  connection.query('select * from orders where status = ?', [status],function (err,results) {
    if(err){
      res.status(400).json(err);
    }
    console.log(results);
    if(results){
      console.log(results);
      res.status(200).json({data: results});
    }
  });
})
app.post('/api/fetchdate',(req,res,next)=>{
  console.log(req.body);
  const dated = req.body.dated;
  const datef = req.body.datef;
  const id_forni = req.body.id_forni?req.body.id_forni : -1;
  let totalcmd = 0;
  let totaleprixa = 0;
  console.log(dated, datef, id_forni);
  const status = req.body.status;
  const sql= 'select DISTINCT o.id_orders as id  from orders o INNER JOIN detail_orders d ON(d.id_Orders = o.id_orders) inner join products p on (p.product_id = d.id_product) where o.status = ? and p.id_forni = ? and o.created_atord between ? and ?';
  const sql1= 'select * from orders where status = ? and created_atord between ? and ?';
  //select * from orders where status = 'Clôturée' and created_atord between '2020-02-23' and '2020-02-24';
  // connection.query('select * from orders where status = ? and created_atord between ? and ?', [status,dated,datef],function (err,results) {
  if (id_forni != -1) {
    connection.query(sql, [status, id_forni, dated, datef], function (err, results) {
      console.log(results, 'hamza')
      if (err) {
        res.status(400).json(err);
      } else {
        // totalcmd = results[0]['totale'];
        // totaleprixa = results[0]['toAchat'];
        const orders_id = [];
        for (let i of results) {
          orders_id.push(i.id);
        }
        console.log(orders_id, 'jhon 12', id_forni, orders_id.length);
        if (orders_id.length != 0) {
          connection.query('select * from orders where  id_orders in (?)', [orders_id], (err, datass) => {
            if (err) {
              res.status(400).json(err);
            } else {
              connection.query('select SUM(d.totalcomonde) as toc, sum(d.to_prixAchat) as toa from detail_orders d inner join products p on (d.id_product = p.product_id) where d.id_orders in (?) and p.id_forni = ?', [orders_id, id_forni], (err, mydata) => {
                err ? res.status(500).json({err: err}) : res.status(200).json({data: datass, totalec: mydata[0]['toc'], totalea: mydata[0]['toa']});
              })
            }
          })
        } else {
          res.status(200).json({data: []});
        }
      }

    });
  }else if(id_forni == -1) {
    connection.query(sql1, [status, dated, datef], function (err, results) {
      if(err) {
        res.status(500).json({err: err});
      }else {
        res.status(200).json({data: results});
      }
    })
  }else {
    connection.query(sql1, [status, dated, datef], function (err, results) {
      if(err) {
        res.status(500).json({err: err});
      }else {
        res.status(200).json({data: results});
      }
    })
  }
})
// banners title's
app.post('/api/Ichhar_banner',(req,res,next)=>{
  const data = {
    titlefr: req.body.titlefr,
    titlearb: req.body.titlearab,
    titleeng: req.body.titleeng,
    created_at: new Date()
  }
  connection.query('insert into ichharbaner set ?',[data], function (err, results) {
    if(err){
      res.status(500).json({err: err});

    }
    console.log(results);
    if(results){
      res.status(200).json({data: results});

    }
  })

})
// gett all tiitles of banners
app.get('/api/all_title_banner',(req,res,next)=>{
  connection.query('select * from ichharbaner' , function (err, data) {
    if(err){
      res.status(500).json({err:err});
    }
    console.log(data);
    if(data) {
      res.status(200).json({data:data});
    }
  })
})
app.delete('/api/deletebanertitle/:id',(req,res,next) => {
  const id = req.params.id;
  connection.query('delete from ichharbaner where id_ichhar = ? ', [id], function (err, responce) {
    if(err) {
      res.status(500).json({err: err});
    }
    res.status(200).json({data: responce});
  })
})
// updating poids
app.get('/api/managepoids/:id', (req,res,next)=>{
  const id = +req.params.id;
  connection.query('select * from manage_gramage where product_id = ? ',[id], function (err, data) {
    if(err){
      res.status(500).json({err: err});

    }
    console.log(data);
    if(data){
      res.status(200).json({data:data});
    }
  });
});
// get data poids
app.get('/api/get-updatedata-poids/:id',(req,res,next)=>{
  const id = +req.params.id;
  connection.query('select * from manage_gramage where id_manage_gramage = ?',[id], function (err, data) {
    if(err){
      res.status(500).json({err:err});
    }
    console.log(data);
    res.status(200).json({data: data});
  })
})
//update poids finnaly
app.put('/api/uppoidsdata',(req,res,next) => {
  console.log(req.body);
  const id_gramage = req.body.id_gramage;
  const pro_id = req.body.pro_id;
  const firstpoids=req.body.firstpoids;
  const poids= req.body.poids;
  const prixv = req.body.prixv;
  const prixa = req.body.prixa;
  const prixp = req.body.prixp;
  const qty = req.body.qty;
  const datas = {
    poids: poids,
    pricepoids: prixv,
    prixAchats: prixa,
    prixPromo: prixp,
    qtypoids: qty
  }
  connection.query('update manage_gramage set ? where id_manage_gramage = ?  and product_id = ? and poids = ?',[datas,id_gramage,pro_id,firstpoids],function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    console.log(data);
    if(data){
      connection.query('update products set poids = ?,priceAchette =?,pricePromo =?,price =?,quantity = ? where product_id = ? and poids = ?',[poids,prixa,prixp,prixv,qty, pro_id, firstpoids],function (err, data) {
        if(err){
          res.status(500).json({err: err});
        }
        console.log(data);
        res.status(200).json({data:data});
      })
    }
  })
})
//delete poids
app.delete('/api/delete_poids/:id/:id_g/:poids',(req,res,next)=>{
  const id_pro = req.params.id;
  const poids = req.params.poids;
  const id_gramage = req.params.id_g;

  connection.query('select count(*) from products p inner join manage_gramage g on(p.product_id = g.product_id)  where p.product_id = ?  and p.poids = ? ',[id_pro,poids],(function (err,data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data[0]['count(*)'] > 0) {
      connection.query('update products set poids = null ,  price  =null, priceAchette= null, pricePromo= null,  quantity   =null where product_id = ? ',[id_pro],function (err,data) {
        if(err) {
          res.status(500).json({err: err});
        }
        if(data){
          connection.query('update manage_gramage set poids = null , pricepoids =null, prixAchats  =null,  prixPromo = null,qtypoids =null where id_manage_gramage = ? and product_id = ? and poids = ?',[id_gramage,id_pro,poids], function (err,data) {
            if(err) {
              res.status(500).json({err: err});
            }
            if(data){
              console.log('ohhhhoooooh');
            }
          })
        }
      })
    }else{
      console.log('mmm ahahaha')
      connection.query('delete from manage_gramage where product_id = ?  and poids = ? and id_manage_gramage = ?',[id_pro,poids,id_gramage], function (err,data) {
        if(err) {
          res.status(500).json({err: err});
        }
        res.status(200).json({data: data});
      })
    }
  }))
})
// set to default
app.put('/api/settodefault', (req,res,next) => {
  const id_gramage=  req.body.id_gramage;
  const id_pro = req.body.id_pro;
  const poids = req.body.poids;
  const qty = req.body.qty;
  const prixv = req.body.prixv;
  const prixa = req.body.prixa;
  const prixp = req.body.prixp;
  connection.query('select poids , quantity, pricePromo, priceAchette, price from products where product_id = ?', id_pro, function (err,data) {
    if(err){
      res.status(500).json({err:err});
    }
    const poids1 = data[0].poids;
    const price1 = data[0].price;
    const prixa1 = data[0].priceAchette;
    const prixp1 = data[0].pricePromo;
    const qty1 = data[0].quantity;
    // connection.query('update manage_gramage set  poids = ? , pricepoids  =?,  prixAchats =?, prixPromo=? , qtypoids=? where id_manage_gramage = ? and poids = ?',[poids1,price1,prixa1,prixp1, qty1, id_gramage, poids], function (err,data) {
    //   if(err){
    //     res.status(500).json({err:err});
    //   }
    //   if(data) {
    connection.query('update products set poids = ? , price = ? ,priceAchette = ? , pricePromo = ? ,quantity = ?, defaults = 1 where product_id = ? and poids = ?',[poids,prixv,prixa,prixp, qty, id_pro, poids1], function (err, data) {
      if(err){
        res.status(500).json({err:err});
      }
      console.log(data)

      if(data) {
        connection.query('update manage_gramage set defaults = 0 where product_id = ?', [id_pro],function (err,data) {
          if(err){
            res.status(500).json({err:err});
          }
          if(data){
            connection.query('update manage_gramage set defaults = 1 where id_manage_gramage = ? and product_id = ? and poids = ?',[id_gramage,id_pro,poids], function (err,data) {
              if(err){
                res.status(500).json({err:err});
              }
              if(data) {
                res.status(200).json({data :'F'});
              }
            });
          }
        })
      }
    })
    //   }
    // })
  })
})
// add ville
app.post('/api/add_ville',(req,res,next)=> {
  console.log(req.body);
  const data = {
    ville: req.body.ville,
    prixLivraison: req.body.prixLiv,
    fraisLivGriteerin200: req.body.frais1,
    fraisLivSmullerin200: req.body.frais2,
    fraislivraison: req.body.fraisliv,
    created_at: new Date()
  }
  connection.query('insert into Villes set ?', [data], function (err, responce) {
    if(err){
      res.status(500).json({err: err})
    }
    console.log(data);
    if(responce) {
      connection.query('select * from Villes',[], function (err, data) {
        if(err){
          res.status(500).json({err: err});
        }
        if(data){
          res.status(200).json({data: data});
        }
      })
    }
  })
})
// getting all Ville
app.get('/api/all_Ville',(req,res,next)=> {
  connection.query('select * from villes order BY ville asc',[], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data: data});
    }
  })
})
// delete ville
app.delete('/api/delete_ville/:id',(req,res,next)=> {
  const id = req.params.id;
  connection.query('delete from Villes where id_Ville = ?', [id], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'D'});
    }
  })
})
// update ville frais
app.put('/api/updatefrais', (req,res,next)=>{
  console.log(req.body);
  const data = {
    fraisLivGriteerin200: req.body.frais1,
    fraisLivSmullerin200: req.body.frais2
  };
  connection.query('update Villes set ?',[data], function (err, respoce) {
    if(err){
      res.status(500).json({err: err});
    }
    console.log(respoce);
    if(respoce){
      res.status(200).json({data:'U'});
    }
  })
})
// update status Ville
app.put('/api/update_status',(req,res,next)=>{
  const id = req.body.id;
  connection.query('update Villes set status = 1 where id_ville = ? ',[id] ,function(err, data){
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'UP'});
    }
  })
})
app.put('/api/update_status_second',(req,res,next)=>{
  const id = req.body.id;
  connection.query('update Villes set status = 0 where id_ville = ? ',[id] ,function(err, data){
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'UP'});
    }
  })
})
//getting ville status = 1;
app.get('/api/onlyVilleStatus', (req,res,next)=>{
  connection.query('select * from Villes where status = 1 order by ville asc',[],function (err, responce) {
    if(err){
      res.status(500).json({err,err});
    }
    if(responce){
      res.status(200).json({data: responce});
    }
  })
})
app.put('/api/upville',(req,res,next)=>{
  const id = req.body.id;
  const ville = req.body.ville;
  const prixliv = req.body.prixliv;
  const upfraisliv = req.body.upfrausliv;
  connection.query('update Villes set ville = ? ,  prixLivraison  =? , fraislivraison = ? where id_ville = ?',[ville,prixliv,upfraisliv, id],function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'UPV'});
    }
  })
})
// dete orders
app.delete('/api/deletecomd/:id',(req,res,next)=>{
  const id = req.params.id;
  connection.query('delete from orders where id_orders = ? ', [id], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data) {
      connection.query('delete from detail_orders where id_Orders = ? ', [id], function (err,data) {
        if(err){
          res.status(500).json({err: err});
        }
        if(data){
          res.status(200).json({data:'D'});
        }
      })
    }
  })
})
//get cmdcode;
app.post('/api/cmdcode',(req,res,next)=> {
  const nom = req.body.nom;
  const tele = req.body.tele;
  connection.query('select CodeCMD from orders where Full_name = ? and  telephone = ? ', [nom, tele], function (err,data) {
    if(err){
      res.status(500).json({err: err});
    }
    console.log(data[0]['CodeCMD']);
    if(data){
      res.status(200).json({data: data[0]['CodeCMD']});
    }
  })
})
//getting al product for ajouter une commande

app.get('/api/allpro',(req,res,next) =>{
  connection.query('select * from products',[],function (err,data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data: data});
    }
  })
})
//getiing poids par pro
app.get('/api/gettingpoidsparpro/:id',(req,res,next)=> {
  const id = req.params.id;
  connection.query('select * from manage_gramage where product_id = ?',[id],function (err,data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data: data});
    }
  })
})
// new product for commande
app.post('/api/newproforcmd',(req,res,next)=>{
  const data = {
    id_Orders:+req.body.id_Orders,
    id_product: req.body.id_product,
    qtycomonde: req.body.qty,
    poidscomonde: req.body.poids,
    totalcomonde: req.body.pricecmd,
    to_prixAchat: req.body.prixa,
    created_at: new Date()
  }

  connection.query('insert into detail_orders set ? ', [data], function (err,data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data: data});
    }
  })
})
// update commnde after ajouter a noveaux produits
app.put('/api/upcmdafternewproduct',(req,res,next)=> {
  const id_orders = +req.body.id_orders;
  const total_whit_prix_livreson = req.body.total_whit_prix_livreson;
  const total_whitout_prix_levrison = req.bodytotal_whitout_prix_levrison;
  const count_pro = req.body.count_pro;
  const total_prixachats = req.body.total_prixachats;
  connection.query('select total_whit_prix_livreson,total_whitout_prix_levrison,count_pro,total_prixachats from orders where id_orders = ?',[id_orders],function (err,data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      console.log(data,'zaaaaabiiiii');
      const prixwl = data[0]['total_whit_prix_livreson'] + total_whit_prix_livreson;
      const prixnol = data[0]['total_whitout_prix_levrison'] + total_whitout_prix_levrison;
      const qty = data[0]['count_pro'] + count_pro;
      const prixa = data[0]['total_prixachats'] + total_prixachats;
      connection.query('update orders set total_whit_prix_livreson = ? ,count_pro=?, total_prixachats=? where id_orders = ?', [prixwl,qty,prixa, id_orders], function (err,data) {
        if(err){
          res.status(500).json({err: err});
        }
        if(data){
          res.status(200).json({data: data});
        }
      })
    }
  })
})
// getpacks
app.get('/api/packs',(req,res,next) => {
  connection.query('select * from products p inner join category c on (p.category_id = c.cat_id) where p.category_id = 39',[],function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data: data});
    }
  })
})
// epuisee le produits
app.put('/api/epuisee',(req,res,next) => {
  const id = req.body.id;
  const poids = req.body.poids;
  connection.query('update products set quantity = 0  where product_id = ? and poids = ? ',[id, poids], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data) {
      connection.query('update manage_gramage set qtypoids = 0 where product_id = ? and poids = ?', [id,poids],function (err,data1) {
        if(err){
          res.status(500).json({err: err});
        }
        if(data1){
          res.status(200).json({data: 'epuise'});
        }
      })
    }

  })
})
app.put('/api/epuiseefrom-manage-poids',(req,res,next) => {
  const id = req.body.id;
  const poids = req.body.poids;

  connection.query('update manage_gramage set qtypoids = 0 where product_id = ? and poids = ?', [id,poids],function (err,data1) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data1){
      res.status(200).json({data: 'epuise'});
    }
  })

})
//show recap
app.get('/api/recap',(req,res,next) => {
  connection.query('select p.title_arab, d.id_product , d.poidscomonde, qtycomonde from orders o inner join detail_orders d on(o.id_orders = d.id_Orders)inner join products p on(p.product_id = d.id_product)  where o.status = \'Commandée\'',[],function (err,data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data: data});
    }
  })
})
//check all btn
app.put('/api/changeallstatus',(req,res,next)=> {

  const status = req.body.status;
  const textstatus = req.body.statusbtn;
  const valueStatus =req.body.value;
  const wentst = req.body.wentst;
  connection.query('update orders set status = ?, textstatus = ?, valueStatus = ? where status = ?', [status,textstatus, valueStatus, wentst], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'updated'});
    }
  })
})
app.put('/api/changeallstatustouts',(req,res,next)=> {

  const status = req.body.status;
  const textstatus = req.body.statusbtn;
  const valueStatus =req.body.value;
  connection.query('update orders set status = ?, textstatus = ?, valueStatus = ?', [status,textstatus, valueStatus], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'updated'});
    }
  })
})
app.put('/api/checkregionparst', (req,res,next)=>{{
  const status = req.body.status;
  const textstatus = req.body.statusbtn;
  const valueStatus =req.body.value;
  const regions = req.body.regions
  connection.query('update orders set status = ?, textstatus = ?, valueStatus = ?  where regions = ?', [status,textstatus, valueStatus, regions], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'updated'});
    }
  })
}})
// api/changeallstatustouts
app.post('/api/addregions',(req,res,next)=>{
  const data = {
    regions : req.body.regions,
    value: req.body.value
  }
  connection.query('insert into regions set ?', [data], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json(data);
    }
  })
})
//get all region
app.get('/api/allregions',(req,res,next)=> {
  connection.query('select * from regions order by regions asc',[],function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:data});
    }
  })
})
//get sub orders
app.get('/api/allsubordimprimer',(req,res,next)=>{
  const id_orders = 'Commandée';
  connection.query('select * from detail_orders d inner join orders o on(d.id_Orders = o.id_orders) inner join products p on(d.id_product = p.product_id) where o.status = ?',[id_orders], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:data});
    }
  })
})
//Adminstrations
app.post('/api/Admin_singUp',(req,res,next)=>{
  const full_name = req.body.Full_name;
  const pass = req.body.password;
  const datamy = {
    Full_name:req.body.Full_name,
    password: req.body.password,
    Role: req.body.status,
    value: 'null',
    status: 'ofline',
    created_at: new Date()
  }
  connection.query('select count(*) from Admin_area where Full_name = ? and  password = ?',[full_name,pass],function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    const datas = data[0]['count(*)'];
    if (datas > 0) {
      res.status(200).json({data: 'deja'})
    }else if (datas == 0) {
      connection.query('insert into Admin_area set ?', [datamy], function (err, data) {
        if(err) {
          res.status(500).json({err:err});
        }
        if(data) {
          res.status(200).json({data:'success'});
        }
      })
    }
  })
})
// Auth super admin
app.post('/api/Auth_super_Admin', (req,res,next)=>{
  const name = req.body.name;
  const pass = req.body.pass;
  connection.query("select * from Admin_area where Full_name = ? and password = ? and Role ='super admin' " ,[name,pass],function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data.length != 0) {
      connection.query('update Admin_area set status =\'online\' where Full_name = ? and password = ?', [name, pass], function (err, data2) {
        if (err) {
          res.status(500).json({err: err});
        }
        if (data2) {
          res.status(200).json({
            datasuper: data,
            data: 'AuthS'
          })
        }
      })
    }else{
      res.status(200).json({data:'field'});
    }
  });
});
// end Adminstrations
// other use acounts
app.post('/api/other_users_auth',(req,res,next)=>{
  const name = req.body.name;
  const pass = req.body.password;
  connection.query("select count(*) from Admin_area where Full_name = ? and password = ?  and Role <>'super admin'",[name,pass],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if(data[0]['count(*)'] != 0){
      connection.query("update Admin_area set status ='online' where Full_name = ? and password = ?",[name, pass],function (err,data1) {
        if (err){
          res.status(500).json({err: err});
        }
        if(data1) {
          connection.query('select * from Admin_area where Full_name = ? and password = ?',[name, pass],function (err, data4) {
            if(err) {
              res.status(500).json({err: err});
            }
            if (data4) {
              res.status(200).json({data:'Other_success',
                datajson: data4
              });
            }
          })
        }
      })
    }else if (data[0]['count(*)'] == 0){
      res.status(200).json({data:'Other_field'});
    }

  })
});
//api/epuiseefrom-manage-poids
//getiing agents CMD
app.get('/api/get_Agent_cmd',(req,res,next)=>{
  const role = 'Agent de Commandes';
  connection.query('select * from Admin_area where Role = ?',[role],function (err,data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data) {
      res.status(200).json({data:data});
    }
  })
})

// agents livraison
app.get('/api/get_Agent_livraison',(req,res,next)=>{
  const role = 'Agent de livraisons';
  connection.query('select * from Admin_area where Role = ?',[role],function (err,data1) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data1) {
      res.status(200).json({data:data1});
    }
  })
})
//livreurs
app.get('/api/get_Livreurs',(req,res,next)=>{
  const role = 'Livreurs';
  connection.query('select * from Admin_area where Role = ?',[role],function (err,data2) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data2) {
      res.status(200).json({data:data2});
    }
  })
})
//end getiing agents CMD
//geniratetraitmentdesagentscmd
app.put('/api/traitement_de_agents/:id',(req,res,next) => {
  const id_orders = req.params.id;
  // const admin = req.body.admin;
  // const agentscmd = req.body.agentcmd?req.body.agentcmd:null;
  // const agentsliv  = req.body.agentliv?req.body.agentliv:null;
  // const livreur = req.body.livreur?req.body.livreur: null;
  const data = req.body;

  connection.query('update orders set ? where id_orders = ?', [data,id_orders], function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'done'});
    }
  })
  // connection.query('update orders set Admin = ? , agent_cmd = ? , agent_livraison = ? , livreur = ? where id_orders = ?', [admin, agentscmd,agentsliv,livreur,id_orders], function (err, data) {
  //   if (err) {
  //       res.status(500).json({err: err});
  //   }
  //   if (data) {
  //     res.status(200).json({data:'done'});
  //   }
  // })
})
//getting all orders a travers le nom de agents cmd
app.post('/api/getting_orders_altravers_le_role',(req,res,next)=>{
  const agentscmdname = req.body.full_name;
  const status =  req.body.status;
  const status2 = 'en cours de traitement';
  status3 = 'Traitée';
  status4 = 'Réserve';
  connection.query('select * from orders where agent_cmd = ? and status IN(?,?,?,?) order by created_atord desc',[agentscmdname,status,status2, status3,status4], function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:data});
    }
  })
})
//getting all orders a travers le nom de agents liv
app.post('/api/getting_orders_altravers_le_role_agentliv',(req,res,next)=>{
  const agentscmdname = req.body.full_name;
  const status =  req.body.status;
  const status2 = 'Non livrée';
  const status3 = 'Livrée';
  const status4 = 'en cours de livraison';
  // const status5 = 'préparation de livraison';
  connection.query('select * from orders where  agent_livraison = ? and status = ? or status = ? or status = ? or status = ? order by created_atord desc',[agentscmdname,status, status2,status3, status4], function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:data});
    }
  })
})
//getting all orders a travers le nom de  livreurs
app.post('/api/getting_orders_altravers_le_role_livreur',(req,res,next)=>{
  const agentscmdname = req.body.full_name;
  const status =  req.body.status;
  // const status2 = 'Non livrée';
  connection.query('select * from orders where  livreur = ? and status = ? order by created_atord desc',[agentscmdname,status], function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:data});
    }
  })
})
// status en cour de traitement on click on this button traiter;
app.put('/api/en_cours_de_traitement',(req,res,next) => {
  const id  = req.body.id;
  const status = req.body.status;
  connection.query('update orders set status =? , textstatus = ? , valueStatus = ? where id_orders = ?',[status,status,1,id],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'traiter'});
    }
  })
})

app.put('/api/valider_traitement',(req,res,next) => {
  const id  = req.body.id;
  const status = req.body.status;
  connection.query('update orders set status =? , textstatus = ? , valueStatus = ? where id_orders = ?',[status,status,8,id],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'traitée'});
    }
  })
})
app.put('/api/preparation_de_livraison/:id',(req,res,next) => {
  const id  = req.params.id;
  const data = req.body;
  connection.query('update orders set ?  where id_orders = ?',[data,id],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'preparation_de_livraison'});
    }
  })
})
//api/en_cours_de_livraison
app.put('/api/en_cours_de_livraison',(req,res,next) => {
  const id  = req.body.id;
  const status = req.body.status;
  const livname = req.body.livname;
  if (livname != 'NULL') {
    connection.query('update orders set status =? , textstatus = ? , valueStatus = ?, livreur = ?  where id_orders = ?', [status, status, 3, livname, id], function (err, data) {
      if (err) {
        res.status(500).json({err: err});
      }
      if (data) {
        res.status(200).json({data: 'en_cours_de_livraison'});
      }
    })
  }else{
    connection.query('update orders set status =? , textstatus = ? , valueStatus = ?  where id_orders = ?', [status, status, 3, id], function (err, data) {
      if (err) {
        res.status(500).json({err: err});
      }
      if (data) {
        res.status(200).json({data: 'en_cours_de_livraison'});
      }
    })
  }
})


app.put('/api/success_livraison',(req,res,next) => {
  const id  = req.body.id;
  const status = req.body.status;
  connection.query('update orders set status =? , textstatus = ? , valueStatus = ? where id_orders = ?',[status,status,3,id],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'Livrée'});
    }
  })
})
// api/CMD_payee
app.put('/api/CMD_payee',(req,res,next) => {
  const id  = req.body.id;
  const status = req.body.status;
  connection.query('update orders set status =? , textstatus = ? , valueStatus = ? where id_orders = ?',[status,status,6,id],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'payée'});
    }
  })
})
//
app.put('/api/reverse_cmd',(req,res,next) => {
  const id  = req.body.id;
  const status = req.body.status;
  connection.query('update orders set status =? , textstatus = ? , valueStatus = ? where id_orders = ?',[status,status,10,id],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'Reversé'});
    }
  })
})
//api/success_no_livraison where livreurs no livree la commande
app.put('/api/success_no_livraison',(req,res,next) => {
  const id  = req.body.id;
  const status = req.body.status;
  connection.query('update orders set status =? , textstatus = ? , valueStatus = ? where id_orders = ?',[status,status,9,id],function (err, data) {
    if (err) {
      res.status(500).json({err: err});
    }
    if (data) {
      res.status(200).json({data:'Non Livrée'});
    }
  })
})

//api/prix_panier_about_livraison
app.post('/api/prix_panier_about_livraison',(req,res,next) => {
  const dataliv = {
    prixpanier: req.body.prixp,
    prixG: req.body.prixG,
    prixS: req.body.prixS,
    created_at: new Date()
  }
  connection.query('select count(*) from prixLivraison', [], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data[0]['count(*)'] != 0) {
      connection.query('update prixLivraison set ?',[dataliv],function (err, data2) {
        if(err) {
          res.status(500).json({err: err});
        }
        if(data2) {
          res.status(200).json({data:'updated'});
        }
      })
    }else {
      connection.query('insert into prixLivraison set ?',[dataliv],function (err,data3) {
        if(err) {
          res.status(500).json({err: err});
        }
        if(data3) {
          res.status(200).json({data:'inerted'});
        }
      })
    }
  })
})
app.get('/api/getpanier_livraison', (req,res,next)=> {
  connection.query('select * from prixLivraison',[], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:data});
    }
  })
})
// update villr after donne prix panier
app.put('/api/ville_panierliv', (req,res,next)=> {
  const id = req.body.id;
  const prixG = req.body.prixG;
  const prixS = req.body.prixS;
  connection.query('update Villes set prixG = ?, prixS = ? where id_Ville = ?',[prixG,prixS, id], function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'update'});
    }
  })
})
// getting all manager;
app.get('/api/getting_all_agents', (req,res,next)=> {
  connection.query('select * from Admin_area',[],function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:data});
    }
  })
})
// delete agents
app.delete('/api/delete_agent/:id',(req,res,next)=> {
  const id = req.params.id;
  connection.query('delete from Admin_area where id_Admin = ?',[id],function (err, data) {
    if(err){
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data:'deleted'});
    }
  })
})
// editing agents
app.put('/api/editing_amdin_agents', (req,res,next)=>{
  const id =req.body.id;
  const data = {
    Full_name: req.body.name,
    password: req.body.pass,
    role: req.body.role,
    status:'ofline',
    Value: null,
    created_at: new Date()
  }
  connection.query('update Admin_area set ? where id_Admin = ?', [data, id], function (err,data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data) {
      res.status(200).json({data: 'updated'});
    }
  })
})
//check livreurs
app.get('/api/checkif_liv/:id',(req,res,next)  => {
  const id = req.params.id;
  connection.query('select livreur from orders where id_orders = ?',[id],function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data) {
      res.status(200).json({data: data});
    }
  })
})
app.get('/api/checkif_agent_liv/:id',(req,res,next)  => {
  const id = req.params.id;
  connection.query('select agent_livraison from orders where id_orders = ?',[id],function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data) {
      res.status(200).json({data: data});
    }
  })
})
app.put('/api/videliv',(req,res,next)=>{
  const id  = req.body.id;
  connection.query('update orders set prixLevrison = 0 where id_orders = ?', [id], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data) {
      res.status(200).json({data: 'vide'});
    }
  })
})
app.post('/api/voir_mes_cmd', (req, res, next) => {
  const CMDcode = req.body.CodeCMD;
  // const tele = req.body.teleclient;
  connection.query('select * from orders where telephone = ? or CodeCMD = ?', [CMDcode, CMDcode], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }
    if(data){
      res.status(200).json({data: data});
    }
  })
});


// getting parapharmacie category
app.get('/api/parapharmacie', (req,res,next) => {
  const query = 'select * from Boutique';
  connection.query(query, [], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }else if (data) {
      res.status(200).json({data: data});
    }
  })
});
// geting all id category
app.get('/api/top_selling_product', (req,res,next) => {
  const query1 = 'select COUNT(*), product_id, image, title, title_arab, price, priceAchette, pricePromo, poids,descreption, quantity,category_id FROM products p INNER JOIN category c on(p.category_id = c.cat_id) INNER join detail_orders d on (p.product_id = d.id_product)  GROUP BY p.product_id ORDER BY COUNT(*) DESC LIMIT 10';
  connection.query(query1, [], function (err, data) {
    if(data) {
      res.status(200).json({data:data});
    }else if (err) {
      res.status(500).json({err:err});
      //..
    }
  })
})
//getting  to sale
app.get('/api/get_top_sale/:id', (req,res,next) => {
  const id = req.params.id;
  const query = 'select COUNT(*), product_id, image, title, title_arab, price, priceAchette, pricePromo, poids,descreption, quantity,category_id FROM products p INNER JOIN category c on(p.category_id = c.cat_id) INNER join detail_orders d on (p.product_id = d.id_product) WHERE c.cat_id = ? GROUP BY p.product_id ORDER BY COUNT(*) DESC LIMIT 2'
  connection.query(query,[id],function (err, data) {
  if(data) {
    res.status(200).json({data: data});
  }else if( err) {
    res.status(500).json({err:err});
  }
  });
})
// get caegory meil
app.get('/api/cat_meil', (req,res,next) => {
  const query = 'select * from products p inner join category c on (p.category_id = c.cat_id) where  p.quantity > 0 limit 10';
  connection.query(query,[], function (err, data) {
    if(data) {
      res.status(200).json({data: data});
    }else if(err) {
      res.status(500).json({err: err});
    }
  })
})
// get caegory beldi
app.get('/api/cat_beldi1', (req,res,next) => {
  const query = 'select * from products p inner join category c on (p.category_id = c.cat_id) where cat_id = 26 and quantity > 0 limit 10';
  connection.query(query, [], function (err, data) {
    if(data) {
      res.status(200).json({data: data});
    }else if(err) {
      res.status(500).json({err: err});
    }
  })
})
// get caegory esipices
app.get('/api/cat_esipces', (req,res,next) => {
  const query = 'select * from products p inner join category c on (p.category_id = c.cat_id) where  quantity > 0 limit 10';
  connection.query(query, [], function (err, data) {
    if(data) {
      res.status(200).json({data: data});
    }else if(err) {
      res.status(500).json({err: err});
    }
  })
})
// get caegory fruit-secs
app.get('/api/cat_fruit-secs', (req,res,next) => {
  const query = 'select * from products p inner join category c on (p.category_id = c.cat_id) where  quantity > 0 limit 10';
  connection.query(query, [], function (err, data) {
    if(data) {
      res.status(200).json({data: data});
    }else if(err) {
      res.status(500).json({err: err});
    }
  })
})
// get caegory oliver-cornichon
app.get('/api/cat_oliver_cornichon', (req,res,next) => {
  const query = 'select * from products p inner join category c on (p.category_id = c.cat_id) where  quantity > 0 limit 10';
  connection.query(query, [], function (err, data) {
    if(data) {
      res.status(200).json({data: data});
    }else if(err) {
      res.status(500).json({err: err});
    }
  })
})
// get caegory oliver-cornichon
app.get('/api/cat_graines', (req,res,next) => {
  const query = 'select * from products p inner join category c on (p.category_id = c.cat_id) where  quantity > 0 limit 10';
  connection.query(query, [], function (err, data) {
    if(data) {
      res.status(200).json({data: data});
    }else if(err) {
      res.status(500).json({err: err});
    }
  })
})
// add new boutique
app.post('/api/add_boutique',multer({storage:storage}).single("imageboutique"),(req,res,next) => {
  const boutique = req.body;
  const created_at = new Date();
  const image = req.file.filename;
  connection.query('INSERT INTO boutique SET ?,imageboutique = ?,created_at = ?',[boutique,image,created_at],function (err, results) {
    if(err) {
      res.status(500).json(err);
    };
    if(results)
    {
      res.status(200).json({
        message: 'your boutique was added succeffully !',
        data: results
      })
    }
  })
});

// getting all boutique
app.get('/api/all_boutique',(req,res,nxt)=>{
  var sql="select * from Boutique ORDER BY created_at desc ";
  connection.query(sql,function (err,results) {
    console.log(results);
    if(err) {
      return err;
    };
    res.status(201).json({
      message:"your categories fettched successfuly",
      CatData:results
    });
  })
});
// get all cat in boutique
app.get('/api/getting_all_category_in_the_boutique/:id',(req,res,next) => {
  const id = req.params.id;
  console.log(id);
  const query = 'select * from Boutique p inner join category c on (p.id_boutique = c.id_boutique) where p.id_boutique =?';
  connection.query(query,[id], function (err, data) {
    console.log(data);
    if(err) {
      res.status(500).json({err: err});
    }else if (data) {
      res.status(200).json({data: data});
    }
  })
});
// getting products par_boutique;
app.get('/api/getting_pro_par_boutqiue',(req,res,next)=>{
  const id = +req.query.id;
  let limit = +req.query.limit;
  let page = +req.query.page;
  let ofssets = limit*(page -1 );
  if(limit && page ) {
    connection.query('SELECT * FROM boutique b INNER JOIN category c on (b.id_boutique = c.id_boutique) INNER JOIN products p on (c.cat_id = p.category_id) where b.id_boutique = ?  ORDER BY p.created_at DESC limit ? OFFSET ?', [id,limit, ofssets], function (err, data) {
      if(err) {
       res.status(500).json({err});
      };
      res.status(200).json({
        data: data
      });
    });
  }
});
// getting all_pro from boutique and cat and pro
app.get('/api/getting_all_products_par_boutique/:id',(req,res,next) => {
  const id = req.params.id;
  const query = 'SELECT * FROM boutique b INNER JOIN category c on (b.id_boutique = c.id_boutique) INNER JOIN products p on (c.cat_id = p.category_id) where b.id_boutique = ?';
  connection.query(query, [id], function (err, data) {
    if(err) {
      res.status(500).json({err});
    };
    res.status(200).json({
      data: data
    });
  })
})
// get reql qty for check qty avant passe a a caisse
app.post('/api/real_qty', (req,res,next) => {
  const id =  req.body.id;
  const qty = req.body.qty;
  const query1 = 'select product_id, quantity from products where product_id = ?';
  connection.query(query1, [id], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
        }else if (data) {
          res.status(200).json({data: data});
        }
      })
});
// after delete prod from the detail part
app.post('/api/qty__update', (req,res,next) => {
  const id = req.body.id;
  const poids = req.body.poids;
  const qty = req.body.qty;
  console.log(id,qty,poids, 'node tsali');
  const sql1 = 'select count(*) from products p inner join manage_gramage m on (p.product_id = m.product_id) where p.product_id = ? and m.poids = ?';
  const sql2 = 'select p.quantity, m.qtypoids from products p inner join manage_gramage m on (p.product_id = m.product_id) where p.product_id = ? and m.poids = ?';
 const sql3 = 'update products set quantity = ? where product_id = ? and poids = ?';
 const sql4 = 'update manage_gramage set qtypoids = ? where product_id = ? and poids = ?';
  connection.query(sql1, [id,poids], function (err,data) {
    if(err) {
      res.status(500).json({err: err});
    }else if (data[0]['count(*)'] > 0) {
      connection.query(sql2,[id, poids], function (err, res1) {
        if(err) {
          res.status(500).json({err: err});
        }else if(res1) {
          connection.query(sql3,[res1[0].quantity + qty,id, poids], function (err, res2) {
            if(err) {
              res.status(500).json({err: err});
            }else if (res2){
              connection.query(sql4, [res1[0].qtypoids + qty,id,poids], function (err, res3) {
                if(err) {
                  res.status(500).json({err: err});
                }else if (res3) {
                  res.status(200).json({data:'increase'});
                }
              })
            }
          })
        }
      })
    } else{
      connection.query('select quantity from products where product_id = ? and poids = ? ', [id, poids], function (err, res4) {
        if(err ) {
          res.status(500).json({err:err});
        }else if(res4) {
          console.log(res4, 'hamza');
          connection.query(sql3, [res4[0].quantity + qty, id, poids], function (err, res5) {
            if(err) {
              res.status(500).json({err:err});
            }else if(res5) {
              res.status(200).json({data:'increase'});
            }
          })
        }
      })
    }
  })
})
app.get('/api/detail_oredrSdata', (req,res,next) => {
  connection.query('select * from detail_orders',[], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }else if(data) {
      res.status(200).json({data: data});
    }
  })
});
app.post('/api/save_fornisseur', (req,res,next) =>{
  const data = {
    nom_forni: req.body.nom,
    created_at: new Date()
  };
  connection.query('insert into fourniseur set ?', [data], ( err, data) => {
    err ? res.status(500).json({err:err}) : res.status(200).json({data: 'saved'});
  })
})
app.get('/api/get_all_fournisseur', (req,res,next) => {
  connection.query('select * from fourniseur order by created_at asc', [],(err, data) => {
    err ? res.status(500).json({err:err}) : res.status(200).json({data: data});
  })
})
app.delete('/api/delete_from_fourni/:id', (req, res,next) => {
  const id = req.params.id;
  connection.query('delete from fourniseur where id_forni =?' , [id], (err, data) => {
    err ? res.status(500).json({err:err}) : res.status(200).json({data: 'deleted'});
  })
})
app.get('/api/getting_all_category_',(req,res,next) => {
  const query = 'SELECT * FROM category ORDER BY cat_id DESC limit 9';
  connection.query(query,[], function (err, data) {
    if(err) {
      res.status(500).json({err: err});
    }else if (data) {
      res.status(200).json({data: data});
    }
  })
});
// get produits
app.get('/api/get_quick_detail/:id', (req,res,next) => {
  const id = req.params.id;
  connection.query('select * from products where product_id = ?', [id], (err, data) => {
    err ? req.status(500).json({err:err}) : res.status(200).json({data: data});
  })
})
// NEW LIGNE FOR CONTABILITE
app.post('/api/recap_commande_day', (req,res,next) => {
  const staus = req.body.status;
  const time = req.body.time;
  connection.query('SELECT o.Full_name, p.title, p.title_arab, d.poidscomonde, d.qtycomonde, d.totalcomonde, o.status, o.created_atord, p.product_id from orders o INNER JOIN detail_orders d on(o.id_orders = d.id_Orders) INNER JOIN products p on(p.product_id = d.id_product) WHERE o.status = ? and o.created_atord >= now() - INTERVAL ? DAY GROUP by d.id_detail ORDER BY o.created_atord ASC', [staus, time], (err, data) => {
    err ? req.status(500).json({err:err}) : res.status(200).json({data: data});
  })
})
// new ligne for region added
app.post('/api/saveregion', (req,res,next) => {
  const data = {
    id_ville: req.body.idV,
    regions: req.body.region
  }
  connection.query('insert into regions set  ?', [data], (err, data) => {
    err ? res.status(500).json(err) : res.status(200).json({data: 'saved'});
  })
})
module.exports = app;
