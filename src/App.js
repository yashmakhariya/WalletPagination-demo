import React, { useEffect, useState, useRef } from 'react'
import ReactPaginate from 'react-paginate';
import "./App.css";
import jQuery from "jquery";

export default function PaginationDynamic(){
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0)
  const [Data, setData] = useState([]);
  const [count,setCount]= useState(0);
  const [apiData, setapiData] = useState([]);
  const [walletId, setWalletId]=useState("");
  const walletValue= useRef();

   useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("https://api.opensea.io/api/v1/collections?offset=0&limit=300&asset_owner=0x3bcf29061c89195419e4038bf4080ac6f24f4c3e"+walletId)
  //     var apiData = await response.json()
  //     console.log(apiData)
  //     setData(apiData)
       setPageCount(Math.ceil(apiData.length / perPage))
       setData(apiData.slice(offset, offset + perPage))
       //console.log("RANGE:"+offset+" "+(offset+perPage))
  //   }
  //   fetchData();
   }, [apiData,offset])

  function check() {

    if (walletId !== "") {
        const options = { method: 'GET' };
        //console.log("FUNCTION CALLED!!")
        fetch('https://api.opensea.io/api/v1/collections?offset=0&limit=300&asset_owner=' + walletId, options)
            .then(response => response.json())
            .then(response => {
                //console.log(response);
                setapiData(response);
                for (var i = 0; i < response.length; i++) {
                    var obj = response[i];
                    var floor = jQuery.ajax({
                        type: 'GET',
                        global: false,
                        async: false,
                        url: 'https://api.opensea.io/api/v1/collection/' + obj.slug + '/stats',
                        success: function (res) {
                            return res;
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    }).responseJSON.stats.floor_price;
                    response[i].stats.floor_price=floor;
                    jQuery(".loader").hide();
                }
                setapiData(response);
            })
            .catch(err => console.error(err));
    }
    else {
        alert("Please enter your wallet addresss.");
        jQuery(".loader").hide();
    }

}

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage* perPage)

  }

  const callapi=(e)=>{
    e.preventDefault();
    console.log("WALLET ID IS: "+walletId);
    setCount(1);
    check();
  }

  const searchWallet=()=>{
    //console.log("changing..");
    setWalletId(walletValue.current.value);
  }

  return (
    
    <section  className="flex flex-col justify-center antialiased bg-gray-100 bg-gray-900 min-h-screen p-4">

    {/* <div className='SrcBox'>
      <form  onSubmit={(e)=>callapi(e)}>
      
      <input ref={walletValue} type="text" onChange={searchWallet} placeholder="GIVE WALLET NUMBER"></input>
      </form>
    </div> */}
    <div>
      <h1 className="text-center topHeader">NFT Floor Chacker</h1>
      <p className="text-center secondHeader">Best tool to track your portfolio, We will soon add other statistics.</p>
      
    </div>
   

    <main className="grid w-full hightsearch bg-gray-900 place-content-center">
    <h5 className="text-center secondHeader">ENTER ANY WALLET ADDRESS BELOW</h5>
    <div className="flex items-center max-w-md mx-auto bg-white rounded-full " x-data="{ search: '' }">
        <div className="w-full">
        
          <form  onSubmit={(e)=>callapi(e)}>
        
              <input ref={walletValue}  type="text" className="w-full px-4 py-1 text-gray-900 rounded-full focus:outline-none " onChange={searchWallet}
                  placeholder="WALLET NUMBER" x-model="search"/>
          </form>
        </div>
        
        
    </div>
</main>




   
            
            <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                <header className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Collaction</h2>
                </header>
                <div className="p-3">
                    <div className="overflow-x-auto">
                        <table className="table-auto">
                            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                <tr>
                                    <th className="">
                                        <div className="font-semibold text-left">Name</div>
                                    </th>
                                    <th className="">
                                        <div className="font-semibold text-left">Volume</div>
                                    </th>
                                    <th className="">
                                        <div className="font-semibold text-left">24h %</div>
                                    </th>
                                    <th className="">
                                        <div className="font-semibold ">7d %</div>
                                    </th>
                                    <th className="">
                                        <div className="font-semibold ">Floor Price</div>
                                    </th>
                                    <th className="">
                                        <div className="font-semibold ">Owners</div>
                                    </th>
                                    <th className="">
                                        <div className="font-semibold ">Items</div>
                                    </th>
                                </tr>
                            </thead>
      {
        pageCount===0 && count!==0 ? <div className='loader'></div> : null
      }
      
      {
        walletId!=="" ?
        Data.map((Data, index) => (
          //  Data.slug==walletId ?
          <tr key={index}>
                                    <td className="">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov"/></div>
                                            <div className="font-medium text-gray-800">{Data.name}</div>
                                        </div>
                                    </td>
                                    <td className="">
                                        <div className="text-left">{Data.stats.thirty_day_volume.toFixed(2)}</div>
                                    </td>
                                    <td className="">
                                        <div className="text-left font-medium text-green-500">{Data.stats.one_day_volume.toFixed(2)}</div>
                                    </td>
                                    <td className="">
                                        <div className="text-lg ">{Data.stats.seven_day_volume.toFixed(2)}</div>
                                    </td>
                                    <td className="">
                                        <div className="text-lg ">{Data.stats.floor_price.toFixed(2)}</div>
                                    </td>
                                    <td className="">
                                        <div className="text-lg ">{Data.stats.num_owners}</div>
                                    </td>
                                    <td className="">
                                        <div className="text-lg ">{Data.stats.count}</div>
                                    </td>
                                </tr>
                                
    
         
          // : null
        ))
        : <h4>ENTER YOUR WALLET ID TO SHOW DETAILS</h4>
      }
        
    { pageCount!==0 ?
          <ReactPaginate
              previousLabel={"prev"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}/> : null}
                               </table>
                    </div>
                </div>
            </div>
      <div className="my-2">
        <h2 className="text-center secondHeader">Copyright. NFT Floor Chacker - 2022</h2>
      </div>
  </section>
  ) 
}