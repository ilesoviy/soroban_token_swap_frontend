import { useState } from "react";
import './Main.css';
// import { Connectivity, EditOfferInput } from './connectivity';
import * as tokenSwap from "token_swap";
import freighter from "@stellar/freighter-api";

// working around ESM compatibility issues
const {
//   isConnected,
//   isAllowed,
    getUserInfo,
//   signTransaction,
} = freighter;

const log = console.log;


function Main() {
    const [fee, setFee] = useState(0.25);
    const [feeWallet, setFeeWallet] = useState("GBRVHOCUM4FKC5CAISSEFWVEAMY6UMTIYTY4PUXMSOVEMADTO556SFGA");
    const [tokenId, setTokenId] = useState("");

    const [offeredToken, setOfferedToken] = useState("CDWHHLHB2JAKWUYQE2NEIJ7YQXTLGJBQYOS3IQAUDIGJFCI7I5GORZUQ");
    const [requestedToken, setRequestedToken] = useState("CBKNL25YZQV4YFWQKFMCXR3PKJS5DOIK6SYVCAUDAOQ352MXDD5VU24A");
    const [offeredTokenAmount, setOfferedTokenAmount] = useState(5000000);
    const [requestedTokenAmount, setRequestedTokenAmount] = useState(500000);
    const [minRequestedTokenAmount, 
        setMinRequestedTokenAmount] = useState(100000);

    const [offerId, setOfferId] = useState(0);
    const [newRequestedTokenAmount, setNewRequestedTokenAmount] = 
        useState(800000);
    const [newMinRequestedTokenAmount, 
        setNewMinRequestedTokenAmount] = useState(200000);

    const [amount, setAmount] = useState(100000);

    return (
        <>
            {/* <WalletMultiButton /> */}
            <hr />

            <h3> Admin Side </h3>
            <label htmlFor="">Fee:</label>
            <input type="text" value={fee} style={{width: '20%'}} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setFee(parseFloat(value));
                }
            }} />
            <label htmlFor="">%</label>
            <label htmlFor="">FeeWallet:</label>
            <input type="text" value={feeWallet} style={{width: '50%'}} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setFeeWallet(value);
                }
            }} />
            <button onClick={async () => {
                try {
                    await tokenSwap.set_fee({ fee_rate: fee * 100, 
                        fee_wallet: feeWallet });
                    console.log('Set fee success!');
                } catch (err) {
                    console.error(err);
                }
            }}> Set Fee </button>
            <br></br>
            <label htmlFor="">TokenId:</label>
            <input type="text" value={tokenId} style={{width: '50%'}} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setTokenId(value.toString());
                }
            }} />
            <button onClick={async () => {
                try {
                    await tokenSwap.allow_token({ token: tokenId });
                    console.log('Allowed token for swap: ', tokenId);
                } catch (err) {
                    console.error(err);
                }
            }}> Allow Token </button>
            <button onClick={() => {
                try {
                    tokenSwap.disallow_token({ token: tokenId });
                    console.log('Disallowed token for swap: ', tokenId);
                } catch (err) {
                    console.error(err);
                }
            }}> DisAllow Token</button>

            <br></br>
            <hr></hr>


            <h3>  User Side (Offeror) </h3>
            <label htmlFor="">Offered TokenId:  </label>
            <input type="text" value={offeredToken} style={{width: '50%'}} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    try {
                        setOfferedToken(value.toString());
                    } catch {
                        // alert("input valid address");
                    }
                }
            }} /> <br></br>
            <label htmlFor="">Requested TokenId:  </label>
            <input type="text" value={requestedToken} style={{width: '50%'}} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    try {
                        setRequestedToken(value.toString());
                    } catch {
                        // alert("input valid address");
                    }
                }
            }} /> <br></br>

            <label htmlFor="">Offered TokenAmount:  </label>
            <input type="number" value={offeredTokenAmount} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setOfferedTokenAmount(parseFloat(value));
                }
            }} /> <br></br>
            <label htmlFor="">Requested Token Amount:  </label>
            <input type="number" value={requestedTokenAmount} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setRequestedTokenAmount(parseFloat(value));
                }
            }} />
            <label htmlFor="">Min Requested Token Amount:  </label>
            <input type="number" value={minRequestedTokenAmount} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setMinRequestedTokenAmount(parseFloat(value));
                }
            }} />
            <br></br>

            <button onClick={async () => {
                if (
                    offeredTokenAmount === 0 ||
                    requestedTokenAmount === 0 ||
                    minRequestedTokenAmount === 0
                ) {
                    // alert("Some passed value remain Zero!");
                    return;
                }

                console.log(Date.now());

                try {
                    const newOfferId = await tokenSwap.create_offer({
                        offeror: (await getUserInfo()).publicKey,
                        send_token: offeredToken,
                        recv_token: requestedToken,
                        timestamp: BigInt(Date.now()),
                        send_amount: BigInt(offeredTokenAmount),
                        recv_amount: BigInt(requestedTokenAmount),
                        min_recv_amount: BigInt(minRequestedTokenAmount),
                    });
                    setOfferId(newOfferId);
                    console.log("offerId: ", newOfferId);
                } catch (err) {
                    console.error(err);
                }
            }}>
                Create Offer
            </button>
            <hr></hr>

            <label htmlFor="">OfferId:  </label>
            <input type="text" value={offerId} style={{width: '50%'}} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    try {
                        setOfferId(parseInt(value, 16));
                    } catch {
                        // alert("input valid value");
                    }
                }
            }} />
            <br></br>
            <label htmlFor="">new requestedToken amount: </label>
            <input type="number" value={newRequestedTokenAmount} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setNewRequestedTokenAmount(parseFloat(value));
                }
            }} />
            <label htmlFor="">new min requestedToken amount: </label>
            <input type="number" value={newMinRequestedTokenAmount} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setNewMinRequestedTokenAmount(parseFloat(value));
                }
            }} />
            <br></br>

            <button onClick={async () => {
                if (
                    newRequestedTokenAmount === 0 &&
                    newMinRequestedTokenAmount === 0
                ) {
                    // alert("Some passed value remain Zero!");
                    return;
                }
                log("newRequestedTokenAmount: ", newRequestedTokenAmount);
                log("newMinRequestedTokenAmount: ", newMinRequestedTokenAmount);

                try {
                    const errorCode = await tokenSwap.update_offer({
                        offeror:(await getUserInfo()).publicKey,
                        offer_id: offerId,
                        recv_amount: BigInt(newRequestedTokenAmount),
                        min_recv_amount: 
                            BigInt(newMinRequestedTokenAmount),
                    });
                    console.log('errorCode: ', errorCode);
                } catch (err) {
                    console.error(err);
                }
            }}>
                Edit Offer
            </button>

            <button onClick={async () => {
                try {
                    const errorCode = await tokenSwap.close_offer({
                        offeror: (await getUserInfo()).publicKey,
                        offer_id: offerId,
                    });
                    if (errorCode !== 0) {
                        console.log('error_code: ', errorCode);
                    }
                } catch (err) {
                    console.error(err);
                }
            }}
            >Close Offer</button>
            <br></br>
            <br></br>
            <hr></hr>

            <h3>  User Side (Acceptor) </h3>
            <label htmlFor="">OfferId:  </label>
            <input type="text" value={offerId} style={{width: '50%'}} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    try {
                        setOfferId(parseInt(value, 16));
                    } catch {
                        // alert("input valid value");
                    }
                }
            }} />
            <label htmlFor="">Amount:  </label>
            <input type="number" value={amount} onChange={(e) => {
                const value = e.target.value;
                if (value) {
                    setAmount(parseFloat(value));
                }
            }} />

            <button onClick={async () => {
                if (
                    amount === 0
                ) {
                    // alert("Amount value remain Zero!");
                    return;
                }

                console.log('acceptor: ', (await getUserInfo()).publicKey);

                try {
                    const errorCode = await tokenSwap.accept_offer({
                        acceptor: (await getUserInfo()).publicKey,
                        offer_id: offerId,
                        amount: BigInt(amount),
                    });
                    if (errorCode !== 0) {
                        console.log('error_code: ', errorCode);
                    }
                } catch (err) {
                    console.error(err);
                }
            }}>
                Accept Offer
            </button>
            <hr></hr>

            <button onClick={() => {
                // connectivity._listenEvents();
            }}> Start Event Listening</button>

            <button onClick={() => {
                // await connectivity._getAllProgramAccounts();
            }}> Get full info </button>
        </>);
}

export default Main;
