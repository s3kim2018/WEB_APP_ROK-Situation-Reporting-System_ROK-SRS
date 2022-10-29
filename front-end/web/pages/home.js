import Head from 'next/head'
import style from '../styles/homepage.module.css'
import Link from "next/link"
import { useState, useEffect } from 'react';
import { Image } from 'antd'
import unitlogo from '../img/unitlogo.png'
import { Descriptions, Tabs, Avatar, List, PageHeader, Input, Space } from 'antd';
import { decodeJwt } from 'jose';
import { getCookie } from 'cookies-next';
import { Convertrank } from '../helperfunction/convertrank'
import Router from 'next/router'

import { encryptchat } from '../encryption/chatencryption';
import { encryptuser } from '../encryption/userencryption';

const { Search } = Input;
async function onSearch(value) {
    let endpoint = process.env.NEXT_PUBLIC_BACKEND_ROOT + 'api/user?search='
        const options = {
            // The method is POST because we are sending data.
            method: 'GET',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('usercookie')
            }
        }
        //Fetch data from external API
        const res = await fetch(endpoint + value, options)
        const data = await res.json()
        if (data.length == 0) {
            return 
        } else {
            let id = data[0]._id
            Router.push('/home/' + id)
        }
}



const Home = (props) => {
    let props1 = props['data'][0]
    let props2 = props['data2'][0]
    const [unitUsers, setUnitUsers] = useState([]);
    const [recentMemo, setRecentMemo] = useState([]);

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_ROOT + 'api/user/unit', {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('usercookie')}`
            }
        })
            .then(response => {
                if (response.status == 200)
                    return response.json()
            })
            .then(data => setUnitUsers(data));

        fetch(process.env.NEXT_PUBLIC_BACKEND_ROOT + 'api/report/', {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('usercookie')}`
            }
        })
            .then(response => {
                if (response.status == 200)
                    return response.json()
            })
            .then(data => setRecentMemo(data));
    }, [setUnitUsers, setRecentMemo]);

    return <>
        <Head>
            <title>홈페이지</title>
        </Head>
        <PageHeader
            className="site-page-header"
            title="홈페이지"
            style={{ backgroundColor: "white", boxShadow: 'inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3)' }}
            subTitle={
                <Space direction="vertical">
                    <Search placeholder="군인 이름/군번 검색" onSearch={onSearch} style={{ width: 250, marginLeft: '600px' }} />
                </Space>
            }
        />
        <div style={{ display: 'flex' }}>
            <div className={style.leftbar}>
                <div className={style.user}>
                    <Image width={180} height={180} src={props1.pic} />
                </div>
                <div className={style.unit}>
                    <div className={style.orgunit}>{props2.Unitname || "no data"}</div>
                    <div style={{ marginTop: '10px', marginLeft: '20px' }}><Image width={180} height={220} src={unitlogo.src} /></div>
                    <div>
                        <p className={style.unitmotto}>{props2.Unitslogan || "no data"}</p>
                    </div>
                </div>
            </div>
            <div>
                <div className={style.mainarea}>
                    <div className={style.infocontainer}>
                        <span className={style.rank}>{Convertrank(props1.Rank)}</span> <span className={style.name}>{props1.Name}</span> <br />
                        <span className={style.role}>{props1.Role || "no data"}</span>
                        <Descriptions title="군인 정보" layout="vertical" style={{ marginTop: '20px' }}>
                            <Descriptions.Item label="군번">{props1.DoDID || "no data"}</Descriptions.Item>
                            <Descriptions.Item label="직책">{props1.Role || "no data"}</Descriptions.Item>
                            <Descriptions.Item label="계정종류">{props1.Type || "no data"}</Descriptions.Item>
                            <Descriptions.Item label="군메일">{props1.email || "no data"}</Descriptions.Item>
                            <Descriptions.Item label="군전화">992-6202</Descriptions.Item>
                            <Descriptions.Item label="휴대폰번호">010-3315-1229</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
                <div className={style.selectionarea}>
                    <div className={style.tabscontainer}>
                        <Tabs>
                            <Tabs.TabPane tab="부대 정보" key="item-1">
                                <Descriptions title="부대 정보" bordered layout="vertical">
                                    <Descriptions.Item label="부대이름">{props2.Unitname || "no data"}</Descriptions.Item>
                                    <Descriptions.Item label="슬로건">{props2.Unitslogan || "no data"}</Descriptions.Item>
                                </Descriptions>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="부대 군인들" key="item-2">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={unitUsers}
                                    renderItem={item => (
                                        <List.Item style = {{cursor: 'pointer'}}>
                                            <Link href = {`/home/${item._id}`}>
                                            <List.Item.Meta
                                                avatar={<Avatar src={item.pic}/>}
                                                title={Convertrank(item.Rank) + " " + item.Name}
                                                description={item.Role}
                                            />
                                            </Link>
                                        </List.Item>
                                    )}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="최근 메모보고" key="item-3">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={recentMemo}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={item.Title}
                                                description={item.Content}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    </>
}


export async function getServerSideProps(context) {
    // let ciphertext = await encryptuser('test133', 'hfipoawefjapoiwfhawpoeifjwf')
    // let decrypt = await decryptuser('test133', ciphertext)
    // console.log(decrypt)
    const backendroot = process.env.NEXT_PUBLIC_BACKEND_ROOT
    const endpoint = backendroot + 'api/user/id?search='
    const JWTtoken = context.req.cookies['usercookie'];
    const { id } = decodeJwt(JWTtoken)
    const options = {
        // The method is POST because we are sending data.
        method: 'GET',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + JWTtoken
        }
    }
    //Fetch data from external API
    const res = await fetch(endpoint + id, options)
    const data = await res.json()
    //Pass data to the page via props
    // console.log('hi')
    // console.log(data[0]['Unit'])

    if (data[0] && data[0]['Unit']) {
        let endpoint2 = backendroot + 'api/unit/get?search='
        const options = {
            // The method is POST because we are sending data.
            method: 'GET',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JWTtoken
            }
        }
        const res2 = await fetch(endpoint2 + data[0]['Unit'], options)
        const data2 = await res2.json()
        return { props: { data, data2 } }


    }

    return { props: { data } }
}

export default Home; 
