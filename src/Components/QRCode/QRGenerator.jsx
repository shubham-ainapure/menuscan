import { useEffect, useState } from "react";
import '../../Styles/QRGenerator.css';
import QRCode from 'qrcode';
import { useSelector } from "react-redux";

function QRGenerator(){
    const restroData=useSelector((state)=>state.db.restaurant);
    const dish=useSelector((state)=>state.db.dishesh);
    const queryString=restroData.documents[0].userId;

    const [qrCodeUrl,setQrCodeUrl]=useState('');
    const [width,setWidth]=useState(null);

    useEffect(()=>{
        const generateQRCode =  async() => {
          if(dish.length>0){
            try {
                const url = await QRCode.toDataURL(`https://shubham-ainapure.github.io/menuscan/menu/?data=${queryString}`,
                  {
                      width:width,
                      margin:2
                  });
                setQrCodeUrl(url);
              } catch (err) {
                console.error(err);
              }
          }
          };
      
          generateQRCode();
    },[width])

    return(
        <>
          <div>
            <h1>QR Code</h1>
             {qrCodeUrl ?
              <>
              <img src={qrCodeUrl} alt="QR Code" />
              <div className="qrFeatures">
              <div>
              {/* <label htmlFor="size">Size</label> */}
              <select id="size" className="selection" value={width} onChange={(e)=>setWidth(e.target.value)}>
                <option value="">size</option>
                <option value='200'>200</option>
                <option value='250'>250</option>
                <option value='300'>300</option>
                <option value='350'>350</option>
                <option value='400'>400</option>
              </select>
              </div>
              <a href={qrCodeUrl} download='qrCode.png' className="downloadBtn">Download</a>
              </div>
              </> : dish.length>0 ?<p className="msg">Loading...</p> :<p className="msg">Please add dish to generate QR</p>}
          </div>
        </>
    )

}
export default QRGenerator;